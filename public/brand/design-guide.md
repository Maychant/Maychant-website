# Maychant design system / 1.0

The visual reference is at https://maychant.com/design-system.

## The idea

Maychant helps people take the next step toward buying or passing on a small business. The design should feel thoughtful, approachable, and optimistic. Make the next action clear without making a serious decision feel rushed.

Three principles: human in tone; clear in purpose; full of possibility.

## Source of truth

- `public/brand/tokens.css`: canonical CSS custom properties. Imported by the application and downloadable as `/brand/tokens.css`.
- `styles/components.css`: shared native-HTML component recipes. These style the live landing page and the reference page.
- `components/brand/primitives.tsx`: React BrandLogo, Button, Arrow, Field, and Notice wrappers using those same styles and assets.
- `app/design-system/`: visual guide and isolated interactive examples. Demo forms never contact the waitlist API or store personal information.
- `design/source-v3/landing.html`: editable landing markup. Run `node scripts/compose-landing.mjs` after editing it; do not manually edit the generated `app/landing-content.ts`.
- `app/globals.css`: established landing compositions, responsive layouts, and illustrated scenes. Existing art-direction values remain where a fluid generic token would alter the approved composition.

Import order is tokens → landing CSS → shared components. The reference page has separately scoped `ds-*` composition styles. Do not introduce another component framework or a second set of brand colors.

## Logo

The supplied identity combines a cobalt storefront awning, a navy M, the lowercase maychant wordmark, and a blue full stop.

The user-supplied vector masters come from `sites/maychant/brand/storefront-a-softer/vectors/`. The original paths and outlined Cabinet Grotesk 800 lettering are preserved in `public/brand/`:

- `maychant-logo.svg`: full-color horizontal lockup.
- `maychant-logo-on-dark.svg`: supplied reversed horizontal lockup.
- `maychant-symbol.svg`: full-color isolated mark.
- `maychant-symbol-on-dark.svg`: supplied isolated mark for dark backgrounds.
- `maychant-symbol-mono.svg`: single-color mark.
- `maychant-logos.zip`: original full asset package.
- `logo-source-notes.md`: original artwork notes and typography attribution.

Do not trace an approximate logo, typeset a substitute wordmark, or invent alternate variants. Use `BrandLogo` in React or the same external SVG in static HTML. The header, footer, dialog, paper illustration, and favicon use these paths. The favicon uses only the exact symbol on a transparent background. Its lower M uses the supplied white variant in dark browser chrome. The versioned `/brand/maychant-icon-v2.svg` URL refreshes the previous cached tab icon.

Preserve aspect ratio. Clear space starts at half the symbol height. Use 180px in desktop navigation and at least 132px on mobile; use the isolated mark when smaller. Use full color on white/light glass and the supplied reversed lockup on navy. Master colors are cobalt #1557FF and navy #101E42; the shared tokens and active illustrations match them.

## Color

| Token | Value | Purpose |
| --- | --- | --- |
| `--mc-blue` | #1557ff | Primary actions, selected controls, emphasis |
| `--mc-navy` | #101e42 | Main text, deep panels |
| `--mc-night` | #001021 | Large editorial dark sections |
| `--mc-white` | #FFFFFF | Primary page surface |
| `--mc-cloud` | #F3F5F8 | Quiet secondary surface |
| `--mc-blue-wash` | #EEF4FF | Selection and supporting panels |
| `--mc-slate` | #58657A | Secondary text on light surfaces |
| `--mc-cyan` | #11B5E4 | Illustration, motion, focus on dark |
| `--mc-teal` | #034748 | Supporting illustration and small accents |
| `--mc-success` | #087B58 | Readable success text |
| `--mc-error` | #B42318 | Error text and input state |
| `--mc-warning` | #885B12 | Notice text |

Use semantic aliases such as `--mc-action`, `--mc-text-secondary`, and `--mc-border-control` in new components. Keep existing `--blue`, `--ink`, etc. as compatibility aliases only. Avoid new hex values in component rules.

White text belongs on blue or navy. Navy text belongs on white, cloud, and cyan. Cyan is not a small-text color on white. Feedback uses color plus an icon and explicit text. The darker semantic green is distinct from an illustrative green.

## Typography

Use the locally hosted Cabinet font family at 400, 500, 700, and 800. Do not request remote font services.

| Role | Size | Weight | Behavior |
| --- | --- | --- | --- |
| Display | 48–96px | 800 | 1.02 leading; −.05em tracking |
| Section heading | 36–72px | 700 | 1.08 leading; −.035em tracking |
| Content title | 28–44px | 700 | Balanced line breaks |
| Lead | 18–22px | 500 | Short introductions |
| Body | 18px | 500 | 1.55 leading; roughly 60ch maximum |
| Control | 16px | 700 | Short, verb-led labels |
| Supporting label | 14px | 700 | Sentence case |
| Note | 12px | 500 | Secondary details, never essential tiny copy |

Page compositions can optically adjust within the scale. Inputs stay at least 16px on mobile. Avoid all-caps paragraphs; small uppercase labels are occasional signposts.

## Space, shape, and surfaces

Use the four-pixel spacing family: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Components generally use 16–24px internal spacing, related groups 32–48px, and sections 64–120px.

Maximum marketing content width is 1380px; page gutters scale from 20px to 56px. Navigation has its own narrower floating container. Existing breakpoints are 380, 700, 900, and 1200px. Collapse based on content fit; do not hide essential copy to force a layout.

Radii: input 10px; card/glass 24px; dialog 26px; actions and floating navigation 999px. Mobile panels may tighten to 20–22px. Do not make every object a pill.

