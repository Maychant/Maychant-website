# Maychant

A buyer and seller waitlist for small-business ownership, with an authored animated neighborhood illustration. This revision replaces the former succession-preparation landing page.

## Run and build

Use Node.js 22 (also specified in `.nvmrc` and `package.json`). This checkout uses standard Next.js App Router, React and a Neon Postgres waitlist, deployed on Vercel.

```sh
npm ci
npm run dev
```

The development server runs at `http://localhost:3000`. To use another port, run `npm run dev -- --port 5176`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`next build` produces `.next/`; `next start` serves that production build. Database credentials are not required to build or view the landing page. The waitlist fails with a service-unavailable response if storage is not configured; it never reports an unsaved submission as successful.

## Waitlist storage and deployment

Set the server-only `DATABASE_URL` to the Neon Postgres connection string in `.env.local` for local development and in the Vercel project's environment settings for each deployment environment. Keep credentials out of Git and browser code. Use separate development and production databases or Neon branches when testing signups.

Run the explicit, idempotent schema setup once for each database before accepting submissions:

```sh
npm run db:setup
```

This command reads `.env.local` when present, or the existing process environment. Schema setup does not run during builds. The old Cloudflare D1 adapter, migrations, Worker, Vinext/Vite tooling and unused Sites authentication/connector scaffolding have been retired from this checkout. Existing hosted D1 records, if any, are not automatically transferred to Neon.

Import this repository into Vercel with the **Next.js** framework preset and Node.js **22.x**. Use the default `npm run build` command and Next.js output handling; no custom Worker, output directory or `vercel.json` is needed. Add `DATABASE_URL`, initialize that database, and redeploy after environment changes. Deployment access is governed by the Vercel project's protection settings.

## Source map

- Page markup: `app/landing-content.ts` (generated from the readable `design/source-v3/landing.html` and `design/neighborhood-scene.svg`).
- Styling: `app/globals.css`.
- Waitlist form, tabs, pause controls and privacy dialog: `public/app.js`.
- Post-hydration local script loading: `app/site-scripts.tsx`.
- Write-only API and validation: `app/api/waitlist/route.ts` and `lib/waitlist.ts`.
- Neon persistence: `lib/waitlist-store.ts`.
- Postgres schema setup: `scripts/setup-waitlist-db.mjs`.
- Production output: generated `.next/`, not an authored source directory.

After editing the readable markup or illustration, run `node scripts/compose-landing.mjs` to update the page module.

## Experience

The centered headline leads into a full neighborhood scene sized to show complete storefront bases at the reviewed desktop viewport sizes. A pale street backdrop, distant building outlines, a paper plane, window glints, swaying awnings and moving route details add motion. The supplied white, navy, cobalt and cyan palette remains fixed across OS themes. The artwork is authored SVG, with separate entrance, interaction and perspective groups.

Navigation floats below the top edge in a rounded glass bar. The buyer and seller panels widen and reveal more context when selected while the other panel contracts. Their illustrations have transparent canvases to blend with the glass surfaces. The navy section uses an accordion: the selected chapter opens its explanation, compresses the other chapters and updates the animated paper illustration. Pause and system reduced-motion controls retain a fully readable static view.

Waitlist actions open a native modal rather than scrolling to a footer form. Explicit buyer/seller buttons preselect their role; unfinished inputs are preserved on close. Escape, backdrop and close controls restore focus to the opener. Nested privacy details preserve the outer modal's scroll lock and focus. The form saves name, email, interest, optional location and consent through the existing API. Success requires a successful server response and remains visible on reopening until the user chooses Add another. No email is sent automatically.

## Product scope

This is a prelaunch waitlist, not a live business marketplace. There are no listings, valuations, buyer matches, transaction guarantees, payments or user accounts. There is no public endpoint for reading signups. Duplicate emails receive the same response without exposing or overwriting the original entry. Owner follow-up and removal requests can be handled through the supplied contact address.

## Verification

The UI is preserved from the previous deployment. Popup, expansion and responsive review: `research/v6-review.md`. Previous redesign and motion review: `research/v5-review.md`. Earlier palette and scene review: `research/color-scene-review.md`. Full waitlist and layout review: `research/neighborhood-review.md`. Root design judgment: `research/self-critique.md`. These reviews describe the original hosting environment. `research/waitlist-backend-report.md` documents the retired D1 implementation, not verification of the current Neon backend. Earlier photographic/vector dashboard reviews describe superseded versions and remain historical evidence only.

Original reference research, including all eleven requested GitHub repositories, remains in `research/repository-influences.md`. Current storefronts and all other art are bespoke; no competitor assets or customer claims are used.
