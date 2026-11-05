# Maychant silent brand film

Created November 4, 2026 from the five existing generated Maychant images; caption placement revised November 5 for mobile video controls. The people and businesses are illustrative, not real clients. The film contains no audio track.

## Delivered assets

- `dist/assets/maychant-story.mp4` — 18.000 seconds; 1280 × 720; 24 fps; 432 frames; H.264 High, level 3.1; yuv420p; 2,655,567 bytes (2.66 MB decimal); approximately 1.18 Mbps. Fast-start MP4: the `moov` atom precedes media data.
- `dist/assets/maychant-story-poster.jpg` — 1280 × 720; opening café scene with the “Built with care.” caption.
- `dist/assets/maychant-story.vtt` — English text track matching the film’s captions, including its silent/illustrative status.

No other website files were changed for this deliverable.

## Creative treatment

The sequence moves from the café exterior through craft, an owner portrait, a record shop and a key handover. Each image has slow reframing, a modest zoom or a gentle lateral move. Four 1.125-second dissolves connect the scenes. A graduated navy veil supports warm white Charter captions without hiding the subjects. All title text ends by vertical pixel 428 in the 720-pixel frame, leaving the lower 292 pixels free for native controls. The final picture settles into a navy end card.

Typography is rendered into the video; no font binaries are distributed. Navy is `#102834`, with warm white `#FFFBF3`. The tiny eyebrow identifies it as a silent brand film.

| Time | On-screen story |
|---|---|
| 0.70–4.75 s | Built with care. |
| 5.15–9.35 s | More than a business. |
| 9.75–15.30 s | A next chapter worth preparing for. |
| 15.80–18.00 s | maychant. / Business succession, thoughtfully. |

## Accessibility handoff

Suggested play-button label: **“Watch the Maychant story — silent film, 18 seconds.”**

Suggested modal description: **“An 18-second silent brand film using illustrative AI-generated images. The people and businesses shown are not real clients.”**

Use native video controls and `playsinline`, load the poster initially and start playback only after the user activates the film. The VTT can be provided as an English captions track. Captions are already rendered visibly in the film; a nearby text transcript also provides the complete message without requiring video playback.

**Text transcript:** A leafy neighborhood café leads to a craftsperson working carefully on a chair. “Built with care.” A café owner looks toward the camera. “More than a business.” A customer browses records in a small shop, then a key is offered to another person across a café counter. “A next chapter worth preparing for.” The film closes on the Maychant name and the words “Business succession, thoughtfully.” There is no sound. All people and businesses shown are illustrative.

## Verification

- Initially inspected representative decoded frames at 1.8, 4.0, 6.0, 8.8, 12.0, 14.8 and 17.2 seconds, covering every image, a dissolve and the end card. After the focused caption revision, inspected the updated poster plus frames at 12.0, 14.8 and 17.2 seconds.
- Measured rendered text-layer bounds after revision: care ends at y=408; more at y=405; the two-line chapter at y=428; end-card text at y=427. Updated the poster to match and strengthened the navy veil behind the raised captions.
- Caption lines remain within the frame with clear spacing; the key and the owner’s face remain visible. The navy overlay supports the white text.
- Decoded the full MP4 through FFmpeg without reported errors.
- FFprobe confirmed the requested dimensions, H.264 codec, yuv420p pixel format, 24 fps, exact 18-second duration and absence of audio streams.
- Checked MP4 atom ordering to confirm fast-start playback. Final file is below the requested approximate 5 MB ceiling.

The site’s actual modal behavior, keyboard focus handling and playback controls remain the responsibility of the implementation agent; this task did not edit or test website integration.
