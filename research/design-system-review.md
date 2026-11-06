# Design system / November 6, 2026

Created `/design-system` as a noindex visual reference with eight chapters: identity, color, typography, layout/surfaces, components, patterns, motion, and voice/accessibility. The route is directly shareable without adding developer-facing navigation to the marketing page.

## Brand fidelity

The original `storefront-a-softer` SVG assets supplied by the user are copied without changing their paths or outlined wordmark. The primary lockup and isolated symbol were compared byte-for-byte with the originals. Supplied reversed and monochrome variants are included. Shared brand colors now match the master: #1557FF and #101E42.

Replaced the previous double-arch logo in the landing header, footer, waitlist dialog, paper illustration, and favicon. Updated the active vector illustration colors to the master palette.

## Shared implementation

Canonical downloadable tokens: `public/brand/tokens.css`. Component contracts: `styles/components.css`. React wrappers: `components/brand/primitives.tsx`. The existing HTML landing page uses the same action styles and semantic color aliases, with its approved composition retained.

Guide downloads include tokens, usage instructions, original SVG logo, and original logo package. Example forms have no network submission or persistence. Native anchors back to the landing page preserve its document-load script initialization.

## Verification

- ESLint passes without warnings.
- Production webpack build and TypeScript validation pass.
- Local browser checks at 1440, 768, 390, and 320px: no horizontal overflow; readable logo and controls.
- 720 CSS-pixel viewport verifies the reflow equivalent of a 1440px viewport at 200% browser zoom. This is not a manual browser-chrome zoom certification.
- Sample dialog: invalid-field description, first invalid field focus, local confirmation, confirmation focus, Escape, opener focus restoration.
- Expanding pathways: selected state, collapsed content inertness, coordinated width changes.
- Motion preview: replay and reduced-motion final state; glass preview supports light/dark backdrops.
- CSS tokens and guide downloads return successfully. No reference-page example sends a waitlist API request.
- Landing regression check: buyer/seller expansion, chapter accordion, popup role selection, Escape, and simulated failed-save feedback. No signup sent.
- Independent reviewer checked shared contracts, original logo placement, component consistency, and mobile captures; recommended field-label and success-focus fixes were applied.

Contrast calculations using WCAG relative luminance: white/blue 5.47:1; slate/white 5.90:1; success/green-wash 4.69:1; error/error-wash 5.98:1; cyan/navy 6.80:1; control-border/white 3.41:1. These are selected pair checks, not a full accessibility conformance claim.

Screenshots are generated under ignored `research/qa-neighborhood/design-system/`. A transient duplicated fixed-header paint after a rapid viewport resize disappears after the compositor settles; the DOM contains exactly one header.

## Scope

Waitlist API, database, consent collection, and deployment configuration remain the existing implementation. No new product functionality or invented business claims were added. The existing marketing layouts retain their scene-specific size and timing exceptions rather than undergoing an unrelated rewrite.
