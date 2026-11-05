# Vector motion reference — Maychant

Inspected November 5, 2026. Exact source: [Coinbase homepage GB reference clip](https://static-assets.coinbase.com/marketing/videos/homepage_GB_744.webm).

Downloaded the reference to `/private/tmp/maychant-coinbase-reference.webm` and inspected ten extracted frames at two-second spacing. The source is 20 seconds, 744 × 744, 30 fps. It was used only to study composition and progression. No reference footage, extracted raster frame or new video was added to the site; no site implementation files were edited.

## What the reference actually does

- **One stable stage:** a vivid blue rounded rectangle sits inside a white square. A single white phone/UI surface occupies the center; white, near-black and neutral gray do most of the work.
- **One active focal point:** a solid blue cursor dot, occasionally surrounded by a translucent halo, indicates the action. The rest of the interface remains visually quiet.
- **Selective enlargement:** a selected asset row lifts out of its list into a wider floating card. Later, a selected action becomes another enlarged card while the underlying UI dims. This makes the decision readable without enlarging everything.
- **Spatial continuity:** the interface scrolls and the camera changes framing to follow the active area. The phone and surrounding blue stage remain recognizable. UI panels slide into place; there are no photographic cuts or decorative scene changes.
- **Restrained depth:** filled shapes, thin separators, rounded corners and a soft shadow establish hierarchy. The effect comes from organized information and focus, rather than complex 3D artwork.
- **Paced demonstration:** approximately 0–5 seconds explores a chart and selects an item; 5–9 selects an action; 9–13 enters an amount; 13–18 reviews/confirms; the final beat closes with the brand. These are approximate observations from sampled frames, not frame-accurate edit markers.

## Apply the pattern to original Maychant vector art

Create a single SVG/HTML workbench with a fixed viewBox, a small document stack, concise labels and one prominent preparation packet. Animate four understandable states:

1. **Gather:** document cards settle into an ordered stack.
2. **Find the gap:** a missing-record chip rises into the foreground while secondary cards become quieter.
3. **Review:** a reviewer note connects to the relevant item; the state visibly changes after the check.
4. **Choose the next step:** an organized packet and a clearly labeled next action become the final focus.

Keep one object or decision active per beat. Use transform/opacity changes, an occasional connector draw and a brief focus halo. Let each completed state rest before the next transition. Preserve the same objects and positions through the sequence so the viewer can follow the work.

The most transferable idea is **showing why one card matters, then changing its state**. A pile of independently floating cards would lose that causal story. The artwork should be labeled as an illustrative workflow where needed; it should not invent customer records, deal results or a working software product.

Build the composition directly with authored SVG/CSS/GSAP. Keep text as readable text, use Maychant’s own palette and shapes, and avoid Coinbase’s logo, trade interface and financial figures. With reduced motion, present the completed organized state and the same explanatory labels. Any repeating animation should respect the site’s pause control and pause when offscreen.
