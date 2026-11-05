# Maychant neighborhood redesign: self-critique

The previous page explained a preparation workflow through dashboard cards. The user wanted the feel of a shopkeeper's business and a buyer/seller waitlist. This revision changes the content, composition and primary action together.

The opening now pairs a direct ownership idea with a miniature street. Different rooflines, a record window, café seating, a repair-shop window and an owner at the door give the business a physical setting. Motion comes from these objects: the record turns, coffee steam rises, a sign swings and the owner waves. There are no charts, workflow tiles, generated images or video.

The hero's two actions explicitly distinguish buying from selling. Both select the right form option. The rest of the page adds the people behind a handover, two audience perspectives, one durable waitlist and clear prelaunch answers. The page does not imply current listings, completed sales, verified buyers or existing customers. The storefront names are part of an illustration, not offered businesses.

## Corrections from actual review

- GSAP's origin handling initially moved SVG objects outside their intended positions. Native CSS transform-box animations now keep the record in its window and the wave attached to the person.
- A deferred interaction script raced React hydration. A post-hydration loader now initializes the page; a fresh independent capture showed no hydration warning.
- Hidden desktop line breaks joined words on phone. Literal whitespace now preserves their text.
- Dark-mode pavement and sky lines needed more contrast. Targeted colors preserve those details.
- Form limits now match the API. Field errors are associated with inputs. The submit control enables only after its handler initializes, and the native form method is POST so contact data cannot fall into a GET URL if scripting is unavailable.

## Assessment

The page now has a coherent local-business subject and a working purpose. It is less corporate and more approachable than the prior dashboard-style composition. The illustration remains a stylized interpretation; it cannot substitute for real owner stories or evidence of demand. Future authentic stories should come from research and permission, not invented testimonials.

Verification covers desktop, phone, dark mode, pause/reduced motion and the complete local signup flow, plus dedicated server validation and persistence checks. It uses isolated Chromium because the connected browser API failed. Physical iOS Safari/Firefox compatibility and production delivery of future emails are not established. No automated email service is configured; the stored waitlist supports future follow-up.
