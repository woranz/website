# Website Orchestration

Use this as the default entrypoint for any request when the user did not explicitly choose a stage.

## Canonical Rule

The user should not need to call stage skills one by one. The agent must infer the most likely path, route the work, and only ask a clarifying question when ambiguity is materially risky.

If the request is ambiguous enough that the target surface, artifact readiness, or requested output is unclear, do not assume a page or section. Stop in `Preflight` or reroute to `Product` first.

## Default Entry

When a request does not explicitly name a stage command or skill:

1. Start in `Orchestrator`
2. Explore the repo enough to classify the work
3. Pick the active stage
4. Decide whether sub-agents are needed
5. Route internally to the correct stage skill or command

If the stage is ambiguous after exploration, ask a concise question. Do not ask questions that repo exploration could answer.

## Task Classification

| Task Type | Typical Signals | Default Route |
| --- | --- | --- |
| `new-page` | new landing, new product page, new section, undefined scope | `Product` unless approved PRD and UI spec already exist |
| `approved-page` | explicit PRD + UI spec, implementation request | `Frontend` |
| `ui-redesign` | redesign, improve hierarchy, stronger visuals, mockup, handoff | `UI` |
| `bugfix` | broken behavior, repro, regression, "fix" | `Frontend` |
| `visual-fix` | spacing, typography, polish, interaction detail | `UI` if design intent is unresolved, otherwise `Frontend` |
| `review` | review, audit, critique, pass/fail, findings | `Review` |
| `copy-update` | change text, tone, labels, CTAs | Load `woranz-copy` skill, then `UI` or `Frontend` |
| `image-update` | new photos, illustrations, hero images | Load `woranz-images` skill, then `UI` or `Frontend` |
| `product-content` | new insurance product, product page content | Load `woranz-productos`, then `Product` |
| `quoter` | calculator, pricing form, quoter flow | `Product` if scope unclear, `Frontend` if spec exists |
| `cms-content` | Sanity schema, content types, editorial workflow | `Frontend` |
| `seo` | metadata, structured data, performance, Core Web Vitals | `Frontend` |
| `primitive-addition` | new component, primitive, control, pattern gap | Check `components/ui/` first |
| `ambiguous` | mixed concerns, unclear readiness, unclear stage | `Preflight` |

## Routing Rules

### New Page

Route to `Product` if any of these is true:

- no approved PRD
- no clear objective or target segment
- content structure is unclear
- acceptance criteria are missing

### Bugfix

Default route: `Frontend`. If the bug is actually a UX/design defect without stable accepted intent, route to `UI` first.

### UI-Only Requests

If the request is about how the UI should feel or read, default to `UI`, not `Frontend`.

Strong signals:

- `se siente`
- `más cálido`
- `menos genérico`
- `más premium`
- `más Woranz`
- `más confiable`
- `más directo`

For these requests:

- do not start production implementation
- do not start a local implementation spike unless the user explicitly asked to edit code

### UI Stage Quality Rule

When the route resolves to `UI`, the stage must run these internal passes automatically:

1. `benchmark` when required
2. `Blocking Visual-Intent Questions` when the brief is visually vague
3. `critique`
4. `anti-attractor`
5. `normalize`
6. `voice`
7. `distill`
8. `polish`

### Domain Skill Integration

When the task involves copy, images, or product content:

- Load the relevant domain skill (`woranz-copy`, `woranz-images`, `woranz-productos`) before the process skill
- Domain skills define brand compliance; process skills define workflow
- Never skip domain skill validation for user-facing content

## Clarifying Question Rule

Ask a question only when:

- repo exploration cannot resolve the ambiguity
- the answer changes the stage or validation scope materially
- proceeding with an assumption would be risky

Otherwise make a reasonable default choice and say what you assumed.

## Output Contract

The orchestrator should produce:

1. `Task Classification`
2. `Stage Verdict`
3. `Why This Route`
4. `Sub-Agent Plan` when needed
5. `Validation Scope`
6. `Next Active Stage`
