# Security — YASIR PLAYBOX

> Scope: Phase 1 (no authentication). This document defines the threat model, controls, and **accepted risks**. It must not overstate protection.

## 1. Security objectives

1. Never expose server secrets or the Supabase service-role key to clients.
2. Prevent unauthorized bulk access to, or destruction of, stored progress.
3. Bound resource abuse (quota exhaustion, oversized payloads, request floods).
4. Keep games safe from injected content and third-party compromise.
5. Be honest: anonymous client-reported scores cannot be made tamper-proof.

## 2. Assets

| Asset | Sensitivity | Location |
|---|---|---|
| Supabase service-role key | Critical | Server-only env (Vercel), never repo |
| Supabase URL + anon key | Public | Client bundle by design |
| Installation IDs | Low (pseudonymous) | localStorage; database |
| Progress, scores, achievements | Low–medium (integrity) | localStorage; database |
| Daily word answers (including future) | Medium | Server-only DB table / server route |
| Game source and assets | Public | Repo, CDN |

## 3. Actors and trust boundaries

- **Casual player:** no malicious intent; may clear storage, switch devices, or use multiple browsers.
- **Curious user:** inspects network requests and local storage; may replay RPC calls.
- **Malicious anonymous user:** can generate unlimited UUIDs, spoof results, and call public RPCs directly with the anon key.
- **Quota abuser:** attempts to exhaust Supabase or Vercel limits.

Trust boundaries:

```
[Untrusted client] ──HTTPS/anon key──► [Supabase RLS + RPC] ──► [Postgres]
[Untrusted client] ──HTTPS──────────► [Next server route] ──service role──► [Supabase]
```

The client is fully untrusted. The anon key is public. Only server-side validation provides integrity.

## 4. Threat model and controls

| ID | Threat | Impact | Likelihood | Controls | Residual risk |
|---|---|---|---|---|---|
| T1 | Device-ID spoofing: read/overwrite another installation's progress | Privacy/integrity | Medium | UUID unguessable (~122 bits); no public SELECT; RPCs require exact ID; no PII stored; enumeration returns empty | Anyone who obtains an ID can use it. **Accepted.** |
| T2 | Score manipulation via modified client | Leaderboard integrity | High | Server caps, bounded levels/durations, rate limits, idempotency; no competitive leaderboard | Within caps, fabricated scores possible. **Accepted; never claim cheat-proof.** |
| T3 | Quota exhaustion via repeated/oversized submissions | Availability/cost | Medium | 2 KB payload cap, validation rejects early, per-device 1.5 s interval + 120/day cap, stop-on-reject, no polling; monitor usage | Distributed UUIDs can share the daily budget. Best-effort only. |
| T4 | Service-role key leakage | Full DB compromise | Low | Server-only env; never `NEXT_PUBLIC_`; pre-deploy scan; key not in repo; rotate if exposed | Vercel account compromise. |
| T5 | SQL injection | Data breach | Low | Parameterized `jsonb` arguments; no dynamic SQL built from input; fixed function bodies | Low |
| T6 | RLS misconfiguration | Unauthorized table access | Medium | Deny-by-default (RLS enabled, zero policies); revoke table grants; RPC-only access; explicit RLS test in Phase 12 | Human error; mitigated by tests |
| T7 | Daily word leakage (future answers) | Game integrity | Medium | Answers stored server-side only; route returns current evaluation; no answer list in client bundle or public repo | Today's answer is necessarily server-known and may be discovered by network inspection after completion. |
| T8 | XSS via user text | Session compromise | Low | No `dangerouslySetInnerHTML`; guesses restricted to A–Z; React escaping; CSP considered | Dependency compromise |
| T9 | Supply-chain compromise | Varies | Low–medium | Pinned versions, lockfile, `npm audit`, no unvetted packages; free-tier libraries only | Upstream risk |
| T10 | PWA caching sensitive/API data | Privacy | Low | Service worker never caches `/api/*` or Supabase; only static assets | Browser cache edge cases |
| T11 | Local storage tampering | Integrity | High | Validate schema/ranges on read; migrations; server caps; treat local as untrusted input | Local progress can be edited; cosmetic only |
| T12 | CSRF on server routes | Integrity | Low | State-changing routes require POST + same-origin check; no secrets in GET; daily route evaluates only its own payload | Low |
| T13 | Abuse of daily-word route | Quota/answer probing | Medium | Rate limit per IP/device where feasible; evaluation only; no answer until completion; bounded payload | Serverless rate limiting is best-effort on free tier |
| T14 | Dependency secret leakage | Critical | Low | No secrets in client imports; env usage audit in Phase 12 | Build misconfiguration |
| T15 | Malicious install prompt / phishing clone | User trust | Low | No custom credential prompts; install instructions name the official URL | Out of app control |

## 5. Secret management

