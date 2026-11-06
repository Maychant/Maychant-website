import { ipAddress } from "@vercel/functions";
import { isIP } from "node:net";
import { handleWaitlist } from "../../../lib/waitlist";
import { createNeonWaitlistStore } from "../../../lib/waitlist-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Vercel overwrites its forwarded IP at the ingress. Outside that trusted
  // deployment, all callers share the fallback bucket; arbitrary CF/OAI or
  // forwarded headers must not grant a fresh rate-limit identity.
  const suppliedIp = process.env.VERCEL === "1" ? ipAddress(request) : undefined;
  const clientIdentity = suppliedIp && isIP(suppliedIp) ? suppliedIp : undefined;
  let store;
  try {
    store = createNeonWaitlistStore(process.env.DATABASE_URL);
  } catch {
    // Bad/missing configuration uses the same safe unavailable response.
  }
  return handleWaitlist(request, store, { clientIdentity });
}
