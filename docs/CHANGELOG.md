# Changelog — YASIR PLAYBOX

All notable changes are recorded here chronologically. Versions follow a simple pre-release scheme until the first public release.

## [Unreleased]

### Planned
- Phase 2: shared game contracts, level-config registry, local snapshot skeleton, game chrome.
- Phases 4–8: five games.
- Phase 9–11: progression, Supabase persistence, PWA.
- Phase 12–14: QA, deployment, handover.

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
