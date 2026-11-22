# Security — YASIR PLAYBOX

> Current threat model for a local-only two-game arcade.

## 1. Scope

The app has no authentication, accounts, server actions, API routes, database,
file uploads, user-generated content, or third-party runtime services. The only
persistent data is game progress in localStorage.

## 2. Assets

| Asset | Sensitivity | Storage |
|---|---|---|
| Completed levels and best scores | Low | Browser localStorage |
| Current level | Low | Browser localStorage |
| Source and level data | Public | Repository |
| Environment secrets | None | None required |

## 3. Trust boundaries

- The browser is the only runtime boundary.
- Level data is trusted because it is generated at build time and committed.
- Player input is limited to pointer and keyboard events.
- No player-provided text is rendered.
- No network response is parsed at runtime.

## 4. Controls

### Secrets

- No secrets exist in the client or repository.
- `.env.example` contains no values.
- No `NEXT_PUBLIC_*` secret pattern is used.
- Supabase service-role keys are not relevant because Supabase is not used.

### Headers

`next.config.ts` sets:

- Content Security Policy with `default-src 'self'`.
- Scripts limited to self plus inline Next.js requirements; `unsafe-eval` only
  in development.
- Styles limited to self and inline styles.
- Images limited to self, data, and blob.
- Fonts self-hosted.
- Connections limited to self (plus WebSocket schemes in development).
- Objects blocked.
- Base URI and form actions restricted to self.
- Framing denied.
- `X-Content-Type-Options: nosniff`.
- Referrer policy `strict-origin-when-cross-origin`.
- Permissions policy disables camera, microphone, geolocation, and payment.
- Cross-origin opener/resource policies set to same-origin.
- HSTS in production.

### Rendering

- React escapes rendered strings.
- No `dangerouslySetInnerHTML`.
- No remote scripts, remote fonts, or embedded third-party frames.
- Game state comes from typed, validated structures.

### Dependencies

- Runtime surface: Next.js, React, Radix Dialog, Lucide, clsx, tailwind-merge.
- `npm audit` reports zero vulnerabilities at handover.
- No analytics, tracking pixels, or advertising packages.

### Persistence

- Progress parsing validates structure, ranges, and numeric finiteness.
- Corrupt data falls back to defaults rather than executing or trusting it.
- No personal or sensitive information is collected.
- Clearing site data removes progress; this is documented and expected.

## 5. Accepted risks

| Risk | Impact | Acceptance |
|---|---|---|
| Clearing browser data loses progress | No cross-device recovery | Accepted; local-only design |
| Another user of the same browser profile can see progress | Low | Accepted; no accounts or personal data |
| Scores are client-side and can be edited by the player | No competitive impact | Accepted; single-player, no leaderboard or rewards |
| No offline service worker | App requires initial asset load | Accepted; network availability assumed |
| localStorage quota or privacy mode can block writes | Progress may not persist | Handled by returning false and keeping the session playable |

## 6. Out of scope

- Account takeover, payment fraud, and privilege escalation: no accounts or
  payments exist.
- Server-side injection: no server inputs or database exist.
- Stored XSS from user content: no user content is stored or rendered.
- Cross-tenant isolation: no tenants or multi-user data exist.

## 7. Reporting

This is a private project. Security issues should be reported directly to the
owner. Do not publish exploit details before the owner has reviewed them.
