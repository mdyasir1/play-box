# Database — YASIR PLAYBOX

> Canonical persistence document. The current build has no database.

## Decision

**No database is used.** The app is a local-only, single-player arcade. A
backend would add credentials, deployment work, privacy obligations, and
failure modes without improving the required experience.

**No Supabase credentials are needed.** Do not ask the owner for a URL, anon
key, service-role key, or database password for this build.

## Current storage

- Mechanism: browser `localStorage`.
- Key: `playbox.v3.progress`.
- Scope: one browser profile on one device.
- Data sensitivity: game progress only; no personal data.

### Schema

```json
{
  "version": 3,
  "games": {
    "zip": {
      "completed": [1, 2, 3],
      "bestScores": { "1": 42, "2": 51, "3": 38 },
      "lastLevel": 4
    },
    "maze-paint": {
      "completed": [1, 2],
      "bestScores": { "1": 6, "2": 8 },
      "lastLevel": 3
    }
  },
  "updatedAt": 1763856000000
}
```

- `completed` is sorted and de-duplicated.
- `bestScores` keys are level numbers as strings.
- Zip scores are seconds; Maze Paint scores are moves.
- `lastLevel` is clamped to 1-100.
- `updatedAt` is a millisecond epoch timestamp.

## Validation and failure behavior

- Missing key: return clean defaults.
- Malformed JSON: return clean defaults.
- Wrong version: return clean defaults.
- Non-object game data: return clean defaults for that game.
- Invalid completed levels or scores: discard those entries.
- Invalid current level: reset to 1.
- Storage unavailable or full: writes return `false`; the game remains playable
  for the session without persistence.

Implementation and tests live in `src/lib/progress.ts` and
`src/lib/progress.test.ts`.

## Why not Supabase now

| Concern | Local-only result |
|---|---|
| Accounts | None needed |
| Secrets | None stored or transmitted |
| Network | Not required after loading assets |
| Free-tier limits | Not applicable |
| Backend failures | No effect on play |
| Privacy | Game progress stays in the browser |

## When a database would become relevant

A future owner-approved feature could add optional cross-device sync. That
would require:

1. A written requirement and threat model.
2. A chosen provider and account.
3. Explicit owner-supplied credentials in `.env.local`.
4. Anonymous identity or authentication design.
5. Schema, row-level security, and migration review.
6. Conflict and offline-merge rules.
7. New tests for sync, failure, and privacy.

Until those steps happen, adding a database is out of scope.
