# YASIR PLAYBOX — MASTER PROJECT SPECIFICATION

| Field | Value |
|---|---|
| Document ID | SPEC-001 |
| Version | 1.0 |
| Status | **FROZEN** |
| Freeze date | 2026-11-21 |
| Authority | Authoritative source of product requirements |
| Hash record | `docs/.freeze/PROJECT_SPEC.sha256` |
| Change policy | This file MUST NOT be edited after freeze. Requirement changes are recorded in `docs/CHANGELOG.md` and an append-only amendment, with explicit approval. |

> This document defines **what the project is and must satisfy**. It does not track progress, implementation steps, or test results. Those live in `docs/DEVELOPMENT_PROGRESS.md`, `docs/BUILD_JOURNEY.md`, and the other companion documents indexed in `docs/README.md`.

---

## 1. ROLE AND RESPONSIBILITY

The project is to be executed with the discipline of a senior software team: architect, full-stack developer, UI/UX designer, frontend specialist, browser-game developer, database engineer, security engineer, QA lead, and technical project manager.

The team must plan before implementing, review before merging, and test before declaring completion. Visual polish alone does not constitute completion. Every game, level, control, score, animation, database operation, and responsive layout must work as specified.

Primary objectives:

1. Build a premium gaming platform named YASIR PLAYBOX.
2. Include exactly five complete single-player games.
3. Implement genuine level-based progression.
4. Increase difficulty measurably as levels increase.
5. Persist progress and unlocked levels.
6. Use Supabase Free for cloud persistence.
7. No authentication in Phase 1.
8. Mobile-first, installable PWA.
9. Zero mandatory-cost architecture.
10. Use specialized work roles; emulate them honestly where sub-agents are unavailable.
11. Maintain complete project documentation continuously.
12. Perform independent testing and security review.
13. Deploy through Vercel.

## 2. PROJECT SCOPE

Included games (exactly these five):

1. Reaction Rush
2. Word Master
3. Number Merge
4. Memory Challenge
5. Neon Survival

Explicitly excluded from Phase 1:

- Multiplayer.
- Mini Battle.
- Tic-Tac-Toe.
- Rock Paper Scissors.
- Online player-versus-player.
- Chat.
- User registration, login, logout.
- Authentication in Phase 1.

Features outside this scope must not be built without documented justification and approval.

## 3. ZERO-BUDGET REQUIREMENT

Available resources: Next.js, React, TypeScript, Tailwind CSS, Supabase Free, Vercel Hobby (subject to eligibility/usage limits), GitHub Free, free UI/animation libraries, browser APIs.

Permitted technologies: shadcn/ui, Motion for React, GSAP, React Bits, Lucide icons, HTML Canvas, Phaser only with justification, Vitest, Playwright, React Testing Library.

Rules:

1. No paid APIs.
2. No paid libraries.
3. No paid authentication provider.
4. No paid game engine.
5. No paid analytics.
6. No paid image-generation services.
7. Avoid unnecessary cloud storage.
8. Verify free-plan restrictions before introducing any external service.
9. Prefer locally stored assets.
10. Monitor Supabase and Vercel free-tier usage.
11. Never assume free services are unlimited.
12. No service upgrades without explicit approval.

If a feature requires paid infrastructure, redesign it.

## 4. DEVELOPMENT ORGANIZATION

Work must be divided into small, independently testable packages with assigned ownership and explicit dependencies. Parallel work is allowed only on independent modules; shared files must have a single writer at a time.

Required roles:

