# Maychant V4 color and dimensional scene review

Reviewed November 5, 2026 against `http://127.0.0.1:5174`. Focused independent review of the palette, new SVG scene, controls, and existing form initialization. No implementation was edited. Only the QA directory ignore rule and this review's evidence were added. No waitlist submission or API test was performed.

Final result: no unresolved blocking or visual issue from this focused review. The transparency finding below was corrected and independently rechecked at all three widths.

## Results

- The site remains white under OS dark mode. Observed body background is `rgb(255,255,255)`, hero heading is navy `#0b1b3d`, and its emphasized line is cobalt `#1652f0`. Confirmed on desktop and phones.
- The new angled shop arrangement reads as a dimensional neighborhood. Café foreground placement, side walls, roof planes, and separate plinths produce much more visual depth than the flat strip. White space separates the illustrated scene from the two primary actions.
- The default focus advanced café → workshop → records in the observed desktop cycle. Timing checks sampled across the 4.8-second interval. Selected buttons updated `aria-pressed` correctly.
- Manual selection by keyboard Enter held its chosen shop through a further 4.9-second interval. Manual selection via each of the three named buttons worked on desktop, 390 px, and 360 px reduced motion.
- Pause, an offscreen hero, and OS reduced motion each held the current shop through a 4.9-second interval. Reduced motion remained explicitly labeled and disabled as intended.
- Sampled artwork transforms/opacity/dashed-line offsets changed in active desktop and phone views. They remained unchanged after Pause on desktop and phone, and under reduced motion at 360 px.
- No SVG `<title>` or ARIA tooltip nodes were present in the hero, and hovering the café produced no tooltip. The SVG retains an accessible image description.
- No detached record, waving arm, or other misplaced illustration part was visible in the inspected settled/active/focus frames. Focus moves complete shop groups with their platforms and accessories.
- No horizontal overflow at desktop 1440 px, phone 390 px, or narrow phone 360 px. Primary buttons, shop controls, and privacy dialog fit their viewports.
- Form initialization completed, the submit button enabled after initialization, and the buyer/seller CTAs selected their matching roles. Typed synthetic name/email values survived changing role. No form was submitted.
- No JavaScript page errors were recorded. No raster/video DOM elements appeared in the scene.

## Finding

### Visual — inactive buildings became translucent: fixed

The focus dimming applied opacity `.84` to entire shop groups. Because the shops overlap, the café's side wall revealed workshop window/roof strokes behind it, and its platform revealed the dashed ground route. This looked like accidental transparency rather than lighting and weakened the solid dimensional construction.

Root removed group-opacity dimming and retained lift/scale plus the active control. Final computed opacity is `1` for all three groups in both records/workshop focus states at 1440, 390, and 360 px. Visually inspected `final-desktop-workshop.png`, `final-phone-workshop.png`, and `final-narrow-records.png`: the café wall and platform now remain opaque; workshop/ground strokes no longer show through. Initial defect evidence remains in `desktop-dark-records-selected.png` and `phone-workshop-selected.png` for comparison.

## Evidence and limits

Evidence is in `research/qa-color-scene/`, ignored by Git. `preflight.json` records white-palette values, control states, 4.9-second hold checks, form initialization, retained input values, and zero non-GET requests. `final-observations.json` records per-viewport artwork states and selected phases.

`fix-observations.json` is the final targeted result: all groups opaque, no overflow or JavaScript errors at all three widths; actual phone pointer click on record shop selected records; phone pause stopped sampled artwork; both CTAs selected matching form roles; paused privacy remained visible. Final screenshots use the `final-` prefix and supersede earlier translucent-shop captures.

Useful screenshots: `desktop-dark-hero-a.png`, `desktop-dark-hero-cycle.png`, `desktop-dark-hero-cycle-next.png`, `phone-hero-a.png`, `phone-workshop-selected.png`, `narrow-dark-reduced-hero-a.png`, `narrow-dark-reduced-records-selected.png`, `desktop-dark-audience.png`, and `narrow-dark-reduced-paused-privacy.png`.

The isolated Chrome runner initially timed out when it tried to click the entire continuously animated SVG group on phone because Playwright waited for stable bounds. A real pointer click at coordinates derived from the rendered record shop completed successfully in the targeted follow-up. Named scene buttons also worked throughout. This was not an API regression suite, screen-reader audit, or cross-browser pass.
