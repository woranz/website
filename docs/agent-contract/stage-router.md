# Stage Router

Route every request through this document before planning, designing, coding, or reviewing.

## Canonical Rule

- Pick exactly one active stage before doing substantive work.
- If the user did not explicitly choose a stage, start with `Orchestrator`.
- If the request spans multiple stages, stop at the earliest unresolved stage.
- If the stage is unclear, run Preflight first.
- If the target surface or artifact readiness is unclear, stay in `Preflight` or reroute to `Product`.
- If the request belongs to a different stage than the current command/skill, stop and reroute.

## Stages

| Stage | Owns | Required Inputs | Hard Blocks |
| --- | --- | --- | --- |
| `Product` | Problem framing, scope, PRD, content audit, blocking questions | Goal, segment, scope intent | Never mark `ready` without objective, scope, non-goals, content requirements, acceptance criteria, `Decision Log`, `Blocking Questions by Stage` |
| `UI` | Visual direction, reuse, responsive behavior, UI spec, state design | Approved PRD | Never produce a UI handoff without approved PRD. New key pages require a `Benchmark Packet`. |
| `Frontend` | Production code, Sanity integration, SEO, a11y, release-quality validation | Approved PRD, approved UI spec | Never implement without PRD + UI spec unless the user explicitly requests a spike. |
| `Review` | Mechanical compliance review, pass/fail evidence, risks | Existing diff or feature scope | Review-only. Do not fix code in this stage. |
| `Preflight` | Stage routing, readiness, blockers, validation scope | Any request that is ambiguous or mixed-stage | Never skip when the stage is unclear. |

## Routing Rules

### Product

Use when the request is about:

- defining scope for a new page or section
- deciding what to build
- checking content requirements with Sanity schemas
- producing or revising a PRD
- defining quoter flows or conversion funnels

### UI

Use when the request is about:

- visual direction
- page composition (hero, sections, cards, CTAs)
- hierarchy and rhythm
- responsive behavior
- component reuse
- mockups or UI spec handoff

### Frontend

Use when the request is about:

- changing production code
- wiring Sanity data to components
- implementing the approved UX
- quoter logic and form flows
- SEO metadata and structured data
- API integrations (Woranz API, SendGrid)

### Review

Use when the request is about:

- auditing existing work
- pass/fail compliance
- evidence gathering without implementation

### Preflight

Use when:

- the request mixes stage concerns
- implementation is requested but readiness is unclear
- the request could trigger avoidable token spend or wrong validation scope

## Exit Criteria

- `Product` exits with a PRD package that downstream stages can execute without inventing missing decisions.
- `UI` exits with a UI spec package containing reuse audit, state audit, benchmark packet when required, and visual risk notes.
- `Frontend` exits with merge-ready code plus validation evidence.
- `Review` exits with evidence-first findings.
- `Preflight` exits with stage verdict, blockers, validation scope, and next command/skill.

## Stage Mismatch Response

When the request lands in the wrong stage:

1. State the detected stage.
2. State why the current stage is blocked or premature.
3. Point to the correct next skill/command.
4. Do not continue silently.
