# Testing & QA — YASIR PLAYBOX

> Canonical home for executed results. Last updated 2026-11-21 (Phase 2). Do not replace `axe-core` results with jest-dom; every accessibility result in this file has explicit tooling notes.

## 1. Execution status

| Suite | Status | Last run | Notes |
|---|---|---|---|
| Unit/component (Vitest + RTL + jsdom) | **PASS 68/68** | 2026-11-21 | Contracts, level registry, persistence, shell, primitives, game chrome |
| E2E (Playwright + Chromium) | **PASS 12/12** | 2026-11-21 | 10 viewports, navigation switch, keyboard skip-link |
| Lint/typecheck/build | **PASS** | 2026-11-21 | 0 errors/warnings; strict TypeScript; Next build emits static routes |
| Security headers | **PASS** | 2026-11-21 | CSP/HSTS/nosniff/frame/referrer/permissions verified in production smoke |
| Dependency audit | **PASS** | 2026-11-21 | 0 vulnerabilities |
| Accessibility (axe smoke) | **PASS (shell + game chrome)** | 2026-11-21 | Zero critical/serious; jsdom color-contrast disabled; full audit Phase 12 |
| Manual keyboard/touch smoke | **PASS (Phase 2)** | 2026-11-21 | Skip link, focus rings, icon buttons, toast dismiss, pause Escape |
| Responsive browser layout | **PASS (Playwright)** | 2026-11-21 | No horizontal overflow at 320–1440 px |
| Mobile/desktop nav switch | **PASS** | 2026-11-21 | Below 1024: mobile top bar + bottom nav; ≥1024: sidebar |
| Deployed production smoke | NOT RUN | — | Not deployed |

## 2. Phase 2 executed evidence

| Date | Suite/Case | Environment | Result | Notes |
|---|---|---|---|---|
| 2026-11-21 | Playwright overflow | Chromium headless, local production build | 12/12 pass | Widths 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 across `/`, `/games`, five detail pages, five play routes, stats, achievements; checks `document.documentElement.scrollWidth <= innerWidth+1` |
| 2026-11-21 | Playwright navigation | Chromium headless | PASS | Desktop sidebar hidden at 1023 px; visible at 1024 px; Mobile Primary nav visible at ≤1023 and hidden at desktop; skip link focused on first Tab |
| 2026-11-21 | Lint | Windows Node 22.13.1, npm 10.9.2 | PASS | 0 errors/warnings |
| 2026-11-21 | TypeScript | same | PASS | Strict mode, no unused TS-only checks |
| 2026-11-21 | Unit/component | same | PASS 68/68 | Includes persistence, contracts, registry, shell, UI, game chrome |
| 2026-11-21 | Production build | same | PASS | Static routes for `/`, `/games`, five details, five plays, stats, achievements |
| 2026-11-21 | Local production smoke | `next start -p 3100` | PASS | `/` → 200; `/games` → 200; five details → 200; five play → 200; stats/achievements → 200; `/games/nope` → 404; `/games/nope/play` → 404 |
| 2026-11-21 | Security headers | local production | PASS | CSP, HSTS, nosniff, frame, referrer, permissions present |
| 2026-11-21 | Dependency audit | npm | PASS | 0 vulnerabilities |
| 2026-11-21 | Axe shell/game chrome | jsdom + axe-core 4.14.1 | PASS | Zero critical/serious; color-contrast disabled in jsdom (no real layout) |

## 3. Testing strategy for later phases

- Vitest gates pure contracts, level configs, storage/validation/migration, and pure component logic.
- Playwright covers browser-only concerns: viewport overflow, navigation, hydration, static route behavior.
- Axe gives structural/ARIA smoke; full color, contrast, motion, canvas, and accessibility verification is Phase 12.
- Prefer small, deterministic tests before browser tests.

## 4. Backlog (not executed)

| ID | Suite | Status | Notes |
|---|---|---|---|
| BQ-001 | Full-browser axe for all pages | NOT RUN | Phase 12 |
| BQ-002 | Lighthouse performance/core web vitals | NOT RUN | Phase 8/12 |
| BQ-003 | Mobile physical device manual pass | NOT RUN | Deferred; label |
| BQ-004 | E2E play→result flows | NOT RUN | Phase 4–8 |
| BQ-005 | Cross-device local data/PWA install | NOT RUN | Phase 11 |

## 5. Tooling inventory

- Testing: `@playwright/test` 1.65.1, `axe-core` 4.14.1, Vitest 5.1.1, jsdom 29.1.1, RTL, user-event.
- Browser: Playwright Chromium headless shell/Chromium v1255.
- Local audit: `npm audit`.
- Browser visual checks: Playwright screenshots disabled by default; enable when needed.
