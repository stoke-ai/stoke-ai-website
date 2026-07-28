# A2P 10DLC optional SMS preference

## Problem

The live Stoke AI SMS enrollment form currently requires affirmative consent and rejects every submission without it. AgentPhone’s compliance reviewer requires the page to let a visitor explicitly decline SMS while still completing the preference flow, and asks that the campaign’s consent-flow description point directly to the live form URL.

## Acceptance Criteria

- [ ] AC-1 — The SMS preference form begins with neither choice selected and presents explicit `Yes, I agree` and `No thanks` options.
- [ ] AC-2 — The form cannot be submitted until one preference is selected, but both the affirmative and decline choices are accepted by the server.
- [ ] AC-3 — An affirmative choice preserves the full disclosure, Privacy Policy and Terms links, stores affirmative consent evidence, and returns an affirmative confirmation.
- [ ] AC-4 — A decline choice stores a durable declined/revoked preference, does not represent the visitor as opted in, and returns a clear no-text confirmation.
- [ ] AC-5 — The API response distinguishes affirmative and declined outcomes without exposing private evidence.
- [ ] AC-6 — The live page remains usable and readable on desktop and approximately 390 px mobile width.
- [ ] AC-7 — A Gmail reply is created as a draft in Meet Modi’s existing thread, identifies the live form URL, explains the optional choice, and asks him to resubmit. It is not sent.

## Non-goals

- NG-1 — Do not enable AgentPhone outbound texting or bypass 10DLC registration.
- NG-2 — Do not remove or weaken the existing SMS disclosure, Privacy Policy, Terms, STOP/HELP, message-rate, or no-condition-of-purchase language.
- NG-3 — Do not change unrelated portal, Goff, blog, or homepage behavior.
- NG-4 — Do not send the vendor email; create a draft only.
- NG-5 — Do not write synthetic QA submissions to the production consent database.

## Relevant files and evidence

- `src/app/sms-consent/page.tsx` — current required checkbox and affirmative-only confirmation.
- `src/app/api/sms-consent/route.ts` — server response contract.
- `src/lib/sms-consent/store.ts` — validation and durable consent evidence.
- Meet Modi email received July 28, 2026 — requires a skippable checkbox or `No thanks` option and a simplified consent-flow link.
- `https://stoke-ai.com/sms-consent` — live compliance evidence reviewed before implementation.

## Test expectations

- Deterministic validation tests for missing, affirmative, and declined choices.
- Structural verification that the page retains required disclosure/legal language and exposes both choices.
- Changed-file lint, TypeScript/build verification, and `git diff --check`.
- Browser QA of both rendered choice states without submitting production data.
- Production verification after deployment, without creating synthetic production preference records.

## How to verify

1. Load `/sms-consent`; confirm neither choice is preselected and both choices are visible.
2. Confirm the browser requires one selection before submission.
3. Exercise affirmative and declined server behavior only against isolated/local persistence or pure validation tests.
4. Verify affirmative and declined confirmation copy in a local browser without a production data write.
5. At 390 px, confirm no horizontal overflow and readable choices/legal links.
6. After deployment, inspect production rendering and static form semantics without submitting.
7. Verify the Gmail draft exists in the original thread and has no `SENT` label.

## Risk and release gate

Moderate compliance and persistence risk. Jeff’s explicit request authorizes implementation and updating the live site. Production writes during QA remain prohibited. External communication is limited to a Gmail draft; sending remains a separate Jeff gate.
