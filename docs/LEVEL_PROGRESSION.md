# Level Progression — YASIR PLAYBOX

> Canonical home for level curves, unlock rules, completion criteria, scoring, and persistence semantics. Game rules and UI behavior are in `GAME_DESIGN.md`.

## 1. Shared rules

| Rule | Definition |
|---|---|
| Levels per game | 10 (v1 curves below) |
| Level 1 | Always unlocked |
| Unlock | Completing level `N` unlocks `N + 1`; a loss never unlocks |
| Replay | Any unlocked level can be replayed; no penalty and no duplicate unlock |
| Completion authority | Local merge policy, then optional cloud sync; gameplay never waits for the network |
| Best score | Only wins update best score; per-level bests are stored separately |
| Duplicate completion | `idempotencyKey` UUID per result; merge is monotonic (max level, max score) |
| Difficulty source | Central `level-config.ts` per game with `configVersion` (v1) |
| Parameter bounds | Never exceed the documented maxima; playtesting may tune **downward** only within the same config version, or bump the version |
| Failure behavior | Level remains locked; run recorded as a loss for statistics/history, not for best score |
| Persistence | Local snapshot written on completion; cloud sync queued; refresh retains progress |
| Hidden tab | Games must pause or void an in-flight round without penalizing the player unfairly |

### Server plausibility caps (v1)

| Game | Per-level score cap |
|---|---|
| Reaction Rush | 10,000 |
| Word Master | 1,600 |
| Number Merge | 5,000,000 |
| Memory Challenge | 1,500 |
| Neon Survival | 2,000 |

Submissions above the cap are rejected as invalid by the server RPC (not silently clamped).

## 2. Reaction Rush

### 2.1 Parameters

| Level | Rounds | Delay min–max (ms) | Required average ≤ (ms) | Max false starts | Difficulty |
|---|---|---|---|---|---|
| 1 | 5 | 2000–4000 | 450 | 2 | Intro |
| 2 | 6 | 1500–3500 | 425 | 2 | Easy |
| 3 | 6 | 1200–3500 | 400 | 1 | Easy |
| 4 | 7 | 1000–3000 | 390 | 1 | Normal |
| 5 | 7 | 900–2800 | 380 | 1 | Normal |
| 6 | 8 | 800–2500 | 370 | 0 | Hard |
| 7 | 8 | 700–2500 | 360 | 0 | Hard |
| 8 | 9 | 600–2200 | 350 | 0 | Expert |
| 9 | 9 | 500–2000 | 340 | 0 | Expert |
| 10 | 10 | 400–1800 | 330 | 0 | Master |

- The delay range is chosen uniformly per round using `crypto.getRandomValues`-backed RNG where available.
- Round timing is measured exclusively with `performance.now()` from signal paint to input event.

### 2.2 Completion and scoring

- A **valid round** is one completed after the signal without a false start.
- **False start:** pressing before the signal. It voids the current round, counts toward the false-start total, and applies a **50-point penalty**. The round is retried after a 1.2 s reset.
- Level completes when: all required **valid rounds** are recorded, `falseStarts ≤ maxFalseStarts`, and `average ≤ requiredAverage`.
- If false starts exceed the maximum, the run fails immediately.
- Round points: `max(0, 1000 − roundMs)` rounded to the nearest integer.
- Final score: sum of round points − 50 × false starts, floored at 0.
- Fastest, slowest, average, false starts, and all round times are retained for the result screen and history.
- Tab hidden during wait/signal: the round is voided **without penalty** and re-queued.

### 2.3 Edge cases

- Input before "Get ready" completes is ignored.
- A second input during the result flash is ignored.
- System clock changes do not affect timing (monotonic `performance.now()`).
- If the player never responds within 3000 ms after the signal, the round is marked "missed" (counts as a valid round at 3000 ms) to prevent stalled sessions.

## 3. Word Master

### 3.1 Parameters

| Level | Word tier | Attempts | Hints | Daily challenge | Difficulty |
|---|---|---|---|---|---|
| 1 | T1 very common | 6 | 2 | No | Intro |
| 2 | T1/T2 | 6 | 2 | No | Easy |
| 3 | T2 common | 6 | 1 | No | Easy |
| 4 | T2/T3 | 6 | 1 | No | Normal |
| 5 | T3 moderate | 6 | 1 | Yes | Normal |
| 6 | T3/T4 | 6 | 1 | Yes | Hard |
| 7 | T4 challenging (fair) | 6 | 0 | Yes | Hard |
| 8 | T4/T5 | 6 | 0 | Yes | Expert |
| 9 | T5 advanced but fair | 6 | 0 | Yes | Expert |
| 10 | T5 | 6 | 0 | Yes | Master |

