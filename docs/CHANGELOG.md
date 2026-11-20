# Changelog — YASIR PLAYBOX

All notable changes are recorded here chronologically. Versions follow a simple pre-release scheme until the first public release.

## [Unreleased]

### Planned
- Phase 1: Next.js scaffold, strict tooling, brand foundation, test harness.
- Phases 4–8: five games.
- Phase 9–11: progression, Supabase persistence, PWA.
- Phase 12–14: QA, deployment, handover.

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
