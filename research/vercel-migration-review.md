# Vercel migration verification — November 5, 2026

The Maychant GitHub checkout now runs standard Next.js with a private Neon Postgres waitlist. The original Sites checkout and hosted database were left intact. Page markup, styles, local fonts, SVG artwork and browser interactions are unchanged.

## Checked

- Production Next.js build, TypeScript and ESLint pass. Vendor minified animation libraries are excluded from lint; authored app scripts remain checked.
- 24 handler/storage tests pass, including failure responses, limits, consent, duplicate privacy and NFC-normalized input validation.
- Real Postgres verification passed for all roles, normalized duplicate emails, preserved consent, concurrent atomic rate limits and unique contacts. Only exact synthetic test entries and keys were removed.
- Desktop (1440 × 900) and mobile (390 × 844) browser checks passed locally and on Vercel: no horizontal overflow, working script loading, buyer/seller expansion, chapter accordion, popup role selection, Escape and failed-save feedback.
- Live Vercel API successfully stored a synthetic signup. Its consent version and role were confirmed directly in Postgres. A duplicate preserved the original role; invalid consent returned 400. The exact synthetic entry was removed. No email was sent.
- Independent agent review found no blocking issue. Its NFC validation correction is included and covered by two regression cases.

## Deployment

Vercel project: `maychant/maychant-website`. Connected GitHub repository: `Maychant/Maychant-website`, production branch `main`. Public Vercel URL: `https://maychant-website.vercel.app`.

Both `maychant.com` and `www.maychant.com` are attached to the project. `www` redirects to the root domain with status 308. Wix remains the DNS provider. Domain readiness must be verified after Wix DNS changes; attachment alone does not mean traffic has switched.

Neon uses the free plan in `iad1`. `DATABASE_URL` is server-only and configured for production, preview and development. The current integration connects those environments to the provisioned database; ordinary preview submissions may therefore reach the same waitlist. Use separate Neon branches for future development that needs isolated data. No existing D1 entries were migrated or deleted.

Credentials and Vercel local state are ignored by Git. Database schema setup is explicit and idempotent, not part of requests or builds.
