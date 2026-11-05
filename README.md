# Maychant

A bespoke business-succession homepage, designed around the supplied Maychant palette and the idea of a business's next chapter.

## Run locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. The deployable site is the `dist` directory; no build or runtime dependency installation is needed.

## Included

- Responsive photographic hero with original imagery, GSAP entrance and floating motion, a connecting arc, and a motion pause control.
- Three accessible expanding audience panels for owners, future operators, and advisers.
- A three-chapter scroll story with a sample handover document, plus manual chapter controls and reduced-motion behavior.
- Original 18-second silent brand film with native video controls, captions, poster, and transcript.
- Three-stage preparation check. Role-aware questions, prioritized next steps, Back/review/reset behavior, and real plain-text export/copy.
- FAQ, mobile navigation, privacy explanation, and a contact flow that opens a draft addressed to the owner's supplied email, krishdw@umich.edu.

## Deliberate scope

This is an early-stage landing site with a working browser-local preparation tool. It does not have live business listings, accounts, buyer matching, professional reviews, valuations, payments, a mailing-list database, or AI processing. Preparation answers are held in memory and never submitted. Email is reviewed and sent by the visitor's mail application; the site does not claim a message was received.

The Site was created with owner-private access. Publication does not make it publicly accessible without a separate audience change.

## Design provenance

The four generated section comps and image analysis are in `design/`. Original image-generation prompts and asset mappings are in `design/prompts.json`. `research/repository-influences.md` documents all eleven unique requested repositories. `research/reference-sites.md` distinguishes observed reference-site behavior from design inference. No competitor images, logos, testimonials, source code, or statistics were copied.

Implementation is custom HTML, CSS, and JavaScript. Curated repositories inform composition and research; shadcn and Magic UI inform accessible dialog/disclosure and reveal/progress behavior. They are not installed React dependencies. GSAP and ScrollTrigger are served locally. The original brand photos are illustrations, not customers or available businesses.

## Verification

See `research/visual-motion-review.md`, `research/functional-review.md`, and `research/self-critique.md` for the independent reviews, limitations, and fixes. These distinguish measured checks from subjective design judgment.
