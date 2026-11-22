# Changelog — Yasir's Play-Box

All notable changes are recorded here chronologically. Earlier entries describe retired scopes and are retained as history.

## [2.0.0] — 2026-11-22

### Added

- Login-first access flow; protected routes redirect to `/login`.
- Supabase Auth email/password and Prisma `progress` schema with RLS migration.
- Local demo login fallback when Supabase is not configured.
- 200 levels per game with steeper difficulty curves.
- Sequential level unlocking; next level disabled until previous is completed.
- Light and dark premium themes with a default dark theme.
- Animated "Yasir's Play-Box" splash screen and YG SVG mark/favicon.
- Space Grotesk display font, refined buttons, and flatter color system.

### Changed

- Removed gradient-heavy AI-looking UI in favor of a quiet editorial style.
- Home reduced to only the necessary content.
- Auth forms no longer hardcode Yasir.
- Progress storage moved to `playbox.v4.progress`.

### Verified

- Lint, typecheck, 31 unit tests, production build, 23 Playwright tests, audit.

## [1.0.0] — 2026-11-22

### Changed

- Replaced the five-game scope with exactly two games: Zip and Maze Paint.
- Removed the previous source tree and test suite; rebuilt the app around the
  new scope.
- Rewrote `PROJECT_SPEC.md` as version 2.0. The old freeze protocol is retired.
- Rewrote documentation for the two-game architecture, local persistence, UI,
  security model, testing record, and deployment runbook.
- Version bumped to `1.0.0`.

### Added

- 100 generated and solver-verified Zip levels (4×4 to 8×8).
- 100 generated and BFS-solver-verified Maze Paint levels (6×6 to 8×8).
- Pure Zip engine: start, extend, checkpoint order, backtracking, validation.
- Pure Maze Paint engine: slide, paint, blocked moves, completion, par replay.
- Zip board with pointer drag, tap, and keyboard activation.
- Maze Paint board with swipe, on-screen D-pad, arrow keys, and WASD.
- Level picker for all 100 levels per game with current/completed states.
- Result dialog with next level, replay, levels, and per-level statistics.
- Versioned `playbox.v3.progress` localStorage persistence with validation.
- Home page progress summary, game cards, rules, and direct play links.
- Responsive app shell, error page, loading state, not-found page, and icon.
- Vitest unit suite: 5 files, 30 tests.
- Playwright suite: 17 tests covering completion, persistence, level selection,
  result actions, keyboard isolation, narrow layout, and axe accessibility.
- Build, lint, typecheck, and dependency-audit gates.

### Fixed

- Hero decoration and header wordmark overflowed at 320 px.
- Level picker dimension labels failed color contrast.
- Completing a level could switch the board behind the result dialog.
- Maze arrow keys could move the board while the level picker was open.
- Closing the result dialog through Levels could leave a completed board with
  a misleading "fill remaining squares" status.

### Removed

- Five-game engines, pages, components, and tests.
- Supabase configuration from environment examples and CSP.
- Unused dependencies: `motion`, `server-only`, `@radix-ui/react-slot`,
  `class-variance-authority`, React Testing Library, and user-event.

### Verified

- `npm run lint`: pass, no warnings.
- `npm run typecheck`: pass.
- `npm test`: 5 files, 30 tests pass.
- `npm run build`: pass; home, both games, and icon prerendered.
- `npm run test:e2e`: 17 tests pass on the production build.
- `npm audit`: 0 vulnerabilities.
- Axe: zero serious/critical findings on home, both games, level picker, and
  result dialog.

## [Retired plan]

The earlier `[Unreleased]` five-game phase plan (Reaction Rush, Word Master,
Number Merge, Memory Challenge, Neon Survival, Supabase, PWA, phases 4-14) is
obsolete. It must not be resumed without a new owner decision and a new
specification.

## [0.4.0-data] — 2026-11-21


### Added
- Homepage now uses real local snapshot data: games played, completed levels, best scores, games with progress, and achievement highlights. Daily challenge entry is honest ("In build"/offline planned).
- Library now has search and category filters; `GameCard` displays real progress and difficulty.
- Stats page now reads real progress and activity from the snapshot; missing data shows real empty states.
- Achievements page now distinguishes real unlocked entries from locked definitions; no fabricated unlocks.
- Playwright navigation suite verifies `/`, `/games`, `/stats`, `/achievements` headings and library search/filter; 14/14 pass.
- Manual Playwright suite verifies no horizontal overflow at 320–1440 px on shell pages and mobile/desktop nav switching.

### Changed
- Versioned to `0.4.0`.

### Verified
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: pass.
- `npm run test:e2e`: 14/14 pass.
- `npm run build`: pass.
- `npm audit`: 0 vulnerabilities.

## [0.3.0-shell] — 2026-11-21
### Added
- Production app shell: desktop sidebar (brand, nav, daily-challenge card, local profile/sync summary) and mobile top bar + bottom nav with safe areas (`AppShell`, `Sidebar`, `MobileTopBar`, `MobileBottomNav`).
- Shared contracts: `GameId`, `GameDefinition`, `LevelConfig`, result/snapshot types; five ten-level definitions and registry (`REACTION_RUSH_LEVELS`, etc.); server caps `10,000 / 1,600 / 5,000,000 / 1,500 / 2,000`.
- Local snapshot safety skeleton: versioned validation, canonical installation ID, corrupt quarantine, quota trim, old-version migration skeleton, monotonic result merge.
- Core UI primitives: Button loading, LevelBadge, ProgressBar, StatTile, DifficultyChip, ErrorState, Skeleton, Toast, SyncStatus, Dialog mobile bottom sheet.
- Game chrome and lazy play shell: `GameChrome`, `GameHeader`, `GameInstructions`, `PauseOverlay`, `ResultPanel`, `GameHost`; static `/games/[gameId]/play` for all five games.
- Testing tooling: `axe-core` 4.14.1, `@playwright/test` 1.65.1, Playwright shell/navigation checks (`tests/e2e/shell.spec.ts`).

