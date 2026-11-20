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

## Chapter 2 — Phase 1: scaffold and brand foundation (2026-11-21)

### Step 1: Record the new rule before touching code

The owner added a binding process rule: the agent must never stage, unstage, commit, push, reset, or otherwise manipulate Git. The rule was written to `docs/AGENT_INSTRUCTIONS.md` and linked from the documentation index before any Phase 1 work began. This mattered immediately: the default `create-next-app` flow can initialize Git and create a commit, so it was rejected.

### Step 2: Scaffold by hand

The Next.js app was assembled manually: `package.json`, TypeScript config, Tailwind v4/PostCSS, flat ESLint config, and Vitest. This avoided hidden Git actions and gave full control over versions.

Engine conflicts surfaced during installation:

- jsdom 31 requires Node 22.22+; jsdom 30 requires 22.14+; the environment runs 22.13.1. **Fix:** jsdom 29.1.1.
- `@eslint/eslintrc` was installed for legacy flat-config bridging, then removed after discovering that `eslint-config-next` 16 already exports flat config arrays.
- `@vitejs/plugin-react` 6 requires Vite 8 and extra React tooling; it was unnecessary because Vitest/esbuild handles the automatic JSX runtime. It was not installed.

### Step 3: Build the visual foundation

Implemented semantic tokens (midnight, charcoal surfaces, purple/electric-blue accents), self-hosted Sora + Inter via `next/font`, a custom SVG mark, app icon, and a splash that:

- runs once per session,
- can be skipped,
- respects `prefers-reduced-motion`,
- reveals via `requestAnimationFrame` instead of blocking hydration.

The first splash implementation called `setState` directly inside an effect. The Next/React lint rules correctly rejected it as a cascading render. Moving the reveal into a rAF callback fixed the architecture rather than suppressing the rule.

### Step 4: Create honest foundation routes

Because games are not playable yet, the library and detail pages say so explicitly. No fake scores, statistics, or "Play" buttons were added. Stats and achievements show real empty states. This keeps the intermediate build honest while still demonstrating the design system and routing.

### Step 5: Prove the toolchain

The first full verification sequence found two real issues:

1. **Generated types vs. strict flags:** Next 16 added `.next/dev/types/**/*.ts` to `tsconfig.json`; those generated files trip `noUnusedLocals`/`noUnusedParameters`. Removing those two flags and relying on ESLint's unused checks fixed deterministic builds without weakening project linting (ADR-012).
2. **Header overflow risk:** showing the wordmark at 360 px plus three nav labels would exceed the viewport. The wordmark now appears only at `lg`+; the logo mark remains visible on phones.

The final checks passed:

- lint and typecheck clean,
- 11 tests green,
- production build with 12 static pages,
- production server route smoke test (200s and a real 404),
- CSP and hardening headers present,
- `npm audit` clean,
- token contrast ≥ 4.5:1.

### Step 6: Respect the Git boundary

No `git add`, commit, push, reset, restore, or staging command was executed in Phase 1. The agent only wrote working-tree files. The owner retains full control of the index and history.

### Lessons

1. **Default scaffolding is not neutral.** It can create commits; read the tool's side effects.
2. **Engine ranges matter.** A "latest" dev dependency can be unusable on the installed Node version.
3. **Generated code can break strict flags.** Keep strictness where it applies to project code; don't fight generated types.
4. **Honesty in intermediate UI.** Saying "in build" is better than a button that does nothing.
5. **Lint rules catch real design problems.** The effect-state warning led to a better splash lifecycle.

## Chapter 3 — Phase 2: shared layout, navigation, contracts, persistence skeleton, game chrome

### Step 1: Approve and audit interfaces

After owner approval, the PM/UI/DB packages landed in this order: (1) shared contracts/registry, (2) local snapshot storage, (3) app shell, (4) core primitives, (5) game chrome/static play routes, (6) docs/verification. Shared contracts were reviewed before engines because every game, screen, and test depends on them.

### Step 2: Validate the shell by browser, not just CSS

Phase 2 is the first Phase where visual system is implemented. Instead of manual screenshots only, the PM added deterministic Playwright checks: 10 widths from 320–1440 px across the main shell routes, asserting `document.documentElement.scrollWidth <= innerWidth + 1`. The first browser run found real overflow: the home hero used `absolute -inset-6` around a blurred glow, creating an 8 px horizontal overflow at 320–414 px. It was changed to `absolute inset-x-0 -inset-y-6`, and the browser checks now pass.

The same Playwright pass verified:

- desktop sidebar at ≥1024 px;
- mobile top bar + bottom nav below 1024 px;
- sidebar→bottom nav switch at 1023/1024 px;
- skip link as the first keyboard stop;
- static play routes render and return real 404s for unknown games.

### Step 3: Build contracts and the persistence skeleton

The DB/PM layer created `GameId`, `GameDefinition`, `LevelConfig`, result/snapshot types, and five ten-level configs with documented caps. The registry is the single source for `maxScore`, difficulty labels, completion values, and curve data, and `validateLevelRegistry()` guards it in tests.

The DB layer built safe local storage: schema validation, unknown-field stripping, future-version quarantine, corrupt-JSON recovery, old-version migration skeleton, quota trim, canonical installation ID, and monotonic result merge.

### Step 4: Add modern UI primitives and core components

UI added Button loading, LevelBadge, ProgressBar, StatTile, DifficultyChip, ErrorState, Skeleton, Toast, SyncStatus, and made Dialog a mobile bottom sheet. Component tests cover behavior and a11y names.

### Step 5: Build shared game chrome and static play routes

UI built `GameChrome`, header/instructions, pause overlay, and result panel. PM built static `/games/[gameId]/play` routes for all five games. Dynamic `next/dynamic` game loaders make the play module lazy, but unknown params return 404.

### Step 6: Add structural a11y smoke and browser QA

QA installed free `axe-core` for shell/game chrome zero critical/serious checks and Playwright for browser overflow/navigation checks. All pass. Full browser axe/Lighthouse remains Phase 12.

### Lessons

1. **Call the browser while building, not after.** The shell overflow would have been found later by a player.
2. **Static routing fixes real 404s.** Dynamic not-found can stream and still return 200; `dynamicParams = false` gives deterministic unknown-route 404s.
3. **Lazy modules should have a visible skeleton.** `GameStageSkeleton` avoids layout shift before game engines arrive.
4. **Version-sensitive dev tooling needs a local browser target.** Playwright v1.65.1 needed its v1255 headless-shell download.

### Next chapter

Phase 3: wire local snapshot into homepage/library, stats/achievements, and extend Playwright navigation. Entry is gated on owner approval.

---

_Entries are appended as milestones complete. This file never restates requirements; it records the path taken._
