# Maychant — self-critique and release decisions

## Design review

I inspected the actual desktop hero, complete static desktop/mobile pages, mobile hero, expanded audience panels, scroll-story middle state, mobile story, film playback states, and final paused-mode mobile form. These are rendered website screenshots in `research/qa/`, not the generated design references.

**What works:** the two-line opening has a clear focal point and one primary action. Original warm imagery gives the navy/blue/cyan palette a human subject. The photographic arc, horizontal audience expansion, physical handover document, open FAQ rows, and broad cobalt ending provide varied compositions. The actual site closely follows the four generated section references while simplifying their extra navigation and decoration. Mobile recomposes the audience panels and makes the story manually navigable.

**What needed correction:** the first manual-motion implementation froze new CSS entrances at opacity zero. An independent reviewer caught the resulting invisible modal. Manual pause now disables those entrances and immediately exposes their readable state; targeted live retesting covered all four dialogs, audience details and FAQ across desktop,390px,360px and reduced motion. Bright photo crops weakened small role labels, so a top scrim was added. Hidden desktop line breaks joined words on mobile; both static HTML and dynamic chapter strings now preserve spaces. Utility controls were enlarged for mobile.

**Motion judgment:** the hero's subtle depth and moving connection line make the opening feel alive without delaying the primary action. The scroll story changes three meaningful preparation topics and the example document together. It has explicit buttons and a static alternative. Motion is not used to manufacture approvals, live matches, or business traction. The playable 18-second film is a real MP4; it is not an animated poster with a fake play control.

The film reviewer also found that native mobile controls could cover the original lower-third titles. The final media revision moves all title pixels above y=428 in the720px frame, leaving the bottom292px free. The revised poster and representative frames were inspected and the full file decoded successfully. Playback timing and the site's player code are unchanged.

## Product and content judgment

The first useful product is preparation. The page does not claim a live marketplace, matching network, professional acceptance, valuation or acquisition results. Generated people and shops are marked illustrative. The assessment produces a real local text file and handles uncertainty without inventing a readiness percentage. Contact opens a draft for the visitor to review/send; no success message implies receipt.

The site remains an early product, not proof of demand. The next product test should observe whether owners and advisers understand the offer, finish the check, and find the generated next steps useful. Real case studies and authentic owner photography would strengthen credibility when available and authorized; fictional testimonials would not.

## Evidence

- Independent visual/motion review: `research/visual-motion-review.md`, including the defect, fixes and targeted retest.
- Independent functional review: `research/functional-review.md`: 24 meaningful scenarios passed, real downloads inspected, no observed answer submission or third-party resource requests.
- Rendered viewports:1440×900,1280×800,390×844,360×800. No horizontal overflow in reviewed states.
- Film playback advanced through distinct scenes and reached18seconds; close/pause behavior verified.
- All local asset references and in-page anchors resolved; no duplicate static IDs; JavaScript syntax check passed.
- Eleven requested repository references are accounted for in `research/repository-influences.md`.

## Practical limits

QA used isolated Chromium after the connected-browser tool failed. It does not establish physical iOS/Safari/Firefox compatibility or accessibility certification. The page contains no backend service, live listings, payment flow, user accounts or subscription database. The published preview preserves owner-private access.
