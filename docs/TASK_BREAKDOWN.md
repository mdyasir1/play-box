# Task Breakdown — YASIR PLAYBOX

> Work breakdown structure with owners, dependencies, and acceptance criteria. Status is updated as work is genuinely completed. Roles are emulated work packages (see `DEVELOPMENT_PROGRESS.md`), not separate writing agents.

## Owners (role labels)

| Code | Role |
|---|---|
| PM | Project manager / architect / integrator (single writer) |
| UI | UI/UX and design system work package |
| G1 | Reaction Rush + Word Master work package |
| G2 | Number Merge + Memory Challenge work package |
| G3 | Neon Survival work package |
| DB | Database/persistence work package |
| QA | Independent QA/security pass (fresh review, automated tests) |
| DOC | Documentation work package |

**Single-writer rule:** PM performs all file writes. G1/G2/G3/DB/UI/DOC operate as sequential implementation passes. QA reviews and runs tests independently after each gate. No parallel file edits occur.

## Critical path

```
P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9 → P10 → P11 → P12 → P13 → P14
                     └──────────── shared contracts required before P4 ────────────┘
P10 requires P9 progression semantics. P11 depends on P3 + P10. P13 depends on P12 sign-off.
```

Games are sequential because there is one writer. Within each game, pure-engine tests precede UI.

---

## Phase 0 — Inspection, architecture, documentation

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P0-01 | Inspect environment, repo, tooling, credentials | PM | — | **DONE** | Versions and constraints recorded; empty dir + no git verified |
| P0-02 | Initialize git repo and `.gitignore` | PM | P0-01 | **DONE** | `git init` succeeded; ignores secrets/build output |
| P0-03 | Create docs tree and all mandated documents | DOC | P0-01 | **DONE** | 17 Markdown files + freeze record exist |
| P0-04 | Write frozen authoritative specification | PM | P0-03 | **DONE** | 22 sections; hash recorded; read-only; hash verifies |
| P0-05 | Architecture, game design, level curves, DB/security design | PM | P0-03 | **DONE** | All required sections present and consistent |
| P0-06 | WBS, dependencies, risks, progress baseline | PM | P0-05 | **DONE** | This file + risk tables + honest progress |
| P0-07 | Phase 0 review gate | QA/owner | P0-01..06 | **DONE** | Owner approved Phase 0 and instructed Phase 1 to proceed (2026-11-21) |

## Phase 1 — Scaffold and brand foundation

| ID | Task | Owner | Deps | Status | Acceptance criteria / evidence |
|---|---|---|---|---|---|
| P1-01 | Initialize Next.js 16.4.6 app with App Router, TS, `src/`, npm | PM | P0-07 | **DONE** | Manual scaffold (no create-next-app Git actions); `next build` passes; production server returns 200 |
| P1-02 | Enable TS strict, ESLint, scripts (`dev/build/start/lint/typecheck/test`) | PM | P1-01 | **DONE** | `npm run lint` and `npm run typecheck` pass; scripts installed. Unused checks moved to ESLint after Next-generated dev types conflicted with TS flags (ADR-012) |
| P1-03 | Install approved dependencies only; commit lockfile | PM | P1-01 | **DONE** | 475 packages installed; `package-lock.json` present; `npm audit` reports 0 vulnerabilities (dev and production scopes) |
| P1-04 | Tailwind CSS v4 + semantic tokens + fonts (Sora/Inter via `next/font`) | UI | P1-02 | **DONE** | Semantic tokens in `globals.css`; Sora/Inter self-hosted; measured contrast AA (see UI_DESIGN_SYSTEM) |
| P1-05 | shadcn/ui init and 3-primitive compatibility smoke test | UI | P1-03, P1-04 | **DONE** | CLI not used by design (ADR-011); vendored Button/Badge/Card/Dialog on Radix + CVA; production build and component tests pass |
| P1-06 | Vitest + React Testing Library + jsdom setup with smoke test | QA | P1-02 | **DONE** | `npm test` passes: 3 files, 11 tests; coverage command configured; jsdom pinned 29.1.1 for Node 22.13 compatibility |
| P1-07 | Logo, favicon, icon set, splash screen component | UI | P1-04 | **DONE** | SVG logo, `icon.svg`, animated splash; once per session, skippable, reduced-motion static. Full PWA icons remain Phase 11 |
| P1-08 | Error boundary, not-found, loading primitives | PM | P1-01 | **DONE** | `error.tsx`, `not-found.tsx`, `loading.tsx` implemented; unknown game route returns 404 |
| P1-09 | Security headers + `.env.example` + service-role import guard | PM | P1-01 | **DONE** | CSP/HSTS/nosniff/frame/referrer/permissions headers verified via `curl -I`; `.env.example` contains names only; `server-only` guard verified to throw outside the react-server condition |

