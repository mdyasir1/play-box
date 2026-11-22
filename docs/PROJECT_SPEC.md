# Project Specification — Yasir's Play-Box

> Current release is v2.0.0: 200 levels per game, login-first access, Supabase/Prisma sync, light/dark themes. Older sections below describe the 1.0 local-only release and are retained as history.

**Version:** 2.0
**Date:** 2026-11-22
**Status:** Current and implemented.
**Owner direction:** Replace the retired five-game plan and all previous source
code with exactly two games, 100 levels each, local progress, and a polished,
safe interface.

This document supersedes `PROJECT_SPEC.md` version 1.0. The previous frozen
scope, phase plan, Supabase sync design, and five-game roster are retired.

## 1. Product

YASIR PLAYBOX is a private, single-player browser arcade containing two focused
puzzle games:

1. **Zip** — draw one continuous path through every cell of a grid, visiting
   numbered checkpoints in order.
2. **Maze Paint** — slide a roller until it hits a wall, painting every open
   tile, with the goal of covering the whole maze.

The app must be immediately playable, mobile-first, keyboard-friendly, and
usable without an account, network API, database, or paid service.

## 2. Goals

- Ship exactly two complete games, not a demo or placeholder gallery.
- Provide 100 genuinely playable levels per game, with verified solutions.
- Save completion, best score, and current level locally between sessions.
- Make every level available from the start; no unlock gating or fake timers.
- Keep the interface calm, legible, responsive, and accessible.
- Keep the dependency surface small and the runtime local-only.
- Verify behavior with unit tests, browser tests, accessibility checks, a
  production build, and a dependency audit.

## 3. Non-goals

- Accounts, authentication, profiles, or personal data.
- Cloud sync, Supabase, a database, or any server-side persistence.
- Multiplayer, chat, social features, or leaderboards.
- More games, daily challenges, achievements, or PWA/offline behavior.
- Paid services, telemetry, advertising, or third-party analytics.
- Native apps or a game engine.

## 4. Functional requirements

### 4.1 Home

- Show the two games, their rules summary, and the total level count (200).
- Show completed counts, best-per-level availability, and current level.
- Link to both game routes.
- Show honest saved-locally messaging.
- Show no fabricated progress before localStorage is loaded.

### 4.2 Zip

- Render a square grid with 4 to 5 numbered checkpoints.
- Start only from checkpoint 1.
- Extend only to orthogonally adjacent cells that are not already used.
- Reject a checkpoint visited out of order.
- Re-entering the previous cell backtracks one step; Undo also backtracks.
- Complete only when every grid cell is used exactly once and all checkpoints
  were visited in ascending order.
- Support pointer drag, individual taps, and keyboard activation of cells.
- Show filled count, next checkpoint, elapsed time, and best time.

### 4.3 Maze Paint

- Render a square maze with closed borders, floor cells, and one start tile.
- Each move slides until a wall or border stops the roller.
- Every floor tile crossed is painted, including the starting tile.
- A blocked move changes nothing and reports a visible status message.
- Complete when every floor tile has been painted.
- Support swipe, on-screen direction buttons, arrow keys, and WASD.
- Show painted count, moves versus par, elapsed time, and best moves.
- Undo restores the previous position, painted set, and move count.

### 4.4 Level picker

- Expose all 100 levels for each game.
- Show current, completed, and incomplete states.
- Show grid dimensions for Zip and maze dimensions for Maze Paint.
- Selecting a level updates the board and persists it as the current level.
- Close by button, Escape, or overlay click.

### 4.5 Result flow

- Report level completion, a short summary, and per-level statistics.
- Offer **Next level**, **Replay**, and **Levels**.
- Replaying resets the board but keeps saved progress.
- Closing the dialog leaves the completed board visible.
- The final level omits the next-level action.

### 4.6 Progress

- Storage key: `playbox.v3.progress`.
- Store version, both games, completed level numbers, best scores, current
  level, and an update timestamp.
- Validate and clamp loaded data; corrupt or unknown data falls back safely.
- Save completion and level selection immediately.
- Never require a network request.

### 4.7 Input and accessibility

- Pointer, touch, and keyboard must all be usable.
- Dialog focus is trapped and returned by Radix Dialog.
- Status changes use `role="status"` and `aria-live="polite"`.
- Interactive cells and controls have accessible names.
- Reduced-motion preferences disable non-essential animation.
- Keyboard focus is always visible.

## 5. Quality requirements

- No horizontal page overflow at 320 px width.
- Readable typography and AA contrast for interactive content.
- No serious or critical axe violations on home, game pages, level picker, or
  result dialog.
- Build, typecheck, lint, unit tests, and Playwright tests must pass.
- No known critical defects at handover.

## 6. Content requirements

- Zip: 100 levels, sizes 4×4 through 8×8, each backed by a complete
  Hamiltonian solution path with 4-5 ordered checkpoints.
- Maze Paint: 100 levels, sizes 6×6 through 8×8, each solvable, with par equal
  to the shortest generated solution.
- Level data is deterministic and committed; the generator is a development
  script, not a runtime dependency.
- Unit tests validate every stored solution.

## 7. Technical constraints

- Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS 4.
- Client-side game state and localStorage only.
- npm; Node >= 20.9.
- No Supabase credentials are required. `DATABASE.md` explains why.
- No Git write operations by the agent.

## 8. Acceptance criteria

The build is accepted when all of the following are true:

1. `npm run lint` exits successfully.
2. `npm run typecheck` exits successfully.
3. `npm test` passes all unit tests.
4. `npm run build` produces the home page, both game routes, and the icon.
5. `npm run test:e2e` passes the full Playwright suite.
6. Both first levels can be completed in a real browser.
7. Progress persists across a page reload.
8. The level picker reaches level 50 and level 100.
9. Result-dialog actions advance, replay, and open the picker.
10. Opening the level picker does not move the Maze Paint board via keyboard.
11. Home, both games, and the level picker have no serious axe violations.
12. Home and both game pages do not overflow at 320 px.
13. `npm audit` reports zero vulnerabilities.
