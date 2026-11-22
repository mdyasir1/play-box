# Task Breakdown — YASIR PLAYBOX

> Completed work packages for the two-game rebuild. Status reflects verified
> artifacts, not intentions.

## Completed

| ID | Work package | Acceptance evidence | Status |
|---|---|---|---|
| R-01 | Replace the five-game scope with two games | Old source/tests removed; new structure documented | DONE |
| R-02 | Rebuild project structure | Next.js app routes for home, Zip, Maze Paint | DONE |
| R-03 | Generate Zip levels | 100 levels in `src/games/zip/levels.ts` | DONE |
| R-04 | Validate Zip levels | Hamiltonian and checkpoint tests pass | DONE |
| R-05 | Generate Maze Paint levels | 100 levels in `src/games/maze-paint/levels.ts` | DONE |
| R-06 | Validate Maze Paint levels | BFS shortest-solution replay tests pass | DONE |
| R-07 | Implement Zip engine | Start, extend, order, backtrack, validation tests pass | DONE |
| R-08 | Implement Maze Paint engine | Slide, paint, complete, controls, replay tests pass | DONE |
| R-09 | Implement local progress | Versioned parse/save/merge tests pass | DONE |
| R-10 | Build home page | Two games, progress summary, rules, links | DONE |
| R-11 | Build app shell | Responsive header, nav, footer, skip link | DONE |
| R-12 | Build Zip interface | Drag/tap/keyboard board, side stats, undo/restart | DONE |
| R-13 | Build Maze Paint interface | Swipe/D-pad/keyboard board, side stats, undo/restart | DONE |
| R-14 | Build level picker | 100-level modal for each game | DONE |
| R-15 | Build result flow | Next/replay/levels with score stats | DONE |
| R-16 | Hydration-safe level restore | Saved level does not switch board during dialog | DONE |
| R-17 | Keyboard/dialog isolation | Maze input ignored while picker/dialog is open | DONE |
| R-18 | Responsive hardening | 320 px overflow tests pass; wordmark hidden | DONE |
| R-19 | Accessibility hardening | Axe serious/critical count is zero | DONE |
| R-20 | Browser test suite | 17 Playwright cases pass | DONE |
| R-21 | Unit test suite | 5 files, 30 tests pass | DONE |
| R-22 | Build and dependency cleanup | Build passes; audit is clean; unused deps removed | DONE |
| R-23 | Documentation rewrite | Current docs match the two-game build | DONE |

## Release gates

| Gate | Requirement | Status |
|---|---|---|
| G1 | Lint, typecheck, unit tests | PASS |
| G2 | Production build | PASS |
| G3 | Browser flow, persistence, overflow | PASS |
| G4 | Accessibility scan | PASS |
| G5 | Dependency audit | PASS |
| G6 | Owner review and commit | Waiting on owner |

## Explicitly not planned

- Additional games.
- Accounts or cloud sync.
- Achievements, leaderboards, daily challenges.
- PWA install or offline cache.
- Paid services or analytics.
- Native mobile applications.

Any of these requires a new owner decision, a specification update, and a new
plan.
