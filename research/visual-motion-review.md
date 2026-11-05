# Independent visual and motion review — Maychant

Review date: November 4, 2026, America/Detroit. Target: http://127.0.0.1:4173. Reviewer did not edit the website. Screenshots and machine-readable observations are in `research/qa/`.

## Decision

**Targeted retest passed; no unresolved release blocker remains in this visual/motion review.** The manual-pause defect below was reproduced, corrected by the implementation agent and independently retested. The normal-motion and operating-system reduced-motion presentations are visually sound, and the real 18-second film plays successfully. Historical findings are retained below for traceability.

The visual direction is cohesive: navy/white contrast, a single strong blue action, restrained typography and warm local-business imagery. The plan illustration helps connect the brand story to a usable deliverable. Mobile is deliberately recomposed rather than simply shrinking the desktop layout.

## Findings by severity

### Resolved P1 — manual Pause motion made newly opened dialogs invisible

**Reproduction:** normal-motion mode → click the hero's “Pause motion” → click “Find your next step.”

**Observed:** a dark modal backdrop appears, while the assessment itself remains invisible and blocks the page. The native dialog reports `open=true`, but its computed opacity is `0`; `dialog-in` is paused at its initial scale/translation. The same global pause rule freezes newly expanded audience text at opacity 0.

**Cause observed in rendered styles:** the manual class applies `animation-play-state:paused!important` to every element. New entrance animations start at their invisible first frame and never progress. The separate OS reduced-motion rule uses `animation:none!important` and does not have this problem.

**Recommended correction:** manual pause should disable nonessential entrance animation and show the final readable state, while stopping ongoing decorative motion. Verify assessment, film, contact, privacy, audience details and FAQ openings after the change.

Evidence: `qa/phone-paused-assessment.png`, `qa/phone-paused-audience.png`, `qa/pause-regression.json`.

### Resolved P2 — photo-card role labels lost contrast over bright image areas

At the top of owner/operator audience cards, small white role labels and thin expand controls sit over bright windows and leaves. The owner label is particularly weak in the collapsed mobile card. The bottom heading has a stronger scrim and reads well.

Add a restrained dark top scrim or compact backing behind the label/control, and test both active and collapsed image crops. This is a visual contrast finding; no uniform numeric contrast is claimed for the varying photo background.

Evidence: `qa/phone-audience-operator.png`, `qa/desktop-audience-mid.png`.

### Resolved P3 — mobile text concatenated at a hidden line break

The audience intro reads “story,there's” when its desktop line break is hidden. Preserve a space in the text around the line break.

Evidence: `qa/phone-audience-operator.png`.

### P3 — minor mobile readability refinements (utility sizing improved)

The hero motion control reaches 9px at 360px width; footer utility text is 10px. These remain present but deserve a 12px minimum for comfortable reading. This is a usability recommendation, not a claim of an automatic WCAG font-size violation.

The film's native controls briefly overlap the first lower-third title on initial mobile playback. After the controls hide, the title is visible. Consider moving film titles slightly higher into a control-safe area in a later polish pass; playback remains usable and the transcript is available.

Evidence: `qa/narrow-hero-settled.png`, `qa/phone-footer.png`, `qa/phone-film.png`, `qa/phone-film-controls-hidden.png`.

## Verified behavior

| Check | Evidence and outcome |
|---|---|
| Desktop 1440 × 900 | Hero, audience expansion, journey states, assessment, film and footer captured. No horizontal overflow or captured JS errors. |
| Small laptop 1280 × 800 | Hero hierarchy, button group and navigation fit. Audience and journey sections remain legible. No horizontal overflow or captured JS errors. |
| Phone 390 × 844 | Primary action, story button, menu, audience stack and assessment fit. Mobile journey uses manual step controls rather than a pinned desktop scroll experience. |
| Narrow phone 360 × 800 | No horizontal overflow. Headline scales down and buttons remain in bounds. Utility text is the readability caveat above. |
| Hero entrance / ambient movement | Early and settled captures differ. Time-separated computed transforms change for all three photos. Central-photo vertical translation changed from approximately −2.67px to −6.01px over the sampled interval. |
| Pause existing hero motion | Photo transforms become identical in two samples 1.3 seconds apart. This narrow test passes; newly opened UI after manual pause fails as described above. |
| OS reduced motion | `prefers-reduced-motion:reduce` produces a static hero with stable transforms. The manual chapter control still selects step 03. |
| Audience expansion | Desktop card widths visibly interpolate between early and settled screenshots. At 1440px, the selected operator card settles near 615px; other cards near 332px. On phone, the selected card is 400px high and other cards 170px. `aria-expanded` and hidden detail state match. |
| Scroll chapters | Three geometry-based scroll positions select 01 → 02 → 03 and update the plan checkboxes. Captures show the narrative and selected control changing. |
| Manual chapter control | Step 03 selected at every tested viewport and under OS reduced motion. |
| Actual film playback | Browser decoded a real 1280 × 720 MP4. Sampled currentTime advanced 1.026 → 5.825 → 12.529 → 18 seconds; readyState was 4, and the final state was ended=true, paused=true. Closing leaves it paused. |
| Film visual frames | Independently inspected different scenes at approximately 1, 5 and 12 seconds, plus the mobile dialog. It is not a static poster pretending to play. |
| Layout bounds | Document scrollWidth exactly matches 1440, 1280, 390 and 360 respectively. No horizontal overflow was detected in those tested states. |

