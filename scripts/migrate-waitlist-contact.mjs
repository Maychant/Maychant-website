import { neon } from '@neondatabase/serverless';
import { pathToFileURL } from 'node:url';

// Apply explicitly after the original db:setup, before deploying contact-aware
// handlers. Never import this migration from an API route or a build step.
export const WAITLIST_CONTACT_MIGRATION_STATEMENTS = Object.freeze([
  // Use setup's lock so initial provisioning and this migration cannot race.
  'SELECT pg_advisory_xact_lock(313006184)',
  'ALTER TABLE waitlist_entries ADD COLUMN IF NOT EXISTS phone text',
  'ALTER TABLE waitlist_entries ALTER COLUMN email DROP NOT NULL',
  'ALTER TABLE waitlist_entries DROP CONSTRAINT IF EXISTS waitlist_entries_name_check',
  `ALTER TABLE waitlist_entries ADD CONSTRAINT waitlist_entries_name_check
    CHECK (char_length(name) BETWEEN 1 AND 100)`,
  `DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = 'waitlist_entries'::regclass AND conname = 'waitlist_one_contact_check'
    ) THEN
      ALTER TABLE waitlist_entries ADD CONSTRAINT waitlist_one_contact_check
        CHECK ((email IS NOT NULL) <> (phone IS NOT NULL));
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = 'waitlist_entries'::regclass AND conname = 'waitlist_phone_format_check'
    ) THEN
      ALTER TABLE waitlist_entries ADD CONSTRAINT waitlist_phone_format_check
        CHECK (phone IS NULL OR phone ~ '^\\+[1-9][0-9]{1,14}$');
    END IF;
  END $$`,
  // Retain the original unique-email index and its normalization check unchanged.
  'CREATE UNIQUE INDEX IF NOT EXISTS waitlist_phone_unique ON waitlist_entries (phone)',
]);

export async function migrateWaitlistContact(sql) {
  // No data updates or deletes. DDL, constraint validation and index creation
  // commit atomically; a failure rolls back every schema change.
  await sql.transaction(WAITLIST_CONTACT_MIGRATION_STATEMENTS.map(statement => sql.query(statement)));
}

export async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Waitlist contact migration requires DATABASE_URL. No changes were made.');
    return 1;
  }
  try {
    await migrateWaitlistContact(neon(process.env.DATABASE_URL));
    console.log('Waitlist contact migration complete. Existing entries were preserved.');
    return 0;
  } catch {
    // Never print provider errors: they may contain credentials or contact data.
    console.error('Waitlist contact migration failed. Check database configuration and connectivity.');
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}
