import { z } from "zod";

export type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "both";
  location: string;
  consentVersion: string;
  consentedAt: number;
  createdAt: number;
};

export interface WaitlistStore {
  /** Atomically consumes one attempt, returning the new count for this window. */
  consumeRateLimit(input: { key: string; now: number; expiresAt: number; limit: number }): Promise<number>;
  /** Resolves only after a successful insert or an existing unique-email conflict. */
  save(entry: WaitlistEntry): Promise<void>;
}

export type WaitlistContext = {
  /** Supplied by the deployment adapter, never read from arbitrary request headers. */
  clientIdentity?: string;
  now?: number;
};

export const WAITLIST_MAX_BYTES = 4096;
export const WAITLIST_WINDOW_SECONDS = 600;
export const WAITLIST_REQUEST_LIMIT = 12;
export const WAITLIST_CONSENT_VERSION = "maychant-waitlist-v1";

const cleanText = (max: number) => z.string().trim()
  .transform(value => value.normalize("NFC"))
  .pipe(z.string().max(max).refine(
    value => !/[\u0000-\u001f\u007f]/u.test(value),
    "Please use ordinary text without control characters.",
  ));

const signup = z.object({
  name: cleanText(100).refine(value => value.length >= 2, "Enter your name (2–100 characters)."),
  email: z.string().trim().max(254, "Enter an email address under 255 characters.")
    .email("Enter a valid email address.").transform(value => value.toLowerCase()),
  role: z.enum(["buyer", "seller", "both"], { errorMap: () => ({ message: "Choose buyer, seller, or both." }) }),
  location: cleanText(120).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to receive updates about Maychant." }) }),
  website: z.string().max(200).optional().default(""),
});

function json(body: object, status: number, extraHeaders: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

async function readBody(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && (!/^\d+$/u.test(contentLength) || Number(contentLength) > WAITLIST_MAX_BYTES)) {
    throw new RangeError("body-too-large");
  }
  if (!request.body) throw new SyntaxError("missing-body");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > WAITLIST_MAX_BYTES) {
        await reader.cancel();
        throw new RangeError("body-too-large");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

async function rateKey(identity: string | undefined, bucket: number) {
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(`maychant-waitlist|${bucket}|${identity || "unknown-client"}`),
  );
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function handleWaitlist(
  request: Request,
  store: WaitlistStore | undefined,
  { clientIdentity, now = Date.now() }: WaitlistContext = {},
) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin)
      || request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ ok: false, error: "Please submit this form from the Maychant website." }, 403);
  }
  if (!/^application\/json(?:\s*;|$)/iu.test(request.headers.get("content-type") || "")) {
    return json({ ok: false, error: "Please send the form as JSON." }, 415);
  }
  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return json({ ok: false, error: error instanceof RangeError
      ? "This request is too large. Please shorten the form and try again."
      : "We couldn’t read this request. Please check the form and try again." },
    error instanceof RangeError ? 413 : 400);
  }
  const parsed = signup.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] || "form");
      if (key !== "website" && !fields[key]) fields[key] = issue.message;
    }
    return json({ ok: false, error: "Please check the highlighted fields.", fields }, 400);
  }
  if (parsed.data.website.trim()) {
    return json({ ok: false, error: "We couldn’t accept this request. Please try again." }, 400);
  }
  if (!store) {
    return json({ ok: false, error: "We couldn’t save your request. Please try again shortly." }, 503);
  }
  const seconds = Math.floor(now / 1000);
  const bucket = Math.floor(seconds / WAITLIST_WINDOW_SECONDS);
  const expires = (bucket + 1) * WAITLIST_WINDOW_SECONDS;
  try {
    const key = await rateKey(clientIdentity, bucket);
    const count = await store.consumeRateLimit({
      key, now: seconds, expiresAt: expires, limit: WAITLIST_REQUEST_LIMIT,
    });
    if (!Number.isInteger(count) || count < 1) throw new Error("rate-write-failed");
    if (count > WAITLIST_REQUEST_LIMIT) {
      return json({ ok: false, error: "You’ve made several requests. Please wait a little and try again." }, 429,
        { "Retry-After": String(Math.max(1, expires - seconds)) });
    }
    const { name, email, role, location } = parsed.data;
    await store.save({
      id: crypto.randomUUID(), name, email, role,
      location, consentVersion: WAITLIST_CONSENT_VERSION,
      consentedAt: seconds, createdAt: seconds,
    });
    // A conflict confirms an existing saved email. Never reveal its details or overwrite it.
    return json({ ok: true, message: "You’re on the Maychant waitlist." }, 200);
  } catch {
    // Do not log contact data or expose storage errors to visitors.
    return json({ ok: false, error: "We couldn’t save your request. Please try again shortly." }, 503);
  }
}
