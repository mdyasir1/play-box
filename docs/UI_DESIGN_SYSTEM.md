# UI Design System — YASIR PLAYBOX

> Current visual system for the two-game rebuild. Tokens are implemented in
> `src/app/globals.css`.

## 1. Direction

A quiet, dark arcade: near-black indigo backgrounds, crisp white type, violet
for Zip, cyan for Maze Paint, and green for success. The interface should feel
premium and calm rather than noisy or neon-saturated.

## 2. Color tokens

| Token | Value | Use |
|---|---|---|
| `bg` | `#070a14` | Page background |
| `bg-elevated` | `#0c1120` | Elevated panels and dialogs |
| `surface` | `#121a2e` | Cards and controls |
| `surface-hover` | `#18233d` | Hover surfaces |
| `border` | `#26314d` | Default borders |
| `border-strong` | `#3b4c74` | Emphasized borders |
| `text` | `#f5f7ff` | Primary text |
| `text-secondary` | `#c3cde6` | Body text |
| `text-muted` | `#93a1c1` | Metadata and hints |
| `accent` | `#9b7bff` | Zip, primary actions |
| `accent-strong` | `#7c5cff` | Background glow |
| `cyan` | `#4cc9f0` | Maze Paint, alternate actions |
| `success` | `#3ddc97` | Completion and saved state |
| `warning` | `#ffc857` | Invalid-move messages |
| `danger` | `#ff6b81` | Error accent |
| `focus` | `#8ab4ff` | Focus ring |

## 3. Typography

- Display: Sora via `next/font`, variable `--font-sora`.
- Body: Inter via `next/font`, variable `--font-inter`.
- Both are self-hosted; no external font request at runtime.
- Headings use tight tracking and bold display weight.
- Metadata uses small uppercase labels with wide tracking.
- Numeric statistics use tabular numbers.

## 4. Layout

- Maximum content width: 72 rem (`max-w-6xl`).
- Header: 4 rem tall, sticky, translucent backdrop blur.
- Game page: board column plus 340 px side rail at large widths; stacked below.
- Home: hero plus progress panel; game cards; rules; principles.
- Page padding: 1 rem mobile, 1.5 rem tablet, 2 rem desktop.
- Dialogs: centered, maximum height `85dvh`, scrollable content.

## 5. Components

### App shell

- Skip link as the first focusable element.
- Brand mark plus wordmark (wordmark hidden below the `sm` breakpoint).
- Centered game navigation with active state.
- "Saved locally" indicator on wider screens.
- Footer with scope and privacy statement.

### Buttons

Variants: `primary` (violet), `secondary` (bordered surface), `ghost`,
`cyan`, `danger`. Sizes: `sm`, `md`, `lg`, `icon`. Disabled controls use
reduced opacity and no pointer events.

### Cards

Rounded 1 rem to 1.25 rem, subtle border, translucent surface, optional
interior glow. No heavy shadows except dialogs and boards.

### Progress bars

Rounded track, violet default, cyan-to-violet for Maze Paint, accessible label,
`aria-valuenow`/`aria-valuemax`.

### Modal

Radix Dialog provides focus trapping, Escape handling, and focus return.
Overlay is dark with blur. Close button is always 40 px. Titles and descriptions
are semantic dialog labels.

### Boards

- Zip: square grid, hairline cell borders, violet path polyline, checkpoint
  discs, current-cell ring.
- Maze Paint: square grid, dark walls, slate floor, cyan/violet painted tiles,
  white roller with cyan glow.
- Both boards clip horizontal decorative overflow and use touch-none.

### Level picker

Five columns on mobile, up to ten on desktop, 100 buttons. Current is violet;
completed uses green border and check. Grid dimensions appear under each
number. The dialog scrolls when needed.

### Result dialog

Success panel, four statistics, then Next level, Replay, and Levels. The final
level removes Next level. Focus starts inside the dialog.

## 6. Responsive behavior

- 320 px is the minimum supported width and is covered by browser tests.
- Header wordmark hides below `sm` so navigation and logo fit.
- Decorative hero glow is clipped horizontally.
- Game side rail stacks below the board on small screens.
- Modal width is `calc(100% - 2rem)` with internal scrolling.
- No horizontal page scroll is allowed.

## 7. Accessibility

- Axe checks cover home, both game pages, the level picker, and the result
  dialog with zero serious or critical violations.
- Status messages use `role="status"` and `aria-live="polite"`.
- Zip cells have row/column and checkpoint names; path membership is exposed
  with `aria-pressed`.
- Maze board exposes an accessible group label and the D-pad buttons have
  names.
- Focus rings use a dedicated blue token and are visible on dark surfaces.
- Color is never the only signal: completed levels also show a check, current
  level is marked with `aria-current`, and messages use text.
- Reduced motion collapses animation and smooth scrolling.

## 8. Motion

- Page rise: 420 ms, opacity plus 12 px translation.
- Modal: 180 ms scale/translate entrance; overlay fade 150 ms.
- Progress and tile color transitions: 150 ms.
- A soft pulse utility exists but is not required for core actions.
- `prefers-reduced-motion: reduce` disables all animation and transitions.

## 9. Rules

- Use existing semantic tokens; do not introduce one-off colors casually.
- Keep tap targets at least 40-44 px where practical.
- Do not add decorative elements that compete with the board.
- Every interactive element needs visible focus and an accessible name.
- Do not claim a state is saved unless it is written to localStorage.
