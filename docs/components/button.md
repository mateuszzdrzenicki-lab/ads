# Button

Source: [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx). Spec: DS-Decision-Log §5/§6c.

## Purpose

Button triggers an action or a change of state — submitting, confirming, moving a flow
forward. Use `primary` for the single most important action in a view and `outline` for
secondary actions beside it. It renders a native `<button>`, so it's for in-page actions;
for navigation between pages, use a link, not a Button.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` \| `outline` | `primary` |
| `size` | `md` | `md` |

All other props pass through to Base UI's `Button` (`@base-ui/react/button`), which renders a native `<button>`.

## API contracts

### Decorator slots (start/end)

Decorators are **plain children composition** — there is no `startDecorator`/`endDecorator` prop. Place the decorator element directly as a child, before or after the label text:

```tsx
<Button>
  <Plus data-icon="inline-start" />
  Add item
</Button>

<Button>
  Continue
  <ArrowRight data-icon="inline-end" />
</Button>
```

**The `data-icon="inline-start"` / `data-icon="inline-end"` attribute is required on the decorator child.** It's not cosmetic — the component's padding is conditional on it: `has-data-[icon=inline-start]:pl-2` / `has-data-[icon=inline-end]:pr-2` in `button.tsx` shrink that side's padding only when a decorator with the matching attribute is present. Omit the attribute and the decorator renders, but the padding won't compensate for it.

This is the code-side meaning of the Figma component's boolean props `start-decorator` / `end-decorator` (DS-Decision-Log §5): in Figma those booleans toggle slot visibility directly; in code, the equivalent signal is the presence of a child carrying `data-icon="inline-start"` / `"inline-end"`.

If this is ever promoted to an explicit prop API, DS-Decision-Log §5 already reserves the camelCase names `startDecorator` / `endDecorator` for 1:1 Figma↔code parity.

### States

`default` / `hover` / `focus-visible` / `disabled` are plain CSS states (`hover:`, `focus-visible:`, `disabled:` variants) — not props. See DS-Decision-Log §6c for the fill/text/border/ring binding per variant × state.

## Guidance — Do / Don't

**Do**
- Use `primary` for the single most important action in a view; use `outline` for secondary actions beside it.
- Keep one `primary` Button per view or section, so the main action is unambiguous.
- Write labels verb-led and in sentence case, with no trailing punctuation — "Add item", "Save changes".
- Treat decorators as supplementary; the text label always carries the meaning.

**Don't**
- Don't put two competing `primary` Buttons in the same view.
- Don't rely on a decorator alone to convey meaning — there is no icon-only variant, and an icon-only button has no accessible name.
- Don't nest an interactive element (a link, another button, an input) inside a Button — it's invalid HTML and breaks keyboard and screen-reader behavior.
- Don't reach for a variant, size, or state that isn't listed above — stop and report instead (see `constraints.md`).

## Accessibility

- Renders a native `<button>` via Base UI (`@base-ui/react/button`), so role and keyboard interaction (Enter/Space activation, focusability) are handled for you.
- Focus ring is solid (`focus-visible:ring-ring`), not alpha — do not add an opacity modifier to it. The general rule and its WCAG rationale live in `tokens.md`.
- Disabled uses `disabled:opacity-50` and `pointer-events-none`. Disabled controls are not keyboard-focusable, so don't make `disabled` the only signal for why an action is unavailable — a keyboard or screen-reader user may never reach it.
- Every Button takes its accessible name from its text label. Icon-only usage would need an explicit accessible name — but note **no icon-only variant exists**, so this is a constraint, not a recipe.

## Rules

```rules
button: default variant is `primary`; only `primary` and `outline` exist
button: only size `md` exists
button: one `primary` button per view or section
button: decorator children must carry data-icon="inline-start" or data-icon="inline-end"
button: every button needs a text label; no icon-only variant exists
button: never nest an interactive element inside a button
button: never add an opacity modifier to the focus ring
button: labels are verb-led, sentence case, no trailing punctuation
button: for fill/text/border/ring per state, follow DS-Decision-Log §6c — never hardcode
button: variant/size/state outside the above → stop and report (constraints.md)
```

## Figma parity

| Figma prop | Values | Code |
|---|---|---|
| Variant | `primary` / `outline` | `variant` prop |
| Size | `md` | `size` prop (only value) |
| State | default / hover / focus-visible / disabled | CSS state, not a prop (see States) |
| `start-decorator` / `end-decorator` (boolean) | on / off | decorator child — see API contracts above |