| Role | Responsibility |
|---|---|
| AGENT 1 — Project Manager / Architect | Repository inspection, architecture, task division, dependency control, interface approval, integration, phase acceptance, master TODO. Must not accept delegated work without review. |
| AGENT 2 — UI/UX & Design System | Brand identity, visual direction, tokens, reusable components, homepage, cards, navigation, statistics, achievements UI, loading/empty states, responsive layouts, visual consistency. |
| AGENT 3 — Reaction Rush + Word Master | Complete logic, timing, validation, difficulty, scoring, result screens; independently testable modules. |
| AGENT 4 — Number Merge + Memory Challenge | Board, merging, movement, undo, win/loss; sequence generation, playback, validation, difficulty, sound, scoring. |
| AGENT 5 — Neon Survival | Canvas architecture, loop, movement, obstacles, collisions, power-ups, difficulty, scoring, mobile controls, performance, cleanup. |
| AGENT 6 — Database & Persistence | Supabase schema, anonymous device identity, migrations, RLS, RPCs, local-first persistence, sync, recovery, conflict handling, future auth compatibility. |
| AGENT 7 — Independent QA & Security | Independent review and reproduction of defects; tests for gameplay, levels, difficulty, scores, persistence, mobile, compatibility, offline, input, security; severity reporting; fix verification; regression. Must not accept developer claims without verification. |
| AGENT 8 — Documentation & Progress | Continuously maintain all mandated documents; update after every milestone, not only at the end. |

Coordination rules:

1. Assign small, clearly defined tasks.
2. Parallelize independent game modules only.
3. Never let multiple writers edit the same shared file simultaneously.
4. Assign file ownership.
5. Agree shared TypeScript interfaces before parallel implementation.
6. Review interfaces before implementation.
7. Keep a common integration branch.
8. Integrate in controlled stages.
9. Run tests after integration.
10. Do not merge unreviewed changes.
11. Report blockers immediately.
12. No agent may introduce dependencies independently.
13. Documentation must be informed of every important decision.
14. QA receives actual implementation and tests it.
15. The project manager resolves conflicting recommendations.

If the environment does not support sub-agents, they must be emulated sequentially, with the same documentation and review requirements. It is forbidden to pretend agents exist.

## 5. DOCUMENTATION SYSTEM

A `docs/` directory is mandatory and must contain:

| File | Content |
|---|---|
| `PROJECT_OVERVIEW.md` | Purpose, vision, features, game descriptions, UX, scope, exclusions, stack, zero-budget constraints. |
| `ARCHITECTURE.md` | System architecture, flow, folder structure, component and game-module architecture, data flow, persistence, database communication, PWA, security boundaries, dependency decisions. |
| `DEVELOPMENT_PROGRESS.md` | Current phase, honest completion percentage, current/completed/pending tasks, assignment, date, decisions, blockers, known issues, latest test results, next actions. |
| `AGENT_WORK_LOG.md` | Role, assigned tasks, files modified, work done, tests, issues, handover, remaining work. |
| `GAME_DESIGN.md` | For each game: objective, rules, controls, levels, difficulty, scoring, win/loss, edge cases, UI, mobile behavior. |
| `LEVEL_PROGRESSION.md` | Unlock rules, completion requirements, difficulty scaling, thresholds, parameters, persistence, game-over, replay. |
| `DATABASE.md` | Tables, columns, relationships, constraints, indexes, RLS, RPCs, device identity, synchronization, recovery, migration history. |
| `SECURITY.md` | Threat model, anonymous access risks, API exposure, RLS, function permissions, validation, rate limiting, device-ID limits, secrets, score manipulation, retention. |
| `UI_DESIGN_SYSTEM.md` | Brand, palette, typography, spacing, breakpoints, component standards, button states, cards, animation, accessibility, mobile rules. |
| `TESTING_AND_QA.md` | Strategy, cases, unit/integration/e2e results, devices, browsers, accessibility, security review, open/resolved bugs, regression. |
| `DEPLOYMENT.md` | GitHub, env vars, Supabase, migrations, Vercel, deployment, PWA installation, production verification, rollback. |
| `CHANGELOG.md` | Chronological record of important changes. |
| `KNOWN_ISSUES.md` | Bug, severity, reproduction, modules, owner, status, resolution. |

Additional project documents (approved Phase 0 additions):

- `PROJECT_SPEC.md` — this frozen authoritative specification.
- `BUILD_JOURNEY.md` — how the project was built: steps, milestones, decisions, lessons. Must not duplicate specification content.
- `TASK_BREAKDOWN.md` — work breakdown structure with owners, dependencies, acceptance criteria.
- `README.md` — documentation index, content-ownership matrix, freeze rules.