Machine-readable evidence: `qa/observations.json` and `qa/pause-regression.json`.

## Useful screenshots for final self-review

- `qa/desktop-fullpage-static.png`: all sections with reduced motion and images loaded.
- `qa/phone-fullpage-static.png`: complete mobile hierarchy.
- `qa/desktop-hero-settled.png`, `qa/laptop-hero-settled.png`, `qa/phone-hero-settled.png`, `qa/narrow-hero-settled.png`.
- `qa/desktop-audience-mid.png` and `qa/desktop-audience-operator.png`: intermediate and settled expansion.
- `qa/desktop-scroll-005.png`, `qa/desktop-scroll-05.png`, `qa/desktop-scroll-095.png`: chapters 01, 02 and 03.
- `qa/desktop-reduced-journey.png` and `qa/phone-journey-step3.png`: non-pinned/manual presentations.
- `qa/desktop-film-5s.png`, `qa/desktop-film-12s.png`, `qa/phone-film-controls-hidden.png`.
- `qa/phone-assessment.png`: ordinary mobile modal; compare with the failed paused-mode screenshot.

## Method and limits

The connected-browser API failed on documented navigation and capture methods, including the root agent's independent attempt. An isolated Chrome/Playwright runner was used after that recovery attempt. It did not control existing user tabs. An initial `scrollIntoViewIfNeeded` call timed out while waiting for animation stability; authored-page geometry scrolling then completed the captures. This automation stability failure is not classified as a website defect.

Full-page screenshots taken at the top with normal reveal animation can show blank offscreen sections because a stitched screenshot does not scroll through their triggers. The static overview captures disable motion and deliberately scroll through the sections first so lazy images load. Use those for whole-page aesthetics; use normal viewport captures for real animated states.

This is a Chromium desktop/device-size review, not a physical iOS Safari test or an accessibility certification. Motion was verified with distinct rendered states, timed transforms and live video playback; no separate screen-recording file was produced. Functional form/download testing is covered by the other reviewer.

## Retest requirement

After the pause correction, repeat manual pause → assessment, contact/privacy/film, audience expansion and FAQ opening at mobile and desktop widths. Confirm each target has visible final content, remains keyboard usable, and decorative motion remains stopped. Update this report with the retest result; do not infer resolution merely from a code change.

## Final media revision note from implementation

After the independent interaction retest below, the media agent revised the same18-second MP4 so story titles and the closing tagline end at or above y=428 in the720px frame. The bottom292px is now clear for native controls. Revised poster and representative decoded frames were inspected; the whole file decoded without errors. Final MP4 is2,655,567bytes. Player behavior and timing are unchanged. This resolves the caption-placement concern at the asset level; the original browser-playback evidence above refers to the earlier caption placement.



## Targeted final retest — fixes verified

Retested after the implementation agent's corrections on November 4, 2026. Website code remained untouched by this reviewer. Only the reported defects and directly affected states were retested; the earlier complete suite was not unnecessarily repeated.

| Configuration | Assessment, film, contact and privacy dialogs | Audience detail and FAQ paragraph | Width/utility result |
|---|---|---|---|
| Desktop 1440 × 900, manual pause | All four open with opacity 1, animation none and focus inside | Visible, opacity 1; no frozen entrance | scrollWidth 1440; no overflow |
| Phone 390 × 844, manual pause | All four pass | Both pass | scrollWidth 390; motion button 44px high, 11px text |
| Narrow phone 360 × 800, manual pause | All four pass | Both pass | scrollWidth 360; motion button 44px high, 11px text; row fits |
| Phone 390 × 844, OS reduced motion | All four pass | Both pass | scrollWidth 390; 44px motion control |

No captured JavaScript errors occurred in these targeted cases. The mobile audience introduction now contains the required space after the comma. Independently inspected final audience screenshots show the darker top scrim improving role-label and expand-control legibility. The narrow hero screenshot confirms the larger utility control stays inside the page.

The earlier P1 and P2 are **resolved**. The mobile missing-space issue is **resolved**. Utility text/control size is **improved and acceptable for this release**. The remaining film-title/native-controls overlap is a nonblocking refinement: controls hide and the title becomes visible; playback and the transcript work.

Final evidence:

- `qa/final-retest.json`: all 16 dialog checks, 4 audience checks, 4 FAQ checks and layout bounds.
- `qa/final-desktop-paused-assessment.png`: corrected desktop modal.
- `qa/final-phone-paused-assessment.png`, `qa/final-phone-paused-film.png`, `qa/final-phone-paused-contact.png`, `qa/final-phone-paused-privacy.png`: all four corrected mobile dialogs.
- `qa/final-phone-paused-audience.png`: readable expanded content and improved photo-label backing.
- `qa/final-phone-paused-faq.png`: visible new FAQ content after pause.
- `qa/final-narrow-paused-hero.png`: 360px utility row without overflow.
- `qa/final-phone-reduced-assessment.png` and related `final-phone-reduced-*` captures: OS reduced-motion regression coverage.