General glass surfaces combine a translucent fill, 28px blur, 165% saturation, a fine inner highlight, and a soft navy shadow. Use them on expanded surfaces with visible depth behind them. Body copy belongs on a stable reading surface.

The floating navigation has its own `--mc-nav-glass-*` recipe: a white 34% tint, 20px blur, 180% saturation, a rounded rim, and a soft shadow. Its separate `::before` surface carries the subtle SVG refraction; the logo, links, and focus rings remain outside that filter. Over the navy chapter, the tint falls to 9% and the foreground switches to the supplied reversed logo, white links, and a light CTA.

Keep standard and WebKit backdrop declarations in separate `@supports` rules so production CSS optimization preserves the standard spelling. Verify `getComputedStyle(header, '::before').backdropFilter` in the deployed site, not just the source. Always check glass against light content, illustrations, and dark content. Use the solid fallback when transparency is reduced or backdrop-filter is unavailable.

## Components

### Actions

Native HTML:

```html
<button class="mc-button" type="button">Join the waitlist</button>
<button class="mc-button mc-button--secondary" type="button">I want to sell</button>
<button class="mc-button mc-button--ink mc-button--small" type="button">Join the waitlist</button>
```

React:

```tsx
import { Button, Field, Notice } from "@/components/brand/primitives";

<Button arrow onClick={openWaitlist}>Join the waitlist</Button>
<Button variant="secondary" arrow>I want to sell</Button>
<Field id="email" label="Email address" type="email" error={emailError} />
<Notice tone="success">Your details have been saved.</Notice>
```

Actions are at least 44px tall; default is 54px. Use one primary action per group. Primary blue, secondary outlined/light, navy for a compact navigation action, and text style for quiet navigation. Hover lifts by 2px and shifts the arrow 3px. Press lowers by 1px. Disabled uses `disabled`; progress additionally uses `aria-busy`. Never use a button that silently does nothing.

Existing marketing CTAs retain `data-waitlist-open` and optional `data-role="buyer"` or `"seller"`. Do not change these hooks when adjusting classes.

### Forms and feedback

Keep real visible labels. Placeholder text is only a hint. Connect hints/errors via `aria-describedby`, set `aria-invalid`, and focus the first invalid field. Put radio errors on the visible selection surface, not just its visually hidden input. Use explicit consent; never pre-check it.

Success requires confirmed server success. Keep entered values after a request failure. Use a clear pending label; never clear a form before the save succeeds.

### Dialogs

Use native `dialog.showModal()` so focus is contained and the background is inert. Support Escape, a visible close button, scrolling within the viewport, and focus restoration. The waitlist continues to open in a popup rather than a permanent footer form. Every preview dialog must clearly say that it is a local demo.

### Expandable content

On desktop, one buyer/seller panel expands while the other contracts. On mobile, stack them vertically. The toggle needs `aria-expanded` and `aria-controls`. Hide collapsed descendants from keyboard and assistive interaction with `inert` as appropriate. Keep the principal choice visible. Native details/summary is suitable for short FAQ disclosures.

## Illustration and motion

Use authored vector scenes with navy outlines and controlled cobalt/cyan accents. No generated photos or video. Keep the neighborhood broad enough to represent independent businesses across industries. Hero shop bases remain fully visible. Follow the hero with editorial type and purposeful illustration; avoid repeating the same storefront scene in every section.

Motion defaults:

- Color/focus: 180ms.
- Action response: 250ms.
- Panel expansion: 600ms.
- Scene introduction: 800ms, with 120ms stagger.
- Shared ease: cubic-bezier(.22, 1, .36, 1).

Animate opacity and transforms for introductions. Reserve grid/height transitions for deliberate content expansion. Existing GSAP hero choreography may use longer scene-specific timing. Continuous animation needs pause/play. Honor prefers-reduced-motion by showing final content immediately; never leave text or controls invisible because motion failed.

## Voice

Talk to the person, not an acquisition persona. Prefer “buy a business,” “pass it on,” and “explore at your own pace” to financial jargon. Be honest that the current product is a waitlist. Do not imply live listings, guaranteed matches, completed deals, or a fixed launch date.

Use concrete labels: “Join the waitlist,” not “Unlock your future.” Errors explain recovery: “We couldn’t save your details. Check your connection and try again.”

## Access and release checks

Target at least 4.5:1 contrast for normal text and 3:1 for meaningful control boundaries/states. Large text has a 3:1 minimum. Check the final composited glass surface rather than assuming a token passes everywhere. The 44px target is Maychant's usability standard.

Primary references: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Before shipping, verify desktop, 390px and 320px layouts; 200% zoom; keyboard operation; visible focus; Escape/focus restoration; reduced motion; usable opaque glass fallback; and no horizontal overflow. These are checks, not a claim of a full accessibility certification.

Run `npm run lint`, `npm run typecheck`, and a production build. Local restricted environments may need `npm run build -- --webpack`; Vercel runs the normal production build. Capture the live guide and landing page after deployment. Test visual-only demo forms without sending real waitlist records.

Navigation between this guide and the current landing page uses normal anchors, not client-side routing: the landing page's legacy script initializes on document load. Do not introduce client-side transitions without making that initializer lifecycle-aware.

## What this version covers

Shared foundations, actions, fields, feedback, glass surfaces, dialog/expansion behavior, illustration direction, motion, copy, and responsive rules. It does not introduce a marketplace, seller dashboard, payment flow, or unbuilt product claims. Design future screens from these foundations as their functionality is defined.