## Phase 2 — Shared layout, navigation, contracts, persistence skeleton

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P2-01 | App shell: desktop sidebar, mobile top bar + bottom nav, safe areas | UI | P1-04, P1-05 | PENDING | No overflow at 320–1440; keyboard nav; active states |
| P2-02 | Core components: Button, GameCard, LevelBadge, ProgressBar, StatTile, Empty/Error/Skeleton, Modal/Sheet, Toast, SyncStatus | UI | P1-04 | PENDING | All states per `UI_DESIGN_SYSTEM.md`; component tests |
| P2-03 | Shared contracts: `GameId`, `GameDefinition`, `LevelConfig`, result types; level-config registry | PM | P1-02 | PENDING | Type tests; all 5 games registered; caps validated |
| P2-04 | Local snapshot schema + safe storage + migrations skeleton | DB | P2-03 | PENDING | Corrupt JSON, quota, old version, unknown fields handled |
| P2-05 | Game chrome: header, instructions, pause overlay, result panel | UI | P2-02 | PENDING | Keyboard/touch; aria-live; no color-only cues |
| P2-06 | Route scaffolding + lazy game loading | PM | P2-01 | PENDING | Routes render; 404 for unknown game; no layout shift |
| P2-07 | Component/a11y smoke tests (axe) | QA | P2-02, P2-05 | PENDING | Zero critical/serious axe issues on shell |

## Phase 3 — Homepage and library

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P3-01 | Homepage: splash handoff, hero, featured, continue, all games, daily, progress, bests, activity, achievements | UI | P2-01, P2-02 | PENDING | Real stored data only; empty states; not overlong |
| P3-02 | Library: search, filters, descriptions, difficulty, level, best, progress, Play | UI | P2-02 | PENDING | Search/filter correct; locked levels show locked state |
| P3-03 | Stats page with real values and empty state | UI | P2-02 | PENDING | No fabricated values; matches snapshot |
| P3-04 | Achievements page (locked/unlocked) | UI | P2-02 | PENDING | Definitions only; no fake unlocks |
| P3-05 | Daily challenge entry (UTC policy, offline message) | UI | P2-02 | PENDING | Disabled with clear explanation when offline |
| P3-06 | Responsive pass at 10 target widths | QA | P3-01..05 | PENDING | No overflow/clipping/overlap; screenshots recorded |
| P3-07 | Playwright navigation smoke suite | QA | P3-01..05 | PENDING | Home ↔ library ↔ stats ↔ achievements pass |

## Phase 4 — Reaction Rush

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P4-01 | Pure engine + level config v1 (10 levels) | G1 | P2-03 | PENDING | No DOM imports; config matches LEVEL_PROGRESSION |
| P4-02 | Unit tests: timing, false start, average, pass/fail boundaries, visibility | QA | P4-01 | PENDING | All planned §3.1 cases green |
| P4-03 | Game UI: states, tap zone, round dots, HUD, instructions | G1 | P2-05, P4-01 | PENDING | Touch + keyboard; aria announcements |
| P4-04 | Result panel + local progress integration | G1 | P4-03, P2-04 | PENDING | Win unlocks; loss does not; best score only on win |
| P4-05 | Mobile/perf/a11y pass | QA | P4-03 | PENDING | No overflow; reduced motion; 60 fps feedback |
| P4-06 | Independent QA gate | QA | P4-02..05 | PENDING | Happy/loss/replay/refresh/offline cases pass; bugs logged |

