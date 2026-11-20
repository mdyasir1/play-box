# Testing and QA — YASIR PLAYBOX

> Canonical home for the test strategy, test cases, and **executed** results. No test has been run yet: Phase 0 contains no application code. Results are marked `NOT RUN` until genuinely executed. Fabricated results are forbidden.

## 1. Strategy

| Layer | Tool | Scope | When |
|---|---|---|---|
| Unit | Vitest | Pure engines, scoring, level configs, merge policy, dictionary evaluation, validators | With each game, before UI integration |
| Component | React Testing Library + Vitest | Game chrome, result panels, navigation, states, keyboard/touch handlers | After components exist |
| End-to-end | Playwright | Full flows: play → result → unlock → refresh → persistence; offline; install | Phase 9+ continuously |
| Manual device | Real browsers | Android Chrome, iOS Safari, desktop Chrome/Firefox/Safari/Edge | Each game completion + Phase 12 |
| Security | SQL/RPC probes, code review, bundle inspection | RLS, RPC validation, secret exposure | Phase 10 + Phase 12 |
| Accessibility | axe + manual keyboard/screen reader | All screens | Phase 2 onward, gate at Phase 12 |
| Performance | Lighthouse, devtools performance, React profiler | Load, canvas FPS, memory | Each action game + Phase 12 |

Test-first or test-alongside for all pure engine logic. UI tests are written against user-observable behavior, not implementation details.

## 2. Execution status (update continuously)

| Suite | Status | Last run | Notes |
|---|---|---|---|
| Unit | NOT RUN | — | No code exists |
| Component | NOT RUN | — | No code exists |
| E2E | NOT RUN | — | No code exists |
| Security RLS | NOT RUN | — | No Supabase project exists |
| Accessibility | NOT RUN | — | No UI exists |
| Performance | NOT RUN | — | No app exists |
| Production smoke | NOT RUN | — | Not deployed |

## 3. Unit test plan (per game)

### 3.1 Reaction Rush
- Level config returns expected rounds/delay/threshold for all 10 levels.
- Delay selection stays within configured bounds (seeded RNG, 1,000 samples).
- False start voids the round, increments count, applies penalty, retries.
- Average excludes invalid/interrupted rounds and is computed correctly.
- Missed signal records 3000 ms and counts.
- Pass/fail boundaries: average exactly at threshold passes; 1 ms above fails.
- False-start limit boundary.
- Score never negative; cap respected.
- Visibility interruption does not count as a false start.
- Rapid second input is ignored.

### 3.2 Word Master
- Green/yellow/grey evaluation for duplicate letters: `SPEED` vs `ERASE`-style cases including two and three duplicates.
- Guessed letter cannot be counted twice.
- Invalid word rejected without consuming an attempt.
- Win detection; loss after six attempts.
- Hint reveals a correct unresolved position; hint count decrements; cannot exceed available.
- Score formula at boundaries (0–6 attempts remaining, 0–2 hints).
- Daily selection deterministic for a fixed UTC date.
- Daily route rejects malformed guesses and future-date access.
- Share grid contains no letters.

### 3.3 Number Merge
- All four directions: shift, merge order, no double merges.
- Examples: `[2,2,2,2]` left → `[4,4,0,0]` score +8; right → `[0,0,4,4]`.
- `[2,2,4]` left → `[4,4]` (no chain merge in one move).
- Four equal tiles produce two merges.
- Invalid move produces no spawn and no score.
- Spawn distribution approximately 90/10 over 10,000 seeded samples.
- Spawn only on empty cell after valid move.
- Undo restores board/score/move count; counter decrements once; cannot go negative.
- Win when target created (including on last move); loss on no moves and on move limit.
- Board sizes 4×4, 5×5, 6×6.
- Serialization/deserialization of board state (undo stack) is stable.

### 3.4 Memory Challenge
- Sequence generation respects length, pad count, and max two immediate repeats.
- Playback order equals generated sequence.
- Input validation accepts exact sequence and rejects wrong/extra/short input.
- Length increases by one after success; target completion triggers win.
- Wrong pad fails; score accumulated correctly; level bonus applied only on clear.
- Best sequence updates on both wins and losses.
- Pause only allowed between sequences; hidden-tab replay behavior.
- 4-pad and 6-pad configurations.
- Tone mapping is deterministic per pad.
- Debounce prevents double-count beyond intent.

### 3.5 Neon Survival
- Delta-time integration: distance = speed × dt at varied frame rates.
- Fixed-step accumulator clamps large deltas (tab return does not tunnel).
- Collision circle-vs-rect at edges, corners, and high speed (no tunneling at max speed).
- Spawn positions avoid overlapping the player at spawn.
- Difficulty params from level config; speed never exceeds cap.
- Power-up shield absorbs one hit and grants invulnerability window.
- Slow-time reduces speed for 4 s then restores.
- Timer counts active time only; pause/hidden stops accumulation.
- Win at exact target duration; loss on collision before.
- Entity caps enforced; pools reset.
- Loop cleanup: no RAF/listener leak after unmount (test with mocks).

## 4. Progression and persistence tests

