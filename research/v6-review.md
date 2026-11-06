# Maychant V6 independent QA

Reviewed November 5, 2026. Used only the official local preview at `http://127.0.0.1:5175`, verified by “Get early access,” `#waitlist-dialog`, and the new action dock. Port5174 was not visited or stopped. No implementation/backend edits. All synthetic form requests were intercepted in the browser; no local/hosted record was created.

## Result

The hero, expanding glass sections, and modal fit the tested layouts. The one material issue found in the initial pass—invalid name focus hidden behind the modal header—has been fixed and independently rechecked. No unresolved issue remains from this review.

## Finding

**Fixed: name error hidden under modal topbar.** Initially, at390×430, after scrolling to Submit, an intercepted422 response with `fields.name` focused an input at y14.7–61.7 behind the sticky topbar at y13–72. Root added explicit dialog scrolling with topbar clearance while retaining the open-dialog/privacy guard. The single targeted recheck now places the focused name input at y102.7–149.7, fully below the header; its label, outline, and error message are visible. Dialog scroll changed from376 to288. Final evidence: `v6-phone-name-error-fixed.png`, `v6-name-fix-observations.json`. Original defect evidence remains in `v6-phone-name-error-short.png` and `v6-edge-observations.json`.

## Passed checks

- **Hero fit:** all three shop bases fit the first1440×900 viewport (bottoms878–882px) and1280×800 viewport (bottoms773–777px). White/navy/cobalt palette remains under OS dark preference. Detached rounded header fits all widths and remains legible over navy.
- **Real motion:** timed samples of active CSS animations change; reduced-motion emulation produces zero active animations. Paused/reduced pages still open readable modals and change chapter content. No visible category labels returned.
- **Audience expansion:** at1440px, selection exchanges approximately801px/505px card widths and763px/590px heights. At390px, selected cards grow from531px collapsed to712–733px expanded. Both buyer and seller states were captured, including800px tablet. `aria-expanded` and inert details track selection; matching CTAs open the correct waitlist role.
- **Chapter accordion:** selected desktop item grows from74px to158px, phone from68px to146px, tablet from67px to138px. All three selections update the paper, expanded explanation, and inert state. ArrowDown moves to and expands the next button. All paper text/footers remain contained at360/390/800px.
- **Modal layout:** settled buyer/seller dialogs were visually inspected at1440,390,360px. The form is absent from the page footer and lives in the dialog. At390/360×430, dialog remains within viewport and close/Submit can be reached by scrolling/focus. This simulates reduced keyboard space; it is not a physical iOS/Android keyboard test.
- **Modal lifecycle:** buyer/seller role, nested Privacy, Escape, backdrop close, and exact opener focus restoration work. Body scroll is restored after the native close event. Tab cycling did not reach background interactive elements; native browser chrome may receive a stop outside the document.
- **Form responses:** required/consent validation prevents requests. Intercepted503 preserves values, displays error, and re-enables retry. Intercepted422 marks/focuses invalid email. Success appears only after intercepted200 with `ok:true`. Reopening preserves success until “Add another person.” A delayed simulated200 after closing does not steal focus or reopen the dialog.
- **Layout/runtime:** no horizontal document overflow or JavaScript page errors at1440×900,1280×800,390×844,360×800,800×900. Existing screenshots and geometry show no clipped essential card/accordion content.

## Evidence

Ignored `research/qa-neighborhood/` contains `v6-*` captures and three observation files: `v6-observations.json`, `v6-modal-observations.json`, `v6-edge-observations.json`. Buyer/seller modal images were refreshed after their entrance animation, superseding initial empty-backdrop timing captures.

Useful screenshots: `v6-desktop-hero.png`, `v6-laptop-hero.png`, `v6-desktop-audience-buyer.png`, `v6-desktop-audience-seller.png`, `v6-tablet-audience-seller.png`, `v6-phone-chapter-future.png`, `v6-tablet-chapter-future.png`, `v6-desktop-modal-buyer.png`, `v6-phone-modal-seller.png`, `v6-narrow-modal-buyer.png`, `v6-phone-field-error-short.png`, `v6-desktop-modal-success.png`, and desktop/phone full-page overviews.

This is a bounded isolated-Chrome visual and interaction review, not cross-browser certification, screen-reader certification, or backend persistence testing. No production signup or external message was sent.
