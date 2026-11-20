# Database — YASIR PLAYBOX

> Status: **designed, not provisioned.** Supabase project creation is deferred to Phase 10. This document is the implementation contract for migrations and RPCs. No credentials exist in the repository.

## 1. Purpose and principles

- Cloud persistence is a **backup/convenience layer**, never a gameplay dependency.
- Anonymous installation IDs provide data separation, not ownership or authentication.
- The anon key is public by design; security depends on deny-by-default RLS plus narrow, validated RPCs.
- Static game metadata is code-owned; the server keeps a validation copy (`game_definitions`) seeded by migration.
- No personally identifying information is stored.

## 2. Data model

```
game_definitions 1 ──── * device_progress
game_definitions 1 ──── * game_sessions
achievements     1 ──── * device_achievements
device_sync_state (1 per installation)
daily_words (server-only)
```

### 2.1 `game_definitions`

| Column | Type | Constraints |
|---|---|---|
| `game_id` | `text` | PK; one of the five game IDs |
| `display_name` | `text` | NOT NULL |
| `max_level` | `smallint` | NOT NULL, 1..50 |
| `config_version` | `text` | NOT NULL |
| `score_cap` | `bigint` | NOT NULL, > 0 |
| `is_active` | `boolean` | NOT NULL DEFAULT true |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() |

Seeded, not client-writable. The client's level configs are authoritative for play; this table is the server validation copy.

### 2.2 `device_progress`

| Column | Type | Constraints |
|---|---|---|
| `installation_id` | `uuid` | NOT NULL |
| `game_id` | `text` | NOT NULL, FK → `game_definitions(game_id)` |
| `unlocked_level` | `smallint` | NOT NULL, 1..max_level |
| `highest_completed_level` | `smallint` | NOT NULL, 0..max_level |
| `best_score` | `bigint` | NOT NULL DEFAULT 0, ≥ 0 |
| `per_level_best` | `jsonb` | NOT NULL DEFAULT '{}', object of `"level": score`, ≤ 4 KB |
| `total_games_played` | `integer` | NOT NULL DEFAULT 0, ≥ 0 |
| `schema_version` | `smallint` | NOT NULL DEFAULT 1 |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() |
| PK | | `(installation_id, game_id)` |

### 2.3 `game_sessions`

| Column | Type | Constraints |
|---|---|---|
| `session_id` | `uuid` | PK = client idempotency key |
| `installation_id` | `uuid` | NOT NULL |
| `game_id` | `text` | NOT NULL, FK |
| `level` | `smallint` | NOT NULL, 1..max_level |
| `score` | `bigint` | NOT NULL, 0..score_cap (checked in RPC) |
| `duration_ms` | `integer` | NOT NULL, 500..3,600,000 |
| `result` | `text` | NOT NULL, CHECK IN ('win','loss') |
| `config_version` | `text` | NOT NULL |
| `client_version` | `text` | NOT NULL, 1..32 chars |
| `completed_at` | `timestamptz` | NOT NULL |
| `received_at` | `timestamptz` | NOT NULL DEFAULT now() |

Indexes: `(installation_id, received_at DESC)`, `(game_id, received_at DESC)`.
Retention: rows older than 180 days may be pruned by a documented maintenance function; progress tables are never pruned.

### 2.4 `achievements`

| Column | Type | Constraints |
|---|---|---|
| `achievement_id` | `text` | PK |
| `title` | `text` | NOT NULL |
| `description` | `text` | NOT NULL |
| `criteria` | `jsonb` | NOT NULL, documentation only (no dynamic execution) |
| `sort_order` | `smallint` | NOT NULL |
| `is_active` | `boolean` | NOT NULL DEFAULT true |

### 2.5 `device_achievements`

| Column | Type | Constraints |
|---|---|---|
| `installation_id` | `uuid` | NOT NULL |
| `achievement_id` | `text` | NOT NULL, FK |
| `unlocked_at` | `timestamptz` | NOT NULL DEFAULT now() |
| PK | | `(installation_id, achievement_id)` |

### 2.6 `device_sync_state`

