# Known Issues — YASIR PLAYBOX

> Live ledger of defects and accepted limitations. Last updated at the end of Phase 2. The application foundation and local snapshot skeleton exist, but games are not playable. Entries below are **known limitations and dependencies**, explicitly classified. Do not invent bugs or claim fixes.

## Severity legend

| Severity | Meaning |
|---|---|
| P0 | Security vulnerability, data loss, complete failure |
| P1 | Core game/progression broken |
| P2 | Significant UI/functionality/compatibility issue |
| P3 | Minor visual/refinement issue |
| INFO | Planned limitation or pending dependency, not a defect |

## Open entries

| ID | Severity | Area | Description | Reproduction | Status | Owner | Resolution |
|---|---|---|---|---|---|---|---|
| KI-001 | INFO | Entire app | The shell, shared contracts, local snapshot skeleton, and game chrome exist; no game engine is playable. Library/detail/play pages label modules "In build"; no fake Play buttons. | N/A | Planned | PM | Phases 4–8 |
| KI-014 | INFO | Game play | The static `/games/[gameId]/play` route currently opens a labeled in-build shell and always starts level 1; level deep-linking/continue-by-level is not wired until game engines implement progress. Phase 3 wired real snapshot data into home/library/stats/achievements. | Visit play route directly | Accepted/Phase 3 done | PM | Phase 4 engines |
| KI-012 | INFO | Persistence | Local progress storage, achievements wiring, and cloud sync are not implemented yet. Stats/achievements show honest empty states. | N/A | Planned | DB | Phases 2, 9, 10 |
| KI-013 | INFO | PWA | Manifest/service worker/offline installability are not implemented yet. | N/A | Planned | PM | Phase 11 |
| KI-002 | INFO | Persistence | Anonymous device IDs are spoofable; anyone with an installation UUID can access that progress via RPCs. Not ownership/authentication. | N/A | Accepted | DB | Documented in SECURITY.md; Phase 10 authentication path |
| KI-003 | INFO | Persistence | No cross-device progress: clearing site data loses the installation ID and local progress; cloud recovery requires the same ID. | N/A | Accepted | DB | Phase 10 accounts or approved export/import |
| KI-004 | INFO | Word Master | Daily challenge requires network and is unavailable offline by design (future answers are not shipped to the client). Practice mode remains offline. | N/A | Accepted | G1 | Documented in GAME_DESIGN.md |
| KI-005 | INFO | Security | Score integrity is limited to server plausibility caps and rate limits; anonymous scores are not tamper-proof. | N/A | Accepted | DB/QA | Documented in SECURITY.md; never claim cheat-proof |
| KI-006 | INFO | Deployment | Supabase, GitHub, and Vercel accounts/credentials do not exist yet. | N/A | Pending owner action | PM | Phases 10/13 |
| KI-007 | INFO | Deployment | Vercel Hobby eligibility for this use case is unconfirmed (Hobby is non-commercial). | N/A | Pending confirmation | PM | Confirm before Phase 13; no paid upgrade without approval |
| KI-008 | INFO | Process | The environment exposes only a read-only exploration sub-agent; required roles are emulated sequentially. | N/A | Accepted | PM | Single-writer work packages; documented |
| KI-009 | INFO | Tooling | Supabase CLI, Vercel CLI, and GitHub CLI are not installed. | N/A | Accepted | PM | Use `npx` or dashboards |
| KI-010 | INFO | Deployment | Free-tier quotas can change or be exhausted; no paid fallback is permitted. | N/A | Monitoring | PM | Usage checks in Phase 13; redesign if needed |
| KI-011 | INFO | Accessibility | Canvas gameplay (Neon Survival) cannot be fully played via screen reader; keyboard control and textual status are provided. | N/A | Accepted limitation | G3/QA | Documented; scope-approved |

## Bug report template

```
ID: KI-NNN
Severity: P0/P1/P2/P3
Module/page:
Environment: browser, OS, viewport, online/offline
Steps to reproduce:
Expected:
Actual:
Evidence (console/network/screenshot):
Assigned:
Status: Open / In progress / Fixed / Verified / Accepted
Resolution/commit:
```

## Resolved entries

| ID | Description | Resolved on | Verification |
|---|---|---|---|
| — | No defects fixed yet; none reported | — | — |

## Rules

- Never delete an entry; move it to Resolved with a verification note.
- P0/P1 block release.
- P2 must be fixed or explicitly accepted with a written rationale.
- Accepted P3 issues are documented here before handover.
- INFO items are not defects but must not be presented as completed features.
