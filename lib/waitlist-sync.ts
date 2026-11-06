import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const WAITLIST_SYNC_PAGE_SIZE = 500;
export type WaitlistSyncQuery = (text: string, values: unknown[]) => Promise<unknown>;
const syncRows = z.array(z.object({
  id: z.string().uuid(),
  created_at: z.union([z.number().int().nonnegative(), z.string().regex(/^\d+$/u)]).transform(Number),
  name: z.string(), role: z.enum(["buyer", "seller", "both"]),
  email: z.string().nullable(), phone: z.string().nullable(),
})).max(WAITLIST_SYNC_PAGE_SIZE + 1);

function json(body: object, status: number) {
  return Response.json(body, { status, headers: {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  } });
}

/** Read-only feed for the private Google Sheet. Never called by the signup UI. */
export async function handleWaitlistSync(request: Request, query: WaitlistSyncQuery | undefined, tokenHash: string | undefined) {
  const token = /^Bearer ([A-Za-z0-9_-]{32,128})$/u.exec(request.headers.get("authorization") || "")?.[1];
  if (!token || !tokenHash || !/^[a-f0-9]{64}$/u.test(tokenHash)
      || !timingSafeEqual(createHash("sha256").update(token).digest(), Buffer.from(tokenHash, "hex"))) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }
  const after = new URL(request.url).searchParams.get("after");
  if (after && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/iu.test(after)) {
    return json({ ok: false, error: "Invalid cursor." }, 400);
  }
  if (!query) return json({ ok: false, error: "Sync is temporarily unavailable." }, 503);
  try {
    // Each scheduled sync starts a fresh pass. UUID pagination plus sheet-side
    // ID deduplication catches late commits on the following pass without
    // relying on a timestamp watermark that could permanently skip a signup.
    const rows = syncRows.parse(await query(
      `SELECT id, created_at, name, role, email, phone FROM waitlist_entries
       WHERE ($1::uuid IS NULL OR id > $1::uuid) ORDER BY id LIMIT $2`,
      [after || null, WAITLIST_SYNC_PAGE_SIZE + 1],
    ));
    const entries = rows.slice(0, WAITLIST_SYNC_PAGE_SIZE).map(row => ({
      id: row.id, joinedAt: new Date(Number(row.created_at) * 1000).toISOString(),
      name: row.name, interest: row.role, email: row.email || "", phone: row.phone || "",
    }));
    return json({ ok: true, entries, nextCursor: rows.length > WAITLIST_SYNC_PAGE_SIZE ? entries.at(-1)!.id : null }, 200);
  } catch {
    // Never log contacts, query details, or credentials.
    return json({ ok: false, error: "Sync is temporarily unavailable." }, 503);
  }
}