Documentation rules:

- No vague statements such as "everything completed".
- Include actual details, affected pages/modules, and relevant files.
- Record important technical decisions.
- Record failed approaches where useful.
- Keep documentation synchronized with code.
- Never delete previous decisions without recording why they changed.
- Update `DEVELOPMENT_PROGRESS.md` and `AGENT_WORK_LOG.md` at the end of every development session.
- One fact has one canonical home; other documents link instead of duplicating.

## 6. BRAND IDENTITY AND SPLASH SCREEN

Brand name: **YASIR PLAYBOX**
Tagline: **"Your Personal Arcade."**

Premium gaming identity. The name must be clearly visible in the logo and splash screen.

Splash screen requirements:

- Display the YASIR PLAYBOX logo.
- Subtle logo reveal.
- Tasteful animated arcade-inspired visual.
- Short tagline.
- Smooth fade and scale transitions.
- Dark premium background.
- Consistent branding.
- No excessive effects.
- Respect `prefers-reduced-motion`.

Splash behavior:

- Shown on initial application loading where appropriate.
- Must not replay unnecessarily on every route navigation.
- Must never delay access to gameplay.
- Include a skip mechanism where appropriate.
- Must not block the interface when assets are slow.
- Respect browser and PWA lifecycle behavior.

The splash is a branding experience, not a loading excuse.

## 7. DESIGN SYSTEM AND UI/UX REQUIREMENTS

Dark-first premium visual identity.

Direction:

- Midnight background.
- Charcoal surfaces.
- Purple and electric-blue accents.
- Restrained gradients.
- Soft shadows.
- Subtle borders.
- Modern typography.
- Refined rounded corners.
- Smooth micro-interactions.

Avoid: generic admin dashboards, excessive neon, unnecessary glass effects, overcrowded screens, random spacing, inconsistent buttons, excessive animation, poor contrast, decorative clutter.

Global navigation:

- Desktop: premium sidebar or top navigation, main content area, clear categories, personal statistics.
- Mobile: compact top bar, touch-friendly game cards, bottom navigation where appropriate, safe-area spacing, no horizontal overflow.

Homepage must include:

1. Brand logo.
2. Animated welcome section.
3. Featured game.
4. Continue Playing.
5. All Games.
6. Daily Challenge.
7. Player level/progression summary.
8. Personal best scores.
9. Recent activity.
10. Achievement highlights.

The homepage must not be unnecessarily long; prioritize games and immediate play access.

Games library:

- Search.
- Category filters where relevant.
- Descriptions.
- Difficulty indicators.
- Current level.
- Best score.
- Progress indicators.
- Clear Play buttons.

Every individual game screen must include:

- Game title.
- Current level.
- Difficulty.
- Instructions.
- Start/Continue.
- Game area.
- Score.
- Progress information.
- Pause where appropriate.
- Restart.
- Result screen.
- Next Level when unlocked.
- Replay.
- Best score.

Statistics must display real stored values only: total games played, total completed levels, personal bests, per-game progress, recent activity, achievements. Fabricated statistics are prohibited.

## 8. GAME ENGINEERING AND LEVEL SYSTEM

All five games require real level progression. Changing only the level number is insufficient; difficulty must increase through measurable gameplay parameters.

Shared rules:

- Each game maintains its own progression.
- Level 1 is introductory.
- Levels become progressively harder.
- Each level has defined completion criteria.
- Success unlocks the next level; failure does not.
- Previously unlocked levels are replayable.
- Current level persists.
- Best score persists.
- Progress survives refresh.
- Level completion submissions are protected against duplicates.
- Difficulty remains within reasonable, playable limits.
- Use configurable difficulty curves, not arbitrary jumps.
- Use a centralized level-configuration system so tuning does not require rewriting game logic.
- Document a difficulty progression table per game.

## 9. INDIVIDUAL GAME SPECIFICATIONS

### 9.1 Reaction Rush

Objective: measure reaction speed to a visual signal.

Gameplay:

