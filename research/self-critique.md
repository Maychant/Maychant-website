# Maychant V6: design self-critique

The user asked to retain the neighborhood below the headline, show complete storefronts, add more motion and background detail, make navigation float, expand glass panels and replace the bottom form with a popup. This revision changes those behaviors while preserving the buyer/seller waitlist purpose and supplied palette.

## Design judgment

The headline becomes one line on wide screens to make room for the full street. The SVG scales against viewport height, so the buildings and their bases remain visible together in reviewed desktop sizes. A pale street plane, distant linework and sun shape fill the gaps without competing with the solid storefronts. Motion comes from recognizable details: the paper plane drifts, glints shine, an owner waves, awnings respond to interaction and path markers move.

The paired primary actions use a single raised dock, clear buyer/seller waitlist captions and directional hover feedback. They open the same native modal with the appropriate role selected. The detached rounded navigation bar has a translucent white surface, fine border and soft shadow that remain legible when scrolling over navy.

The two audience panels now have a substantial width and height change. The selected panel gains a translucent finish and reveals reassuring context; the other shrinks. The navy chapter list uses a related disclosure pattern, with shorter inactive rows and an expanded glass panel tied to the changing paper artwork. This makes the interaction understandable without depending on decorative motion alone.

## Review corrections and scope

Root inspection caught hard rectangular backgrounds behind the hand illustrations; those canvases are now transparent so they sit naturally on glass. A hidden mobile line break in the closing invitation now preserves word spacing. Independent review caught a server-rejected name field focusing behind the sticky modal header in a short phone viewport; field errors now explicitly scroll the modal to leave header clearance. The waitlist preserves unfinished input, requires the existing successful API response before showing success, and retains the success state until Add another is chosen.

The first automated capture hit another project's preview at port5174. It is not evidence for this revision. All final V6 verification uses the canonical Maychant checkout at port5175; the unrelated process and checkout were left untouched. Final independent evidence and any targeted corrections are in research/v6-review.md.

The storefronts remain fictional illustrations, not listings or proof of traction. Viewport fitting is responsive, not a guarantee that the entire page fits every screen or browser zoom. Very short screens can scroll naturally. API response cases are simulated locally for UI validation; the API and database schema are unchanged from their prior persistence checks. No production signups or emails are sent during this review. Physical iOS Safari and Firefox are outside this review.
