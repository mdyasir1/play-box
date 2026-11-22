# Architecture — YASIR PLAYBOX

> Current architecture for the two-game rebuild. Game rules live in
> `GAME_DESIGN.md`; level data lives in `LEVEL_PROGRESSION.md`.

## Stack

- Next.js 16.4.6 with the App Router and Turbopack build.
- React 19.3.1 with client components for interactive game pages.
- TypeScript 5.9.3 in strict mode with `noUncheckedIndexedAccess`.
- Tailwind CSS 4.3.5 with semantic CSS variables.
- Radix Dialog for modal behavior.
- Lucide React for icons.
- Vitest 5.1.1 and Playwright 1.65.1 for verification.
- No runtime backend, database, API route, or environment variable.

## Source layout

```text
src/
  app/
    layout.tsx                 Root metadata, fonts, app shell
    page.tsx                   Home page (client: progress display)
    games/zip/page.tsx         Zip route
    games/maze-paint/page.tsx  Maze Paint route
    error.tsx, loading.tsx, not-found.tsx
  components/
    app-shell.tsx              Header, navigation, footer, skip link
    game-page-shell.tsx        Header + board + side rail layout
    game-header.tsx            Level navigation and level picker trigger
    level-picker.tsx           100-level modal grid
    result-dialog.tsx          Completion actions and statistics
    zip-board.tsx              Zip grid, path rendering, drag mapping
    zip-game.tsx               Zip state, scoring, progress integration
    maze-board.tsx             Maze rendering, swipe handling
    maze-paint-game.tsx        Maze state, scoring, keyboard integration
    ui/                        Button, Card, Modal, ProgressBar
  games/
    zip/{types,engine,levels,test files}
    maze-paint/{types,engine,levels,test files}
  lib/
    games.ts                   Game catalog and level counts
    progress.ts                Versioned localStorage schema and helpers
    use-progress.ts            Client hydration and save callbacks
    level-meta.ts              Difficulty tier labels
    format.ts                  Time and score formatting
    utils.ts                   clsx + tailwind-merge helper
script/
  generate-levels.mjs          Deterministic level generator and validator
tests/
  setup.ts                     Vitest setup
  e2e/                         Playwright browser and accessibility suites
```

## Rendering boundaries

- Static routes render the shell and a stable first frame on the server.
- Game pages are client components because they own interactive state.
- `useProgress` starts with valid default progress, then hydrates from
  localStorage after mount. Games wait for `ready` before restoring a saved
  level so the server and client first render match.
- The level is selected once per session into `selectedLevel`; completing a
  level updates saved progress without replacing the board behind the dialog.

## Game engines

Engines are pure TypeScript functions without React or storage dependencies.

### Zip

`beginZip` validates the start. `extendZip` validates adjacency, reuse, and
checkpoint order. `validateZipSolution` checks the complete Hamiltonian
solution. `ZipGame` owns the React state, history, timer, and result flow.

### Maze Paint

`slideMaze` computes a full slide, its painted set, and whether movement
occurred. `mazeIsComplete` compares painted floor count with total floor count.
`MazePaintGame` owns position history, move count, timer, keyboard listener,
and result flow.

## Data flow

```text
User input
  -> board component
  -> pure move result
  -> game component state + refs
  -> localStorage save (on completion or level selection)
  -> home page progress summary on next load
```

Refs mirror mutable state that must be read inside pointer, keyboard, or timer
callbacks without stale closures. React state remains the render source.

## Persistence

- Key: `playbox.v3.progress`.
- Version: `3`.
- Games: `zip` and `maze-paint`.
- Per game: sorted completed level list, best score map, current level.
- Parsing rejects corrupt JSON, wrong versions, invalid level numbers, and
  non-finite scores. The app falls back to clean defaults.
- Writes are synchronous localStorage calls; failures are ignored safely.

## Level generation

`script/generate-levels.mjs` is deterministic:

1. Zip paths start from a snake Hamiltonian path, receive seeded 2-opt
   improvement, are validated for adjacency and coverage, then get 4-5 spaced
   checkpoints.
2. Maze layouts are carved with a seeded randomized frontier, then solved with
   BFS over `(position, painted-mask)` states. A level is emitted only when a
   complete shortest solution exists.
3. Generated TypeScript modules are committed. Runtime never runs the solver.

## Styling and components

- `globals.css` defines brand colors, fonts, focus rings, reduced-motion rules,
  keyframes, and background atmosphere.
- Shared UI primitives live in `src/components/ui`.
- Game layouts use `GamePageShell`: a board column and a 340 px side rail on
  desktop, stacked on smaller screens.
- No CSS-in-JS runtime and no animation library.

## Error boundaries

- `error.tsx` offers retry and home actions.
- `not-found.tsx` offers home and Zip actions.
- `loading.tsx` supplies a skeleton.
- Unknown routes are handled by Next.js.

## Security boundaries

- No secrets, API keys, database, or server actions.
- Security headers are set in `next.config.ts`: CSP, nosniff, frame denial,
  referrer policy, permissions policy, cross-origin policies, and HSTS in
  production.
- Fonts are self-hosted through `next/font`.
- The only stored data is non-sensitive game progress.

## Testing boundaries

- Unit tests cover engines, level integrity, and progress parsing/merging.
- Playwright covers real production output: completion, persistence, level
  picker, next-level actions, keyboard blocking, narrow layout, and axe.
- The production build is the Playwright web server, so route and hydration
  behavior are tested as shipped.
- ESLint disables `react-hooks/set-state-in-effect` only for
  `src/lib/use-progress.ts`, `src/components/zip-game.tsx`, and
  `src/components/maze-paint-game.tsx`. Those effects synchronize localStorage
  hydration and reset board state when the selected level changes; they are
  intentional and covered by browser tests.
