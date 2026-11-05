# Maychant reference-site and motion review

Accessed November 4, 2026 (America/Detroit). Independent design review for Maychant. This is inspiration analysis, not an endorsement of these products or permission to reuse their branded assets.

## Method and evidence limits

Read all four live public homepages with the web tool. The connected-browser API selected Chrome but navigation, keyboard and capture methods all failed before acting. After its documented recovery check, an isolated headless Chrome captured Rocket Money, Acquire.com and Airbnb at 1440 × 1000, early/settled states and after scrolling. No existing user tabs were controlled and no forms were submitted.

Coinbase showed a browser challenge. It was not bypassed; its live homepage text was accessible through the web reader, but current visual motion is unverified. Airbnb's homepage loaded navigation/search and the footer, without a property inventory in this isolated session. Do not infer its full marketplace content from that state.

Captures and observations: `research/reference-captures/`. The early and settled captures are samples, not performance benchmarks. Reported Web Animations API durations do not detect every JavaScript/SVG animation or establish a site's complete timing system.

## Observed traits and adaptations

| Reference | Observed on the live page | Implementable Maychant interpretation |
|---|---|---|
| [Rocket Money](https://www.rocketmoney.com/) | White navigation, a softly rounded light-gray hero, large direct headline, one main action and a dominant phone/product preview. After scrolling, the navigation remains present. Product features pair recognizable interface content with human imagery. | Let one legible preparation workspace carry the hero. Keep the benefit and primary next step obvious. Use human context in a supporting section rather than replace the product with decorative cards. A stable navigation bar can keep the assessment entry available. |
| [Acquire.com](https://acquire.com/) | Dark violet/navy hero, bright primary action, a secondary story action, and a connected business/buyer/adviser graphic. Evidence claims sit in a separate strip. Seller/buyer paths are explicit. One 500ms active DOM animation was observed at capture; its meaning was not isolated. | Use a navy feature section and a connected preparation sequence to explain who contributes what. Maychant's sequence should be owner records → review → accepted handover, not an imitation deal marketplace. Reserve numerical proof for actual evidence. |
| [Airbnb](https://www.airbnb.com/) | Strong white space, rounded search control divided into task segments, categorical navigation with a clear selected underline, and a restrained accent color. Small finished 150ms span animations were present; visible decorative category videos were paused at the sampled moment. | A compact assessment can have clear steps and selected states, with one question at a time and visible progress. Keep navigation labels short and interactive targets generous. Use spatial continuity when the user advances. |
| [Coinbase](https://www.coinbase.com/) | Public content has a direct signup proposition, audience-based navigation, concrete product sections and explicit qualifiers close to financial claims. Browser challenge prevented visual verification. | Borrow the principle of concrete product demonstrations and short action-led copy. Do not claim any current Coinbase motion or visual treatment was verified. Keep Maychant's commercial promises similarly bounded. |

### What not to import

- No competitor logos, proprietary interface artwork, copied illustrations or text.
- No fabricated member counts, transaction volume, ratings, reviews or customer portraits presented as real proof.
- No “Browse businesses” marketplace implication when the actual service is preparation.
- No animated score suggesting a certified valuation, sale probability or lender approval.
- No autoplay movement that keeps competing with the headline or makes the assessment harder to read.

## Maychant visual direction

Use navy `#001021` for authority, white/light gray `#f3f5f8` for breathing room, and blue `#1652f0` for the principal action. Dark teal `#034748` can distinguish a continuity/handover section. Cyan is an accent for paths, selection or a brief progress effect; it should not become paragraph text on white.

Keep one recognizable product composition in the hero: a document/evidence list, three unambiguous statuses and a next action. Show a labeled illustrative case, not fictitious customer data disguised as traction. Explain value through task progression and clear accountability, not a collection of undifferentiated dashboard metrics.

Prefer a distinct headline, a short supporting paragraph and two complementary actions: a primary assessment and a secondary process/demo action. Owner/adviser routes may share a page initially if the result clearly changes by selected role.

## Proposed motion system — design recommendations, not measured competitor settings

| Element | Proposed behavior | Verification |
|---|---|---|
| First entrance | Text and primary action settle quickly; product panel follows by a small delay. Use opacity plus 12–20px translation, approximately 450–650ms, once. | Essential text/action visible immediately with reduced motion and after JS failure where practical. |
| Section reveal | Small upward reveal, approximately 350–500ms. Stagger related items by 60–90ms, not every paragraph independently. | All content remains readable if the observer fails; revisiting a section does not repeatedly hide it. |
| Workflow demonstration | Deliberate step progression: evidence arrives, exception is flagged, reviewer accepts. A 3–5 second single sequence with replay is better than an endless pulse. | Frames visibly differ; narrative remains clear without movement; user can replay or pause as applicable. |
| Buttons and links | 120–180ms color/outline shift; tiny arrow translation if helpful. Avoid large scaling or pointer-following effects. | Keyboard focus is visible and equivalent meaning exists without hover. |
| Accordion | Controlled open/close around 220–300ms, retaining the trigger location. | No content jump or clipped text; accessible expanded state matches the visible panel. |
| Assessment steps | 180–250ms fade/short slide when advancing; preserve progress and allow back navigation. | No accidental double-advance, keyboard trap or loss of answers. |
| Reduced motion | Remove translate, parallax, count-up and repeated decorative sequences. Show final meaningful state directly. | Independent test with `prefers-reduced-motion: reduce`, including JavaScript animations. |

These are starting values for the actual composition. They should be shortened or removed if they delay reading. Avoid scroll hijacking and large parallax. W3C explains that nonessential interaction-triggered motion can be disabled and identifies reduced-motion support as a technique; this is a Level AAA criterion, not a claim that every such recommendation is mandatory at AA. [W3C animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

## Palette contrast calculations

Calculated from the supplied hex colors using relative luminance. Ratios shown to two decimals for planning; threshold testing should use full precision and actual rendered foreground/background colors.

| Color against white | Contrast | Recommended role |
|---|---:|---|
| `#001021` | 19.16:1 | Main text |
| `#0b1b3d` | 16.96:1 | Alternate dark surface/text |
| `#034748` | 10.51:1 | Dark teal text/surface |
| `#1652f0` | 6.00:1 | Blue action with white normal-size text |
| `#1481ba` | 4.30:1 | Does not meet 4.5:1 normal-text target on white |
| `#11b5e4` | 2.40:1 | Accent; not normal text on white |
| `#0caadc` | 2.69:1 | Accent; not normal text on white |
| `#0e9f6e` | 3.39:1 | Success icon/fill plus a darker text label |

Cyan `#11b5e4` against navy `#001021` is approximately 7.99:1. Green against that navy is approximately 5.66:1. Do not encode success/error or selection solely by color. W3C's text criterion uses at least 4.5:1 for ordinary text and 3:1 for qualifying large text, with defined exceptions. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## Independent site-review plan

Once the implementation is running, review the actual local site at desktop (1440px), tablet (768px) and mobile (390px and a narrow 320px check). Capture hero, a middle section, interactive state and footer. Verify no horizontal clipping, overlay collision, unreadable low-contrast labels or tiny controls.

Inspect entrance, scroll reveal, hover/focus, open/close and assessment transition states at multiple times. Compare ordinary and reduced motion. A static screenshot cannot establish that animation works; use time-separated captures and rendered-property/state checks. Check layout stability after images/fonts load and after returning/back navigation.

Report specific affected element, viewport, trigger, expected behavior and observed behavior. Keep code unchanged during independent review and send the implementation agent actionable findings.

