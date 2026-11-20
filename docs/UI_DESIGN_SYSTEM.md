# UI Design System — YASIR PLAYBOX

> Canonical home for brand, design tokens, components, animation, accessibility, and mobile layout. Implemented in Phase 1–2. Contrast values must be measured with tooling in Phase 2; token pairs below are chosen for AA targets.

## 1. Brand identity

- **Name:** YASIR PLAYBOX
- **Tagline:** Your Personal Arcade.
- **Personality:** premium, calm, confident, playful without being childish.
- **Logo concept:** a rounded-square "arcade cabinet" mark containing a stylized play triangle formed from two neon strokes; wordmark set in the display typeface with wide letter spacing. The monogram "YP" may be used at small sizes.
- **Splash:** midnight background, logo scales from 0.92 → 1 with a soft glow bloom, a single sweeping light line across the mark, tagline fades in. Total ≤ 1.6 s, skippable, plays once per app launch (not per route), reduced-motion shows a static logo + tagline.
- **Voice:** short, encouraging, specific. No exclamation spam. Errors state what happened and what to do.

## 2. Color tokens

Dark-first. All UI uses semantic tokens, never raw hex in components.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#070A14` | App background |
| `--bg-elevated` | `#0C1120` | Sticky bars, sheets |
| `--surface` | `#121A2E` | Cards, panels |
| `--surface-hover` | `#18233D` | Hover/pressed card |
| `--surface-active` | `#1E2A48` | Selected filter, active nav |
| `--border` | `#26314D` | Default borders |
| `--border-strong` | `#3B4C74` | Focused/selected borders |
| `--text` | `#F5F7FF` | Primary text |
| `--text-secondary` | `#C3CDE6` | Secondary text |
| `--text-muted` | `#93A1C1` | Captions, hints (verify ≥ 4.5:1 on surface) |
| `--accent` | `#9B7BFF` | Primary brand purple |
| `--accent-strong` | `#7C5CFF` | Gradient start / emphasis |
| `--accent-blue` | `#4CC9F0` | Secondary accent, focus glow |
| `--success` | `#3DDC97` | Win, correct |
| `--warning` | `#FFC857` | Caution, near miss |
| `--danger` | `#FF6B81` | Error, false start, collision |
| `--focus` | `#8AB4FF` | Focus ring |

Measured contrast ratios (computed 2026-11-21 using WCAG relative luminance):

| Pair | Ratio | AA target | Result |
|---|---|---|---|
| `--text` on `--surface` | 16.18:1 | 4.5:1 | Pass |
| `--text-secondary` on `--surface` | 10.88:1 | 4.5:1 | Pass |
| `--text-muted` on `--surface` | 6.69:1 | 4.5:1 | Pass |
| `--text-muted` on `--bg` | 7.63:1 | 4.5:1 | Pass |
| `--accent` on `--bg` | 6.28:1 | 4.5:1 | Pass |
| `--bg` (button text) on `--accent` | 6.28:1 | 4.5:1 | Pass |
| Warning text `#FFE1A0` on `--surface` | 13.63:1 | 4.5:1 | Pass |
| `--danger` on `--bg` | 7.22:1 | 4.5:1 | Pass |

These are token-to-token calculations, not a full rendered-page audit. Axe and browser-based accessibility checks still occur in Phase 12.

Accent gradients: purple → electric blue at low opacity; never behind body text. Game accents:

| Game | Accent |
|---|---|
| Reaction Rush | `#FFC857` (signal amber) |
| Word Master | `#3DDC97` |
| Number Merge | `#9B7BFF` |
| Memory Challenge | `#4CC9F0` |
| Neon Survival | `#FF6B81` |

Light mode is not part of the Phase 1 visual launch; tokens must be structured so a light theme can be added without component changes. Dark is the shipped theme. If a light theme is introduced later, it must pass the same contrast audit.

## 3. Typography

- **Display:** Sora (Google Fonts via `next/font`, self-hosted at build, free).
- **Body/UI:** Inter (same mechanism).
- Fallback stack: system UI sans-serif; no layout shift (font-display swap managed by `next/font`).

| Style | Size / line | Weight | Usage |
|---|---|---|---|
| Display XL | 44/52 (mobile 36/44) | 700 | Splash, hero |
| Display | 32/40 | 700 | Page titles |
| H2 | 24/32 | 600 | Section titles |
| H3 | 18/26 | 600 | Card titles |
| Body | 16/24 | 400 | Default |
| Body strong | 16/24 | 600 | Emphasis |
| Small | 14/20 | 400 | Metadata |
| Caption | 12/16 | 500 | Labels, badges |

