# Maychant

A bespoke business-succession homepage, designed around the supplied Maychant palette and the idea of a business's next chapter.

## Run locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. The deployable site is the `dist` directory; no build or runtime dependency installation is needed.

## Included

- Authored SVG hero: a business snapshot, preparation card and next-step plan connected by moving signals. GSAP draws the chart, changes focus and reveals the priorities, with direct scene selection and a motion pause control.
- Three accessible expanding audience panels for owners, future operators, and advisers.
- A three-chapter scroll story with a sample handover document, plus manual chapter controls and reduced-motion behavior.
- Responsive vector illustrations for owners and operators, plus a knowledge map and handover document. Mobile frames one hero card at a time. No raster imagery or video is shipped.
- Three-stage preparation check. Role-aware questions, prioritized next steps, Back/review/reset behavior, and real plain-text export/copy.
- FAQ, mobile navigation, privacy explanation, and a contact flow that opens a draft addressed to the owner's supplied email, krishdw@umich.edu.

## Deliberate scope

This is an early-stage landing site with a working browser-local preparation tool. It does not have live business listings, accounts, buyer matching, professional reviews, valuations, payments, a mailing-list database, or AI processing. Preparation answers are held in memory and never submitted. Email is reviewed and sent by the visitor's mail application; the site does not claim a message was received.

The Site was created with owner-private access. Publication does not make it publicly accessible without a separate audience change.

## Design provenance

The current vector direction replaces the original generated photography and brand film at the user's request. `research/vector-reference-notes.md` records the observed Coinbase clip and the translation into an original SVG workflow. Historical section comps and prompts remain in `design/`, outside the deployed assets. `research/repository-influences.md` documents all eleven unique requested repositories. No competitor images, logos, testimonials, source code, or statistics were copied.

Implementation is custom HTML, CSS, SVG, and JavaScript. Curated repositories inform composition and research; shadcn and Magic UI inform accessible dialog/disclosure and reveal/progress behavior. They are not installed React dependencies. GSAP, ScrollTrigger and fonts are served locally. The graphics show an illustrative preparation workflow, not real businesses, customer activity or live matches.

## Verification

See `research/vector-review.md` for the current independent motion, responsive-layout and functional checks, and `research/self-critique.md` for release judgment. `research/visual-motion-review.md` and `research/functional-review.md` describe the original version; the vector review covers the changed UI and a representative preparation flow. These distinguish measured checks from subjective design judgment.
