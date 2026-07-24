# <Component name>

<!-- Template for component docs. Copy this file, fill every section, delete these comments.
     Section order is fixed so every component doc reads the same way. -->

Source: [`src/components/ui/<name>.tsx`](../../src/components/ui/<name>.tsx). Spec: DS-Decision-Log §<n>.

## Purpose
<!-- One paragraph, human register. The job this component does and when you'd reach for it.
     Not a feature list. -->

## Props
<!-- Only props this component defines. Note pass-through props in one sentence below the table. -->

| Prop | Values | Default |
|---|---|---|
| `<prop>` | `<a>` \| `<b>` | `<a>` |

## API contracts
<!-- What a consumer MUST do for the component to work correctly: required attributes,
     required children, behavioral states. Put component-specific behavior (e.g. States)
     as subsections here. If there's nothing non-obvious, write "None." -->

## Guidance — Do / Don't
<!-- Prose, human register. This is the system's opinion, not universal truth: which variant
     when, composition limits, label conventions. -->

**Do**
- …

**Don't**
- …

## Accessibility
<!-- What the component already handles vs. the consumer's job. Roles, labels, focus, contrast.
     State facts, not aspirations. Reference tokens.md for token-level a11y rules; don't restate them. -->

## Rules
<!-- Machine register of Guidance + Accessibility: terse, imperative, one rule per line, greppable.
     This is the one place the same fact may appear in two registers — same file, by design.
     Reference the Decision Log for bindings; never restate a token value here. -->

```rules
<component>: <one imperative rule per line>
```

## Figma parity
<!-- How the Figma component's properties map to code. -->

| Figma prop | Values | Code |
|---|---|---|
| … | … | … |