| Column | Type | Constraints |
|---|---|---|
| `installation_id` | `uuid` | PK |
| `last_submission_at` | `timestamptz` | NULL |
| `submissions_today` | `smallint` | NOT NULL DEFAULT 0 |
| `counter_day` | `date` | NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT now() |

### 2.7 `daily_words` (server-only)

| Column | Type | Constraints |
|---|---|---|
| `answer_date` | `date` | PK (UTC date) |
| `word` | `text` | NOT NULL, CHECK `^[A-Z]{5}$`, UNIQUE |
| `created_at` | `timestamptz` | NOT NULL DEFAULT now() |

Contains future answers. Accessed only by the server route using the service-role key. Never readable by the anon role.

## 3. RLS and privileges

- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` on every table in `public`.
- **No policies are created for `anon` or `authenticated`.** Direct table access is denied.
- `REVOKE ALL ON TABLE ... FROM anon, authenticated;`
- RPCs are `SECURITY DEFINER` with `SET search_path = public, pg_temp` and an explicit owner.
- `REVOKE EXECUTE ON FUNCTION ... FROM PUBLIC; GRANT EXECUTE ... TO anon, authenticated;` only for the two public RPCs.
- `daily_words` is accessed only via the server's service-role client; no public RPC returns it.
- Future auth: add `user_id uuid` columns and ownership policies in a separate migration; never loosen existing anon restrictions.

## 4. RPC: `get_progress`

```
get_progress(p_installation_id uuid)
  RETURNS jsonb
```

- Validates the UUID non-null.
- Returns a bounded JSON object:
  - `games`: array of progress rows for that installation (max 5).
  - `achievements`: array of achievement IDs with unlock timestamps.
  - `serverTime`: ISO timestamp.
- Returns empty arrays for unknown devices; no error that leaks existence.
- Read-only; no state mutation.
- Rate limiting is handled at the client with backoff; the function itself does not write.

## 5. RPC: `submit_result`

```
submit_result(p_installation_id uuid, p_payload jsonb)
  RETURNS jsonb