## Phase 5 — Word Master

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P5-01 | Source and license a dictionary; build fair answer tiers + allowed guesses | G1 | P4 gate | PENDING | License recorded; no proper nouns/offensive/archaic; counts met |
| P5-02 | Evaluator + duplicate-letter tests | G1/QA | P5-01 | PENDING | §3.2 cases green; no double counting |
| P5-03 | Level UI: grid, physical + on-screen keyboard, hints, errors | G1 | P2-05, P5-02 | PENDING | Playable at 320 px; correct focus/keyboard behavior |
| P5-04 | Daily route + server-side answers, UTC reset, rate limits | DB | P5-02 | PENDING | No future answers in client; malformed input rejected |
| P5-05 | Practice mode, share grid, daily streak | G1 | P5-03, P5-04 | PENDING | Practice offline; share contains no letters; streak correct |
| P5-06 | Independent QA gate | QA | P5-01..05 | PENDING | Win/loss/replay/refresh/offline daily handling verified |

## Phase 6 — Number Merge

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P6-01 | Board engine: moves, merges, spawn, score, win/loss + tests | G2 | P5 gate | PENDING | All directions/edge cases per §3.3 |
| P6-02 | Undo stack + level configs (10 levels) | G2 | P6-01 | PENDING | Undo restores exactly; counter rules; config match |
| P6-03 | UI: swipe, keyboard, animations, board scaling | G2 | P6-01, P2-05 | PENDING | Touch/keyboard parity; no scroll; DPR-correct |
| P6-04 | Result + progression integration | G2 | P6-03, P2-04 | PENDING | Target on last move wins; deadlock/limit loses |
| P6-05 | Independent QA gate | QA | P6-01..04 | PENDING | Movement matrix, undo, refresh, mobile pass |

## Phase 7 — Memory Challenge

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P7-01 | Sequence engine + configs (4/6 pads, 10 levels) + tests | G2 | P6 gate | PENDING | Generation, playback order, validation, boundaries |
| P7-02 | Audio (Web Audio) + haptics + mute persistence | G2 | P7-01 | PENDING | Unlock on gesture; graceful silence; no autoplay errors |
| P7-03 | UI: pads, watch/input states, pause between sequences | G2 | P7-01, P2-05 | PENDING | Taps during playback ignored; hidden-tab replay |
| P7-04 | Result/progression integration | G2 | P7-03, P2-04 | PENDING | Score/bonus/best sequence correct; loss no unlock |
| P7-05 | Independent QA gate | QA | P7-01..04 | PENDING | Wrong pad, rapid taps, audio blocked, refresh pass |

## Phase 8 — Neon Survival

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P8-01 | Canvas lifecycle: sizing, DPR cap, single RAF, fixed step, cleanup | G3 | P7 gate | PENDING | No duplicate loops; no leaks on unmount; resize correct |
| P8-02 | Movement, spawner, collision, power-ups + unit tests | G3 | P8-01 | PENDING | No tunneling; caps; shield/slow semantics |
| P8-03 | Touch drag, keyboard, pause/resume, visibility | G3 | P8-01 | PENDING | First pointer only; safe areas; auto-pause |
| P8-04 | HUD/result + 10 level configs + perf pass | G3 | P8-02, P8-03 | PENDING | Win at target; collision loss; stable fps/memory |
| P8-05 | Independent QA gate | QA | P8-01..04 | PENDING | 5-minute run, rotation, pause spam, mobile pass |

## Phase 9 — Progression and achievements

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P9-01 | Monotonic merge policy + tests (win/loss/duplicate/regression) | DB | P4–P8 | PENDING | PROG-01..16 local cases pass |
| P9-02 | Achievement definitions, evaluation, idempotent unlocks | PM | P9-01 | PENDING | Real results only; duplicates impossible |
| P9-03 | Wire stats/activity/history to real snapshot | UI | P9-01, P3-03 | PENDING | Values match results; no fabricated data |
| P9-04 | Schema version migration and quarantine UI | DB | P9-01 | PENDING | Old/corrupt data handled without loss |
| P9-05 | Cross-game Playwright: play → unlock → refresh | QA | P4–P8, P9-01 | PENDING | All five games unlock and persist after reload |

