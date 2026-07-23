# Design System — Decision Log & Spec

> **Purpose:** Single source of truth for decisions on this project. Read this first in any new conversation.
> Doubles as the new-joiner onboarding doc and the changelog.
> **Status legend:** `LOCKED` = decided · `OPEN` = pending · `PARKED` = deferred on purpose

---

## 0. Project in one paragraph

An AI-friendly design system built on **shadcn/ui** (React + Tailwind v4) with custom styling.
**Figma** provides design tokens + a UI Kit mirroring the components. Goal: one DS that (1) is used in Figma to design for implementation, (2) is implemented and ready to build those designs, and (3) can be used to build front-end prototypes via prompts.
Solo project (owner + AI). Training/personal. Constraint: **€0 — no paid tools.**

---

## 1. Forks — LOCKED

| # | Decision | Choice |
|---|---|---|
| 1 | Token source of truth | **Figma-first.** Figma = design/token SoT, one-directional sync → repo. |
| 2 | First milestone shape | **Vertical slice first** (one component E2E) → then broaden token foundation → then scale components. |
| 3 | Primary AI consumption path | **Path A:** AI reads repo + structured docs to implement. (Figma Make / capture parked.) |

---

## 2. Scope decisions — LOCKED

- **Governance (old P7): dropped.** Kept only two lightweight scraps: **semver on tokens** + **a changelog** (this doc). Adoption metrics / cross-team process / heavy VRT = cut (solo project).
- **Storybook: PARKED.** Free, but setup friction. Substitute for Path A = a structured `/docs` folder in Markdown the AI reads. Revisit only if a human-facing visual gallery is wanted.
- **Component-token tier: SKIPPED.** Tiers = **primitive → semantic** only. Add component tokens later *only* on real need (e.g. Button must diverge from a semantic value).

---

## 3. Architecture principles — LOCKED

- **Two source-of-truth claims, kept separate:**
  - **Structural / API SoT = shadcn (code)** — what props/variants/nesting actually exist and are buildable.
  - **Token / visual SoT = Figma** — styling, naming vocabulary, design decisions.