### Changed
- `GameCard` now supports real progress state and difficulty; in-build games are labeled honestly.
- Static play routes return real 404s for unknown games (`dynamicParams = false`).
- Home hero fixed to prevent 8 px horizontal overflow at 320–414 px.
- Versioned to `0.3.0`; audit clean (`0 vulnerabilities`).

### Fixed
- Home hero absolute blur used `-inset-6` and overflowed on mobile; now `inset-x-0 -inset-y-6`.

### Verification
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: **68/68** pass.
- `npm run test:e2e`: **12/12** pass (10 viewport widths, navigation switch, keyboard skip-link).
- `npm run build`: static `/`, `/games`, five details, five play routes, `/stats`, `/achievements`; unknown routes 404.
- Production smoke: routes 200, unknown play/detail routes 404, headers present, audit clean.

### Docs
- Updated `TASK_BREAKDOWN`, `DEVELOPMENT_PROGRESS`, `AGENT_WORK_LOG`, `BUILD_JOURNEY`, `CHANGELOG`, `TESTING_AND_QA`, `KNOWN_ISSUES`, `DEPLOYMENT`, `ARCHITECTURE`, `README`.
- Frozen `PROJECT_SPEC.md` remains unchanged and hash-verified.

## [0.2.0-foundation] — 2026-11-21

### Added
- Next.js 16.4.6 application scaffold (App Router, `src/`, TypeScript 5.9.3) built manually to avoid tool-driven Git actions.
- Tailwind CSS 4.3.5 semantic design tokens, dark theme, Sora + Inter self-hosted via `next/font`.
- Brand assets: SVG logo, app icon, animated splash (session-once, skippable, reduced-motion aware).
- Responsive app shell (header/footer), foundation homepage, games library, five statically generated game detail pages, stats and achievements empty states.
- shadcn-style UI primitives: Button, Badge, Card, Dialog (Radix UI + CVA).
- Error, not-found, and loading states.
- Vitest 5.1.1 + React Testing Library + jsdom 29.1.1 harness; 11 tests.
- Security headers in `next.config.ts` (CSP, HSTS, nosniff, frame/referrer/permissions policies).
- `.env.example` and a `server-only` import guard.
- `docs/AGENT_INSTRUCTIONS.md` with the binding no-Git-write policy.

### Changed
- `tsconfig.json`: Next 16 set `jsx: react-jsx` and added `.next/dev/types`; TS `noUnusedLocals`/`noUnusedParameters` removed because generated dev types fail them (unused checks remain in ESLint).
- Header wordmark is hidden below `lg` to prevent mobile overflow.

### Fixed
- Splash state update moved out of the synchronous effect body.
- jsdom version pinned for Node 22.13 compatibility.
- Removed unnecessary `@eslint/eslintrc`.
- ESLint flat config export style cleaned up.

### Verification
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: 11/11 pass.
- `npm run build`: pass; 12 static pages.
- Production server: real routes 200, unknown game 404, security headers present.
- `npm audit`: 0 vulnerabilities.
- Contrast spot-check: all documented pairs ≥ 4.5:1.
- Frozen spec hash still verifies.

### Notes
- Games are **not playable yet**; game logic is 0%.
- No Git staging, commit, push, reset, or restore was performed by the agent.
- E2E, axe, Lighthouse, Supabase, PWA, and deployment remain for later phases.

## [0.1.0-docs] — 2026-11-21

### Added
- Initialized the git repository (no commit, no remote) and added `.gitignore`.
- Created the complete documentation system under `docs/`:
  - `README.md` (index, content-ownership matrix, freeze protocol)
  - `PROJECT_SPEC.md` (frozen authoritative specification, 22 sections)
  - `PROJECT_OVERVIEW.md`
  - `ARCHITECTURE.md`
  - `GAME_DESIGN.md`
  - `LEVEL_PROGRESSION.md` (10-level curves for all five games)
  - `UI_DESIGN_SYSTEM.md`
  - `DATABASE.md` (schema/RLS/RPC design; not provisioned)
  - `SECURITY.md` (threat model, accepted risks)
  - `TESTING_AND_QA.md` (strategy and cases; no tests run)
  - `DEPLOYMENT.md` (runbook; not deployed)
  - `DEVELOPMENT_PROGRESS.md`
  - `AGENT_WORK_LOG.md`
  - `BUILD_JOURNEY.md`
  - `TASK_BREAKDOWN.md` (88 tasks)
  - `KNOWN_ISSUES.md`
- Froze `PROJECT_SPEC.md`:
  - SHA-256 `ef76a2655afa94b19b79d7f95782499767693505a08ede1d84592b59cc97bd33`
  - Hash record at `docs/.freeze/PROJECT_SPEC.sha256`
  - Read-only attribute set on Windows
  - Verification: `sha256sum -c` → OK

### Decisions
- npm selected as the only installed package manager.
- Accounts for Supabase, GitHub, and Vercel deferred to Phases 10/13.
- Eight required roles emulated as sequential work packages; no write-capable sub-agents exist.
- Daily Word answers will be server-side; future answers never shipped to clients.
- Level curves are versioned (`configVersion: 1`) and provisional pending playtesting.

### Notes
- No application code, dependencies, tests, database, or deployment exists at this version.
- No test results or deployment claims are made.

### Verification
- Frozen hash verified.
- Documentation files verified present.
- Git initialized with zero commits.
