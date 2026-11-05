# Maychant V3 independent visual and interaction review

Reviewed November 5, 2026. Current development preview: `http://127.0.0.1:5174`. Ports 5173 and 8787 were not used. This review did not edit implementation.

## Verdict

The neighborhood direction is coherent and substantially more specific to small-business ownership than generic dashboard art. The page reads as an early waitlist, with two clear audiences, rather than pretending a marketplace is already operating. No blocking layout, navigation, or waitlist issue was found in the tested Chrome views. The final small fixes and their verification are recorded below.

## What was actually checked

- Visually inspected screenshots at desktop 1440 × 900, phone 390 × 844, narrow phone 360 × 800, desktop dark mode, and phone dark mode. Reviewed hero, buyer/seller panels, form, success/error states, privacy dialog, FAQ, footer, and full-page overview.
- Loaded fresh pages after the initialization and SVG-motion fixes. `#waitlist-form` initialized successfully, and no JavaScript page errors were recorded in the four main viewports.
- Compared actual computed transforms/opacity 800 ms apart, then 600 ms apart after pausing. Active artwork changed on desktop and phone; paused artwork did not change. The record remained centered in its window, and the owner's moving arm remained attached in inspected animation frames.
- Emulated OS reduced motion at 360 px: the page began with static artwork and no entrance animation obstruction. Reopened privacy and exercised form validation in the reduced state.
- Opened privacy after manual Pause on desktop/phone/dark. It remained fully visible, fitted within the viewport, and closed with Escape. Opened FAQ content while paused.
- Clicked buyer/seller desktop navigation and each corresponding panel CTA. Navigation selected the correct panel; each CTA selected the correct waitlist role. Home, End, ArrowLeft, and ArrowRight changed the tab and moved focus correctly.
- Tested empty required fields, malformed email, and absent consent. Submission remained blocked and success stayed hidden. The no-consent attempt focused consent. The malformed-email attempt focused email on the final stable reload.
- Simulated a local 503 API response: a useful error appeared, entered details remained, submission became available again, and no success state appeared.
- Simulated local 422 field validation while paused: the email message appeared, `aria-invalid` was set, and focus moved to email. Confirmed on desktop, 390 px, 360 px reduced motion, and dark phone.
- Submitted one consented synthetic entry (`Maychant QA Review`, an `@example.test` email) to the actual local API. The response was HTTP 200 with `ok: true`; only then did the form hide and success receive focus. No external message was sent. Database implementation and persistence were reviewed separately by the backend agent; this check verifies the UI/API boundary.
- No `img`, `video`, or SVG `image` nodes were found. The observed requests contained no raster/video resources and no external domains. These are observations of this local session, not a claim about every future deployment.
- Document width equaled viewport width at 1440, 390, and 360 px; no horizontal overflow was observed.

## Findings and resolutions

### Minor — mobile copy joined across a hidden break: fixed

The first phone capture read “Worth keepingin the neighborhood.” The separate line break in the belief margin needed whitespace, in addition to the heading breaks already fixed. Fresh `final-phone` and `final-narrow-reduced` DOM observations now read “Worth keeping in the neighborhood.” Main belief and waitlist headings also retain spaces.

### Minor — dark artwork lost its pavement/sky lines: fixed

The original dark capture lost decorative navy strokes and dark plant leaves into the page background. The revised phone dark capture shows muted green sky/pavement lines and lighter leaves. The buildings and key product actions remain clear. This was visual polish rather than a functional blocker.

### Minor — reduced-motion control suggested playback it could not start: fixed

With OS reduced motion on, the initial implementation allowed a click on “Play motion,” changed the control to “Pause,” but CSS still suppressed animation. Root changed this control to disabled “Reduced motion,” with an accessible explanation of the system preference. The final stable run confirmed text “Reduced motion,” disabled=true, pressed=true, accessible label “Animation off: system reduced-motion preference,” and unchanged transform/animation samples. The form also initialized with method=post and enabled submission only after its handler was ready.

### Minor — buyer key-tag text lacked breathing room: fixed

The initial buyer illustration placed the last letters of “YOUR NEXT” very close to the blue tag edge. Root reduced both lines from 22 to 18 SVG units. The fresh focused `final-buyer-art.png` was inspected after this edit: both lines now fit within the blue tag with visible margins. No further visual defect remains open from this review.

## Independent design judgment

The palette, Cabinet type, irregular street drawing, large text, and small handwritten details belong together. The illustration communicates the intended neighborhood-scale business category immediately. On mobile the two primary choices stay visible above the illustration; the street remains recognizable without making tiny sign text essential to the flow. Buyer keys and the seller's open sign are distinct, related metaphors. The form feels part of the page, with clear labels, reasonable field count, and a visible optional location.

The page deliberately prioritizes warmth and interest capture over product explanation. That fits the actual waitlist stage and the explicit statement that there are no live listings or transactions. It does not yet establish why Maychant will outperform brokers or existing marketplaces; this should eventually be answered with a real operating model and evidence, not invented social proof. No fabricated customer count, revenue chart, testimonial, or deal-completion claim appeared in the reviewed content.

Two nonblocking future refinements: some decorative storefront lettering and footer/consent text are small on 360 px; maintain readable essential copy if adding more content. The audience art is intentionally simpler than the hero, so a later product launch could replace one illustration with a real workflow demonstration once that workflow exists. Neither requires expanding this waitlist revision.

## Evidence

All paths below are relative to this research directory. The screenshot directory is already ignored by Git.

- `qa-neighborhood/final-desktop-motion-a.png` and `final-desktop-motion-b.png`: current desktop hero at different animation times.
- `qa-neighborhood/phone-hero.png`, `narrow-hero.png`: 390/360 px hero composition.
- `qa-neighborhood/desktop-buyer.png`, `desktop-seller.png`, `phone-seller.png`: audience layout and visible keyboard focus.
- `qa-neighborhood/final-buyer-art.png`: final smaller key-tag lettering with visible margins; supersedes the original buyer-art lettering.
- `qa-neighborhood/desktop-success.png`: actual local API success state.
- `qa-neighborhood/final-desktop-field-error.png`, `final-phone-paused-form-error.png`: field errors while manually paused.
- `qa-neighborhood/final-narrow-reduced-paused-privacy.png`: reduced-motion privacy dialog at 360 px.
- `qa-neighborhood/final-dark-phone-hero-paused.png`, `final-dark-phone-paused-privacy.png`: updated dark art and dialog.
- `qa-neighborhood/phone-full.png`, `desktop-full.png`: initial complete-page review; these precede the small belief-margin spacing fix and should not be mistaken for final copy screenshots.
- `qa-neighborhood/observations.json`: initial viewport, navigation, validation, network, and actual-save observations.
- `qa-neighborhood/final-observations.json`: fresh animation/pause/reduced-motion and navigation observations. One desktop field-validation sample coincided with a development hot reload; the stable rerun in the following file supersedes that sample.
- `qa-neighborhood/smoke-observations.json`: final stable desktop validation and reduced-motion control check.

## Limits

This was a bounded Chrome review using an isolated browser after the connected browser's documented API failure. It was not a cross-browser/device-lab pass or a screen-reader audit. API failures were deliberately simulated locally. The actual API success used synthetic data only. No production deployment or external email flow was tested.