- Local development: `.env.local` (git-ignored). Provide `.env.example` with names only.
- Required client variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server-only variables (if used): `SUPABASE_SERVICE_ROLE_KEY`, `DAILY_WORD_SALT` (if needed). Never prefixed `NEXT_PUBLIC_`.
- The service-role client is constructed only inside server-only modules; add a runtime guard that throws if imported into a client component.
- Pre-deploy checks:
  - `git grep -n "service_role"` returns only documentation/server code.
  - Production bundle search for the service key prefix returns nothing.
  - No `.env.local` is tracked.
- If a key is exposed: rotate it in Supabase, redeploy, document the incident in `CHANGELOG.md`.

## 6. Input validation standards

- UUIDs: strict regex/parser; reject nil/other formats.
- Game IDs: allowlist of five.
- Levels: integers within `game_definitions.max_level`.
- Scores/durations: integers; bounded; reject (not clamp) out-of-range values.
- Timestamps: ISO-8601 UTC; future ≤ 24 h; past ≤ 30 days.
- Strings: length caps (`clientVersion` ≤ 32, config version ≤ 32).
- JSON: payload ≤ 2 KB; arrays ≤ 50 items; unknown fields ignored.
- Word guesses: `^[A-Z]{5}$` plus dictionary membership server-side for daily mode.
- Local storage: full schema validation; unknown/invalid fields discarded; corrupt data quarantined.

## 7. Client-side security responsibilities

- Never render untrusted HTML.
- Do not embed future daily answers.
- Do not store secrets in localStorage or code.
- Do not log installation IDs or payloads in production console.
- Service worker: no API caching; scoped cache names; versioned cleanup.
- Validate all values read from localStorage and from cloud responses before merging.
- Use `rel="noopener noreferrer"` for external links (minimal external links).
- Keep `Content-Security-Policy` feasible: no inline scripts except Next.js requirements; no third-party trackers.

## 8. Rate limiting and abuse resistance

- Client: single queue, sequential submissions, exponential backoff, no retry on validation errors.
- Server RPC: minimum 1.5 s between accepted submissions per installation; 120 accepted submissions/day per installation; resets at UTC midnight.
- Daily route: per-IP + per-device best-effort counters; bounded request body; short timeouts.
- No public SELECT endpoints; progress reads require an exact UUID.
- Monitoring: Supabase usage dashboard reviewed during Phase 10–13; Vercel function invocations checked after release.

These controls reduce accidental and casual abuse; they do not stop a determined attacker with many UUIDs. That limitation is accepted for Phase 1.

## 9. RLS and RPC verification (Phase 12)

Required tests against a real project with the anon key:

1. `select * from device_progress` → permission denied.
2. `insert/update/delete` on every table → denied.
3. `submit_result` with valid payload → accepted once; replay same `sessionId` → duplicate, no count change.
4. `submit_result` with score above cap → rejected, no row.
5. `submit_result` with unknown game/level/config → rejected.
6. `submit_result` with 3 KB payload → rejected.
7. Two immediate submissions → second rate-limited.
8. `get_progress` for random UUID → empty, no error leakage.
9. `daily_words` direct select → denied.
10. Anon cannot execute maintenance functions.

Results are recorded in `TESTING_AND_QA.md`.

## 10. PWA and offline security

- No API responses cached.
- Cached shell is public content only.
- Installation ID and progress remain in localStorage; clearing site data removes local progress (cloud recovery requires the same ID, which is also cleared). Document this clearly to users.
- Update flow cannot force a reload during an active run.
- Shared devices: progress is not private; there is no account separation. Document in help.

## 11. Data retention and privacy

- No names, emails, phone numbers, precise location, or device fingerprints.
- Installation ID is a random UUID with no personal data.
- Session metadata retained up to 180 days; progress retained while active.
- Supabase/Vercel provider logs are outside app control; their free-tier retention applies.
- No third-party analytics or advertising.
- Users can reset local progress via a confirmed destructive action (Phase 3+).

## 12. Accepted risks (explicit)

1. Anonymous installations are spoofable; cross-device ownership cannot be proven.
2. Scores can be fabricated within server caps.
3. Anyone with an installation UUID can access that progress via the RPC.
4. Daily word for the current day can be discovered after completion (inherent to client display).
5. Serverless rate limiting is best-effort on free tiers.
6. Shared-browser progress is visible to other users of that browser.

These are documented product limitations, not hidden defects. Phase 2 authentication addresses ownership, not client-side score trust entirely.

## 13. Release security checklist

- [ ] No service-role key in client bundle or repo history.
- [ ] `.env.local` ignored; `.env.example` contains no values.
- [ ] RLS enabled with zero direct-access policies.
- [ ] Table grants revoked; only two RPCs executable by anon.
- [ ] Validation tests from §9 pass.
- [ ] `npm audit` reviewed; no unresolved critical/high advisories without documented acceptance.
- [ ] Service worker does not cache APIs.
- [ ] CSP and security headers configured in `next.config`/Vercel.
- [ ] Error pages do not reveal stack traces in production.
- [ ] Security findings recorded in `TESTING_AND_QA.md` and `KNOWN_ISSUES.md`.
