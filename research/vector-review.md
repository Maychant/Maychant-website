# Maychant vector revision — independent review

Reviewed November 5, 2026, using the live local build at http://127.0.0.1:4173. Desktop 1440 × 900 and phone 390 × 844. Implementation files were not edited by this reviewer.

## Outcome

The revision delivers actual animated vector product art, with no detected raster/video assets or loads. Pause, reduced motion and a representative owner preparation flow pass. Both reported visual layout issues were corrected and passed the targeted final retest below. No unresolved issue remains from this bounded review.

## Visual findings

1. **Resolved P2 — mobile hero note was clipped.** In the first camera crop, the decorative “The little details…” note is cut at the right edge; in the second crop, its remaining text appears sliced at the left. Hide that note on mobile or move it inside the selected crop. Evidence: `qa-vector/phone-vector-phase0.png`, `phone-vector-phase1.png`.
2. **Resolved P2 — operator illustration labels overlapped.** On desktop, “A shared purpose” covers the end of “The next operator.” On phone, the “A thoughtful plan” chip overlaps the large “I want to run one” heading. Separate the badge from the profile label and raise/shrink the illustration on mobile. Evidence: `qa-vector/desktop-audience.png`, `phone-audience.png`.

No blocking functional defect was found in this bounded pass. The navy/blue/teal art is cohesive, the main hero cards remain readable at each mobile camera position, and the journey diagram explains the preparation stages more directly than the removed photographic film.

## Verified behavior

- **Real changing SVG state:** automatic phases 0 → 1 → 2 observed. The chart draws, path dots change coordinates, preparation check opacity changes from 0.15 to 1, and the next-step card moves. Mobile viewBox changes from `35 50 390 400` to `465 50 350 400` to `845 50 390 400`. These are time-separated rendered observations, not only source inspection.
- **User control:** scene buttons select phases 0 and 2 correctly, with the matching mobile camera crop.
- **Pause:** all sampled vector state is identical across two paused samples. The preparation dialog still opens visibly with opacity 1.
- **Reduced motion:** phone starts in a stable static state; scene selection still switches camera/card directly; the assessment remains visible.
- **Representative flow:** business owner → next few years → five “Partly” answers → useful result completed at desktop and phone widths while paused.
- **Journey:** manual step 3 selects only the third knowledge node and checks the corresponding plan rows.
- **Layout:** document scrollWidth equals viewport width at both 1440 and 390. No captured JavaScript errors.
- **Media removal:** zero `img`, `video` or SVG `image` elements; no raster/video references found in authored HTML/CSS/JS; the distribution asset list contains only fonts, scripts and an SVG favicon.
- **Network:** 11 observed local resources per viewport: HTML, app JS, two stylesheets, two animation libraries, four fonts and SVG favicon. No external, raster-image or video request detected.

## Evidence

Machine-readable observations: `research/qa-vector/observations.json`.

Useful captures:
- `desktop-vector-phase0.png`, `desktop-vector-phase1.png`, `desktop-vector-phase2.png`
- `phone-vector-phase0.png`, `phone-vector-phase1.png`, `phone-vector-phase2.png`
- `desktop-audience.png`, `phone-audience.png`
- `desktop-journey.png`, `phone-journey.png`
- `desktop-paused-assessment.png`, `phone-paused-assessment.png`
- `desktop-result.png`, `phone-result.png`, `phone-reduced-selected.png`

This was a focused Chromium review of the revision, not an exhaustive browser/device certification. The earlier dialog pause regression remains fixed. Full-page captures were taken paused so offscreen reveals remain visible.



## Targeted final retest

The implementation agent corrected both findings. Independently retested only the affected hero camera crops and audience illustrations at 1440 × 900 and 390 × 844; implementation remained untouched by this reviewer.

- Mobile phases 0 and 1 no longer show sliced decorative-note text. The note computes to `display:none` on phone and remains visible on desktop.
- “Shared purpose” now sits below the profile title, which is fully readable.
- “A thoughtful plan” and the rest of the operator artwork clear the large audience heading on both viewports. At phone size the lowest badge text ends near y678, while the main heading begins near y717; the screenshot confirms a clear gap.
- The storefront sign and its small care badge fit their shapes in the final desktop capture.

Final captures: `qa-vector/final-phone-phase0.png`, `final-phone-phase1.png`, `final-desktop-audience.png`, and `final-phone-audience.png`. Measurements: `qa-vector/final-targeted.json`.

**Final result: pass for this review scope.** Earlier vector-only asset/network checks, actual animation, pause/reduced-motion checks and representative assessment passes remain the evidence for the unchanged behavior; they were not redundantly rerun for these layout-only corrections.
