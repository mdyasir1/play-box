# Architecture — YASIR PLAYBOX

> Status: Phase 0 design (approved direction). No application code exists yet. Any section marked **planned** describes the contract Phase 1+ must implement and test.

## 1. System overview

```
┌──────────────────────────────── Browser (PWA) ────────────────────────────────┐
│  Next.js App Router                                                           │
│  ├─ Static platform shell (home, library, stats, achievements)                │
│  ├─ Client game modules (lazy-loaded per route)                               │
│  ├─ Local persistence (localStorage) ──┐                                      │
│  ├─ Sync queue ────────────────────────┤                                      │
│  └─ Service worker (asset cache, offline shell)                               │
└───────────────────────────────────────┼───────────────────────────────────────┘
                                        │ HTTPS (anon key only)
                                        ▼
┌──────────────────────────── Supabase Free (optional) ─────────────────────────┐
│  Postgres                                                                     │
│  ├─ Tables: device_progress, game_sessions, achievements, ...                 │
│  ├─ RLS enabled; no direct anon table writes                                  │
│  └─ SECURITY DEFINER RPCs: get_progress, submit_result (validated, idempotent)│
└───────────────────────────────────────────────────────────────────────────────┘
```

Cloud availability never blocks gameplay. The browser is the primary gameplay and progression authority; the cloud is a redundant backup and cross-session recovery aid.

## 2. Key architectural decisions

| ID | Decision | Rationale |
|---|---|---|
| ADR-001 | npm as package manager | Only npm is installed (npm 10.9.2). Avoids extra toolchain cost. |
| ADR-002 | Next.js App Router + TypeScript strict | Required stack; static-first rendering; cheap Vercel deployment. |
| ADR-003 | HTML Canvas for Neon Survival, no Phaser | Zero-cost, small bundle, full control; Phaser is unnecessary for a single-obstacle dodger. |
| ADR-004 | Local-first persistence with optional sync | Gameplay must survive offline, DB downtime, and quota exhaustion. |
| ADR-005 | Anonymous installation ID is not identity | Prevents security theater; documented as convenience-only. |
| ADR-006 | Daily Word answer validated server-side | Prevents shipping future daily answers in the client bundle. Daily mode requires network; practice remains offline. |
| ADR-007 | Centralized, versioned level configs | Difficulty tuning without rewriting engines; testable curves. |
| ADR-008 | Single-writer work packages | Environment has no write-capable sub-agents; parallel writes would corrupt shared files. |
| ADR-009 | Pin versions; verify shadcn/ui + Tailwind v4 in Phase 1 | Version drift is a real risk on a fresh project. |
| ADR-010 | Game routes lazy-loaded client modules | Keeps initial JavaScript small on mobile; each game owns its bundle. |

Full decisions and consequences are appended below in §10.

## 3. Planned folder structure

