# Maychant V5 independent review

Reviewed November 5, 2026 at `http://127.0.0.1:5174`, using isolated Chrome after the previously documented connected-browser failure. Inspected desktop 1440×900, phone 390×844, and narrow 360×800 with OS reduced motion. OS dark preference was emulated; the site remained white. No implementation/backend changes and no waitlist submissions were made.

Final result: the material mobile paper defect, copy/cropping defects, and tablet decorative overlap are fixed. Targeted follow-up checked all three chapters at 360, 390, and 768 px. No unresolved issue remains from this review.

## Findings

1. **Fixed — mobile chapter paper was too short.** Initial future/knowledge chapters spilled footer text outside the sheet. The new content-driven mobile paper contains all three titles, descriptions, and footers. I visually inspected all nine combinations at 360/390/768 px. Each paper's scrollHeight equals clientHeight. The lowest footer bottom is 405 px inside a 463 px sheet at360, 428 inside463 at390, and362 inside382 at768. No clipping or overflow remains. Old defect evidence is retained; final screenshots use `v5-final-`.
2. **Fixed — hidden mobile line breaks joined words.** Fresh rendered text reads “business. And” and “One business. A world”.
3. **Improved, accepted limitation — desktop entrance partly below first fold.** Smaller hero type and spacing bring more storefront detail into the 1440×900 first viewport. Entire lower floors still require scrolling. The entrance remains on load by design; the panoramic scale means part of the stagger is below the initial fold. This is not a broken animation.
4. **Fixed — mobile outer buildings were cropped.** All three storefronts and accessories now fit the 390/360 composition with space at both edges.
5. **Fixed — tablet rear sheet overlapped tab arrow.** Root reduced only the rear decorative sheet size in the701–900px range. A fresh768px capture confirms the full arrow and a clear gap before the blue rear sheet, with the white content sheet unchanged. Updated evidence: `v5-final-768-people.png`.

## Verified behavior

- Real initial samples show all three outer `.district-reveal` groups at opacity 0, followed by the first rising to .3324 while the other two remain 0, then fully visible settled groups. Source and rendered geometry confirm the reveal operates on whole-building wrappers rather than separate façades. Reduced motion displays all three immediately without transforms.
- Hover changes the whole shop transform. Enter activates its pressed state and Space deactivates it; no visible category controls remain. The moving owner arm and shop accessories remain attached in inspected frames.
- Pause stops sampled ambient transforms; reduced motion also disables hover movement. Newly opened privacy dialogs and switched chapter content remain visible while paused.
- Sticky glass navigation stays at viewport top and remains legible over navy. Final waitlist anchor top is about 128 px on desktop and 116 px on mobile, below headers ending at 85/73 px. The skip link is hidden in normal viewport screenshots.
- Seller card selection updates the audience state. Both card CTAs select their correct waitlist role.
- Chapter ArrowDown, Home, and End change the tab, focus, paper content, index, and panel label. Paper transform changes with scrolling under normal motion and stays constant under reduced motion.
- Waitlist initializes with its submit button enabled. Empty native validation focuses name, keeps success hidden, and sends no POST. No API submission was attempted.
- No JavaScript page errors or horizontal document overflow appeared in the three tested viewports.

## Visual judgment

The centered headline and panoramic neighborhood are a clear change from the split hero. The lower page now has a coherent sequence: large editorial statement, contrasting buyer/seller illustrations, navy story, then a practical waitlist. The large type and extra spacing feel intentional. The final mobile paper has adequate breathing room and preserves the same visual story.

## Evidence

Files are in ignored `research/qa-neighborhood/`, prefixed `v5-`. `v5-observations.json` records timing, keyboard, scroll, pause, anchor, form, and error results. `v5-desktop-entrance-early.png` / `entrance-mid.png` show actual animation frames; `v5-desktop-full.png` and `v5-phone-full.png` show page rhythm. Viewport captures include hero, storefronts, focus/hover, audience, chapter, paper, waitlist, privacy, and footer.

Final targeted evidence: `v5-fix-observations.json`; `v5-final-1440-hero.png`; `v5-final-360-hero.png`; `v5-final-390-hero.png`; and `v5-final-{360,390,768}-{people,knowledge,future}.png`. These supersede the original paper/copy/cropping captures. Follow-up screenshot heights were900px; the tested responsive widths are360/390/768.

This was a bounded visual/interaction review, not a backend regression suite, screen-reader audit, or cross-browser certification. Fix validation targeted changed layouts only; unaffected interactions were not repeatedly rerun. No live waitlist entry was created.
