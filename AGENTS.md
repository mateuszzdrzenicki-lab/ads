# Design system — read this first

This repo is an AI-friendly design system built on **shadcn/ui** (React + Tailwind v4),
with components owned as source (not a live dependency). **Figma is the source of truth
for design tokens**; the token values in `globals.css` are **generated**, not hand-written.
Decisions are logged, not re-derived — when in doubt, read before you build.

## Where to look

| Your question | Open |
|---|---|
| What exists? What must I never do at the edge? | `docs/constraints.md` |
| Which token do I use, and when not? | `docs/tokens.md` |
| How do I use a specific component well? | `docs/components/<name>.md` |
| *Why* is it built this way? | `docs/DS-Decision-Log.md` |

## Hard rules

- Never hardcode a color, radius, or spacing value.
- Never use Tailwind palette utilities (`bg-gray-100`, `text-red-500`, …).
  Use semantic token utilities only.
- Never edit the generated block in `src/app/globals.css`. Change tokens in Figma,
  then run `npm run tokens:build`.
- Never invent a component that isn't in `docs/components/`.
- Never add a token. Tokens originate in Figma (log §1).
- Before building anything, read `docs/constraints.md`.

**At the edge of the system, stop-and-report.** If a task needs something that doesn't
exist yet, do not approximate it — see the degradation rule in `docs/constraints.md`.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
