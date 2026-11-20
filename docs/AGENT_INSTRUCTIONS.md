# Agent Instructions — YASIR PLAYBOX

**Status:** ACTIVE — applies to every AI agent session from 2026-11-21 onward.
**Authority:** Project owner instruction. This file may be updated only by the owner or with explicit owner approval.

## 1. Git policy (binding)

The AI agent must **never** perform Git operations that modify the repository state or the staging area. This includes, without limitation:

- `git add`, `git stage`, `git rm --cached`, `git reset`, `git restore --staged`
- `git commit`, `git commit --amend`
- `git push`, `git push --force`, `git pull`, `git fetch` that writes refs
- `git merge`, `git rebase`, `git cherry-pick`, `git revert`
- `git stash`, `git checkout`, `git switch`, `git clean`, `git tag`
- Any `git` alias or wrapper that performs the above

Additional rules:

1. Do **not** stage or unstage any file.
2. Do **not** turn staged changes back into unstaged changes.
3. Do **not** move working-tree changes into the staging area.
4. Do **not** discard, overwrite, or revert any staged or unstaged user change.
5. Do **not** initialize, clone, or restructure repositories without explicit approval.
6. The owner performs all staging, committing, and pushing manually.
7. If a task appears to require a Git write operation, stop and ask the owner. Never "helpfully" commit.
8. Read-only inspection (e.g., reviewing a file) is acceptable, but agent workflows should avoid unnecessary Git commands entirely.
9. Never run scaffolding tools that auto-initialize Git or create commits (e.g., `create-next-app` defaults). Create files manually or use flags that guarantee no Git actions.

Violation handling: if a Git write ever happens accidentally, stop immediately, report exactly what ran, and do not attempt to repair the index without owner instruction.

## 2. Scope discipline

- Work only on the approved phase. Do not start the next phase without approval.
- Do not invent agents, files, tests, deployments, or results.
- Do not edit the frozen `PROJECT_SPEC.md`. Requirement changes go through `CHANGELOG.md` and an owner-approved amendment.
- Do not introduce paid services, paid dependencies, or upgrades.
- Do not add authentication, multiplayer, or out-of-scope games in Phase 1.

## 3. Documentation duties

- Update `DEVELOPMENT_PROGRESS.md` and `AGENT_WORK_LOG.md` after each work session.
- Record real commands and verification evidence.
- Keep `KNOWN_ISSUES.md` current; never delete history.
- Keep the content-ownership matrix in `README.md` valid; do not duplicate canonical content across documents.

## 4. Secret handling

- Never write secrets to tracked files.
- `.env.local` only; `.env.example` contains names only.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client or `NEXT_PUBLIC_*`.

## 5. Compliance log

| Date | Phase | Git actions | Note |
|---|---|---|---|
| 2026-11-21 | Phase 0 | `git init` only (owner-approved) | No commit, no push, no staging |
| 2026-11-21 | Phase 1 | **None** | No Git commands executed; files written to the working tree only |
| 2026-11-21 | Phase 2 | **None** | No Git commands executed; files written to the working tree only |

