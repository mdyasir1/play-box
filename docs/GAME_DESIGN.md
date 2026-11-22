# Game Design — YASIR PLAYBOX

> Rules and controls for the two implemented games. Level counts and scoring
> semantics are canonical in `LEVEL_PROGRESSION.md`.

## 1. Zip

### Objective

Fill every cell of a square grid with one continuous path. The path starts on
the cell marked **1** and must touch the numbered checkpoints in ascending
order. It may never reuse a cell.

### Setup

- Grid sizes range from 4×4 to 8×8.
- Every level has 4-5 checkpoints, numbered from 1.
- Checkpoint 1 is at one end of the stored solution and the final checkpoint is
  at the other end.
- The stored solution is a complete Hamiltonian path.

### Valid moves

1. The first accepted cell must be checkpoint 1.
2. Every later cell must be orthogonally adjacent to the current end.
3. The cell must not already be in the path.
4. If the cell is a checkpoint, it must be the next checkpoint by number.

### Feedback

- A rejected start reports "Start the path at number 1."
- A non-adjacent cell reports "Move to a neighboring cell."
- A reused cell reports "That cell is already part of the path."
- An out-of-order checkpoint reports "Visit the numbers in order."
- The live status otherwise shows the next required number.
- Once all numbers are visited, the status asks the player to fill the rest.

### Completion

The level is complete only when:

- every cell appears exactly once;
- adjacent cells form the path;
- all checkpoints appear in ascending order.

The result dialog reports elapsed time and best time, plus grid size and
checkpoint count.

### Backtracking, undo, restart

- Entering the cell immediately before the path end removes the last cell.
- **Undo** removes the last cell.
- Removing the first cell stops the timer and resets elapsed time.
- **Restart** clears everything for the current level.

### Controls

- Pointer: press a cell and drag through neighbors; release to stop.
- Tap: activate cells one at a time.
- Keyboard: Tab to a cell and press Enter or Space.

### Scoring

- Lower elapsed time is better.
- Time starts on the first accepted cell.
- Best time is saved per level as `max(1, round(seconds))`.
- The completion dialog shows the better of the new result and the stored best.

### Edge cases

- A drag that skips a cell is rejected rather than auto-filled.
- Leaving and re-entering the board does not duplicate moves.
- A completed board ignores further input until replay or level change.
- Level selection or restart clears the path, message, timer, and result state.

## 2. Maze Paint

### Objective

Cover every open floor tile of a maze with a roller that slides until blocked.
The start tile is painted automatically.

### Setup

- Square mazes range from 6×6 to 8×8.
- The outer border is always wall.
- One interior floor cell is the start.
- Each level stores a shortest solution and its move count as par.

### Movement

1. Choose up, down, left, or right.
2. The roller moves continuously in that direction.
3. It stops immediately before a wall or the border.
4. Every floor tile entered is painted.
5. If the first step is blocked, the move is rejected and nothing changes.

### Completion

The level is complete when the number of painted floor tiles equals the total
number of floor tiles. Walls never count.

The result dialog reports moves, best moves, par, and tile count.

### Feedback

- A blocked move reports "Blocked there — try another direction."
- The status otherwise reports painted tiles out of total floor tiles.
- The side rail shows painted count, moves, par, elapsed time, and best moves.

### Undo, restart, replay

- **Undo** restores the prior position, painted set, and move count.
- When the move count returns to zero, the timer resets.
- **Restart** returns to the initial maze state.
- **Replay** after completion resets the board and keeps saved progress.

### Controls

- Touch: swipe at least 24 px; the dominant axis chooses the direction.
- Pointer: drag and release on the board.
- On-screen D-pad: four direction buttons.
- Keyboard: arrow keys or WASD.
- Keyboard input is ignored while the level picker or result dialog is open.

### Scoring

- Fewer moves is better.
- Par is the shortest solution found by the generator's breadth-first search.
- The best move count is saved per level.
- The completion dialog shows the better of the new result and the stored best.

### Edge cases

- A short tap or tiny drag does not count as a move.
- A move that cannot advance is not added to history.
- Undo cannot restore a blocked move because blocked moves are not recorded.
- Dialog interactions never mutate the board.
- Level selection resets the state to the new maze.

## 3. Shared behavior

- Every level is unlocked.
- Both games have a timer that starts on the first effective action.
- Progress is local and saved immediately on completion.
- No game requires a network connection after the initial page load.
- Both games expose the same level picker and result-dialog patterns.
