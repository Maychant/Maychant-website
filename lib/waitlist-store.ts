import { neon } from "@neondatabase/serverless";
import type { WaitlistEntry, WaitlistStore } from "./waitlist";

type SqlResult = {
  command: string;
  rowCount: number | null;
  rows: Record<string, unknown>[];
};

/** Small query boundary keeps storage behavior independently testable. */
export type WaitlistQuery = (text: string, values: unknown[]) => Promise<SqlResult>;

export function createPostgresWaitlistStore(query: WaitlistQuery): WaitlistStore {
  return {
    async consumeRateLimit({ key, now, expiresAt, limit }) {
      // Bound cleanup work; expired windows stop limiting immediately. Old hashes
      // are removed by subsequent submissions, not by an in-process timer.
      await query(
        `DELETE FROM waitlist_rate_limits WHERE key IN (
          SELECT key FROM waitlist_rate_limits WHERE expires_at <= $1
          ORDER BY expires_at LIMIT 50
        )`,
        [now],
      );
      // PostgreSQL serializes concurrent conflicts on this primary key. There is
      // no separate read/increment race, and denied requests saturate at limit+1.
      const result = await query(
        `INSERT INTO waitlist_rate_limits (key, count, expires_at) VALUES ($1, 1, $2)
         ON CONFLICT (key) DO UPDATE
         SET count = LEAST(waitlist_rate_limits.count + 1, $3)
         RETURNING count`,
        [key, expiresAt, limit + 1],
      );
      const count = result.rows[0]?.count;
      if (result.command !== "INSERT" || result.rowCount !== 1 || result.rows.length !== 1
          || typeof count !== "number" || !Number.isInteger(count) || count < 1 || count > limit + 1) {
        throw new Error("rate-write-failed");
      }
      return count;
    },

    async save(entry: WaitlistEntry) {
      const result = await query(
        `INSERT INTO waitlist_entries
         (id, name, email, phone, role, location, consent_version, consented_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT DO NOTHING`,
        [entry.id, entry.name, entry.email, entry.phone, entry.role, entry.location,
          entry.consentVersion, entry.consentedAt, entry.createdAt],
      );
      // Both a saved row and a unique-contact conflict are successful. Do not read,
      // return or replace the existing person's details on a duplicate request.
      if (result.command !== "INSERT" || (result.rowCount !== 0 && result.rowCount !== 1)) {
        throw new Error("waitlist-write-failed");
      }
    },
  };
}

export function createNeonWaitlistStore(databaseUrl: string | undefined): WaitlistStore | undefined {
  if (!databaseUrl) return undefined;
  // Constructing this HTTP client performs no query. Schema setup is explicit;
  // neither builds nor incoming form requests create or modify database tables.
  const sql = neon(databaseUrl, { fullResults: true });
  return createPostgresWaitlistStore(async (text, values) =>
    sql.query(text, values, { fetchOptions: { signal: AbortSignal.timeout(10_000) } }),
  );
}
