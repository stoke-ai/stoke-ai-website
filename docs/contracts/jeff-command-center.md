# Jeff Command Center — External Owner View

## Problem
Jeff needs a persistent, private, cross-device view of current client work so he does not have to reconstruct Stoke AI operations from Telegram or memory.

## Acceptance Criteria
- [ ] AC-1 — `https://stoke-ai.com/command-center` is available through the existing Stoke AI website and requires the `stoke-ai` portal identity.
- [ ] AC-2 — The first screen shows Jeff-attention status, latest verified changes, Blaze-owned work, waiting-state ownership, and a four-client pulse.
- [ ] AC-3 — Each client card exposes outcome, current lane/state, next milestone, next-move owner, Jeff action, governing decision, freshness, and source evidence.
- [ ] AC-4 — The page labels stale or reported information honestly instead of presenting it as verified current truth.
- [ ] AC-5 — The experience is readable and free of horizontal overflow at 390 CSS pixels and works on desktop.
- [ ] AC-6 — The route is `noindex,nofollow`, does not render the public chat widget, and does not expose the internal view to another client portal session.
- [ ] AC-7 — A deterministic data verification script, changed-file ESLint, and the canonical production build pass. Existing repository-wide lint debt is recorded separately and is not attributed to this slice.

The `stoke-ai` owner identity uses a dedicated `COMMAND_CENTER_ACCESS_CODE` override so its activation or rotation cannot replace the client workspace credential map.

## Non-goals
- NG-1 — No client-facing portal or client notification is created.
- NG-2 — No production/client-system write, email, SMS, or portal-board update occurs.
- NG-3 — No new database or automated reconciliation pipeline is added in this slice.
- NG-4 — No attempt is made to merge or overwrite unrelated dirty work in the primary website checkout.
- NG-5 — No stale statement is silently upgraded to verified.

## Relevant files and evidence
- `systems/jeff-command-center-morning-view-map.md` in the Stoke AI Command Center — approved product map.
- `operating-rhythm/active-client-control.md` — cross-client control fields.
- `shared-memory/clients/morgan-door/index.md` — Morgan operating truth and boundaries.
- `shared-memory/clients/rachel-hansen/active-memory.md` — Rachel current workflow and closeout gate.
- `clients/goff-welding/goff-project-focus-control-list.md` plus `goff-procurement-intake` test evidence — Goff lane and current gate.
- `dispatching-app` current repository state — Handy verified implementation evidence.

## Test expectations
- Data-contract verification script.
- ESLint.
- Next production build.
- Auth-boundary checks for unauthenticated, `stoke-ai`, and non-owner sessions.
- Desktop and true 390px visual QA with `scrollWidth === clientWidth`.
- Live production smoke test after authorized deployment.

## How to verify
1. Open `/command-center` without a portal session and see the private owner sign-in screen.
2. Sign in as the existing `jeff` / `stoke-ai` portal identity and see the owner dashboard.
3. Confirm another client portal identity cannot see the dashboard.
4. Inspect the four client cards, detail disclosures, evidence/freshness labels, and mobile layout.
5. Verify production HTML metadata and no chat widget on the route.

## Risk and release gate
- Risk: medium. The view is internal and contains client operating context, so authentication and search indexing are binding requirements.
- Build authority: Jeff explicitly authorized creating it on the Stoke AI website.
- Release authority: Jeff’s instruction includes making it available from MacBook and phone, so production deployment is authorized after checks and independent review pass.
- External communication remains unauthorized.
