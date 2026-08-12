# Morgan Door Estimate Review — feature contract

## Problem
Braxton needs to verify Estimate-to-Job reconciliation and stale active Estimates asynchronously without researching records or manipulating HCP Pipeline.

## Acceptance Criteria
- [ ] AC-1 — `/morgan-door-review` requires a dedicated private access code and exposes no customer records before authentication.
- [ ] AC-2 — The authenticated review shows one Estimate at a time with customer, address, amount, dates, scope, candidate Job evidence, Blaze's likely answer, and one focused question.
- [ ] AC-3 — Braxton can answer `Existing Job`, `Create Job`, `Canceled / not approved`, `Different work`, or `Not sure`, optionally add a note, and move to the next record.
- [ ] AC-4 — Answers persist durably with actor, timestamp, version, and case ID; rapid duplicate submissions are idempotent and stale edits are rejected.
- [ ] AC-5 — The interface separates the nine high-priority reconciliations from the broader active-Estimate cleanup and shows progress.
- [ ] AC-6 — Server-side GET-only HCP refresh updates current Estimate state and truthfully labels refresh time/failure; no credential enters client code.
- [ ] AC-7 — Jeff has a readable PDF summary of review scope and cases.
- [ ] AC-8 — Desktop and 390px mobile QA, lint, tests, and production build pass.

## Non-goals
- NG-1 — No HCP writes, Job creation, Estimate archive/stage changes, customer communication, automation changes, invoicing, or payments.
- NG-2 — No public customer-data page or credentials in source/client bundles.
- NG-3 — This is not Morgan Door OS and does not replace HCP.
- NG-4 — Braxton's click records a decision only; it never claims the HCP correction is completed.

## Evidence
- `BRAXTON-ESTIMATE-TO-JOB-RECONCILIATION-2026-08-11.md`
- `private/approved-estimate-job-match-evidence-2026-08-11.json`
- live GET-only HCP Estimate/Job API

## Verification
Auth denial, valid login, one-record rendering, all answer types, persistence/readback, stale-write conflict, no-HCP-write source audit, HCP refresh status, desktop/mobile screenshots, lint, tests, build.

## Risk and release
Private customer data and durable decisions. Jeff's explicit request authorizes build/deploy. HCP remains GET-only; production correction remains a separate reviewed action.
