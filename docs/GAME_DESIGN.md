# Game Design — YASIR PLAYBOX

> Canonical home for game rules, controls, UI states, and edge cases. Level numbers, curves, and scoring thresholds are canonical in `LEVEL_PROGRESSION.md`.

## Shared game chrome

Every game screen uses the same shell:

- **Header:** game title, level badge, difficulty label, score (live where meaningful), best score, pause/restart controls.
- **Instructions:** plain-language "How to play" available before starting and from a help button during play.
- **Primary action:** Start (new session) or Continue (if a resumable state exists; otherwise Start).
- **Result panel:** outcome, score breakdown, personal best comparison, requirement missed (on loss), Replay, Next Level when unlocked, Back to Library.
- **States:** idle, countdown/ready, active, paused, round result, level result, error/fallback.
- **Accessibility:** all controls are buttons with labels; status changes announced via `aria-live="polite"` (score updates throttled); no color-only signals; keyboard and touch parity.
- **Exit guard:** leaving mid-run requires confirmation; progress is not lost for completed levels.

Mobile rules for all games:

- Primary controls sit in the lower 40% of the viewport where possible.
- Minimum touch target 44×44 CSS px.
- Support safe-area insets; never place controls under the home indicator.
- Lock page scroll during active canvas/swipe games.
- Orientation: portrait-first; landscape must remain playable or show a clear rotate hint.
- No hover-only information.

---

## 1. Reaction Rush

### Objective

Measure reaction speed across several rounds while penalizing premature input.

### Rules

1. Player presses Start.
2. A "Wait for green" state appears; input during this state is a false start.
3. After a randomized delay, the target turns green and a timestamp is captured with `performance.now()`.
4. The player taps the target (or presses Space/Enter).
5. The round time is recorded; a short result flash appears.
6. The next round begins automatically after a short reset.
7. After all rounds, the average and level requirements are evaluated.

- False starts void the round, count toward the limit, add a score penalty, and retry the same round.
- Missing the signal for 3 seconds counts as a 3000 ms round.
- The round layout must not move between wait and signal (no "target moves" tricks).

### Controls

- Touch/click anywhere inside the designated tap zone.
- Keyboard: Space or Enter.
- Start/Pause/Restart are explicit buttons.

### UI

- Large, high-contrast target panel with clear state text ("Wait…", "TAP!", "Too soon").
- Round progress dots; current average; false-start counter.
- Result screen: average, fastest, slowest, false starts, all round times (expandable), score.
- Color is never the only state indicator: text + icon accompany every state.

### Edge cases

- Rapid double taps: only the first valid input after the signal counts; the second is ignored during the result flash.
- False start on the final round still consumes the retry opportunity and counts.
- Tab hidden during wait or after signal: void the round without penalty and replay it later.
- Device sleep/lock: treat as a voided round; do not record a fake reaction time.
- Reduced motion: disable pulse/scale animations; keep state changes instant and textual.
- Screen reader: announce "Wait for green", "Tap now", and the recorded time.

### Failure states

- False-start limit exceeded.
- Average above the level threshold.
- No valid rounds recorded due to repeated interruptions (show "Session interrupted — try again").

---

## 2. Word Master

### Objective

Deduce a hidden five-letter word within six attempts.

### Rules

- Guess feedback per letter:
  - **Green:** correct letter, correct position.
  - **Yellow:** letter exists elsewhere in the answer.
  - **Grey:** letter not present in the remaining count.
- Duplicate-letter evaluation is exact (two-pass: greens consumed first, then yellows against remaining letters).
- Guesses must be valid five-letter words from the allowed-guesses dictionary.
- Six attempts maximum per word.
- Hints are limited per level; a hint reveals one unresolved letter in its correct position.
- Level completion requires solving the word. The daily challenge is a separate mode and does not unlock levels.

### Modes

| Mode | Network | Unlocks levels | Notes |
|---|---|---|---|
| Level mode | Optional | Yes | Uses tiered answer lists from the level config |
| Daily challenge | Required | No | Deterministic UTC daily word; server-validated |
| Practice | Optional | No | Unlimited local random words; clearly labeled |

### Controls

- Physical keyboard: A–Z, Backspace, Enter.
- On-screen keyboard: three rows, large keys, Backspace and Enter.
- Input is locked while the previous guess is being evaluated (short animation).
- Keyboard focus is never trapped; a visible focus ring is preserved.

### UI

- 6×5 grid, large enough at 320 px width (minimum tile ~48 px with 6 px gaps).
- On-screen keyboard occupies the lower area; the grid remains visible above it.
- Row shake for invalid words; inline message ("Not in word list", "Not enough letters").
- Hint button shows remaining hints and disables at 0.
- Result screen: answer reveal, attempt distribution, score, streak (daily), share button, replay.
- Color-blind support: feedback tiles also show a letter-position icon or pattern (green = filled check, yellow = dot, grey = dash), not color alone.

