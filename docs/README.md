# YASIR PLAYBOX — Documentation Index

**Product:** YASIR PLAYBOX — "Your Personal Arcade."
**Version:** 2.0.0
**Status:** Login-first two-game arcade, 200 levels each, light/dark themes, Supabase-ready.
**Scope:** Zip and Maze Paint; sequential unlock; local-first with optional Supabase sync.

## Scope change

The project owner replaced the previous five-game plan with a focused two-game
build on 2026-11-22. The old source, tests, and plans were removed. References
to a frozen five-game specification and Supabase persistence are historical
only. The current authority is `PROJECT_SPEC.md` version 2.0.

The freeze protocol is retired. `docs/.freeze/PROJECT_SPEC.sha256` is an
unmodified historical record and no longer matches the current specification.

## Current documents

| Document | Canonical content |
|---|---|
| `AGENT_INSTRUCTIONS.md` | Binding no-Git-write policy and agent process rules |
| `PROJECT_SPEC.md` | Current two-game product requirements and acceptance criteria |
| `PROJECT_OVERVIEW.md` | Product summary for new readers |
| `ARCHITECTURE.md` | Modules, data flow, persistence, and testing boundaries |
| `GAME_DESIGN.md` | Zip and Maze Paint rules, controls, and edge cases |
| `LEVEL_PROGRESSION.md` | Level distributions, scoring, and progression semantics |
| `UI_DESIGN_SYSTEM.md` | Tokens, typography, components, responsive rules, accessibility |
| `DATABASE.md` | Local-only persistence schema; why Supabase is not used |
| `SECURITY.md` | Local-only threat model and controls |
| `TESTING_AND_QA.md` | Executed unit, browser, accessibility, build, and audit results |
| `DEPLOYMENT.md` | Build and hosting runbook with no environment variables |
| `DEVELOPMENT_PROGRESS.md` | Current completion snapshot and evidence |
| `TASK_BREAKDOWN.md` | Completed implementation work packages |
| `CHANGELOG.md` | Version history; earlier entries are historical |
| `KNOWN_ISSUES.md` | Current limitations and accepted risks |
| `AGENT_WORK_LOG.md` | Session log; earlier sessions are historical |
| `BUILD_JOURNEY.md` | How the rebuild was planned and delivered |

## Content ownership rules

1. One fact has one canonical home; other documents link to it.
2. Every completion claim must name a command, test, or artifact.
3. Do not describe unbuilt features as complete.
4. Requirements changes are recorded in `CHANGELOG.md` and `PROJECT_SPEC.md`.
5. Old five-game sections are retained only as clearly labelled history.

## Manual Git control

Per the owner's binding instruction, the AI agent must never stage, unstage,
commit, push, reset, restore, or otherwise write to Git. The owner performs all
Git operations manually. See `AGENT_INSTRUCTIONS.md` section 1.

## Start here

- Product: `PROJECT_OVERVIEW.md`
- Requirements: `PROJECT_SPEC.md`
- Architecture: `ARCHITECTURE.md`
- Verification: `TESTING_AND_QA.md`
- Current status: `DEVELOPMENT_PROGRESS.md`
