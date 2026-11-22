# Level Progression — YASIR PLAYBOX

> Canonical level counts, difficulty curves, scoring, and persistence rules.

## 1. Level inventory

| Game | Levels | Sizes | Locked? |
|---|---|---|---|
| Zip | 100 | 4×4 to 8×8 | No |
| Maze Paint | 100 | 6×6 to 8×8 | No |
| **Total** | **200** | — | — |

Every level is available from the first visit. There is no star gate, timer
gate, sequential unlock, or artificial currency.

## 2. Zip curve

| Levels | Grid | Checkpoints | UI tier |
|---|---|---|---|
| 1-10 | 4×4 | 4-5 | Warm-up |
| 11-30 | 5×5 | 4-5 | Easy |
| 31-55 | 6×6 | 4-5 | Steady |
| 56-80 | 7×7 | 4-5 | Tricky |
| 81-100 | 8×8 | 4-5 | Expert |

- Each level stores a complete Hamiltonian path, verified by unit tests.
- Checkpoints are placed along that path, with the first at the start and the
  last at the end.
- Difficulty grows through grid size and path complexity, not through hidden
  rules.

## 3. Maze Paint curve

| Levels | Size | Target floor cells | UI tier |
|---|---|---|---|
| 1-15 | 6×6 | 9 upward, capped at 14 | Warm-up |
| 16-50 | 7×7 | scales toward 19 | Steady |
| 51-100 | 8×8 | scales toward 19 | Tricky |

- Floor target increases gradually from 9 to 19 across the 100 levels.
- Stored levels have 9-19 floor tiles.
- Par is the number of moves in the shortest solution found by BFS over
  `(position, painted-tile-set)` states.
- Stored level pars are in the 4-14 range.
- The generated roster has more than 80 distinct layouts.

## 4. Difficulty labels

### Zip (`zipTier`)

| Grid | Label |
|---|---|
| 4 | Warm-up |
| 5 | Easy |
| 6 | Steady |
| 7 | Tricky |
| 8 | Expert |

### Maze Paint (`mazeTier`)

| Size | Label |
|---|---|
| 6 | Warm-up |
| 7 | Steady |
| 8 | Tricky |

Labels are informational. They do not gate access.

## 5. Scoring

### Zip

- Metric: elapsed time in seconds.
- Starts when the first cell is accepted.
- Minimum stored value: 1 second.
- Best score is the smallest recorded time for that level.

### Maze Paint

- Metric: number of effective slides.
- Blocked attempts and undo steps do not increase the score.
- Best score is the smallest recorded move count for that level.
- Par is shown separately as the generator's shortest route.

## 6. Completion and current level

- Completing level N adds N to the game's completed list if missing.
- If the score beats the stored score, or no score exists, it becomes the best.
- The saved current level becomes `max(previous current, min(N + 1, 100))`.
- Completed levels remain accessible and replayable.
- Replaying or selecting an earlier level does not erase completion history.
- Selecting any level updates the saved current level to that selection.

## 7. Persistence

- localStorage key: `playbox.v3.progress`.
- Version: `3`.
- Per game:
  - `completed`: sorted, de-duplicated level numbers from 1 to 100.
  - `bestScores`: object keyed by level number with finite non-negative scores.
  - `lastLevel`: integer from 1 to 100.
- Invalid levels, duplicate entries, non-finite scores, wrong versions, and
  malformed JSON are discarded or replaced with safe defaults.
- No expiration, account, or network sync exists.

## 8. Content generation and verification

`script/generate-levels.mjs` produces deterministic level modules using seeded
randomness.

- Zip: snake path → seeded 2-opt → Hamiltonian validation → checkpoint choice.
- Maze Paint: seeded frontier carving → state-space BFS solver → emit only if a
  complete shortest solution exists.
- Runtime imports the committed data; it does not generate or solve levels.

Verification is covered by `src/games/zip/levels.test.ts` and
`src/games/maze-paint/levels.test.ts`.
