import { neon } from "@neondatabase/serverless";
import { handleWaitlistSync, type WaitlistSyncQuery } from "../../../../lib/waitlist-sync";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // The lazy boundary ensures no database access happens before authentication.
  const query: WaitlistSyncQuery | undefined = process.env.DATABASE_URL
    ? async (text, values) => neon(process.env.DATABASE_URL!).query(text, values, {
      fetchOptions: { signal: AbortSignal.timeout(10_000) },
    }) : undefined;
  return handleWaitlistSync(request, query, process.env.WAITLIST_SHEETS_TOKEN_HASH);
}