```
PlayBox/
├─ docs/                          # This documentation system
├─ public/
│  ├─ icons/                      # PWA icons (192, 512, maskable)
│  ├─ screenshots/                # Manifest screenshots
│  └─ audio/                      # Small locally stored SFX (Memory, UI)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # Root: fonts, theme, providers, metadata
│  │  ├─ page.tsx                 # Homepage
│  │  ├─ manifest.ts              # Web app manifest
│  │  ├─ globals.css              # Tailwind v4 tokens
│  │  ├─ not-found.tsx
│  │  ├─ error.tsx
│  │  ├─ loading.tsx
│  │  ├─ (platform)/
│  │  │  ├─ games/page.tsx        # Library
│  │  │  ├─ games/[gameId]/page.tsx
│  │  │  ├─ stats/page.tsx
│  │  │  └─ achievements/page.tsx
│  │  └─ api/
│  │     ├─ daily-word/route.ts   # Server-validated daily word
│  │     └─ health/route.ts       # Optional deployment verification
│  ├─ components/
│  │  ├─ ui/                      # shadcn/ui primitives
│  │  ├─ layout/                  # App shell, sidebar, bottom nav
│  │  ├─ brand/                   # Logo, splash screen
│  │  ├─ platform/                # GameCard, ProgressRing, StatTile...
│  │  └─ game/                    # Shared game chrome: header, result, pause
│  ├─ games/
│  │  ├─ reaction-rush/
│  │  │  ├─ definition.ts
│  │  │  ├─ level-config.ts
│  │  │  ├─ engine.ts             # Pure logic, no DOM
│  │  │  ├─ Game.tsx              # Client UI adapter
│  │  │  └─ engine.test.ts
│  │  ├─ word-master/ ...         # dictionary/, evaluator.ts, daily.ts
│  │  ├─ number-merge/ ...        # board.ts, moves.ts, spawn.ts
│  │  ├─ memory-challenge/ ...    # sequence.ts, audio.ts
│  │  └─ neon-survival/ ...       # canvas.ts, loop.ts, spawner.ts, input.ts
│  ├─ lib/
│  │  ├─ persistence/
│  │  │  ├─ types.ts
│  │  │  ├─ storage.ts            # Safe wrapper, versioned keys
│  │  │  ├─ migrations.ts
│  │  │  ├─ queue.ts              # Pending submissions, backoff
│  │  │  ├─ local-adapter.ts
│  │  │  └─ remote-adapter.ts     # Supabase RPC only
│  │  ├─ progression/
│  │  │  ├─ types.ts
│  │  │  ├─ policy.ts             # Unlock/merge rules
│  │  │  ├─ achievements.ts
│  │  │  └─ activity.ts
│  │  ├─ supabase/client.ts
│  │  └─ utils/ (cn, result, time, random, device)
│  └─ types/
├─ supabase/migrations/           # Versioned SQL
├─ tests/e2e/                     # Playwright
├─ tests/setup.ts
└─ public/sw.js (or generated)    # Service worker
```

File ownership is assigned per work package. Shared contracts (`lib/persistence/types.ts`, `lib/progression/types.ts`, game definition types) are frozen before game work starts.

## 4. Shared interfaces (contracts for Phase 1)

### 4.1 Game identity and level config

```ts
export type GameId =
  | "reaction-rush"
  | "word-master"
  | "number-merge"
  | "memory-challenge"
  | "neon-survival";

export type DifficultyLabel =
  | "Intro" | "Easy" | "Normal" | "Hard" | "Expert" | "Master";

export interface GameDefinition {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  category: "reflex" | "word" | "puzzle" | "memory" | "action";
  configVersion: string;
  maxLevel: number;
  accentVar: string;          // CSS custom property, not a raw hex in cards
  instructions: string[];     // accessible, plain language
}

export interface LevelConfig<TCustom = unknown> {
  level: number;
  difficultyLabel: DifficultyLabel;
  completionKind: "average-reaction" | "solve" | "reach-tile" | "sequence-length" | "survive";
  completionValue: number;
  maxScore: number;           // server-side plausibility cap
  custom: TCustom;
}
```

### 4.2 Progression

```ts
export interface GameProgress {
  unlockedLevel: number;                  // 1..maxLevel
  completedLevels: number[];              // ascending, unique
  bestScore: number;                      // overall, max over valid wins
  perLevelBest: Record<number, number>;
  totalPlays: number;
}

export interface ProgressSnapshot {
  schemaVersion: number;                  // current: 1
  installationId: string;                 // UUID v4 from crypto.randomUUID()
  games: Record<GameId, GameProgress>;
  achievements: Record<string, string>;   // achievementId -> ISO unlock time
  activity: ActivityEntry[];              // capped ring buffer, e.g. 50
  pending: ResultSubmission[];            // queue, capped
  updatedAt: string;
}
```

### 4.3 Result submission

```ts
export interface ResultSubmission {
  idempotencyKey: string;                 // crypto.randomUUID(), never reused
  gameId: GameId;
  level: number;
  score: number;
  durationMs: number;
  result: "win" | "loss";
  completedAt: string;                    // ISO-8601 UTC
  clientVersion: string;
  levelConfigVersion: string;
}

export interface SyncOutcome {
  status: "synced" | "queued" | "offline" | "rejected";
  reason?: "validation" | "rate-limited" | "unavailable";
  serverProgress?: ProgressSnapshot;      // merge candidate
}
```