Numeric scores use `font-variant-numeric: tabular-nums`. Line length capped at 68 characters for prose.

## 4. Spacing, radius, elevation

- Spacing scale (px): 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. No arbitrary values outside the scale.
- Page gutters: 16 px mobile, 24 px tablet, 32 px desktop.
- Section gap: 32 px mobile, 48 px desktop.
- Radii: 8 (inputs/small), 12 (buttons), 16 (cards), 24 (hero/sheets), 999 (pills).
- Borders: 1 px. Emphasis 2 px.
- Shadows: low `0 8px 24px rgba(0,0,0,.32)`; raised `0 16px 48px rgba(0,0,0,.42)`. No heavy glassmorphism.
- Focus ring: 2 px `--focus`, 2 px offset; always visible on keyboard focus.

## 5. Breakpoints and layout

| Name | Min width | Layout |
|---|---|---|
| xs | 0 | Single column, bottom nav, compact top bar |
| sm | 480 | Two-column game grid |
| md | 768 | Wider content, two-column stats |
| lg | 1024 | Left sidebar navigation, max content 1100 px |
| xl | 1280 | Sidebar + wider hero, max content 1240 px |
| 2xl | 1440 | Same as xl, centered |

Test widths: 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440.

Navigation:

- **< 1024 px:** compact top bar (logo, sync status, settings) + bottom navigation with four items: Home, Games, Stats, Achievements. Bottom nav respects `env(safe-area-inset-bottom)` and is 56 px + safe area. Icons have text labels.
- **≥ 1024 px:** left sidebar 240 px with brand, primary nav, daily challenge card, and player mini-summary.

Page container: `max-width` per breakpoint, centered, with gutters; no horizontal overflow at any width.

## 6. Components

| Component | Requirements |
|---|---|
| `Button` | Variants: primary (accent gradient solid), secondary (surface + border), ghost, danger. Sizes sm 36, md 44, lg 52. States: default, hover, active, focus-visible, disabled, loading (spinner + disabled, label preserved for screen readers). Never icon-only without `aria-label`. |
| `GameCard` | Art/abstract accent panel, title, one-line description, difficulty chip, current level, best score, progress bar, Play/Continue action. Entire card is a link except the action button (no nested interactive ambiguity). |
| `DifficultyChip` | Text + color; never color-only. |
| `LevelBadge` | "LV 4" pill with "Level 4 of 10" accessible label. |
| `ProgressBar` | Track + fill; `role="progressbar"` with valuemin/max/now and label. |
| `StatTile` | Label, value, optional delta/context. Values tabular. |
| `SyncStatus` | Icon + text: Saved locally / Synced / Waiting to sync / Offline. Muted, never alarming. |
| `EmptyState` | Icon, heading, one-sentence explanation, primary action. |
| `ErrorState` | What failed, retry action, fallback link. No raw stack traces or error codes to users. |
| `Skeleton` | Matches final layout dimensions; reduced-motion shows static blocks. |
| `Modal/Sheet` | Focus trap, Escape to close, labelled, mobile bottom sheet; background scroll locked. |
| `Toast` | Max 1 visible; polite live region; auto-dismiss 4 s; never used for critical errors. |
| `SearchInput` | Labelled, debounced, clear button, no layout shift. |
| `SegmentedFilter` | Keyboard arrow navigation, `aria-pressed` or radio semantics. |
| `AchievementBadge` | Locked/unlocked states, tooltip/description, relative unlock time. |
| `ScoreDisplay` | Live score with `aria-live="polite"` throttled to ≥ 2 s to avoid screen reader spam. |
| `PauseOverlay` | Resume, Restart, Quit; Escape resumes. |

Card style: surface background, 1 px border, 16 px radius, 20–24 px padding, subtle accent gradient wash at the top edge, hover lift 2 px (disabled under reduced motion).

Button hierarchy: one primary action per screen region. Destructive actions use danger styling and confirmation.

## 7. Animation rules