- All words are exactly five letters, uppercase internally, alphabetic only.
- Guesses must exist in the curated **allowed-guesses** dictionary; answers come from tier lists.
- Tier lists must be reviewed for fairness: no proper nouns, no archaic spellings, no offensive words, no words requiring niche knowledge.
- Level 10 does not add hidden constraints; difficulty comes from vocabulary tier only. Optional future constraints require a config version bump.
- Max level counts by cumulative wins across all 10 levels; the daily challenge does not unlock levels (it is a parallel mode).

### 3.2 Hint behavior

- A hint reveals the correct letter and position for one not-yet-green slot.
- The hinted position is chosen deterministically per session (leftmost unresolved), not randomly.
- Hints remaining are shown; quantity per level is fixed in the table.
- Hints do **not** consume attempts, but each remaining hint adds score.

### 3.3 Completion and scoring

- Complete = guess the answer within 6 attempts.
- Failure = 6 incorrect guesses.
- Score (win only): `attemptsRemaining × 250 + hintsRemaining × 100`. Range: 500–1,600 (hints 2 max).
- Duplicate letters are evaluated correctly (two-pass algorithm): greens first, then yellows against remaining unmatched letters; a letter cannot be counted twice.

### 3.4 Daily challenge policy

- One word per calendar day, deterministic from a server-held answer list.
- **Timezone and boundary:** UTC. The daily word changes at 00:00 UTC. The UI shows a countdown to the next UTC midnight and states "Daily words reset at 00:00 UTC."
- The client never receives future answers. The daily route returns game state/evaluation for guesses only, plus the answer **after** completion or exhaustion.
- Daily mode requires network. If offline, the UI offers practice mode instead, with an explicit message. Practice mode uses the local dictionary and does not unlock levels.
- Completing the daily challenge never unlocks a level; it contributes to the daily streak and statistics.
- Streak = consecutive UTC days with a solved daily challenge. Breaking a day resets to 0; today's solve extends the streak.
- Share result copies an emoji grid (no letters, no answer) using the platform clipboard with a fallback.

## 4. Number Merge

### 4.1 Parameters

| Level | Board | Target tile | Move limit | Undos | Difficulty |
|---|---|---|---|---|---|
| 1 | 4×4 | 128 | None | 3 | Intro |
| 2 | 4×4 | 256 | None | 3 | Easy |
| 3 | 4×4 | 512 | None | 3 | Easy |
| 4 | 4×4 | 1024 | None | 3 | Normal |
| 5 | 4×4 | 2048 | None | 3 | Normal |
| 6 | 5×5 | 2048 | 300 | 2 | Hard |
| 7 | 5×5 | 4096 | 400 | 2 | Hard |
| 8 | 5×5 | 4096 | 320 | 2 | Expert |
| 9 | 5×5 | 8192 | 500 | 1 | Expert |
| 10 | 6×6 | 8192 | 400 | 1 | Master |

- Spawn distribution: 90% value 2, 10% value 4, on a uniformly random empty cell.
- Spawns occur after a move that changed the board. Invalid moves spawn nothing.
- Standard 2048 merge rule: each tile merges at most once per move; merges process in movement order.
- Score: standard merge score (sum of merged tile values). No time component.
- Undo restores the previous board, score, and spawn state for one move; undo count decrements; undo cannot be used after game over. Undo does **not** restore an undo count.

### 4.2 Completion and failure

- Complete = target tile created before the move limit (when present) and before no-move deadlock.
- Failure = no legal moves or move limit reached before target.
- 4×4 levels 1–5 are luck-influenced but achievable; higher levels use larger boards and generous move budgets to reduce luck dependence.
- If a player reaches the target with the final allowed move, it is a win.
- Restart resets the board, score, move count, and undos for the current level; it does not affect unlocked progress.

## 5. Memory Challenge

### 5.1 Parameters

| Level | Pads | Start length | Target length | Playback on (ms) | Gap (ms) | Input tolerance | Difficulty |
|---|---|---|---|---|---|---|---|
| 1 | 4 | 2 | 4 | 800 | 320 | None | Intro |
| 2 | 4 | 2 | 5 | 750 | 300 | None | Easy |
| 3 | 4 | 3 | 6 | 700 | 280 | None | Easy |
| 4 | 4 | 3 | 7 | 650 | 260 | None | Normal |
| 5 | 4 | 3 | 8 | 600 | 240 | None | Normal |
| 6 | 4 | 4 | 9 | 550 | 220 | None | Hard |
| 7 | 6 | 4 | 10 | 500 | 200 | None | Hard |
| 8 | 6 | 4 | 11 | 470 | 185 | None | Expert |
| 9 | 6 | 5 | 12 | 440 | 170 | None | Expert |
| 10 | 6 | 5 | 13 | 420 | 160 | None | Master |

