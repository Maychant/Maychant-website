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

The centered hero leads into a wide authored neighborhood panorama. Three generic fictional businesses rise into place one by one. Each responds to hover, focus and keyboard activation, while an owner waves, plants move, an Open sign swings and sky details drift. No visible shop-type labels narrow the audience. Perspective, entrance and hover transforms use separate SVG groups so whole buildings move together. The supplied white, navy, cobalt and cyan palette remains fixed across OS themes.

A sticky translucent header provides persistent navigation. The lower page alternates a spacious editorial statement, two expansive buyer/seller panels with custom hand-and-paper illustrations, and a navy handover section. The navy section has keyboard-operated chapter tabs and layered papers that shift with scrolling. Pause and system reduced-motion settings provide a static, fully readable view. All artwork is authored SVG/CSS; no generated photos or videos are shipped.

Buyer and seller links select the corresponding waitlist interest. The form saves name, email, interest, optional location and consent. Success appears only after a successful server response; input is preserved on failure. Form initialization precedes optional animation setup. Names and addresses are never stored in browser storage or placed in a GET URL. No email is sent automatically.

## Product scope

This is a prelaunch waitlist, not a live business marketplace. There are no listings, valuations, buyer matches, transaction guarantees, payments or user accounts. There is no public endpoint for reading signups. Duplicate emails receive the same response without exposing or overwriting the original entry. Owner follow-up and removal requests can be handled through the supplied contact address.

## Verification

Current redesign and motion review: `research/v5-review.md`. Earlier palette and scene review: `research/color-scene-review.md`. Full waitlist and layout review: `research/neighborhood-review.md`. Backend tests and persistence evidence: `research/waitlist-backend-report.md`. Root design judgment: `research/self-critique.md`. Earlier photographic/vector dashboard reviews describe superseded versions and remain historical evidence only.

Original reference research, including all eleven requested GitHub repositories, remains in `research/repository-influences.md`. Current storefronts and all other art are bespoke; no competitor assets or customer claims are used.
