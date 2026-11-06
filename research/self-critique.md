# Maychant V5: design self-critique

The redesign follows the user's selected direction: a centered headline above a full-width neighborhood, with a different editorial rhythm below. Generic illustrated businesses replace the category-specific storefront labels. The primary action remains joining a buyer or seller waitlist.

## What works

- Three complete buildings rise into place in sequence. Separate entrance, interaction and perspective wrappers keep the buildings structurally intact. Hover, keyboard activation, moving plants, the owner wave and the swinging Open sign provide object-based motion.
- The sticky glass header remains legible over both white and navy sections. The supplied white/navy/cobalt/cyan palette is retained across system themes.
- Large editorial type creates a pause after the hero. Buyer and seller panels introduce a different illustration language: hands, paper and an open doorway, rather than repeating storefronts or small floating vector icons.
- The navy section adds contrast and scale. Its layered papers move with scrolling; keyboard-operated chapter controls change the message and paper artwork. Its copy describes handover principles, not nonexistent product capabilities.
- Every buyer/seller CTA leads to the actual waitlist with the appropriate role selected. Optional motion initializes after the form, so a visual effect cannot prevent signup initialization.

## Corrections from independent review

The first pass hid too much of the desktop entrance below the first screen. The headline size, top spacing, copy gaps and panorama width were reduced while retaining the broad composition. Phone artwork now fits the viewport instead of cropping the outer businesses. Two hidden line breaks now retain literal word spacing. The phone paper became content-sized with reserved footer space so all three chapter messages fit.

## Remaining design tradeoffs and verification limits

The full desktop panorama extends beyond a 900px-high first viewport. Its entrance is visible at load, and the complete scene is revealed with scrolling. This preserves the chosen expansive layout without shrinking the artwork into a thumbnail. The fictional storefronts are illustrative, not listings or customer evidence. The handover narrative cannot replace authentic owner stories or evidence of demand.

Independent review covers desktop, phone, narrow screens, real animation samples, keyboard interactions, pause/reduced motion, sticky navigation, anchors, role selection, and native form validation. The final targeted fixes are documented in research/v5-review.md. The API and storage schema are unchanged; their prior validation/persistence evidence remains applicable. No production signup was created during visual QA, and no email service is configured. Physical iOS Safari and Firefox were not tested. Isolated Chromium was used after the connected browser failed in the earlier workflow.
