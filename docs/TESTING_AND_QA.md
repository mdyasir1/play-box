# Testing & QA — YASIR PLAYBOX

> Canonical record of executed verification. Results below were produced on
> 2026-11-22 in the project workspace with the current source tree.

## 1. Execution summary

| Gate | Status | Evidence |
|---|---|---|
| Lint | **PASS** | `npm run lint` exits 0 with no warnings |
| Typecheck | **PASS** | `npm run typecheck` exits 0 |
| Unit tests | **PASS** | `npm test`: 5 files, 30 tests |
| Production build | **PASS** | `npm run build`: home, both games, icon prerendered |
| Browser tests | **PASS** | `npm run test:e2e`: 17 Playwright tests |
| Accessibility | **PASS** | Axe: zero serious/critical on 3 routes + dialogs |
| Narrow layout | **PASS** | Home, Zip, Maze Paint at 320 px: no horizontal overflow |
| Dependency audit | **PASS** | `npm audit`: 0 vulnerabilities |
| Deployed smoke | NOT RUN | No deployment configured |
| Physical device pass | NOT RUN | Chromium emulation only |

## 2. Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit
```

Playwright builds and starts the production server on port 3100, so the browser
suite exercises the shipped output rather than the development server.

## 3. Unit tests

| File | Focus |
|---|---|
| `src/games/zip/engine.test.ts` | Start validation, adjacency, reuse, checkpoint order, backtracking, completion, error messages |
| `src/games/zip/levels.test.ts` | Exactly 100 levels, unique ids/numbers, complete Hamiltonian solutions, checkpoint placement, adjacency |
| `src/games/maze-paint/engine.test.ts` | Sliding, blocked moves, painting, floor counts, completion, key/swipe mapping, undo history inputs |
| `src/games/maze-paint/levels.test.ts` | Exactly 100 solvable levels, dimensions, closed borders, floor ranges, shortest-solution replay, layout variety |
| `src/lib/progress.test.ts` | Defaults, parsing, corrupt data, score/clamping rules, completion merge, current level |

Coverage tooling is configured with `npm run test:coverage`. Coverage percentage
is not claimed in this document because it was not used as a release gate.

## 4. Browser tests

### Home (`tests/e2e/home.spec.ts`)

- Both game links and both game cards exist.
- Heading, lineup, saved-locally copy, and 200-level framing render.
- No horizontal overflow at 320 px.

### Zip (`tests/e2e/zip.spec.ts`)

- Complete level 1 through the stored 16-cell solution.
- Completion dialog appears.
- localStorage stores completion, best time, and current level 2.
- Replay clears the result and restores the initial state.
- Reload restores level 2.
- Invalid first cell reports the correct message and keeps filled count 0.
- **Next level** advances to level 2 and resets the board.
- **Levels** opens the picker from the result dialog; closing it leaves the
  completed board and completion status visible.
- Level picker opens and selects level 50.
- Level 50 survives a reload.
- No horizontal overflow at 320 px.

### Maze Paint (`tests/e2e/maze-paint.spec.ts`)

- Complete level 1 through the stored keyboard solution.
- Completion dialog appears.
- localStorage stores completion, par score, and current level 2.
- Replay clears the result and restores the start state.
- Reload restores level 2.
- Blocked direction surfaces the warning.
- **Next level** advances to level 2.
- Opening the level picker and pressing an arrow key does not move the board.
- Level 100 is reachable and survives a reload.
- No horizontal overflow at 320 px.

### Accessibility (`tests/e2e/accessibility.spec.ts`)

- Axe WCAG A/AA scan on `/`.
- Axe scan on `/games/zip`.
- Axe scan on `/games/maze-paint`.
- Axe scan with the Zip level picker open and with the result dialog open.
- Only serious and critical violations fail the suite; the current result is
  zero.

## 5. Responsive checks

Browser tests set a 390×844 mobile viewport for flow tests and a 320×760
viewport for overflow tests. The measured page overflow must be at most 1 px.

Manual screenshot review covered desktop and mobile home, Zip, Maze Paint,
level picker, and result dialog. One real issue was found and fixed: the hero
glow and header wordmark overflowed at 320 px. Another was fixed when the level
picker's dimension labels failed color contrast.

## 6. Build verification

`npm run build` succeeds with Next.js 16.4.6 and Turbopack. Routes:

```text
/                    static
/_not-found          static
/games/maze-paint    static
/games/zip           static
/icon.svg            static
```

## 7. Security verification

- `npm audit`: zero vulnerabilities.
- Security headers configured in `next.config.ts`.
- No environment variables required.
- No Supabase URL or keys present in the current app configuration.
- `grep` confirmed no imports of removed packages (`motion`, `server-only`,
  `@radix-ui/react-slot`, `class-variance-authority`).

## 8. Not run / limitations

| Item | Status | Reason |
|---|---|---|
| Firefox/WebKit Playwright projects | Not configured | Chromium is the current release gate |
| Physical iOS/Android pass | Not run | No device access in the environment |
| Screen-reader manual pass | Not run | Automated axe only |
| Lighthouse/Core Web Vitals | Not run | No deployed URL |
| Deployed production smoke | Not run | No hosting configured |
| Coverage threshold gate | Not enforced | Tests are behavior-focused; no target was set |

These limitations are also recorded in `KNOWN_ISSUES.md`.
