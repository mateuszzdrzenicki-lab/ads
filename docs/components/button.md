# Button

Source: [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx). Spec: DS-Decision-Log §5/§6c.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` \| `outline` | `primary` |
| `size` | `md` | `md` |

All other props pass through to Base UI's `Button` (`@base-ui/react/button`), which renders a native `<button>`.

## Decorator slots (start/end) — API contract

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

## States

`default` / `hover` / `focus-visible` / `disabled` are plain CSS states (`hover:`, `focus-visible:`, `disabled:` variants) — not props. See DS-Decision-Log §6c for the fill/text/border/ring binding per variant × state.