## Phase 10 — Supabase anonymous persistence

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P10-01 | Create Supabase Free project; store keys outside repo | Owner/DB | P9 | PENDING | Project exists; anon key only in client; service key server-only |
| P10-02 | Apply migrations 0001/0002 + seed definitions/achievements/daily words | DB | P10-01 | PENDING | Migrations applied; seed verified; history recorded |
| P10-03 | RLS + RPC implementation and security probes | DB | P10-02 | PENDING | SECURITY.md §9 probes pass; no direct anon table access |
| P10-04 | Remote adapter, queue, backoff, rejection handling | DB | P10-03, P2-04 | PENDING | Offline queue, dedupe, no retry on validation errors |
| P10-05 | Sync status UI and conflict merge | UI/DB | P10-04 | PENDING | Never regresses local; clear status; no gameplay blocking |
| P10-06 | Failure simulation QA | QA | P10-04 | PENDING | DB down/offline/rate-limit recover without data loss |

## Phase 11 — PWA and offline

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P11-01 | Manifest, icons (192/512/maskable), theme metadata | UI | P3 | PENDING | Installability criteria met; icons render |
| P11-02 | Service worker: shell/static caching, no API caching | PM | P3, P10 | PENDING | Offline relaunch after one online visit; API excluded |
| P11-03 | Update flow with deferral during gameplay | PM | P11-02 | PENDING | Prompt shown; no mid-game reload |
| P11-04 | Install instructions and offline messaging | UI | P11-01 | PENDING | Android/iOS guidance; honest first-visit limitation |
| P11-05 | PWA QA on Android Chrome + iOS Safari | QA | P11-01..04 | PENDING | Standalone launch, offline, safe areas, update flow |

## Phase 12 — Comprehensive QA and security review

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P12-01 | Full regression across all games/platform | QA | P1–P11 | PENDING | Suite green; results recorded with evidence |
| P12-02 | Security review + bundle/secret scan + RLS probes | QA | P10 | PENDING | No secrets; probes pass; findings logged |
| P12-03 | Accessibility audit (axe + keyboard + screen reader) | QA | P3–P11 | PENDING | No critical/serious issues; limitations documented |
| P12-04 | Performance/Lighthouse + memory tests | QA | P8, P11 | PENDING | Budgets measured and recorded |
| P12-05 | Fix P0/P1/P2 and verify fixes | PM/QA | P12-01..04 | PENDING | No open P0/P1; P2 fixed or accepted with rationale |
| P12-06 | QA sign-off | QA | P12-05 | PENDING | Signed release readiness recorded in TESTING_AND_QA |

## Phase 13 — Deployment

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P13-01 | GitHub remote; push with approval | PM | P12-06 | PENDING | Repo created; secrets excluded; build passes |
| P13-02 | Vercel project, env vars, Hobby eligibility confirmed | PM | P13-01 | PENDING | Deploy succeeds; envs scoped correctly |
| P13-03 | Production verification (all games, progression, offline, install) | QA | P13-02 | PENDING | Checklist in DEPLOYMENT.md executed and recorded |
| P13-04 | Rollback rehearsal | PM | P13-03 | PENDING | Previous deployment promoted; production healthy |
| P13-05 | Monitoring/usage baseline | PM | P13-03 | PENDING | Supabase/Vercel usage recorded; no paid upgrade |

## Phase 14 — Handover

| ID | Task | Owner | Deps | Status | Acceptance criteria |
|---|---|---|---|---|---|
| P14-01 | Update all documentation to final state | DOC | P13 | PENDING | No stale sections; progress and changelog current |
| P14-02 | QA, security, performance reports finalized | QA | P12–P13 | PENDING | Real results only; known issues listed |
| P14-03 | Final known-issues review | PM | P14-02 | PENDING | Accepted P3s documented; no hidden P0/P1 |
| P14-04 | Handover package + Phase 2 auth plan | PM | P14-01..03 | PENDING | Source, docs, deployment details, migration plan delivered |

## Dependency and risk gates

| Gate | Blocks until |
|---|---|
| G0 Phase 0 review | Phase 1 |
| G1 Shared contracts + local store | Any game integration beyond engine work |
| G2 Per-game QA | Next game's integration with shared chrome |
| G3 Progression policy | Any cloud sync work |
| G4 RLS/RPC probes | PWA release candidate |
| G5 Full regression + security | Deployment |
| G6 Production verification | Handover |
