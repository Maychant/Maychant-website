import { neon } from '@neondatabase/serverless';
import { pathToFileURL } from 'node:url';

// Run explicitly after provisioning DATABASE_URL. Never import this script from
// an API route or build step. Future schema changes should use new migrations.
export const WAITLIST_SCHEMA_STATEMENTS = Object.freeze([
  // Serialize simultaneous setup commands; the transaction releases this lock.
  'SELECT pg_advisory_xact_lock(313006184)',
  `CREATE TABLE IF NOT EXISTS waitlist_entries (
    id uuid PRIMARY KEY,
    name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
    email text NOT NULL CHECK (char_length(email) <= 254 AND email = lower(email)),
    role text NOT NULL CHECK (role IN ('buyer', 'seller', 'both')),
    location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 120),
    consent_version text NOT NULL,
    consented_at bigint NOT NULL,
    created_at bigint NOT NULL
  )`,
  'CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique ON waitlist_entries (email)',
  `CREATE TABLE IF NOT EXISTS waitlist_rate_limits (
    key text PRIMARY KEY,
    count integer NOT NULL CHECK (count > 0),
    expires_at bigint NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS waitlist_rate_expiry ON waitlist_rate_limits (expires_at)',
]);

export async function setupWaitlistDatabase(sql) {
  // DDL and indexes commit together. Re-running preserves existing contacts.
  await sql.transaction(WAITLIST_SCHEMA_STATEMENTS.map(statement => sql.query(statement)));
}

export async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Waitlist setup requires DATABASE_URL. No changes were made.');
    return 1;
  }
  try {
    await setupWaitlistDatabase(neon(process.env.DATABASE_URL));
    console.log('Waitlist database schema is ready. Existing entries were preserved.');
    return 0;
  } catch {
    // Provider errors can include credentials, query parameters or contact data.
    console.error('Waitlist setup failed. Check database configuration and connectivity.');
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}