- Pad layout: 4 pads in a 2×2 grid; 6 pads in a 2×3 grid (portrait-optimized).
- A wrong pad press fails the level attempt. The failed sequence length is recorded as `bestSequence` only if it is a new personal best for that level? No — `bestSequence` is an all-time value across wins and losses; losing early still records the length reached.
- On success, the sequence length increases by one and play continues within the same level until the target is reached.
- The next sequence extends the previous one (Simon-style) rather than generating a fully new sequence. This is the intended mode; document any change in the game design first.

### 5.2 Scoring

- Each successfully completed sequence: **100 points**.
- Reaching the target length for the level: **+250 bonus**.
- Wrong input: run ends with the score already accumulated (loss; no best-score update).
- `combo` = consecutive correct pad presses within the current input; resets on error. Displayed for feedback; no score multiplier in v1.
- `bestSequence` = longest correctly completed sequence, persisted across runs.

### 5.3 Playback rules

- Playback begins 700 ms after the sequence is generated.
- Input is locked during playback; taps are ignored (not counted as errors).
- Pause is allowed only between sequences. Pausing during playback or input is not offered; if the tab becomes hidden, the run pauses and resumes by replaying the current sequence from the start.
- Audio: a short tone per pad; unlocked on first user gesture. If audio is blocked, gameplay continues silently with a visible sound-off state.
- Vibration: 30 ms on pad press where `navigator.vibrate` is supported; no vibration spam during playback.

## 6. Neon Survival

### 6.1 Parameters

| Level | Survive | Obstacle speed (design px/s) | Spawn interval (s) | Patterns | Power-ups | Difficulty |
|---|---|---|---|---|---|---|
| 1 | 20 s | 260 | 1.60 | Straight | Off | Intro |
| 2 | 25 s | 300 | 1.40 | Straight | Off | Easy |
| 3 | 30 s | 340 | 1.25 | Sine | Off | Easy |
| 4 | 35 s | 380 | 1.10 | Sine + straight | Off | Normal |
| 5 | 40 s | 420 | 1.00 | Mixed | Shield + slow | Normal |
| 6 | 45 s | 460 | 0.90 | Mixed + zigzag | Shield + slow | Hard |
| 7 | 50 s | 500 | 0.80 | Zigzag | Shield + slow | Hard |
| 8 | 55 s | 550 | 0.70 | Mixed dense | Shield + slow | Expert |
| 9 | 60 s | 600 | 0.65 | Mixed dense | Shield + slow | Expert |
| 10 | 75 s | 660 | 0.60 | All patterns | Shield + slow | Master |

- Design resolution: portrait logical field, obstacle speed expressed against a 1080-unit-tall reference; rendering scales to the container.
- Speed and spawn interval are clamped to the table bounds. No level exceeds 660 px/s or spawns faster than one every 0.60 s.
- Power-ups spawn every 12 s ± 2 s starting at level 5, alternating shield/slow: shield absorbs one collision; slow reduces obstacle speed by 35% for 4 s. Power-ups never overlap obstacles or each other.
- Player hitbox is smaller than the drawn sprite (forgiving collision).
- One hit ends the run unless shielded.
- Pause stops the timer, obstacle movement, and spawning. Tab hidden auto-pauses.
- Failure = collision before target survival time. Complete = timer reaches target.

### 6.2 Scoring

- Survival: **10 points per whole second** survived (floor of elapsed time × 10).
- Power-ups collected: **+25 each**.
- Level clear: **+100 bonus**.
- Max theoretical (level 10): 750 + power-ups + 100; the 2,000 cap is a safety bound, not a target.

## 7. Shared persistence semantics

- On completion, the client merges: `unlockedLevel = max(previous, won ? level + 1 : previous)`, `completedLevels` union, `bestScore = max(previous, won ? score : previous)`, `totalPlays += 1`.
- Losses increment `totalPlays` and activity but never unlock or update best score.
- A result submission is created for every completed run (win or loss); duplicates are rejected by `idempotencyKey`.
- If the same level is completed again, no unlock changes but per-level best may improve.
- The pending queue is capped at 100 entries; oldest successfully synced entries are removed first. If the cap is reached, the newest local progress still takes precedence and the UI reports "Waiting to sync".
- Cloud merge is monotonic; a server response can never reduce local progress.
- Schema version is stored with the snapshot. Unknown future versions are not overwritten; the app loads a safe read-only notice until a migration exists.

## 8. Configuration versioning

- Each game's `configVersion` is independent (e.g., `reaction-rush:1`).
- Results store the config version used at completion for later analysis.
- Changing a curve requires bumping the version, updating this document, and recording the change in `CHANGELOG.md`.
- The server accepts only known `(gameId, configVersion, level)` combinations.

## 9. Replay and game-over behavior

- Replay starts the selected level from the beginning; no partial state is restored.
- Restart during a run asks for confirmation only if the run is more than 5 seconds old.
- Results screen always offers: Replay, Next Level (if newly unlocked), Back to Library.
- A failed run shows the requirement that was missed (e.g., "Average 412 ms — needed ≤ 400 ms") without revealing hidden future content.