### Dictionary policy

- Curated dictionary, locally stored for level/practice modes, versioned.
- Answer tiers are ordered by commonness; no proper nouns, plurals that are obscure, offensive terms, or words requiring specialized knowledge.
- Allowed guesses are broader than answers but remain fair and five letters.
- Source list licensing must be verified in Phase 5 and recorded in `BUILD_JOURNEY.md`; no copied proprietary game lists.

### Daily challenge policy

- Deterministic selection from a server-held list; the client never receives future answers.
- Resets at 00:00 UTC; the UI states this policy and shows a countdown.
- Offline: daily mode is unavailable, with an explicit message and a link to practice mode.
- One submission per day per installation for streak purposes; replaying after completion is view-only.
- Sharing produces an emoji grid only (no letters/answer).

### Edge cases

- Rapid Enter presses: ignored while a submission is pending.
- Invalid word: no attempt consumed; clear error message.
- Duplicate guess: allowed only if it is a valid word; it consumes an attempt (documented in help).
- Browser refresh mid-run: current level progress (unlocked/best) is retained, but the in-progress word is not resumed; the player restarts the level. (No partial-guess persistence in v1.)
- Screen reader: grid cells expose "letter, position, result" labels; keyboard keys are labeled.

### Failure states

- Six incorrect guesses: answer revealed, no unlock.
- Offline daily attempt without network: blocked before starting, not counted.

---

## 3. Number Merge

### Objective

Merge numbered tiles to create the target tile before running out of moves or space.

### Rules

- Grid sizes per level config (4×4, 5×5, 6×6).
- A move shifts all tiles in a direction; equal adjacent tiles merge once per move.
- A valid move is one that changes the board; only then does a new tile spawn.
- New tile: 90% `2`, 10% `4`.
- Merges award the merged value as score.
- Undo restores the previous turn (limited per level).
- Game over when no legal moves remain or the move limit is reached.

### Controls

- Touch: swipe with a threshold (~24 px) and dominant-axis detection; no diagonal merges.
- Keyboard: arrow keys and WASD.
- On-screen directional buttons as an accessible fallback (optional toggle).
- Undo, Restart, Pause (pause hides the board to prevent planning while "paused" is not meaningful; instead pause is a simple overlay without input).

### UI

- Centered board that fits the viewport width minus safe margins; no horizontal scroll at 320 px.
- Tiles animate slide and pop; merge pop is ≤ 120 ms; animations never block input unnecessarily (input queue length 1).
- Score, best, target tile, move count/limit, undo count always visible.
- Target progress indicator (highest tile vs target).
- Game-over overlay: reason ("No moves left" / "Move limit reached"), score, Replay, Back.
- Reduced motion: slide animations shortened or removed; state changes immediate.

### Edge cases

- A move that only combines two tiles of different values (no merge, no shift) is invalid.
- Three equal tiles in a line: the first two merge in movement direction; the third moves.
- Four equal tiles: two merges, each tile merges only once.
- Full board with a valid merge remains playable.
- Undo immediately after a merge restores the pre-merge board, score, spawn, and move count; the undo counter itself is not restored.
- Swipe starting outside the board is ignored; swipe ending outside is clamped.
- Rapid alternating swipes are processed one at a time; input during animation is buffered once.
- Target created during a move: win is evaluated after spawn and animations complete.
- Game-over detection runs after every valid move and after undo.

### Failure states

- No legal moves before target.
- Move limit exhausted before target.

---

## 4. Memory Challenge

### Objective

Reproduce an increasingly long sequence of pad activations.

### Rules

1. A sequence is generated (random pad indices, immediate repeats allowed but capped at two in a row for fairness).
2. Playback shows each pad in order with sound and light.
3. The player repeats the sequence by tapping pads.
4. Correct completion extends the sequence by one and continues.
5. A wrong pad ends the run.
6. Reaching the level's target sequence length completes the level.

### Controls

- Touch/click on pads; keyboard keys `1–4` (or `1–6`) mapped to pad order; visible key hints.
- Pads are large and separated; accidental double-taps count as two inputs and can fail the run (intentional, but pads have a 120 ms debounce to avoid hardware bounce).

### UI

- Pad board centered; active pad glows and plays a tone.
- "Watch" / "Your turn" / "Paused" state text with icons.
- Sequence length current/target; score; combo; best sequence.
- Pause available only between sequences.
- Level result: sequences completed, wrong pad position, best sequence, score.
- Sound toggle always visible; defaults to on after a user gesture unlocks audio.