1. Intro screen.
2. Player starts.
3. Randomized wait.
4. Green signal.
5. Record response.
6. Detect false starts.
7. Show result.
8. Complete required rounds.
9. Calculate final score.
10. Determine level completion.

Progression: Level 1 uses five rounds and comfortable randomized intervals; higher levels add rounds, tighten timing, increase variation, and require better average thresholds. All parameters configurable.

Features: average, fastest, slowest reaction; false-start counter; personal record; level history; restart; result animations.

Timing: use `performance.now()` for measurement, not `setTimeout` execution time. Handle browser backgrounding and tab visibility changes.

### 9.2 Word Master

Objective: guess a hidden word with limited attempts.

Base rules: five-letter words; six attempts; correct position green; wrong position yellow; absent grey.

Progression: Level 1 uses common, simple words with helpful instructions and generous requirements. Higher levels use increasingly challenging but fair vocabulary and optional constraints/hints. Difficulty must not come from obscure or unfair words.

Features: curated dictionary; correct duplicate-letter evaluation; physical and on-screen keyboards; backspace; enter; permitted hints; level progress; daily challenge; practice mode; streak; shareable result.

Daily word selection must be deterministic; document timezone and date-boundary policy. Answer validation must be authoritative enough not to expose future daily answers unnecessarily.

### 9.3 Number Merge

Objective: merge matching numbered tiles.

Base: 4x4 grid.

Gameplay: move in four directions; merge matches; spawn only after valid moves; compute score; detect completion; detect no-more-moves.

Progression: Level 1 reach 128; Level 2 reach 256; Level 3 reach 512; Level 4 reach 1024; Level 5 reach 2048. Further levels introduce carefully designed variations such as target scores, move limits, or alternative board configurations. Higher levels must not depend entirely on luck.

Features: swipe; keyboard arrows; undo; restart; score; best score; tile animations; game-over state; level completion; mobile touch.

All movement directions and edge cases must be tested.

### 9.4 Memory Challenge

Objective: remember and reproduce an increasingly difficult sequence.

Gameplay: display pads; generate sequence; play sequence; wait for input; validate; increase difficulty after success; complete level requirements.

Progression: Level 1 four pads, short sequences, slow playback. Higher levels increase sequence length and reduce playback delays while maintaining enough delay for human reaction.

Features: sound effects; visual indicators; score; level; best sequence; combo; restart; pause where appropriate; vibration where supported. Handle browser audio initialization restrictions.

### 9.5 Neon Survival

Objective: survive by avoiding obstacles as long as possible.

Base: Canvas.

Gameplay: player-controlled character; obstacles; collision detection; increasing speed; power-ups; survival timer; score; game over.

Progression: Level 1 slow obstacles, low spawn frequency, simple movement. Higher levels increase obstacle speed and spawn rate, introduce patterns, reduce safe intervals, add optional power-ups, and demand longer survival. Curves are carefully tuned and must remain playable on mobile.

Technical requirements: `requestAnimationFrame`; delta-time movement; correct canvas scaling; device pixel ratio handling; collision detection; memory management; event-listener cleanup; animation-loop cleanup; visibility handling; touch and keyboard controls; pause/resume; restart; performance monitoring. Multiple simultaneous animation loops are prohibited.

## 10. PROGRESS AND DATABASE ARCHITECTURE

Supabase Free provides persistence. No authentication in Phase 1.

Anonymous device identity:

- Generate a random installation identifier with a cryptographically secure browser API.
- Store it locally.
- No personally identifying information.
- Never treat it as authentication.
- Never assume possession proves device or player ownership.

Local-first architecture:

1. Player starts game.
2. Game runs locally.
3. Progress calculated locally.
4. Local storage updated.
5. Completed level/score queued for sync.
6. If online, submit to Supabase.
7. If offline, retain in pending queue.
8. Retry safely when connectivity returns.

Versioned local data. Handle missing data, invalid JSON, corruption, old versions, duplicate submissions, interrupted sync, database downtime, and quota exhaustion.

Suggested tables:

- `device_progress`: installation ID, game ID, current unlocked level, highest completed level, best score, total games played, updated timestamp, schema version.
- `game_sessions`: session ID, installation ID, game ID, level, score, duration, result, completion timestamp.
- `achievements`: achievement ID, title, description, unlock criteria.
- `device_achievements`: installation ID, achievement ID, unlock timestamp.
- `game_definitions`: game ID, name, version, level-config version, active status.

Avoid unnecessary duplication of static data.

Security for anonymous access — assume attackers may generate identifiers, spoof scores, modify client logic, attempt unauthorized operations, and consume quotas. Mandatory protections:

1. RLS enabled on all exposed tables.
2. Service-role key never exposed.
3. Restricted public database permissions.
4. Narrowly scoped database functions.
5. Input type and range validation.
6. Game-ID and level-limit validation.
7. Payload-size validation.
8. Idempotency keys.
9. No unrestricted row updates.
10. No public unrestricted SELECT.
11. Restricted anonymous writes.
12. Reasonable request limits where supported.
13. Usage monitoring.
14. No private personal information.

RLS based only on a client-supplied device ID is not genuine ownership protection; it provides limited separation only. The system is convenience-based anonymous persistence, not tamper-proof competitive storage. Secure user-owned cloud progress requires Phase 2 authentication.

Database failure behavior:

- Games remain playable.
- Local progress remains available.
- Subtle sync status.
- Queue pending operations.
- Do not hammer the backend.
- Exponential backoff retry.
- Never erase local progress because of a failed request.
- Game completion never depends on database availability.

## 11. PHASE 2 AUTHENTICATION PREPARATION

Phase 1 excludes authentication. Architecture must remain ready for future expansion:

- Player progress independent of Supabase Auth.
- Game logic independent of identity.
- Persistence behind an abstraction.
- No hardcoded anonymous-identity assumptions across game modules.
- Document a guest-to-account migration strategy.

No login, signup, protected account pages, or authentication libraries in Phase 1 unless strictly required by an unrelated dependency.

## 12. PROGRESS TRACKING AND ACHIEVEMENTS

Shared progression system with: per-game levels, current unlocked level, completed levels, best scores, total games played, achievement unlocks, progress indicators, recent activity.

Example achievements: First Victory, Speed Demon, Word Wizard, Number Genius, Perfect Memory, Survivor, Consistency.

Achievement conditions derive from actual game results. Duplicate unlocks prevented. No fake progress.

## 13. MOBILE-FIRST PWA

Implement: web app manifest, icons, standalone display, launch presentation, service worker, offline asset caching, install instructions, theme colors, responsive navigation.

Test on Android Chrome and iOS Safari.

Requirements:

- Safe browser storage handling.
- No indiscriminate caching of private data.
- Service-worker updates must not break running games.
- App remains functional when reopened.
- Cache essential game assets.
- Avoid unnecessary network dependencies.
- Clear offline indicator when useful.

Offline play must work after app and required assets are cached. First-visit offline support must not be claimed.

## 14. PERFORMANCE AND CODE QUALITY

Use: TypeScript strict mode; clear module boundaries; reusable components; dynamic imports for heavy games; lazy loading; error boundaries; clean state management; appropriate hooks; efficient game loops; optimized assets.

Avoid: unnecessary client components, re-renders, dependencies, duplicated logic, monolithic components, memory leaks, unhandled promises, broad error suppression, and `any` as a shortcut.

All timers, listeners, audio contexts, and animation loops must be cleaned up.

## 15. ACCESSIBILITY AND USABILITY

Requirements: adequate contrast; keyboard navigation; visible focus; semantic HTML; accessible labels; screen-reader-friendly instructions; reduced motion; no color-only communication; adequate touch targets; clear errors; readable typography.

Every game must be understandable without guessing.

## 16. RESPONSIVE DESIGN TESTING

Viewports: 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 px.

Check: no horizontal scrolling; no clipped text; no overlapping controls; no cut-off buttons; no broken grids; correct canvas scaling; keyboard does not cover critical controls; navigation overflow; safe areas.

Mobile is the primary target; desktop layouts must not simply be scaled down.