```

Validation sequence (all failures return `{ "ok": false, "reason": "<code>" }`):

1. `p_installation_id` is a valid UUID; payload is an object; serialized size ≤ 2048 bytes.
2. Required fields: `sessionId`, `gameId`, `level`, `score`, `durationMs`, `result`, `completedAt`, `configVersion`, `clientVersion`.
3. `sessionId` is a UUID; `gameId` exists and is active in `game_definitions`.
4. `configVersion` matches the active definition; `level` is between 1 and `max_level`.
5. `result` ∈ {win, loss}; if `loss`, score is still accepted for history but cannot unlock.
6. `score` is an integer, 0..`score_cap` (reject, do not clamp).
7. `durationMs` is an integer, 500..3,600,000.
8. `completedAt` parses, is not more than 24 h in the future, and not more than 30 days in the past.
9. **Idempotency:** if `session_id` already exists, return current progress with `ok: true, duplicate: true` (no double-count).
10. **Rate limit:** if `last_submission_at` is within 1.5 s for the device, reject `rate_limited`; if `submissions_today` ≥ 120, reject `daily_limit`. Counter resets by UTC date.
11. Insert the session row.
12. Upsert `device_progress` monotonically:
    - `unlocked_level = greatest(existing, case when win then least(level+1, max_level) else existing end)`
    - `highest_completed_level = greatest(existing, win ? level : existing)`
    - `best_score = greatest(existing, win ? score : existing)`
    - `per_level_best` merges max per key for wins.
    - `total_games_played = existing + 1`
    - `updated_at = now()`
13. Optional `achievementIds` array (≤ 50, known IDs only) inserted with `ON CONFLICT DO NOTHING`. Achievements are cosmetic; server persistence prevents accidental duplicates across devices, not cheating.
14. Update `device_sync_state`.
15. Return merged progress for the affected game plus server time.

The function is transactional. It never trusts client-supplied unlocked levels, completed-level arrays, or best scores beyond the validated current result.

### 5.1 Rejected reasons

`bad_request`, `bad_uuid`, `payload_too_large`, `unknown_game`, `inactive_game`, `bad_config`, `bad_level`, `bad_result`, `score_out_of_range`, `duration_out_of_range`, `bad_timestamp`, `rate_limited`, `daily_limit`, `server_error`.

The client stops retrying validation rejections and retains local progress. Only `server_error`/network failures are retried with backoff.

### 5.2 Client trust disclaimer

Score plausibility caps and rate limits reduce casual abuse; they do **not** make anonymous results tamper-proof. A modified client can submit any value within the caps. This is documented as an accepted limitation until the future authentication phase (Phase 10).

## 6. Device identification

- Generated once: `crypto.randomUUID()`; stored in `localStorage` under `ypb:v1:installation`.
- Format-validated on every use; regenerated only if absent/invalid.
- Not derived from hardware, IP, browser fingerprint, email, or name.
- Not an authentication credential. Anyone who learns an ID can read/write that progress through the RPCs.
- Export/import (if approved) would let a user move progress across devices; no account linking in Phase 1.

## 7. Synchronization protocol

1. On app start (online): `get_progress` once, merge monotonically into local snapshot.
2. On run completion: merge locally, write snapshot, enqueue submission.
3. Flush queue sequentially (never parallel) with exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, 60s cap, ±20% jitter.
4. Stop on `rate_limited` and retry after the server's suggested window; stop entirely on validation reasons and mark the item as rejected locally (kept for diagnostics, excluded from retry).
5. On `online` event and app foreground: flush once.
6. On success: remove from queue, merge returned progress (max only).
7. Never delete local data because sync failed. Never block game start on sync.

## 8. Conflict resolution

- Progress fields merge monotonically (`greatest`), so offline play cannot regress cloud or local progress.
- Per-level bests merge per key with max.
- `total_games_played`: server increments once per accepted session; local counts all local runs. On merge, the larger count wins; sessions are not reconciled retroactively.
- Conflicting schema versions: if the server stores a newer schema than the client supports, the client keeps local data and shows a sync notice; it does not attempt to downgrade.
- A returned server snapshot never overwrites a better local value.

## 9. Migrations

- Location: `supabase/migrations/NNNN_description.sql`.
- Migration `0001_initial_schema.sql` (planned Phase 10) contains: extensions (`pgcrypto` if needed), tables, constraints, indexes, RLS enablement, revokes, functions, seed data for `game_definitions` and `achievements`.
- Migration `0002_daily_words.sql` seeds daily answers server-side (no public access).
- Every migration is idempotent where practical (`if not exists`, `on conflict`).
- Migration history is recorded here; applied migrations are never edited—only superseded.

| Version | Description | Status |
|---|---|---|
| 0001 | Core schema, RLS, RPCs, seed definitions | Planned |
| 0002 | Daily word table and seed | Planned |

## 10. Data recovery and retention

- Local snapshot is the player's authoritative copy for gameplay; cloud recovery requires the installation ID (same browser profile).
- Corrupt local data is quarantined, not deleted; a fresh snapshot is created and a notice shown.
- No PII. Session rows may be pruned after 180 days; progress and achievements are retained while the device remains active.
- A documented maintenance function (`prune_sessions(p_days int)`) may be run manually; it is not an automatic dependency.
- Database backups follow Supabase Free plan capabilities; do not claim point-in-time recovery.

## 11. Performance and quotas

- Expected write volume is tiny (one row per completed run) with per-device limits.
- All RPC access is indexed by primary keys.
- Payloads are capped at 2 KB; returned progress is bounded (< 50 KB).
- Free-tier quotas must be monitored; no polling, no bulk uploads, no analytics tables.
- `device_progress` stays at ≤ 5 rows per installation; `game_sessions` is the only growing table.

## 12. Future authentication compatibility

- The persistence adapter is the only backend-aware layer; game code never sees IDs.
- Future authentication: add `user_id uuid` to progress/achievement tables, create ownership policies, and implement a one-time `claim_device_progress(device_id)` RPC after sign-in. The installation ID remains a fallback key for merged data. |
- No Phase 1 table shape blocks this evolution.
