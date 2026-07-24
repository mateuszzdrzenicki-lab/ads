# Constraints

> The boundary of the system: what exists, what does not, and what to do at the edge.
> Rules only. Rationale lives in `DS-Decision-Log.md`; token values live in `globals.css`.

## What exists right now

- **Components:** Button only.
- **Button variants:** `primary`, `outline`.
- **Button sizes:** `md` only.
- **Button states:** `default`, `hover`, `focus-visible`, `disabled`.
- **Semantic tokens:** the 12 defined in DS-Decision-Log §6b (10 consumed in
  code; the two `text/size/*` are defined but unused). Intent and usage: `tokens.md`.

## What does NOT exist yet

- **No Icon atom** — decorators take arbitrary children (see `components/button.md`).
  So don't import or assume an `<Icon>` component.
- **No dark mode** — deleted, not deferred (§9). So don't add a `.dark` block,
  `next-themes`, or a theme toggle.
- **No status colors** (`success` / `warning` / `destructive` / `info`) — some hue
  primitives exist, but no semantic token aliases them. So don't use a raw primitive;
  unaliased primitives are not usable.
- **No spacing or sizing tokens** — Tailwind utilities only (path (a), §4).
  So don't reach for a `--space-*` or `--size-*` token.
- **No typography tokens in use** — `text/size/*` exist but nothing consumes them.
  So don't bind text size to a token yet.
- **No components other than Button.** So don't infer Card, Input, Dialog, etc.
  from surrounding context.

## Degradation rule — LOCKED: stop-and-report

If a task requires a component, variant, size, state, or token that is not listed
under **What exists right now**, **stop**. Do not stub it, do not approximate it with
raw Tailwind, do not invent a token. Report exactly what is missing and what would
need to be added to the design system, then wait for a decision.

Silent approximation produces output that looks correct and violates the system —
which is worse than no output.
