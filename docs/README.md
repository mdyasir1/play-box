# YASIR PLAYBOX — Documentation Index

**Project:** YASIR PLAYBOX — "Your Personal Arcade."
**Current phase:** Phase 0 complete (documentation and architecture). No application code exists yet.
**Frozen specification:** `docs/PROJECT_SPEC.md` v1.0
**Frozen hash:** `ef76a2655afa94b19b79d7f95782499767693505a08ede1d84592b59cc97bd33`

## Documents

| Document | Canonical content | Must NOT contain |
|---|---|---|
| `PROJECT_SPEC.md` | Authoritative product requirements (frozen) | Progress, test results, journey, implementation notes |
| `PROJECT_OVERVIEW.md` | Product summary for new readers | New requirements, progress, bug tracking |
| `ARCHITECTURE.md` | System/module architecture, data flow, contracts, ADRs | Game rules, level numbers, progress percentages |
| `GAME_DESIGN.md` | Per-game objective, rules, controls, UI, edge cases | Level curves/thresholds (canonical in LEVEL_PROGRESSION) |
| `LEVEL_PROGRESSION.md` | All level curves, unlock rules, scoring, persistence semantics | Game tutorial content, bug tracking |
| `UI_DESIGN_SYSTEM.md` | Brand, tokens, typography, components, animation, accessibility | Screenshots/status claims |
| `DATABASE.md` | Schema, constraints, RLS, RPCs, migrations, sync design | Narrative project history |
| `SECURITY.md` | Threat model, controls, accepted risks, retention | Feature requirements duplication |
| `TESTING_AND_QA.md` | Test strategy, cases, executed results, regression history | Live bug ownership ledger (use KNOWN_ISSUES) |
| `DEPLOYMENT.md` | Account setup, env vars, migrations, deploy, rollback, verification | Development progress |
| `DEVELOPMENT_PROGRESS.md` | Current phase snapshot, honest percentage, tasks, blockers, next actions | Historical narrative (use BUILD_JOURNEY) |
| `AGENT_WORK_LOG.md` | Per-session role assignments, files touched, handover | Product requirements |
| `BUILD_JOURNEY.md` | How the project was built: steps, milestones, decisions, lessons | Specification restatement, duplicate design docs |
| `TASK_BREAKDOWN.md` | WBS: task IDs, owners, dependencies, acceptance criteria | Completed-result claims |
| `CHANGELOG.md` | Dated, versioned change entries | Current status, task planning |
| `KNOWN_ISSUES.md` | Live defect/limitation ledger | Test plans, architecture |

## Content ownership rules

1. One fact has one canonical home. Other documents link to it.
2. `PROJECT_SPEC.md` is immutable. It is never edited, even for typos, without an explicit unfreeze decision recorded in `CHANGELOG.md`.
3. Requirement changes after freeze are recorded in `CHANGELOG.md` plus an append-only amendment document approved by the project owner.
4. A document must not copy another document's section wholesale.
5. Every claim of completion must name the verified artifact or command output.

## Freeze protocol

- The spec was hashed with SHA-256 and marked read-only on Windows (`attrib +R`).
- The hash record is `.freeze/PROJECT_SPEC.sha256`.
- Verify from `docs/`:

```bash
sha256sum -c .freeze/PROJECT_SPEC.sha256
```

PowerShell alternative:

```powershell
Get-FileHash docs\PROJECT_SPEC.md -Algorithm SHA256
```

- The recorded hash must match. If it does not, the spec was modified and the change must be investigated before any release.
- To read the spec despite the read-only flag, do not clear the flag; copy it if a working reference is needed.

## Role emulation disclosure

The build environment exposes one read-only exploration sub-agent, not eight writing agents. The eight required roles are therefore executed as sequential work packages by the main agent, with separate review/QA passes. `AGENT_WORK_LOG.md` records this honestly. No document may claim that specialized agents exist when they do not.

## Start here

- Product: `PROJECT_OVERVIEW.md`
- Requirements: `PROJECT_SPEC.md`
- Plan and tasks: `TASK_BREAKDOWN.md`, `DEVELOPMENT_PROGRESS.md`
- How decisions were made: `BUILD_JOURNEY.md`
