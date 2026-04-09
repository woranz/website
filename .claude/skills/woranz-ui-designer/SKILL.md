---
name: woranz-ui-designer
description: Create Woranz website UI handoffs from approved PRDs with strong reuse discipline, benchmark-aware visual quality, brand compliance, responsive behavior, and visual validation.
---

# Stage Boundary

Own this stage:

- visual hierarchy
- component reuse decisions
- responsive behavior
- section composition
- UI handoff quality

Do not own:

- changing product scope
- inventing CMS schemas
- production implementation

If the PRD is not approved, stop and reroute to `Product`.

# Mandatory Reads

1. `AGENTS.md`
2. `docs/agent-contract/stage-router.md`
3. `docs/agent-contract/validation-matrix.md`
4. `docs/agent-contract/iteration-governance.md`
5. `docs/agent-contract/design-intent-questions.md`
6. `docs/agent-contract/design-anti-attractor.md`
7. `docs/agent-contract/design-heuristics.md`
8. `docs/agent-contract/design-anti-patterns.md`
9. `docs/agent-contract/design-distillation.md`
10. `docs/agent-contract/design-passes.md`
11. `docs/agent-contract/design-voice.md`
12. `.claude/skills/woranz-copy/SKILL.md` for copy tone
13. `.claude/skills/woranz-images/SKILL.md` for image guidelines
14. `.claude/skills/woranz-productos/PRODUCTOS.md` when product pages are involved
15. `.claude/skills/woranz-design/SKILL.md` for Pencil implementation specs (grid, spacing, component construction)

# Hard Blocks

Do not produce a UI handoff without:

- approved PRD
- `Critique Findings`
- `Anti-Attractor Notes`
- component reuse audit
- `Component Mapping`
- `Normalization Plan`
- `Heuristic Audit`
- `Voice Notes`
- `Distill Notes`
- `Polish Notes`
- visual risk notes
- copy tone verification (woranz-copy compliance)

Treat design anti-patterns as blocking defects, not optional taste notes.
Treat generic or template-like output as a blocking defect. Use `docs/agent-contract/design-voice.md` to recover Woranz-specific character.
Treat vague quality briefs as unresolved until 2 or 3 `Blocking Visual-Intent Questions` have been answered.
Treat copy that uses "usted", corporate insurance-speak, or generic marketing language as a blocking defect.

Repo-first violations are blocking:

- do not invent sections or components without a real repo mapping
- if a region cannot be mapped to `components/ui/`, `components/site/`, or `components/templates/`, stop and mark the gap

For new pages and major redesigns, a `Benchmark Packet` is mandatory.

# Workflow

1. Confirm the request belongs to `UI`.
2. Audit existing Woranz components before inventing new composition.
3. Build a `Component Mapping` before locking the layout.
4. If the page is new, assemble the `Benchmark Packet`.
5. If the brief is visually vague, answer 2 or 3 `Blocking Visual-Intent Questions`.
6. Run `critique` and record findings.
7. Run `anti-attractor` and reject reflex defaults.
8. Produce a `Heuristic Audit`.
9. Run `normalize` to pull the proposal to Woranz patterns and tokens.
10. Run `voice` to remove generic feel (cross-check with woranz-copy and woranz-images skills).
11. Run `distill` to cut excess.
12. Run `polish` after structure, voice, and distillation are correct.
13. Produce or update `ui-spec.md`.
14. Re-anchor on every iteration using `challenge first`.

# Output Contract

Return:

1. `UI Preflight`
2. `Blocking Visual-Intent Questions` when required
3. `Critique Findings`
4. `Anti-Attractor Notes`
5. `Heuristic Audit`
6. `Normalization Plan`
7. `Component Mapping`
8. `Distill Notes`
9. `Voice Notes`
10. `Benchmark Packet` when required
11. `Polish Notes`
12. `Visual Risk Notes`
13. `UI Postflight`
