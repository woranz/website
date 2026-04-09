# Design Passes

These passes are mandatory inside the `UI` stage for any meaningful visual work.

## Canonical Rule

Do not treat "designing the page" as one step. Run the passes in order so intent, critique, system alignment, and finish quality happen explicitly.

## Pass Order

1. `visual-intent` when required
2. `critique`
3. `anti-attractor`
4. `normalize`
5. `voice`
6. `distill`
7. `polish`

For new pages, primary flows, and major redesigns, run `benchmark` before `critique`.
When the brief is visually vague, run `visual-intent` after `benchmark` and before `critique`.

## `visual-intent`

Purpose: clarify what the page should feel like before changing the layout.

Required when:

- the brief asks for a page to feel less corporate, less generic, more Woranz, more trustworthy
- the request is a redesign or visual fix with weak stated direction

Checks:

- ask or answer 2 or 3 direction-changing questions
- resolve what should become obvious in 3 seconds
- resolve whether the surface is conversion-focused, informational, or exploratory
- resolve where warmth should come from: copy, imagery, emphasis, or specificity

Output: `Blocking Visual-Intent Questions`

## `benchmark`

Purpose: collect external and internal references, define the quality bar.

Required when: new page, primary flow, major redesign.

Output: `Benchmark Packet`

## `critique`

Purpose: identify weak hierarchy, generic composition, communication issues.

Questions:

- What is the page trying to make obvious in 3 seconds?
- What feels generic or interchangeable?
- Where is the hierarchy too flat or too noisy?
- Where does Gestalt proximity or grouping break down?
- Which anti-patterns are present?
- Does the copy follow woranz-copy tone?

Output: `Critique Findings`

## `anti-attractor`

Purpose: reject reflex defaults before they become the page.

Required read: `docs/agent-contract/design-anti-attractor.md`

Output: `Anti-Attractor Notes`

## `normalize`

Purpose: pull the proposal back into Woranz conventions.

Checks:

- component reuse (`components/ui/`, `components/site/`, `components/templates/`)
- token compliance (`tailwind.config.ts`, `globals.css`)
- spacing and rhythm (Woranz spacing tokens)
- CTA discipline
- copy tone compliance (woranz-copy)
- image compliance (woranz-images)

Output: `Normalization Plan`, `Component Mapping`

## `voice`

Purpose: remove generic feel, make recognizably Woranz.

Required reads:

- `docs/agent-contract/design-voice.md`
- `.claude/skills/woranz-copy/SKILL.md`

Output: `Voice Notes`

## `distill`

Purpose: remove explanatory excess.

Required read: `docs/agent-contract/design-distillation.md`

Output: `Distill Notes`

## `polish`

Purpose: improve finish quality once the structure is already correct.

Checks:

- alignment and spacing rhythm
- wording and labels (woranz-copy compliance)
- CTA quality
- one controlled warmth moment
- interaction feedback
- mobile clarity
- visual friction or awkward transitions

Output: `Polish Notes`

## Quality Gate

The UI stage is not done until it can show:

- `Benchmark Packet` when required
- `Blocking Visual-Intent Questions` when required
- `Critique Findings`
- `Anti-Attractor Notes`
- `Normalization Plan`
- `Component Mapping`
- `Heuristic Audit`
- `Voice Notes`
- `Distill Notes`
- `Polish Notes`
- `Visual Risk Notes`

## Repo-First Rule

Every meaningful surface must map:

- page region -> actual component or pattern
- visual treatment -> existing token/component, not ad-hoc CSS invention
- copy -> woranz-copy tone compliance
- images -> woranz-images guidelines compliance