- **Figma structure is derived from shadcn's real API, per component** (avoids designing un-buildable components, e.g. a naive merged "List"). Done as part of each slice — **not** a big upfront inventory.
- **Token layer = the shared spine** all three goals ride on (Figma design vocab · code parity · predictable AI output). Don't fork the vocabulary.
- **shadcn is owned, not a live dependency.** Components are copied in and become our code; there is no upstream auto-update fighting us. Cleanliness comes from keeping customization **token-driven** and **declarative** (shadcn's `cva` variant maps — no imperative `if`s / hacks).

---

## 4. Technical foundation — LOCKED / verified (Jan 2026)

- shadcn currently defaults to **Tailwind v4** with **CSS-variable theming on by default** (`cssVariables: true`).
- v4 token model: raw var in `:root`/`.dark` → mapped to a utility via **`@theme inline`** → consumed as a class. Dimensional tokens (height, padding, radius) work the same way as color tokens.
- **Path (a) NOW:** tokenize only what shadcn already tokenizes — **color, radius, focus ring.** Sizing/spacing stay as Tailwind utilities for the slice.
- **Path (b) LATER (additive, not a refactor):** define dimensional tokens in the same CSS-var + `@theme` structure and swap hardcoded utilities for generated ones. No brackets/hacks required. `LOCKED` as the intended upgrade path.

### 4a. Repo scaffold — as built (Jul 2026)

Confirmed on scaffold: Next.js 16.2.11, React 19.2.4, Tailwind v4 (`^4`, no `tailwind.config.js` — CSS-first), `cva` still the variant-map mechanism §3 assumes. Six things drifted from what §4/§5/§6c assumed, none of which changed the token bindings in §6b/§6c:

- **shadcn now asks for a primitive-library choice** (Base UI / React Aria / Radix) that didn't exist when this doc was written. Took the CLI's recommended default, **Base UI** (`@base-ui/react`, not `@radix-ui/*`). Verified its native `<button>` respects the `disabled` attribute Tailwind's `disabled:` selectors need.
- **A named style-preset system** (Nova/Vega/Maia/…/Custom) now sits in front of the old base-color prompt. Took **Nova** (Lucide + Geist) — moot for our colors since we override them, but it matches the Geist font `create-next-app` already wires into `layout.tsx`.
- Stock primary hover is now `hover:bg-primary/80`, not `/90`. Doesn't change D1 (§6b) — we use neither — but the rationale text there cites the old fraction.
- Stock outline hover moved from `accent` to `muted`/`foreground`. §7.1's "shadcn-faithful" label is now slightly stale phrasing; the actual §6c binding is unaffected since those classes are hand-authored regardless of stock defaults.
- **Current shadcn has no literal `md` size key** (its scale is `default/xs/sm/lg/icon*`). Named our one size key `md` directly in code, per §3 ("shadcn is owned, not a live dependency").
- **Dropped `focus-visible:border-ring`** from the copied-in base classes. Current stock shadcn swaps border color on focus; §6c's binding table keeps the border unchanged and only adds a ring, so the doc won over the stock default.

---

## 5. Button slice — LOCKED

**Progress:** Steps 3–5 **DONE & VERIFIED.** Step 3 (Figma authoring): primitive + semantic collections built as variables, Button designed and bound; pre-flight passed; both collections exported to JSON (native Figma export) and **alias integrity verified — 12/12 semantic tokens resolve to existing primitives** (§6d). Steps 4–5 (repo scaffold, Style Dictionary transform, Button built + wired): done in the Claude Code repo/setup thread — see §4a, §7.2. **Figma-vs-code parity checked** via Figma MCP screenshot/metadata (§10) against all 8 variant×state combinations (`primary`/`outline` × `default`/`hover`/`focus`/`disabled`) — no discrepancies.

**Known intentional divergence from stock shadcn:** primary hover uses an explicit `--primary-hover` token instead of `hover:bg-primary/90` (see §6b, D1).

- **Decorator API:** children composition (shadcn-native, no icon props) for the slice. Figma boolean props **`start-decorator` / `end-decorator`** map to "presence of a child in that position." Naming rationale: `start`/`end` = logical/RTL-safe (vs `leading`/`trailing`); `decorator` = slot isn't icon-specific (icon, spinner, avatar…). Aligns with MUI Joy UI. shadcn has no icon prop → nothing to conflict with. If ever promoted to explicit React props, use camelCase `startDecorator`/`endDecorator` for 1:1 Figma↔code parity.
- **Variants:** `primary` + `outline`.
- **Sizes:** `md` only (others come near-free in code under path (a)).
- **States:** `default` / `hover` / `focus-visible` / `disabled`.
- **Icon slots:** decorator instance-swap placeholders. **No Icon atom yet** (deferred dependency).

---

## 6. Token naming — LOCKED

- **Structured / nested naming** (not flat). Rationale: renaming later is a breaking change that ripples into Figma bindings + JSON keys + consumers; name right once.
- **Consequence:** nested names ≠ shadcn's flat vars → a **Style Dictionary transform** is owed to flatten `color/primary/default → --primary`. Author clean; tool flattens. **Built** — see §7.2.

### 6a. Token spec — Primitives — AS BUILT (v0.7)

**Built state (Figma, verified against export):** ~189 primitives. Broader than the original "backbone only" plan — harmless, since primitives have **no consumers** until a semantic aliases them.

| Group | Contents | Notes |
|---|---|---|
| `color/brand/*` | 50, 100, 150, 200, 300…950 | brand hue (warm amber; `500 = #C68346`) |
| `color/neutral/*` | 0, 50, 100, 150, 200…950 | `0`=white · `100`=accent · `200`=border · `950`=fg (`#2E2E2E`) |
| `color/<hue>/*` | steel, green, lime, red, orange, yellow, blue, teal, violet, pink | built ahead of need; **unused** — status semantics still deferred (§9) |
| `scale/*` | 0, 25, 50, 100, 125, 200, 300, **350**, 400, 500…3200 | dimensional ramp (value = px). `350 = 14px` added for `text-sm` |
| `font/*` | family + weights | **unused** by the slice; typography lands in path (b) |
| `color/White`, `color/Black` | absolute | duplicate of `neutral/0` — do **not** alias these; use the ramp |

> Ramp deviates from the pure Tailwind mirror: adds a **`150`** step. Intentional, recorded.

### 6b. Token spec — Semantic (each aliases a primitive) — 12 tokens, v0.7

| Semantic token | Aliases → | shadcn / code var |
|---|---|---|
| `color/primary/default` | `color/brand/500` | `--primary` |
| `color/primary/hover` | `color/brand/400` | `--primary-hover` **(new, non-stock)** |
| `color/primary/foreground` | `color/neutral/0` | `--primary-foreground` |
| `color/surface/background` | `color/neutral/0` | `--background` |
| `color/surface/foreground` | `color/neutral/950` | `--foreground` |
| `color/border/default` | `color/neutral/200` | `--border` |
| `color/accent/default` | `color/neutral/100` | `--accent` |
| `color/accent/foreground` | `color/neutral/950` | `--accent-foreground` |
| `color/focus/ring` | `color/brand/500` | `--ring` |
| `radius/default` | `scale/200` | `--radius` |
| `text/size/text-sm` | `scale/350` | *(unused until path (b))* |
| `text/size/text-md` | `scale/400` | *(unused until path (b))* |

**Naming convention — LOCKED:** state is a **sibling** of `default`, not a child → `primary/hover`, **not** `primary/default-hover`. Scales predictably to `accent/hover`, `destructive/hover`, etc.

> `/default` leaf resolves Figma's "value-at-node vs children" limit; transform maps `primary/default → --primary`.

**Hover-token decision (D1) — LOCKED.** Primary hover is an **explicit token**, not an opacity modifier. Rationale: (1) Figma can't isolate fill opacity from layer contents, so opacity isn't expressible in the design SoT; (2) shadcn is already inconsistent — primary uses opacity, outline uses the `accent` *token* — so an explicit token makes the system **more** coherent. Code cost: one declarative `cva` line (`hover:bg-primary-hover` replaces `hover:bg-primary/90`).

### 6c. Binding map (bind, never hardcode)

| Variant / state | Fill | Text | Border | Radius | Notes |
|---|---|---|---|---|---|
| primary / default | `primary/default` | `primary/foreground` | — | `radius/default` | |
| primary / hover | `primary/hover` | `primary/foreground` | — | `radius/default` | code = `hover:bg-primary-hover` (**not** `/90`) |
| primary / focus-visible | `primary/default` | `primary/foreground` | — | `radius/default` | + ring = `focus/ring` |
| primary / disabled | `primary/default` | `primary/foreground` | — | `radius/default` | **whole-layer** opacity 50% = `opacity-50` |
| outline / default | `surface/background` | `surface/foreground` | `border/default` | `radius/default` | |
| outline / hover | `accent/default` | `accent/foreground` | `border/default` | `radius/default` | code = `hover:bg-accent hover:text-accent-foreground` |
| outline / focus-visible | `surface/background` | `surface/foreground` | `border/default` | `radius/default` | + ring = `focus/ring` |
| outline / disabled | `surface/background` | `surface/foreground` | `border/default` | `radius/default` | **whole-layer** opacity 50% = `opacity-50` |

### 6d. Figma native export format — VERIFIED (Jul 2026)

Two files, one per collection (`Value` = Primitives, `Light Mode` = Semantic). Mode name is embedded at `$extensions["com.figma.modeName"]`.

**Shape is DTCG-flavoured but NOT DTCG-compliant. Four things the transform must handle:**

1. **Aliases are resolved, not referenced.** `$value` holds a *concrete* value, not `{color.brand.500}`. The alias survives only as metadata:
   `$extensions["com.figma.aliasData"].targetVariableName` → e.g. `"color/brand/500"`.
   → To keep the semantic→primitive chain, the transform **must read `$extensions`** and rewrite `$value` into a Style Dictionary reference. Reading `$value` alone silently flattens the tier structure.
2. **`targetVariableName` matches the primitive's key path exactly** (slash-delimited, after the v0.7 renames) → chains are resolvable by **name matching**. Verified: **12/12 semantic tokens resolve.**
3. **Color `$value` is an object**, not a string: `{colorSpace, components[0-1 floats], alpha, hex}`. Use `.hex`; a custom parser/preprocessor is required.
4. **Numbers are unitless** (`radius/default: 8`, `text-sm: 14`) → transform appends `px` (or converts to `rem`).

**Transform output targets:** flatten `color/primary/default → --primary`, `color/primary/hover → --primary-hover`, `radius/default → --radius`, etc. per §6b, then expose via `@theme inline` (§4).

---

## 7. Open decisions

| # | Decision | Options | Status |
|---|---|---|---|
| 7.1 | Outline hover treatment | **(i) LOCKED** — added `accent` + `accent-foreground` (source: new `neutral/100`) = 9 semantic tokens, shadcn-faithful. Code: `hover:bg-accent hover:text-accent-foreground`. | `LOCKED` |
| 7.2 | Style Dictionary transform | Input format inspected & verified (§6d). **Built as a hand-rolled, zero-dependency Node script** (`scripts/build-tokens.js`, not the `style-dictionary` package — the alias-resolve/color-object/unitless-number handling in §6d is custom either way, and a plain script is easier to hand-read at low coding experience). Resolves each semantic token via `$extensions.aliasData.targetVariableName` against the primitives file, flattens to §6b var names, writes them into `src/app/globals.css`. Re-run via `npm run tokens:build`; idempotent. | `LOCKED` (built & verified) |

---

## 8. Toolkit & constraints

- Figma **Full seat, Professional plan** (confirmed) · Claude Pro · Google AI Pro · GitHub · Mac.
- **Token export path — UPDATED (v0.6):** variable collections export to JSON **natively from Figma** (confirmed working on Full/Professional, one file per collection). No third-party plugin needed → one less dependency, still €0.
  - Superseded: the earlier plan assumed a **free community export plugin** was required because the **Figma Variables REST API is Enterprise-only** (still true — REST remains unavailable to us). Native export makes the plugin moot.
  - ⚠️ Consequence: the Style Dictionary transform must be built against **Figma's native export format**, not a plugin's. Format to be inspected in the setup thread before writing the transform (§7.2).
- Low coding experience → repo/setup steps are hand-held, step-by-step.
- Claude Cowork available if useful.

---

## 9. Parked / not now

- **"Claude Code to Figma" capture** (`generate_figma_design`, code → editable Figma frames): still parked *as a token/authoring source*. It captures a *running UI* into raw frames that **don't respect** the DS's props/variants/naming — would fight the SoT. Reconsider later only for a mirror/doc layer.
  - ⚠️ **Corrected (Jul 2026):** an earlier note here implied Figma AI integration was capture-only. Not true — see §10. Canvas *writing* is available; it's the **capture** flow specifically that stays parked.
- **Figma Make ↔ repo connection:** parked (Path A first).
- **Status color ramps** (`success` / `warning` / `destructive` / `info`): deferred. Add primitives + semantics when a component actually needs them (Alerts, destructive Button, etc.). Backbone (`brand` + `neutral`) built now.
- **Dark mode: deleted, not deferred-in-code (Jul 2026).** The stock `.dark` block scaffolded by `create-next-app`/shadcn was never generated from Figma tokens — there is no dark-mode collection in the Figma export, only "Light Mode" — and nothing in the app applied the `.dark` class. Rather than keep it commented-out as "not yet wired up," it was deleted outright, since a "not generated" comment would have been permanently true, not temporarily true. **Revisit trigger:** a dark-mode collection actually authored in Figma — Figma is the token source of truth (§1), so dark mode doesn't get re-added in code speculatively ahead of that.

---

## 10. Figma MCP server — ADOPTED (verified Jul 2026)

**Seat confirmed: Full seat on Professional → 200 tool calls/day.** (View/Collab seats are capped at ~6/month — not our case.)

- **Use the remote server:** `https://mcp.figma.com/mcp`. No local setup; link-based (right-click layer → *Copy link to selection* → paste URL). Desktop server (`127.0.0.1:3845`) only needed if remote endpoints are blocked — not our case.
- **Client gating:** only clients in Figma's MCP Catalog can connect — **Claude Code**, Codex, Cursor, VS Code, Gemini CLI, Xcode. **Not available in claude.ai web chat.** → MCP lives in the *setup/build* threads via Claude Code, not the architecture thread.
- For Claude Code, Figma recommends the plugin (bundles MCP config + Agent Skills) over a raw MCP entry.

**Capabilities**
- *Read:* live file structure — node tree, layout, variables/tokens. Use for **parity verification** (does the built component match Figma?).
- *Write:* `use_figma` can create/edit frames, components, **variables**, styles, text. Use for **authoring assist** (e.g. generating ramp steps from spec).

**Role in the pipeline — LOCKED**
- MCP = **verification + authoring assist.**
- MCP is **NOT** the token export path. Reads are selection-scoped and don't dump full collections with alias chains intact. **Style Dictionary still consumes the plugin's raw JSON export.** (§6)

**Watch items**
- Write tools free during beta; Figma has signalled eventual usage-based pricing → re-check against the €0 constraint before depending on it.
- Rate limits attach to the **team owning the file**, not your account — files in Drafts/Starter teams can hit Starter limits despite a Full seat.

---

## 11. Working process

- **Threads split by mode, not by step:** architecture/decisions (this thread) · repo/setup · per-component slices · AI-docs authoring.
- **Tool split:** *claude.ai web chat* = architecture, decisions, spec-writing (no repo/Figma access). *Claude Code* = repo, commands, file edits, Figma MCP. Decisions land in this doc; execution happens in Claude Code.
- **First real split = at the repo scaffold (step 5).** Don't split mid-slice.
- Every new thread starts by pointing at this doc.
- AI flags checkpoints worth splitting or generating files proactively.

---

## Changelog

- **v0.8** — Steps 4–5 done: repo scaffolded (Next.js 16 + React 19 + Tailwind v4 + shadcn), Style Dictionary transform built as a zero-dependency script (§7.2), tokens wired into `globals.css`, Button built per §5/§6c and verified in-browser, then parity-checked against the Figma reference via MCP (§10) — no discrepancies across all 8 variant×state combinations. **New §4a** records six drifts surfaced by scaffolding against a current shadcn CLI, none of which changed §6b/§6c: shadcn now offers a primitive-library choice (took **Base UI** over Radix), a named style-preset system (took **Nova**), stock primary-hover opacity moved `/90→/80`, stock outline-hover moved `accent→muted`, no stock `md` size key exists (named ours directly), and `focus-visible:border-ring` was dropped from the copied-in base classes since §6c keeps the border unchanged on focus (ring-only), diverging from the current stock default.
- **v0.7** — Tokens built & verified. **D1 LOCKED:** primary hover = explicit `--primary-hover` token (aliases `brand/400`), not an opacity modifier — Figma can't isolate fill opacity, and shadcn was already inconsistent (outline uses a token). **Naming convention LOCKED:** state is a sibling of `default` → `primary/hover`, not `primary/default-hover`. **D2 LOCKED:** `text/size/*` now alias `scale/350` (14px, added) + `scale/400`; unused until path (b). Semantic tier = **12 tokens**. §6a reconciled to as-built primitives (~189, incl. unused hues/scale/font). **New §6d:** verified Figma native export format — aliases resolved not referenced (live in `$extensions.aliasData`), color `$value` is an object, numbers unitless; 12/12 chains resolve by name. Figma naming cleanup done (lowercase, no spaces/parens).
- **v0.6** — Step 3 (Figma authoring) marked DONE. **Token export path changed:** native Figma JSON export (per collection) replaces the planned free community plugin — one less dependency, still €0. REST API remains Enterprise-only/unavailable. §7.2 updated: transform must be written against Figma's native format, alias chains resolved.
- **v0.5.1** — Housekeeping: renumbered sections so file order is sequential (MCP = §10, Working process = §11); §8 seat clarified as Full/Professional.
- **v0.5** — Added Figma MCP server section (adopted). Corrected earlier outdated claim that AI↔Figma was capture-only — remote MCP has read *and* write (`use_figma`). Seat confirmed Full/Professional (200 calls/day). MCP scoped to **verification + authoring assist**, explicitly *not* the token export path. Client gating → MCP runs in Claude Code, not web chat; added tool split to §10.
- **v0.4** — Decorator slot naming: `leading-icon`/`trailing-icon` → **`start-decorator`/`end-decorator`** (logical/RTL-safe, content-agnostic, matches MUI Joy UI). No shadcn conflict (children composition). Future explicit props → camelCase `startDecorator`/`endDecorator`.
- **v0.3** — Palette scope (option A): full **primitive** tier now — `brand` + `neutral` ramps on Tailwind scale (`50–950` + `0`). Semantics held at 9 (slice unchanged). Primary/ring re-aliased `brand/base → brand/500`. Status ramps deferred (§9).
- **v0.2** — Closed §7.1: outline hover = shadcn-faithful `accent` (option i). Added primitive `neutral/100` + semantic `accent/default` / `accent/foreground` (9 semantic tokens total). Filled outline/hover binding. Step 3 (Button Figma spec) now fully locked.
- **v0.1** — Seeded: forks 1–3, scope de-scoping (P7/Storybook/component-tier), architecture principles, Tailwind v4 foundation (path a/b), Button slice, structured token naming + spec tables, open decisions, toolkit/constraints, parked items, working process.
