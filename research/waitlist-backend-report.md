# Maychant durable waitlist — implementation and verification

Implemented November 5, 2026. Backend migration only; the root agent owns the landing copy, styling and browser interaction code. No publication, Git commit, audience change, production signup, email or credential change was performed.

## Implementation

- Prepared the supported Vinext starter separately, then ported its configuration and build integration into the existing checkout. Preserved `.git`, history and project ID `appgprj_6aebfba3c51c81919855d950f16c7ad2`.
- Preserved all original static fonts, GSAP, ScrollTrigger and favicon in `public/assets` before the first generated build. The existing static `dist` output becomes generated Worker/client output.
- `.openai/hosting.json` now declares `d1: "DB"`, `r2: null`, with the obsolete `static` field removed. No hosted resources were independently provisioned; Sites handles the D1 binding and hosted migration on publication.
- `app/page.tsx` renders the root-owned `landing-content.ts` HTML string inside an opaque markup wrapper. `app/layout.tsx` adds metadata. A small client component loads local GSAP, ScrollTrigger and `app.js` in order from a post-hydration effect; failed animation loads do not prevent form initialization.
- `POST /api/waitlist` validates name, email, buyer/seller/both role, optional location and explicit boolean consent. The `website` honeypot must be empty.
- Saves a generated ID, trimmed name, lowercased email, role, optional location, consent version and timestamps. Email has a unique index. Existing emails return the same success response without exposing or overwriting their record.
- No public read/list endpoint, no confirmation email, and no browser-storage substitute. GET returns 405. A database failure returns 503, never a signup-success response.
- Limits JSON request bodies to 4 KiB, including streamed bodies without a trustworthy Content-Length. Rejects cross-site browser origins, invalid content types, malformed JSON and control characters. Queries use bound parameters.
- D1-backed request limit: 12 valid attempts per 10-minute bucket, keyed by a hash of Cloudflare client IP or platform identity. No raw IP or user ID is stored. Expired keys are removed in bounded batches as requests arrive. 429 includes Retry-After. This is basic abuse control, not a claim of comprehensive bot prevention.

## API contract

Request:

```json
{"name":"Example Person","email":"person@example.com","role":"buyer","location":"Ann Arbor","consent":true,"website":""}
```

Successful durable insert or existing-email conflict: HTTP 200, `{"ok":true,"message":"You’re on the Maychant waitlist."}`.

Validation: HTTP 400 with `ok:false`, `error`, and a `fields` mapping for relevant controls. Other statuses: 403 origin, 413 body size, 415 content type, 429 request limit, 503 unavailable storage. All responses use `Cache-Control: no-store`.

Duplicates deliberately retain the original name/role/location. Contact-based correction can be handled by the owner; anonymous requests cannot alter another person's record.

## Verification completed

- Supported dependency installation completed.
- TypeScript check passed and public interaction script syntax checked.
- Eleven endpoint unit tests passed, covering invalid fields, control characters, cross-origin requests, content type, malformed/oversized bodies, honeypot, missing database, database errors, unsuccessful final write, rate limiting and successful normalization/parameterization.
- Supported Vinext build passed, with `/` and `/api/waitlist` included.
- Generated and inspected schema-only `drizzle/0000_amused_nextwave.sql` plus Drizzle journal/snapshot. Applied exactly once to the local database. Four schema statements completed successfully.
- Built Worker integration tested buyer, seller and both; case-insensitive duplicates; four concurrent duplicate requests; consent/honeypot rejection; GET 405; and 429 rate limiting.
- Direct local D1 inspection confirmed exactly five distinct synthetic integration records with consent version/timestamps. Duplicate requests preserved the original details. No real person or production data was used.
- Stopped the built Worker, queried local D1 from a separate process and confirmed the five rows remained. Restarted the Worker successfully. This verifies local durable storage rather than in-memory success.
- Current-source preview returned HTTP 200. The root's UI reviewer owns the browser/hydration and final design checks. Browser plugin navigation remained unavailable due a tool error; no browser success is claimed by this backend report.
- Root's initial browser review identified an attribute mismatch caused by deferred app.js modifying markup before React hydration. Replaced that lifecycle with the post-hydration client loader and removed hydration-warning suppression. The final built browser check confirmed the fix: HTTP 200, form initialized, GSAP/ScrollTrigger loaded, app.js loaded exactly once, three hero buildings present, and zero console errors, warnings, hydration messages or failed requests.
- Final built endpoint smoke checks returned GET 405 and invalid POST 400. These checks created no additional signups. The result is retained in ignored `.sites-runtime/final-built-check.json`.

## Handoff

Current-source HMR preview: `http://127.0.0.1:5174/`, exec session `78061`. Port 5173 was occupied and its process was left alone. Final built preview: `http://127.0.0.1:8787/`, exec session `82087`. Both use the checkout's local `.wrangler/state`; both were left running at the root agent's request.

The final supported build includes the final UI and post-hydration loader. The root agent then regenerated the landing-content source using equivalent JSON string escaping, 44 seconds after that build. Include the supported build command once during source-helper packaging so the archive exactly matches the final source. No further database migration or API test is needed unless runtime/schema changes.

Reproducible checks:

```text
node --test research/waitlist-unit.test.mjs
node research/waitlist-integration.mjs http://127.0.0.1:8787
```

The integration runner refuses non-loopback destinations. Synthetic results live in ignored `.sites-runtime/waitlist-test-results.json`; test records remain only in the ignored local database. Hosted storage will be separate, and production migration/behavior has not yet been verified. Do not replay the local migration or alter its SQL/history after it has been applied.
