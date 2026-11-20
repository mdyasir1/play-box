# Project Overview — YASIR PLAYBOX

> Product summary. The authoritative requirements are in `PROJECT_SPEC.md`; this file does not add requirements.

## Identity

- **Name:** YASIR PLAYBOX
- **Tagline:** Your Personal Arcade.
- **Category:** Premium single-player browser gaming platform / installable PWA.
- **Primary device:** Modern mobile phone; desktop and tablet supported.

## Purpose

YASIR PLAYBOX gives one player a polished, dependable arcade of five skill games with meaningful level progression that is remembered between sessions. It must feel like a designed product, not a demo gallery: consistent branding, real difficulty curves, real saved progress, and no dead controls.

## Product vision

A personal pocket arcade that opens instantly, works offline after first load, respects the player's attention, and rewards improvement. The platform should be usable indefinitely without a paid subscription or account. Cloud synchronization is a convenience layer, never a prerequisite to play.

## Audience and usage context

- A single player on a phone, often one-handed, possibly on a slow or unstable connection.
- Short sessions (1–10 minutes) with persistent progress.
- No social features, no accounts, no personal data.

## Games

| Game | Core loop | Primary skill |
|---|---|---|
| **Reaction Rush** | Wait for the signal, tap as fast as possible across several rounds | Reaction time and restraint (false starts) |
| **Word Master** | Guess a five-letter word in six attempts | Vocabulary and deduction |
| **Number Merge** | Slide and merge tiles toward a target | Planning and spatial reasoning |
| **Memory Challenge** | Reproduce a growing pad sequence | Short-term memory and rhythm |
| **Neon Survival** | Dodge obstacles for a survival duration | Motor control and focus |

Each game exposes: title, level, difficulty label, instructions, start/continue, live score/progress, pause where relevant, restart, result screen, next-level/replay, best score.

## Platform experience

1. **First launch:** branded splash (short, skippable, reduced-motion aware) → homepage.
2. **Homepage:** featured game, continue playing, all games, daily challenge, progression summary, best scores, recent activity, achievement highlights.
3. **Library:** search, filters, descriptions, difficulty, current level, best score, progress, play access.
4. **Game:** clear instructions and controls tuned for touch first.
5. **Result:** outcome, score, whether the next level unlocked, replay.
6. **Progress:** levels and best scores persist locally; sync to the cloud opportunistically.
7. **Statistics:** totals and achievements derived from stored results only.
8. **Offline:** playable after assets are cached; queued results sync later; subtle sync/offline status.

## Features (as specified)

- Five complete single-player games.
- Real level progression with measurable difficulty increase.
- Local-first persistence with anonymous cloud backup (Supabase Free).
- Achievements and personal statistics.
- Daily challenge (Word Master daily word; homepage daily entry).
- PWA install, standalone launch, offline asset caching.
- Responsive, mobile-first layout with safe-area support.
- Reduced-motion support and keyboard/touch parity.

## Scope boundaries

**In scope:** the five games, shared progression, achievements, anonymous persistence, PWA, QA, deployment.

**Out of scope in Phase 1:** authentication, accounts, multiplayer, PvP, chat, mini battle, tic-tac-toe, rock-paper-scissors, paid services, paid analytics, cloud storage beyond persistence needs.

## Technology stack (planned, pinned in Phase 1)

- Next.js (App Router), React, TypeScript strict.
- Tailwind CSS, shadcn/ui primitives, Lucide icons.
- Motion for React for UI animation; GSAP only if justified; React Bits only if a component is genuinely reused.
- HTML Canvas for Neon Survival; no game engine unless justified.
- Supabase Free (Postgres + RPCs) for optional cloud sync.
- Vitest, React Testing Library, Playwright.
- GitHub Free + Vercel Hobby (subject to eligibility).
- npm as the package manager (only installed manager in the environment).

## Zero-budget constraint

The application must remain fully usable with no mandatory paid service. Free-tier quotas (Supabase, Vercel) are treated as finite: validated narrow RPCs, idempotent submissions, backoff, and no high-frequency polling. No paid API, library, auth provider, engine, analytics, or image generation may be introduced.

## Definition of success

A player can install the app, play all five games across multiple levels, see difficulty genuinely rise, close the browser, reopen it, and find their progress intact — online or offline — with no fabricated data and no critical defects. See `PROJECT_SPEC.md` §18 for the binding acceptance criteria.

## Related documents

- Requirements: `PROJECT_SPEC.md`
- Architecture: `ARCHITECTURE.md`
- Game rules: `GAME_DESIGN.md`
- Levels: `LEVEL_PROGRESSION.md`
- Delivery plan: `TASK_BREAKDOWN.md`