## 17. INDEPENDENT QA AND SECURITY REVIEW

QA prepares a comprehensive test plan before implementations are finished.

Per game test: initial screen, start, gameplay, correct/incorrect input, rapid repeated input, pause/resume, restart, win, loss, unlock, difficulty increase, score calculation, personal best, refresh, local persistence, cloud sync, offline behavior.

Level tests: Level 1 playable; Level 2 unlocks only on valid completion; locked levels inaccessible through normal UI manipulation; difficulty increases correctly; parameters within bounds; replay works; failure does not unlock; refresh preserves progress; duplicate completion does not corrupt records.

Security review: environment variables; exposed credentials; RLS; RPC permissions; anonymous writes; SQL injection; input validation; stored data integrity; oversized payloads; repeated requests; device-ID spoofing; client-side score manipulation; cross-device limits. Anonymous scores must never be claimed cheat-proof.

UI tests: desktop, mobile, tablet, light/dark, loading, empty, error, long text, small screens, slow connections, reduced motion.

Automation: Vitest for logic, React Testing Library for components, Playwright for e2e, browser devtools for runtime errors, Lighthouse for performance/accessibility. Run lint, typecheck, tests, production build. Resolve critical/high defects before deployment. Do not hide failing tests.

## 18. ACCEPTANCE CRITERIA

Complete only when:

1. All five games are playable.
2. Each has functional levels.
3. Difficulty genuinely increases.
4. Progress survives refresh.
5. Cloud persistence works online.
6. Offline play works after caching.
7. Mobile controls work.
8. No critical console errors.
9. No broken navigation.
10. No decorative-only important buttons.
11. Required screens have loading, error, and empty states.
12. Production build succeeds.
13. Security review completed.
14. QA independently verified fixes.
15. Documentation current.
16. Deployment tested on the production URL.

Severity: P0 security/data loss/complete failure; P1 core game/progression broken; P2 significant UI/functionality/compatibility; P3 minor. P0/P1 block release. P2 must not be silently ignored. Accepted P3 issues documented.

## 19. DEPLOYMENT AND PRODUCTION

GitHub + Vercel.

Before deployment: inspect environment variables; verify Supabase URL and public anon key; service-role key never in client code; apply SQL migrations; verify RLS and functions; production build; tests; PWA configuration; offline caching; mobile layout.

After deployment: open actual production URL; test all games, progression, persistence, offline, mobile install; check console, network, database behavior, performance.

Provide deployment documentation and rollback instructions. Deployment must not be claimed unless performed.

## 20. DEVELOPMENT EXECUTION PHASES

- Phase 0: repository inspection and architecture.
- Phase 1: brand identity and design system.
- Phase 2: shared layout and navigation.
- Phase 3: homepage and game library.
- Phase 4: Reaction Rush.
- Phase 5: Word Master.
- Phase 6: Number Merge.
- Phase 7: Memory Challenge.
- Phase 8: Neon Survival.
- Phase 9: progression and achievements.
- Phase 10: Supabase anonymous persistence.
- Phase 11: PWA and offline support.
- Phase 12: comprehensive QA and security review.
- Phase 13: production deployment.
- Phase 14: final documentation and handover.

Independent tasks may run in parallel, but design system and game engine contracts are agreed before parallel implementation.

## 21. FINAL HANDOVER

Deliver: source code; architecture; five games; progression; difficulty scaling; Supabase migrations; RLS; PWA; automated tests; QA report; security report; performance report; known issues; deployment instructions; complete documentation; production URL if deployed; Phase 2 authentication plan.

Update every document before handover.

## 22. FINAL PRIORITIES

In order: correct functionality; data safety and security; stable progression; mobile usability; visual quality; performance; maintainability; complete documentation.

Forbidden: fabricating agents, files, tests, deployment, or verified results; leaving an attractive but incomplete prototype; adding auth or multiplayer in Phase 1; introducing mandatory paid services.

The final product must be a genuinely enjoyable, premium, reliable platform called YASIR PLAYBOX, playable on a mobile phone whenever needed.
