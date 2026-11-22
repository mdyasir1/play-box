# Testing & QA — Yasir's Play-Box

## Release gates

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass |
| Typecheck | `npm run typecheck` | Pass |
| Unit | `npm test` | 5 files, 31 tests |
| Build | `npm run build` | Pass; `/`, `/login`, both games, icon |
| Browser | `npm run test:e2e` | 26 tests |
| Audit | `npm audit` | 0 vulnerabilities |

## Coverage

- Engines: valid moves, blocked moves, completion, replay solutions.
- Level data: 200 Zip and 200 Maze Paint levels, uniqueness, solution validity.
- Progress: version 4 schema, level locking, remote merge, corrupt data.
- Browser: login-first redirect, demo login, theme toggle, splash, 200-level
  picker, sequential unlock, completion/replay, persistence, 320px layout, axe.

## Supabase

Automated tests run against the local demo auth path. Real Supabase auth and
Prisma sync require credentials and are verified manually after `.env.local` is
filled. Apply `prisma/migrations/20261122_init/migration.sql` before testing sync.

## Accessibility

Axe WCAG A/AA scans cover home, both game pages, the level picker, and the
result dialog. The current result is zero serious/critical violations.
