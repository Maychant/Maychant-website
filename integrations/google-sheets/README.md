# Maychant waitlist → Google Sheets

The website saves each signup to Neon before reporting success. A private Google
Apps Script reads a dedicated authenticated feed every five minutes and appends
new signup IDs to the `Waitlist` tab. Google downtime does not block signups.

The sheet has seven columns: Signup ID, Joined at (UTC), Name, Interest, Email,
Phone, Notes. ID/email/phone values stay text, dates use UTC, and user-entered
formula prefixes are escaped. Notes are never overwritten. Duplicate submissions
retain the original database record and produce no duplicate sheet row.

## Setup

1. Apply the additive contact migration explicitly before deploying the new form:
   `node --env-file-if-exists=.env.local scripts/migrate-waitlist-contact.mjs`.
2. Generate a random 32-byte base64url token. Put only its SHA-256 hex digest into
   the Vercel production variable `WAITLIST_SHEETS_TOKEN_HASH`, then deploy.
3. Create a private sheet with the exact header row above, named `Waitlist`.
4. From the new sheet, choose Extensions → Apps Script to create a bound project.
   Add `Code.gs`. Its `@OnlyCurrentDoc` annotation limits spreadsheet access to
   this workbook. Set Script Properties
   `MAYCHANT_SHEET_ID` and `MAYCHANT_SYNC_TOKEN` to the verified sheet ID and token.
   Never put the token in a sheet cell, URL, source-control commit, or client code.
5. Run `setupWaitlistSync`, review Google's requested permissions, and authorize
   the script. Verify a successful run and one five-minute `syncWaitlist` trigger.
6. Confirm existing saved signups appear once; repeat a sync to check deduplication.

The script needs access to this spreadsheet, external HTTP requests to the Maychant feed,
and permission to create its own time-based trigger. It does not send email/SMS.
The Sheet and Apps Script should remain private to authorized waitlist managers.

## Operations

Each run starts a fresh UUID-paginated pass, so late commits and missed scheduled
runs are caught on the next pass. A lock prevents overlapping script runs. The
current bounded pass supports up to 10,000 rows; review capacity before that scale.
Failure details appear in Apps Script Executions without logging contact values.
The note on cell A1 records the last successful check.

This is an append-only mirror, not a two-way editor. Make contact corrections or
removals in both the database and the sheet; preserve each remaining Signup ID.
Deleting only a sheet row will cause it to be restored at the next sync. Local
test records must be removed from both destinations after verification.

The endpoint rejects missing/invalid tokens before querying, limits each page to
500 rows, uses parameterized cursors, and disables caching. Rotate the integration
token by replacing the Vercel hash and the matching Script Property together.

References: [Google installable triggers](https://developers.google.com/apps-script/guides/triggers/installable),
[Google Range API](https://developers.google.com/apps-script/reference/spreadsheet/range).