### 4.4 Persistence adapter

```ts
export interface PersistenceAdapter {
  loadLocal(): ProgressSnapshot;                    // synchronous, safe fallback
  saveLocal(snapshot: ProgressSnapshot): void;      // throws only on quota, never silently loses old data
  applyResult(result: ResultSubmission): ProgressSnapshot; // pure merge policy
  sync(snapshot: ProgressSnapshot): Promise<SyncOutcome>;
  flushQueue(): Promise<SyncOutcome>;
}
```

Game engines never import Supabase. Only the persistence layer knows the backend.

### 4.5 Game engine boundary

- `engine.ts` is pure TypeScript: no React, DOM, timers, or `window`.
- The React component drives time/input and calls pure functions.
- `definition.ts` and `level-config.ts` contain no rendering.
- Every engine exports deterministic helpers for tests (e.g., seeded RNG or injected RNG).

## 5. Rendering and data flow

1. **Build-time/static:** homepage shell, game library metadata, stats/achievements layout.
2. **Client hydration:** local snapshot loaded synchronously; UI reflects local truth immediately.
3. **Game start:** level config resolved from centralized config; engine initialized with a session seed.
4. **During play:** all state local; no network calls.
5. **Completion:** pure merge policy updates local snapshot and writes it once; result enqueued.
6. **Sync:** adapter attempts RPC with idempotency key; on failure, exponential backoff (1s → 2s → 4s... capped at 60s, ±20% jitter). Queue persists across reloads.
7. **Merge:** server returns authoritative max progress; client merges monotonically (never downgrades unlocked level or best score).
8. **Achievements:** evaluated locally from real results; server re-checks plausibility on sync; duplicates impossible by key.

No polling. Sync triggers: app foreground, online event, queue flush on interval while foreground only, and completion.

## 6. Persistence architecture

- **Primary:** `localStorage` under a versioned key `ypb:v1:progress`.
- **Write discipline:** read → validate → migrate → merge → write. Never write an unvalidated object.
- **Corruption handling:** parse failure → quarantine corrupt value under `ypb:v1:corrupt:<timestamp>`, start a fresh snapshot, surface a non-blocking notice.
- **Quota:** on `QuotaExceededError`, trim activity to the most recent 10 entries and retry; if still failing, keep in-memory and show a warning. Never delete achievements or levels.
- **Identity:** installation ID generated once via `crypto.randomUUID()`; stored separately under `ypb:v1:installation`; not used as authentication.
- **Pending queue:** array of `ResultSubmission`, max 100; deduplicate by `idempotencyKey`; each result merged locally immediately so gameplay is never blocked.
- **Cross-tab:** listen to `storage` events and reload the snapshot to avoid stale overwrites; last valid write wins with monotonic merge on level/score fields.
- **Phase 2:** adapter gains account-scoped implementation; game and UI layers remain unchanged.

## 7. Database communication

- Browser uses only the Supabase URL and **anon** key (public by design).
- Direct table privileges for `anon` are revoked. All reads/writes go through RPCs:
  - `get_progress(p_installation_id uuid)` → progress rows.
  - `submit_result(p_installation_id uuid, p_payload jsonb)` → validated, idempotent upsert; returns merged progress.
- RPC validation: known game ID, level range, score within config cap, duration bounds, payload size ≤ 2 KB, ISO timestamp sanity, idempotency key UUID.
- Rate limiting: per installation ID minimum interval (e.g., 2s between accepted submissions) and per-day accepted submission cap. Rejected submissions return a typed reason; client stops retrying validation failures.
- Service-role key exists only in server-only environment variables (never `NEXT_PUBLIC_*`), and only if a server route needs it.

See `DATABASE.md` and `SECURITY.md`.

## 8. PWA architecture

