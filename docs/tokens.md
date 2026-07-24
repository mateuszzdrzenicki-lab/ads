# Tokens

Semantic intent and usage. This file says which token to reach for and when not to —
it never states a value. Values are generated into `src/app/globals.css`; the aliases
(semantic → primitive) live in DS-Decision-Log §6b. Don't restate either here.

## Two tiers

- **Primitives** (`color/brand/*`, `color/neutral/*`, `scale/*`, …) have **no consumers**.
  They are raw material, not usable directly.
- **Semantics** are the only usable layer. Every semantic token aliases one primitive.
  If a need has no semantic token, it is not expressible yet — see `constraints.md`.

## Generation path

Figma variables → native JSON export (one file per collection) →
`scripts/build-tokens.js` → generated block in `src/app/globals.css` →
exposed to Tailwind via `@theme inline` → consumed as a utility class.
Re-run with `npm run tokens:build`. Never hand-edit the generated block.

## Semantic tokens

| Token (§6b) | Drives | Use it for | Don't use it for |
|---|---|---|---|
| `primary/default` | `bg-primary` | The one primary-action fill in a view | Large surfaces or body text — it's an accent hue |
| `primary/hover` | `hover:bg-primary-hover` | The hover fill of a primary button | Any non-hover state; don't substitute an opacity modifier |
| `primary/foreground` | `text-primary-foreground` | Text/icon sitting **on** a primary fill | Text on a light surface — it's near-white and would vanish |
| `surface/background` | `bg-background` | Default page / component surface | Signalling state or emphasis |
| `surface/foreground` | `text-foreground` | Default body and label text | Text on a primary fill (use `primary/foreground`) |
| `border/default` | `border-border` | Borders and dividers | Text or icon color — it's tuned for surfaces, not contrast |
| `accent/default` | `bg-accent` | The outline-button hover surface | A general muted background (that's stock `--muted`, unmanaged) |
| `accent/foreground` | `text-accent-foreground` | Text/icon on an `accent` surface | Anywhere not paired with `bg-accent` |
| `focus/ring` | `focus-visible:ring-ring`, `outline-ring` | The keyboard-focus indicator | A decorative border or emphasis outline |
| `radius/default` | `rounded-lg` (and the `radius-*` scale) | Corner rounding on components | Hardcoding a `px` radius instead |
| `text/size/text-sm` | — (not consumed yet) | Nothing yet — lands in path (b) | Don't bind text size to it yet |
| `text/size/text-md` | — (not consumed yet) | Nothing yet — lands in path (b) | Don't bind text size to it yet |

## The non-stock hover token

Agents trained on stock shadcn reach for `hover:bg-primary/90` (an opacity modifier).
**This system does not do that.** Primary hover is an explicit token: use
**`hover:bg-primary-hover`**. Rationale is in §6b (D1) — don't re-argue it here.

## Accessibility rules that belong to tokens

- **Never apply an opacity modifier to a contrast-carrying value** — rings, borders,
  text. It silently drops contrast below WCAG thresholds. The **one** exemption is
  `disabled:opacity-50`: disabled controls are exempt from SC 1.4.3 / 1.4.11.
- **Known accepted deviation:** `border/default` does not meet 3:1 against
  `surface/background`. Recorded and deferred with the palette retune — do **not**
  "fix" it locally.
