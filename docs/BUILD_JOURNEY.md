# Build Journey — YASIR PLAYBOX

> Narrative record of **how** the project is being built: steps, order, decisions, failures, lessons. This is not a requirements document (`PROJECT_SPEC.md`) and not a bug ledger (`KNOWN_ISSUES.md`). Progress status lives in `DEVELOPMENT_PROGRESS.md`.

## Chapter 1 — Phase 0: inspection, freeze, and plan (2026-11-21)

### Step 1: Read the brief and refuse to guess

The brief is a full product specification, not a single feature request. The first action was to treat it as a project to plan, not code to dump. The instruction was explicit: Phase 0 only, inspect first, invent nothing.

### Step 2: Inspect the real environment

Findings that shaped every later decision:

- The project directory was completely empty.
- It was not a git repository.
- Node v22.13.1 and npm 10.9.2 were available; pnpm and yarn were not.
- Supabase CLI, Vercel CLI, and GitHub CLI were not installed.
- No Supabase/Vercel/GitHub credentials existed in the environment.
- npm registry connectivity worked.
- Windows provides `attrib`, `sha256sum`, and `certutil`, enabling a real freeze mechanism.
- Current registry versions: Next 16.4.6, React 19.3.1, Tailwind 4.3.5, Supabase JS 2.119.2, Vitest 5.1.1, Playwright 1.65.1, Motion 14.14.0, Lucide 1.77.0.

**Consequence:** npm is the package manager. Deployment work is deferred until accounts exist. No command or file was claimed that had not been verified.

### Step 3: Surface the agent-capability truth

The environment exposes one read-only `explore` sub-agent, not eight writing agents. Rather than pretending a team existed, the plan documented emulation: sequential work packages, one writer, independent QA passes. This decision is visible in `README.md`, `DEVELOPMENT_PROGRESS.md`, and `AGENT_WORK_LOG.md`.

### Step 4: Present the plan and obtain decisions

The Phase 0 plan was presented before writing anything. The owner approved:

1. Phase 0 execution as planned (docs first, no scaffold).
2. A full normalized specification frozen with a hash.
3. `git init` with no commit.
4. Supabase/GitHub/Vercel accounts deferred to Phases 10/13.

This is the first point where the project had explicit authorization to write files.

### Step 5: Initialize the repository safely

`git init` created the repository. `.gitignore` was written **before** any future secrets could exist: environment files, build output, test artifacts, editor/OS files. No commit was made, per the no-commit rule.

### Step 6: Write the specification once, then freeze it

`PROJECT_SPEC.md` was normalized into 22 sections, preserving every requirement from the brief: five games, level progression, zero budget, no auth in Phase 1, PWA, QA, deployment, and the "do not fabricate" rules. It is 556 lines.

Freeze procedure used:

1. Wrote the file.
2. Computed SHA-256: `ef76a2655afa94b19b79d7f95782499767693505a08ede1d84592b59cc97bd33`.
3. Stored the record in `.freeze/PROJECT_SPEC.sha256`.
4. Set the Windows read-only attribute with `attrib +R`.
5. Re-ran `sha256sum -c` and confirmed `OK`.

**Why freeze:** the owner explicitly asked that the "about the project" document be frozen and separate from the "how we achieved it" document. Immutability prevents silent scope drift later.

### Step 7: Separate "what" from "how" (the requested document split)

The owner asked for two distinct documentation layers:

- Everything **about** the project → one frozen file (`PROJECT_SPEC.md`).
- **How** the project was achieved, steps followed, milestones → a living file (`BUILD_JOURNEY.md`).

A content-ownership matrix in `README.md` prevents the two from bleeding into each other. The remaining mandated documents each own a single concern:

- Game rules vs. level curves.
- Schema/RLS vs. threat model.
- Test plan/results vs. bug ledger.
- Current status vs. chronological history.

This avoids the common failure of five documents repeating the same paragraphs out of sync.

### Step 8: Design the product, not just the paperwork

Phase 0 was not a docs-only formality. Concrete decisions were made and written down:

- **Level curves:** 10 levels per game with measurable parameters and bounds; server plausibility caps; centralized configs.
- **Daily Word:** server-validated in UTC; future answers never shipped to the client; practice mode offline.
- **Persistence:** local-first snapshot, idempotent queue, monotonic merge, exponential backoff; Supabase is optional.
- **Security:** deny-by-default RLS, no direct anon table access, two narrow RPCs, explicit accepted risks.
- **Neon Survival:** canvas with one RAF loop, fixed timestep, DPR cap, pooling, cleanup, 60 fps target.
- **Accessibility:** 44 px targets, no color-only feedback, reduced-motion paths, screen-reader status.

Some curves are deliberately marked provisional under `configVersion: 1`; Phase 6/8 playtesting may tune them, but only with a version bump and a changelog entry.

### Step 9: Plan 88 tasks with gates

The WBS in `TASK_BREAKDOWN.md` covers 15 phases, 88 tasks, dependencies, owners, and acceptance criteria. Release gates are explicit:

1. Shared contracts before any game integration.
2. Per-game QA before the next game starts.
3. RLS probes before PWA release candidate.
4. Full regression before deployment.
5. Production verification before handover.

### Step 10: Verify, then stop

Phase 0 was closed only after verifying:

- every documentation file existed;
- the frozen hash still matched;
- the read-only flag was set;
- git was initialized with no commit or remote;
- no application code or dependency had been introduced.

No tests were run because no testable code exists. That is stated plainly rather than papered over.

## Decisions taken, alternatives rejected

| Decision | Alternative rejected | Reason |
|---|---|---|
| npm | pnpm/yarn | Not installed; avoid extra setup risk |
| Next.js App Router | Vite SPA | Required stack; deploy path and PWA tooling fit Vercel |
| Canvas for Neon Survival | Phaser | One simple game; engine adds weight without benefit |
| Local-first persistence | Cloud-required progress | DB outages/quota must never block play |
| Server-validated daily word | Deterministic client-selected word | Client selection would ship all future answers |
| Deny-by-default RLS + RPCs | Per-row anon policies on tables | Device IDs are spoofable; narrow RPCs reduce attack surface |
| Sequential work packages | Fake multi-agent parallelism | Environment has no writing sub-agents; single-writer avoids conflicts |
| Frozen spec + living journey | One evolving "master doc" | Owner requested separation; prevents requirement drift |
| UTC daily reset | Local-midnight reset | Determinism and a single documented boundary |

## Lessons so far

1. **Inspect before planning.** The absence of pnpm, CLIs, and credentials changed the plan more than any design preference.
2. **Freeze is a process, not a label.** Hashing and re-verification make it real.
3. **Separate concerns in docs early.** The ownership matrix costs one page and prevents months of inconsistency.
4. **State limitations up front.** Anonymous persistence cannot be cheat-proof; hiding that would create future rework and false claims.
5. **Do not claim agents/tests/deployment that do not exist.** The log reflects what actually happened.

## Next chapter (not started)

Phase 1: scaffold Next.js, enable strict tooling, verify shadcn/ui + Tailwind v4 compatibility, set up Vitest, establish tokens, logo, and splash. Entry is gated on owner approval of Phase 0.

---

_Entries are appended as milestones complete. This file never restates requirements; it records the path taken._