- Durations: micro 120 ms; standard 180 ms; enter 240 ms; large transitions 320 ms max.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` for enter, `ease-out` for exits.
- Motion library: Motion for React for UI enter/exit and layout transitions; GSAP only if a specific timeline cannot be expressed cleanly (requires approval).
- Game-specific animation lives inside game components and must respect `prefers-reduced-motion`.
- No infinite background animations on the homepage (performance/battery).
- Animate only transform and opacity where possible; avoid layout-triggering properties in loops.
- Splash: once per launch; skip on `prefers-reduced-motion`; max 1.6 s; never blocks input after exit.
- Score pops ≤ 180 ms; no confetti on every action (reserve for level completion, throttled).

## 8. Accessibility standards

- Target WCAG 2.2 AA: body text ≥ 4.5:1, large text ≥ 3:1, non-text UI ≥ 3:1.
- Semantic landmarks: header, nav, main, footer. One H1 per page.
- Keyboard: all interactive elements reachable; visible focus; no trap except modals; Escape closes overlays.
- Touch targets ≥ 44×44 px with ≥ 8 px spacing.
- Status messages via `aria-live="polite"`; errors via `role="alert"`.
- Game instructions available as structured text, not only visuals.
- No color-only meaning: pair with text, icon, or pattern.
- `prefers-reduced-motion` disables non-essential motion and splash animation.
- `prefers-contrast: more` increases border/text contrast where supported.
- Zoom to 200% without loss of content or horizontal scroll at desktop widths.
- Canvas games provide accessible instructions and textual status; the limitation for full screen-reader play is documented, and keyboard control is mandatory.

## 9. Mobile design rules

- Design at 375 px first, verify at 320 px.
- One primary column; game grid becomes two columns only ≥ 480 px.
- Thumb zone: primary actions and game controls in the lower half.
- Sticky headers use `backdrop-filter` sparingly and only if performance allows; otherwise solid `--bg-elevated`.
- Use `100dvh`/`100svh` carefully; avoid `100vh` keyboard/URL-bar issues. Game canvases size to available container, not viewport guesses.
- Safe areas: `padding-bottom: max(16px, env(safe-area-inset-bottom))` for bottom nav and game controls.
- Prevent accidental pull-to-refresh during games where possible via `overscroll-behavior` and fixed play areas; do not globally disable browser gestures.
- No horizontal scrolling at any listed width; long words wrap or ellipsize with accessible full text.
- iOS input zoom: form controls use ≥ 16 px font size.

## 10. Screen-level standards

- **Homepage:** hero (welcome + featured game), Continue Playing row, All Games grid, Daily Challenge card, progress summary, best scores, recent activity, achievements. Limit to these sections; no walls of text.
- **Library:** search + filters, grid/list, each card shows real progress only.
- **Game:** header, instructions (collapsible), play area, HUD, controls, pause/restart, result panel.
- **Stats:** totals, per-game cards, recent activity list; empty state when no data.
- **Achievements:** grid with locked/unlocked, progress hints; empty state only if no achievement definitions are loaded (should not occur).
- **Settings (minimal):** sound, reduced motion override, data export/import (only if approved), reset local progress with confirmation, install instructions.

## 11. Loading, empty, error, offline

- Loading: skeletons matching final layout; no full-page spinners for content that can be streamed.
- Empty: explain why and offer the next action (e.g., "No games played yet — start with Reaction Rush").
- Error: human message, Retry, and Back; log technical detail to console in development only.
- Offline: small persistent chip "Offline — progress saved on this device"; never block games already cached.
- Sync: separate, quieter status from connectivity; a failed sync is not an error the player must fix mid-game.
- Slow network: app shell renders without waiting for Supabase; no layout shift when sync completes.

## 12. Implementation notes (Phase 1)

- Sora and Inter are self-hosted at build via `next/font` and bound to the token variables `--font-sora` / `--font-inter`.
- The dark theme is implemented with Tailwind v4 `@theme` tokens; components use semantic utilities, not raw hex values.
- The splash uses CSS animations, runs at most once per session, is skippable, and collapses to a static presentation under `prefers-reduced-motion`.
- The mobile header hides the wordmark below `lg` so navigation never overflows at 320 px; the mark remains visible.
- `Button`, `Badge`, `Card`, and `Dialog` are vendored shadcn-style primitives.
- Measured contrast passes AA for the documented pairs; full axe/browser verification is deferred to Phase 12.

## 13. Iconography and assets

- Lucide icons at 16/20/24 px, stroke width 2; icons decorative unless labelled.
- No emoji as UI icons (except shareable Word Master result text).
- Game art: locally generated CSS/SVG/canvas visuals, no external image services. Assets optimized; no large hero photos.
- PWA icons: 192, 512, maskable 512, monochrome fallback; generated locally in Phase 2.