### Audio and haptics

- Short distinct tones per pad (Web Audio API synthesized; no network audio).
- Audio context created after the first user gesture; resume on visibility.
- Mute persists locally.
- Vibration 30 ms on pad press where supported; no vibration during playback.

### Edge cases

- Taps during playback are ignored and do not count as errors.
- Tab hidden during playback: pause and replay the sequence from the beginning when visible.
- Tab hidden during input: pause; on resume, replay the sequence from the beginning (input is not preserved).
- Rapid taps: processed in order; extra taps beyond sequence length are errors.
- Wrong pad on the last position: run fails; sequence not completed.
- Level start uses a fresh sequence; no sequence is reused across attempts.
- Reduced motion: replace glow scaling with opacity/border changes; keep audio.

### Failure states

- Wrong pad at any position.
- If audio is unavailable, the game remains fully playable.

---

## 5. Neon Survival

### Objective

Survive incoming obstacles for the level's required duration.

### Rules

- The player controls a ship near the bottom of the field.
- Obstacles spawn at the top and move downward (with optional sine/zigzag patterns).
- Speed and spawn rate follow the level config.
- Collision with an obstacle ends the run unless a shield is active.
- Power-ups: shield (absorbs one hit) and slow-time (reduces obstacle speed for 4 s).
- Survive until the timer reaches the target to complete the level.

### Controls

- Touch: drag anywhere in the playfield; the ship follows the horizontal finger position with smoothing. A relative-drag mode is available for small screens (ship moves by delta, not absolute position).
- Keyboard: Left/Right arrows or A/D.
- Pause button always visible; Pause overlay shows Resume/Restart/Quit.
- No fire button; the game is purely evasive.

### Canvas architecture

- Single `requestAnimationFrame` loop owned by one effect; a guard prevents duplicate loops.
- Fixed-timestep logic accumulator (e.g., 1/120 s) with interpolation for rendering; delta clamped to avoid tunneling after tab suspension.
- Device pixel ratio capped at 2 to bound fill-rate on high-DPI phones.
- ResizeObserver-driven canvas sizing; logical coordinates scaled uniformly; no stretched collision shapes.
- Object pooling for obstacles and particles; hard caps on active entities (e.g., 40 obstacles, 60 particles).
- Collision: circle-vs-rectangle with a reduced hitbox (player radius ~70% of sprite).
- Cleanup on unmount: cancel RAF, remove listeners, close audio context if created, stop timers.
- Visibility: auto-pause and reset the accumulator to prevent a jump.
- Performance target: stable 60 fps on a mid-range phone; degrade particles first if frame time exceeds budget.

### UI

- HUD: time survived / target, score, shield indicator, slow-time indicator, level.
- Countdown before start ("3-2-1") with input disabled.
- Game-over overlay: reason, time survived, score, best, Replay, Next Level if unlocked.
- Reduced motion: reduce background motion and particles; obstacles still move (gameplay-critical).
- Screen reader: the canvas is not fully playable via screen reader; provide clear instructions and an equivalent textual status (time, score, shield) via `aria-live`, and document the limitation in accessibility notes. Keyboard control is fully supported.

### Edge cases

- Swipe/touch outside the canvas: ignore; reacquire on next touch inside.
- Two simultaneous touches: use the first active pointer; ignore additional pointers.
- Device rotation/resize: recompute scale; keep the player inside bounds; do not reset the run.
- Tab hidden: pause; on return, show "Resumed" and a 1 s grace period.
- Power-up collected at the same time as a collision: shield applies before collision resolution if collected on the same frame; otherwise collision wins. This ordering is fixed and tested.
- Obstacle spawn exactly on the player: spawn X is constrained to not overlap the player's current X within a safety margin at spawn time.
- Pause spam cannot advance time; the timer uses accumulated active time only.

### Failure states

- Collision before the target duration.
- Run abandoned via Quit (recorded as a loss only if the run exceeded 3 seconds; otherwise discarded).

---

## Cross-game consistency

| Aspect | Standard |
|---|---|
| Level display | "Level N of 10" with difficulty label |
| Best score | Overall per game; per-level bests shown in results/history |
| Unlock feedback | Explicit message and a subtle unlock animation, reduced-motion aware |
| Result persistence | Written locally before any network attempt |
| Error recovery | Engine errors caught by an error boundary; offer Replay/Back; never a blank screen |
| Sound | Global mute setting; games respect it; no autoplay before a gesture |
| Pause | Only where it cannot be exploited to gain information (Memory restricts pause) |
| Restart | Resets run state only; never progress/unlocks/best scores |
| Instructions | Available before start and during pause; written at a 9th-grade reading level |
