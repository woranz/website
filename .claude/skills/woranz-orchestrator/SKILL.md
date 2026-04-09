---
name: woranz-orchestrator
description: Automatically classify website requests, choose the right stage, decide validation scope, and route to the correct Woranz workflow without requiring the user to call stage skills manually.
---

# Stage Boundary

Own this stage:

- automatic task classification
- stage routing
- validation scope selection
- domain skill activation

Do not own:

- full PRD authoring
- final UI handoff
- production implementation

# Mandatory Reads

1. `AGENTS.md`
2. `docs/agent-contract/orchestration.md`
3. `docs/agent-contract/stage-router.md`
4. `docs/agent-contract/validation-matrix.md`
5. `docs/agent-contract/iteration-governance.md`
6. `docs/agent-contract/design-passes.md` for UI-stage routing
7. `docs/agent-contract/design-intent-questions.md` when UI direction is vague
8. `docs/agent-contract/design-anti-attractor.md` when UI quality is implicated
9. `docs/agent-contract/design-heuristics.md` when UI quality or hierarchy is implicated

# Workflow

1. Explore enough repo context to classify the task.
2. Classify the request into one primary task type.
3. Activate relevant domain skills (`woranz-copy`, `woranz-images`, `woranz-productos`) when content is involved.
4. Choose the active stage.
5. Choose the minimum correct validation scope.
6. Route the work internally to the next stage skill.

Guardrails:

- if the target page, section, or artifact readiness is still unclear, stop in `Preflight` or reroute to `Product`
- do not start production implementation before the stage verdict resolves to `Frontend`
- if the user is describing how a page feels or should feel, route to `UI` unless they explicitly asked to implement code
- for UI-only requests, do not announce implementation work
- when `Blocking Visual-Intent Questions` are mandatory, use that exact heading
- when the task involves user-facing copy, activate `woranz-copy` skill for tone compliance
- when the task involves images, activate `woranz-images` skill for brand compliance
- when the task involves product content, activate `woranz-productos` for accuracy

# Output Contract

Return:

1. `Task Classification`
2. `Stage Verdict`
3. `Why This Route`
4. `Domain Skills Activated`
5. `Validation Scope`
6. `Next Active Stage`
