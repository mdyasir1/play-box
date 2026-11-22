# Known Issues — YASIR PLAYBOX

> Live ledger for the current two-game build. Last updated 2026-11-22.

## Severity legend

| Severity | Meaning |
|---|---|
| P0 | Security vulnerability, data loss, or complete failure |
| P1 | Core game or progression broken |
| P2 | Significant UI, functionality, or compatibility issue |
| P3 | Minor visual or polish issue |
| INFO | Accepted limitation or pending external action |

## Open entries

There are no known P0, P1, P2, or P3 defects in the verified build.

| ID | Severity | Area | Description | Status |
|---|---|---|---|---|
| KI-101 | INFO | Persistence | Progress is stored only in the current browser profile. Clearing site data or switching devices loses it. | Accepted by design |
| KI-102 | INFO | Persistence | Another user of the same browser profile can see and modify progress. | Accepted; no accounts or personal data |
| KI-103 | INFO | Integrity | Scores are client-side and can be edited by the player. | Accepted; no leaderboard or rewards |
| KI-104 | INFO | Offline | There is no service worker or offline cache. Initial assets require a network load. | Accepted; out of scope |
| KI-105 | INFO | Compatibility | Playwright runs Chromium only; Firefox/WebKit projects are not configured. | Accepted for this release |
| KI-106 | INFO | Manual QA | No physical iOS/Android or screen-reader manual pass was performed. | Pending owner/device access |
| KI-107 | INFO | Deployment | No hosted production environment exists yet. | Pending owner action |
| KI-108 | INFO | Content | Every level is computer-verified for solvability, but not manually playtested one by one. | Accepted; playtest recommended |
| KI-109 | INFO | Scope | "100s of levels" was implemented as 100 levels per game (200 total). | Assumption; owner can request expansion |
| KI-110 | INFO | Content | Zip levels are generated from seeded snake/2-opt paths and may share structural patterns. | Accepted; all are valid and distinct |
| KI-111 | INFO | Security | CSP permits inline scripts/styles required by Next.js. | Accepted framework requirement; no user HTML |

## Resolved in this rebuild

| ID | Description | Verification |
|---|---|---|
| KI-112 | Mobile home overflowed by 8 px from the hero glow | 320 px browser test passes |
| KI-113 | Header exceeded 320 px by 60 px | 320 px browser test passes |
| KI-114 | Level dimension labels failed color contrast | Axe dialog scan passes |
| KI-115 | Completion advanced the board behind the result dialog | Browser completion/replay/persistence tests pass |
| KI-116 | Maze arrow keys moved the board behind the level picker | Keyboard-isolation browser test passes |
| KI-117 | Unused five-game dependencies remained installed | `npm install` pruned 8 packages; audit clean |
| KI-118 | Closing the result dialog via Levels left a completed board with a misleading status | Status now derives from board completion; Zip browser test passes |

## Historical entries

The previous five-game project tracked issues KI-001 through KI-014. Those
items referred to unbuilt games, Supabase, PWA work, and a frozen specification
that the owner retired on 2026-11-22. They are not open issues for this build.
Details remain in the repository history and earlier changelog entries.

## Rules

- Never present a limitation as a completed feature.
- P0/P1 entries block release.
- P2 entries must be fixed or explicitly accepted in writing.
- Resolved entries stay documented with their verification evidence.
