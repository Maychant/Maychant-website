# Maychant independent functional and content review

Reviewed November 4, 2026 at `http://127.0.0.1:4173/`. Source reviewed: `dist/index.html`, `dist/app.js` and the rendered interactions. No implementation files were edited.

## Result

**24 functional scenarios passed. No blocking defect found.** The homepage accurately offers a local preparation check and downloadable text plan. It does not invent live listings, completed transactions, customer testimonials or professional approval. The contact action prepares an email to the user-supplied address, and its status does not claim that a message was sent.

The connected browser runtime failed before navigation and failed its accessibility/DOM fallback as well. After following its documentation and troubleshooting, QA used an isolated Chrome session through Playwright. The test was run at 1440 × 1000 and 390 × 844, with reduced motion enabled. This is a local functional review, not a cross-browser or assistive-technology certification.

## Verified behavior

| Area | Evidence |
|---|---|
| Required selections | Role, horizon and five-question steps cannot advance incomplete. The error is readable and focus moves to the first missing field. “Not sure” is available. |
| Back and role change | Back preserves horizon and partial answers. Changing from owner to operator clears incompatible answers and changes the financial-record question wording. |
| Audience routes | Owner, future-operator and adviser cards preselect the correct role. Adviser instructions avoid identifying client information. Each route produced a real plan download. |
| All-yes result | Gives a useful starting point and recommends qualified review; explicitly avoids saying the business is ready to sell or buy. No score or approval badge is generated. |
| All-unknown result | Gives actionable preparation priorities and includes all five unknown answers in the export. No undefined values or unsupported percentage appears. |
| Mixed result | Prioritizes “Not yet,” then “Not sure,” then “Partly.” Editing a previous answer updates both the displayed priorities and the next downloaded file. |
| Five dimensions | Individually leaving records, work, people, relationships or next decision unresolved produces the corresponding priority. |
| Real exports | The browser downloaded `maychant-next-step-plan.txt`. Files contain the date, correct role/horizon, current priorities, all five answers, discussion checklist and self-reported scope limitation. The UI explicitly identifies plain-text format. |
| Copy | Plan and contact copy operations produce the expected exact text. A simulated clipboard denial gives an honest alternative instead of claiming success. |
| Reset and refresh | Start again clears role, horizon and answer selections. A page refresh clears preparation and contact input state. |
| Keyboard/dialogs | Initial heading focus works; Tab does not move to background page controls; Escape closes the dialog and restores the invoking button. The contact dialog behaves similarly. Native browser chrome can receive focus during Tab traversal, which is not a hidden background-page control. |
| Links | Every nonempty in-page anchor resolves to an existing target. Audience navigation selects the intended panel. |
| Contact encoding | Ampersands, question marks, hashes, percent signs, quotes, Unicode, line breaks and an HTML-looking test string remain literal note text. Decoding the mailto body restores the entered note; the URI contains only the intended subject/body parameters. No injected HTML element appears. |
| Draft status | Recipient is `krishdw@umich.edu`. The interface says the draft is ready for review/send, never that interest was submitted or received. Preparation answers are not appended. The browser's external-mail launch was prevented during the test; no email was sent. |
| Privacy observation | All requests observed during the flow were local GET requests for the page and assets. No answer-bearing request, POST, third-party asset request, cookie, localStorage entry or sessionStorage entry was observed. No analytics or external AI call appears in the reviewed application source. |
| Phone flow | The mobile menu opens and closes correctly, adviser routing works, five questions can be completed, the result downloads, and the document has no horizontal overflow at 390 px width. |
| Runtime | No application page errors were recorded. |

## Content assessment

The headline is aspirational, while the primary action is a concrete preparation check. Audience cards cover owners, operators and advisers without suggesting a marketplace exists. The visible imagery note and “Example plan” label prevent the illustrations from looking like real inventory or completed client work. The FAQ accurately explains the early product, local answer handling, no financial uploads and professional-review limitation.

The plan's guidance stays at the level of organizing information and choosing conversations. It does not claim a valuation, financing approval, legal conclusion, validated readiness score or approved successor. The “Your answers stay in this page” claim matches the reviewed implementation and observed request behavior.

No content change is required for release on the reviewed build. Preserve these qualifications if subsequent design changes add cards, badges, numbers or new contact behavior.

## Artifacts and limits

- Detailed result record: `research/functional-artifacts/results.json`.
- Real downloaded sample: `research/functional-artifacts/operator-mixed.txt`.
- Other exports include all three all-yes role plans, all-unknown, edited-answer and mobile adviser cases.
- Encoded contact test: `research/functional-artifacts/contact-payload.json`; contains synthetic QA text only.
- Reproducible test runner: `/private/tmp/maychant-visual-review/functional-review.cjs`.

The first run identified two test-harness issues: it checked clipboard status before the asynchronous operation completed, and treated native browser chrome focus as escape to background content. Those checks were corrected; the completed second run passed. Earlier failure screenshots in the artifact directory are from that superseded run and are not confirmed site defects.

No outbound message, signup, listing, account or external submission was created. Email delivery itself was not tested. No Safari/Firefox testing, screen-reader session, hosted authentication review or post-deployment network check is included in this result.
