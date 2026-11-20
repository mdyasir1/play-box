# Testing & QA — YASIR PLAYBOX

> Canonical home for executed results. Last updated 2026-11-21 (Phases 2–3). Do not replace `axe-core` results with jest-dom; accessibility results have explicit tooling notes.

## 1. Execution status

| Suite | Status | Last run | Notes |
|---|---|---|---|
| Unit/component (Vitest + RTL + jsdom) | **PASS 68/68** | 2026-11-21 | Contracts, registry, persistence, shell, UI, game chrome |
| E2E (Playwright + Chromium) | **PASS 14/14** | 2026-11-21 | 10 overflow widths, nav switch, keyboard, library search |
| Lint/typecheck/build | **PASS** | 2026-11-21 | 0 errors; strict TS; static shell pages |
| Security headers | **PASS** | 2026-11-21 | CSP/HSTS/nosniff/frame/referrer/permissions verified in production smoke |
| Dependency audit | **PASS** | 2026-11-21 | 0 vulnerabilities |
| Accessibility (axe smoke) | **PASS (shell + game chrome)** | 2026-11-21 | Zero critical/serious; jsdom color-contrast disabled; full audit Phase 12 |
| Responsive browser layout | **PASS (Playwright)** | 2026-11-21 | No horizontal overflow at 320–1440 px |
| Mobile/desktop nav switch | **PASS** | 2026-11-21 | Below 1024: mobile top bar + bottom nav; ≥1024: sidebar |
| Deployed production smoke | NOT RUN | — | Not deployed |

## 2. Phase 3 executed evidence

| Date | Suite/Case | Environment | Result | Notes |
|---|---|---|---|---|
| 2026-11-21 | Playwright navigation/library | Chromium headless, local production build | 2/2 pass | Core pages render headings; library searchbox and category filters render/filter |
| 2026-11-21 | Playwright overflow | Chromium headless | 12/12 pass | Widths 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 across `/`, `/games`, five detail pages, five play routes, stats, achievements |
| 2026-11-21 | Local production smoke | `next start -p 3100` | PASS | Shell pages return 200; unknown game routes 404 |

## 3. Testing strategy for later phases

- Vitest gates pure contracts, level configs, storage/validation/migration, and pure component logic.
- Playwright covers browser-only concerns: viewport overflow, navigation, search/filter, hydration.
- Axe gives structural/ARIA smoke; full color, contrast, motion, canvas, and accessibility verification is Phase 12.
- Prefer small deterministic tests before browser tests.

## 4. Backlog (not executed)

| ID | Suite | Status | Notes |
|---|---|---|---|
| BQ-001 | Full-browser axe for all pages | NOT RUN | Phase 12 |
| BQ-002 | Lighthouse performance/core web vitals | NOT RUN | Phase 8/12 |
| BQ-003 | Mobile physical device manual pass | NOT RUN | Deferred |
| BQ-004 | E2E play→result flows | NOT RUN | Phase 4–8 |
| BQ-005 | Cross-device local data/PWA install | NOT RUN | Phase 11 |

## 5. Tooling inventory

- Testing: `@playwright/test` 1.65.1, `axe-core` 4.14.1, Vitest 5.1.1, jsdom 29.1.1, RTL, user-event.
- Browser: Playwright Chromium headless shell/Chromium v1255.
- Local audit: `npm audit`.
- Browser visual checks: Playwright screenshots disabled by default; enable when needed.