- Manifest: name, short name, standalone, portrait-primary, theme `#070A14`, background `#070A14`, 192/512 icons (plus maskable).
- Service worker: precache the app shell, fonts, icons, and essential game chunks after first successful load; runtime-cache immutable static assets; **never cache** `/api/*` or Supabase responses.
- Navigation: network-first for HTML with cached fallback; stale-while-revalidate for static chunks.
- Update policy: detect a waiting worker, show a non-blocking "Update available" prompt; never auto-reload during an active game. A running session defers activation until it ends.
- Offline indicator reflects `navigator.onLine` plus failed fetches; sync status is separate ("Saved locally" / "Synced" / "Waiting to sync").
- iOS limitations documented: storage eviction possible; request `navigator.storage.persist()` opportunistically; provide export/import as a future enhancement only if approved.

## 9. Security boundaries

| Boundary | Rule |
|---|---|
| Client ↔ Supabase | anon key only; RPC surface; RLS enabled; no table writes |
| Client ↔ server route | validate and bound input; no secrets returned |
| Daily word | answer never bundled; server route returns only evaluation and allowed metadata |
| Device ID | client-generated, spoofable; used for data separation only |
| Score | client-computed; server plausibility caps only; never advertised as cheat-proof |
| Local storage | untrusted input on read; validate every field |
| Service worker | no caching of authenticated or API responses; versioned caches |

## 10. Decision log

### ADR-001 — npm
Accepted. Only npm exists in the environment. No pnpm/yarn. `npx` is available for one-off CLIs.

### ADR-002 — Next.js App Router, TypeScript strict
Accepted. Static-first, low operational cost. Games are client islands; no server state for gameplay.

### ADR-003 — Canvas instead of Phaser
Accepted. A single-player dodge game does not justify an engine dependency. Bundle and mobile memory stay small.

### ADR-004 — Local-first
Accepted. Supabase Free availability is not guaranteed; gameplay must never depend on it.

### ADR-005 — Anonymous ID is not authentication
Accepted. Documented limitations are part of the security posture, not a hidden assumption.

### ADR-006 — Server-validated daily word
Accepted. Client-side deterministic selection would bundle all future answers. Practice mode remains fully offline; daily mode requires connectivity. Tradeoff documented in `GAME_DESIGN.md`.

### ADR-007 — Centralized level configs
Accepted. Each game exposes `getLevelConfig(level)`; curves live in `level-config.ts` with a `configVersion`. Changing balance does not touch engine code.

### ADR-008 — Sequential work packages
Accepted. The environment provides only a read-only `explore` sub-agent. Parallel implementation would violate the single-writer rule from the specification.

### ADR-009 — Version pinning and early compatibility smoke test
Accepted. Next 16.4.6, React 19.3.1, Tailwind 4.3.5, Supabase JS 2.119.2 were current at inspection. Phase 1 must prove shadcn/ui compatibility before design-system work proceeds.

### ADR-010 — Lazy game routes
Accepted. Home/initial payload must stay small; games load on demand and are cached by the service worker afterward.

## 11. Architecture risks and guards

| Risk | Guard |
|---|---|
| Game logic entangled with React | Pure engines; no DOM imports; Vitest tests first |
| Multiple RAF loops | Loop ownership in one effect; guard flag; cleanup on unmount/visibility |
| Service worker breaking a running game | Update prompt + defer activation; no cache-first for HTML mutations |
| Sync overwriting better local progress | Monotonic merge; server returns max values only |
| Daily answer leakage | Server route; client bundle contains no future answers |
| Stale local schema | `schemaVersion` + explicit migrations + quarantine |

## 12. Verification expectations for later phases

- `npm run build` succeeds with strict TypeScript.
- Unit tests cover pure engines and progression merges.
- Playwright covers: play → result → unlock → refresh → progress retained.
- RLS/RPC tests run against a real Supabase project (manual or scripted) before release.
- Lighthouse mobile performance/accessibility audited and recorded in `TESTING_AND_QA.md`.
