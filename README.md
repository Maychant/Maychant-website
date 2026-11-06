# Maychant

A buyer and seller waitlist for small-business ownership, with an authored animated neighborhood illustration. This revision replaces the former succession-preparation landing page.

## Run and build

```sh
npm run dev -- --port 5175
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

The centered headline leads into a full neighborhood scene sized to show complete storefront bases at the reviewed desktop viewport sizes. A pale street backdrop, distant building outlines, a paper plane, window glints, swaying awnings and moving route details add motion. The supplied white, navy, cobalt and cyan palette remains fixed across OS themes. The artwork is authored SVG, with separate entrance, interaction and perspective groups.

Navigation floats below the top edge in a rounded glass bar. The buyer and seller panels widen and reveal more context when selected while the other panel contracts. Their illustrations have transparent canvases to blend with the glass surfaces. The navy section uses an accordion: the selected chapter opens its explanation, compresses the other chapters and updates the animated paper illustration. Pause and system reduced-motion controls retain a fully readable static view.

Waitlist actions open a native modal rather than scrolling to a footer form. Explicit buyer/seller buttons preselect their role; unfinished inputs are preserved on close. Escape, backdrop and close controls restore focus to the opener. Nested privacy details preserve the outer modal's scroll lock and focus. The form saves name, email, interest, optional location and consent through the existing API. Success requires a successful server response and remains visible on reopening until the user chooses Add another. No email is sent automatically.

## Product scope

This is a prelaunch waitlist, not a live business marketplace. There are no listings, valuations, buyer matches, transaction guarantees, payments or user accounts. There is no public endpoint for reading signups. Duplicate emails receive the same response without exposing or overwriting the original entry. Owner follow-up and removal requests can be handled through the supplied contact address.

## Verification

Current popup, expansion and responsive review: `research/v6-review.md`. Previous redesign and motion review: `research/v5-review.md`. Earlier palette and scene review: `research/color-scene-review.md`. Full waitlist and layout review: `research/neighborhood-review.md`. Backend tests and persistence evidence: `research/waitlist-backend-report.md`. Root design judgment: `research/self-critique.md`. Earlier photographic/vector dashboard reviews describe superseded versions and remain historical evidence only.

Original reference research, including all eleven requested GitHub repositories, remains in `research/repository-influences.md`. Current storefronts and all other art are bespoke; no competitor assets or customer claims are used.
