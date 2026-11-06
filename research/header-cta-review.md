# Header and CTA refinement — November 6, 2026

The floating header now uses a more translucent frosted surface, a fine inner reflective rim and a compact 66px desktop layout. The header action is a navy “Join the waitlist” pill with a small SVG arrow. The two hero actions use clear single-line buyer/seller labels; the former enclosing dock, secondary captions and circled arrow treatments are removed. Closing and submit actions use the same rounded button language.

The palette, illustrations, waitlist API and popup behavior are preserved. The mobile header action has a 44px target. Keyboard focus, reduced motion, reduced transparency and browsers without backdrop-filter are handled.

Review: desktop 1440×900, phones 390px and 320px, and header over the navy section. No horizontal overflow or clipped labels; header/hero/closing actions open the modal, role preselection works, Escape closes it and returns focus. No signup was submitted. An independent agent reviewed the screenshots and source and found no blockers. On white the glass is deliberately subtle; it becomes clearer as colored content moves behind it.

Local production compilation and TypeScript passed using Next.js Webpack; the local Turbopack worker was blocked from binding its internal port. ESLint and whitespace checks passed. Vercel retains its normal Next.js build.
