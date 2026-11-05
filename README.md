# Maychant

A buyer and seller waitlist for small-business ownership, with an authored animated neighborhood illustration. This revision replaces the former succession-preparation landing page.

## Run and build

```sh
npm run dev -- --port 5174
```

The current application uses the Sites Vinext starter, React and a Cloudflare Worker with D1. The Site identity remains in `.openai/hosting.json`; the audience remains owner-private.

- Page markup: `app/landing-content.ts` (generated from the readable `design/source-v3/landing.html` and `design/neighborhood-scene.svg`).
- Styling: `app/globals.css`.
- Waitlist form, tabs, pause controls and privacy dialog: `public/app.js`.
- Post-hydration local script loading: `app/site-scripts.tsx`.
- Write-only API: `app/api/waitlist/route.ts` and `lib/waitlist.ts`.
- Schema and immutable migration: `db/schema.ts` and `drizzle/`.
- Deployed output: generated `dist/`, not an authored source directory.

After editing the readable markup or illustration, run `node scripts/compose-landing.mjs` to update the page module.

Use the installed Sites plugin's build and publication helpers for release. Local D1 migration setup is described in `research/waitlist-backend-report.md`. Do not replay an applied migration. Local test records are separate from hosted storage.

## Experience

The hero illustrates three fictional neighborhood businesses with a waving owner, rotating record, coffee steam, moving plants and an Open sign. All artwork is SVG; no generated photos or video are shipped. CSS handles continuous SVG motion and GSAP handles entrances. Pause and system reduced-motion settings provide a static view. Light and dark themes follow the system preference.

Buyer and seller links select the corresponding waitlist interest. Keyboard-operable audience tabs explain both sides. The form saves name, email, interest, optional location and consent. It shows success only after a successful server response and preserves input on failure. Names and addresses are never stored in browser storage or placed in a form GET URL. No email is sent automatically.

## Product scope

This is a prelaunch waitlist, not a live business marketplace. There are no listings, valuations, buyer matches, transaction guarantees, payments or user accounts. There is no public endpoint for reading signups. Duplicate emails receive the same response without exposing or overwriting the original entry. Owner follow-up and removal requests can be handled through the supplied contact address.

## Verification

Current independent review: `research/neighborhood-review.md`. Backend tests and persistence evidence: `research/waitlist-backend-report.md`. Root design judgment: `research/self-critique.md`. Earlier photographic/vector dashboard reviews describe superseded versions and remain historical evidence only.

Original reference research, including all eleven requested GitHub repositories, remains in `research/repository-influences.md`. Current storefronts and all other art are bespoke; no competitor assets or customer claims are used.