| ID | Case | Expected |
|---|---|---|
| PROG-01 | Win level 1 | Level 2 unlocked; best score updated |
| PROG-02 | Lose level 1 | Level 2 remains locked; total plays increments |
| PROG-03 | Win already-completed level | No duplicate unlock; best score may improve |
| PROG-04 | Replay unlocked older level | Allowed; progression unchanged except totals/bests |
| PROG-05 | Refresh after win | Unlock and best score persist |
| PROG-06 | Corrupt localStorage JSON | Quarantined; fresh snapshot; UI notice; no crash |
| PROG-07 | Old schema version | Migrated deterministically; data preserved where possible |
| PROG-08 | Quota exceeded on write | Activity trimmed and retried; progress retained; warning shown |
| PROG-09 | Duplicate submission replay | Server returns duplicate; counts unchanged |
| PROG-10 | Offline completion | Local save succeeds; queue grows; UI shows pending |
| PROG-11 | Reconnect | Queue flushes with backoff; progress syncs |
| PROG-12 | Server returns lower values | Merge keeps local max (no regression) |
| PROG-13 | Two tabs open | No lost updates; storage event merge works |
| PROG-14 | Server down | Gameplay unaffected; retries back off; no data loss |
| PROG-15 | Validation rejection | Item not retried forever; local progress intact |
| PROG-16 | Achievement unlock twice | Single record; timestamp unchanged |

## 5. Level and difficulty tests

- All 10 configs per game load and validate against schema limits.
- Level 2 unreachable via UI when locked; direct route access shows locked state, not a playable board.
- Direct manipulation of local level number cannot bypass locked UI (UI derives from snapshot; server rejects out-of-range levels).
- Difficulty parameters are monotonic within each game's intended curve (e.g., Reaction threshold non-increasing; Memory target non-decreasing).
- No parameter exceeds documented bounds (speed, spawn, delay, attempts).
- Failure never unlocks.
- Completing the final level does not overflow `unlockedLevel` beyond max.
- Replays use the correct config for the selected level.

## 6. Security tests

See `SECURITY.md` §9 for the mandatory RLS/RPC probes. Additional:

- Inspect production JS bundle for service-role key and future daily answers.
- Search repo history for secrets.
- Submit oversized payloads (2 KB+), negative scores, non-integer values, invalid UUIDs, unknown game IDs, future timestamps.
- Replay valid RPC calls with the anon key directly via curl/`supabase-js`.
- Verify direct table operations are denied for anon.
- Verify service worker does not cache `/api/*` or Supabase responses.
- Check security headers (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Dependency audit and lockfile review.

## 7. UI, responsive, and compatibility

Viewports: 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440.

Per width: no horizontal scroll; no clipped/overlapping controls; game board fits; on-screen keyboard does not hide critical controls; safe areas respected; navigation not overflowing.

Browsers: Android Chrome (current), iOS Safari (current and one prior major), desktop Chrome, Firefox, Safari, Edge.

States: loading, empty, error, offline, sync-pending, long text, slow network (throttled), reduced motion, keyboard-only, 200% zoom.

## 8. Accessibility checks

- Automated axe scan on home, library, each game idle/result, stats, achievements: zero critical/serious violations.
- Keyboard-only completion of at least one full level in every game.
- Visible focus at all times.
- Screen-reader smoke test (NVDA or VoiceOver) for navigation, instructions, and one game flow.
- Color-blind simulation for Word Master feedback and Memory pads.
- Touch target audit ≥ 44 px.
- Reduced-motion audit: splash and transitions respect the preference.
- Canvas limitations documented, with keyboard support verified.

## 9. Performance budgets

| Metric | Target |
|---|---|
| Lighthouse mobile performance | ≥ 90 on home/library (post-MVP) |
| LCP (mid-tier mobile, 4G) | < 2.5 s |
| CLS | < 0.1 |
| Initial route JS (gzip, excluding game chunk) | < 200 KB |
| Individual game chunk (gzip) | < 80 KB |
| Neon Survival frame rate | 60 fps target; ≥ 45 fps degraded on mid-tier |
| Memory growth during 5-minute Neon run | No unbounded growth; stable after warm-up |
| Long tasks during gameplay | No repeated > 50 ms tasks |

Measurements are recorded with device/browser/date. Claims without measurement are not allowed.

## 10. Severity and release gates

| Severity | Definition | Gate |
|---|---|---|
| P0 | Security vulnerability, data loss, complete failure | Must be zero |
| P1 | Core game/progression broken | Must be zero |
| P2 | Significant UI/functionality/compatibility issue | Must be fixed or explicitly accepted with rationale |
| P3 | Minor visual/refinement | Documented if accepted |

Release requires: production build passes, lint/typecheck pass, all unit/component/e2e suites green, security probes pass, no P0/P1, docs updated.

## 11. Bug workflow

1. Reproduce independently; record exact steps, environment, expected vs actual.
2. File in `KNOWN_ISSUES.md` with severity and affected module.
3. Fix; add a regression test where feasible.
4. QA verifies on the same environment; moves to resolved with the verification date.
5. Never delete a bug record; mark resolved and keep history.

## 12. Manual test case templates (to be instantiated)

For each game:

- Happy path at Level 1: start → play → win → result → unlock.
- Loss path: fail requirement → no unlock → replay.
- Pause/restart mid-run (where applicable).
- Rapid/repeated input.
- Refresh mid-run and after completion.
- Offline mode (cached app) and sync recovery.
- Mobile touch and keyboard.
- Reduced motion and screen reader smoke.
- Difficulty boundary: exactly at threshold.
- Level 10 completion and max-level state.

For the platform:

- First launch splash, skip, reduced motion, no replay on navigation.
- Homepage with and without progress (empty state).
- Library search/filters, locked levels, direct URL access.
- Stats and achievements accuracy against actual results.
- Install prompt/instructions; standalone launch; offline relaunch.
- Sync status transitions; offline indicator.
- Update available prompt; updating does not interrupt a game.

## 13. Results log

Add rows only after real execution:

| Date | Suite/Case | Environment | Result | Evidence | Notes |
|---|---|---|---|---|---|
| — | — | — | NOT RUN | — | Phase 0: no code |
