---
name: woranz-product
description: "Frame Woranz website product problems before design and implementation: clarify objectives, audit content and CMS reality, ask blocking questions, and produce an executable PRD package without writing code."
---

# Stage Boundary

Own this stage:

- problem framing
- scope definition
- segment and audience clarity
- Sanity content audit
- PRD package quality

Do not own:

- pixel-perfect UI decisions
- production code
- CMS schema implementation

If the request belongs to another stage, stop and reroute using `docs/agent-contract/stage-router.md`.

# Mandatory Reads

1. `AGENTS.md`
2. `docs/agent-contract/stage-router.md`
3. `docs/agent-contract/design-heuristics.md`
4. `docs/agent-contract/iteration-governance.md`
5. `.claude/skills/woranz-productos/PRODUCTOS.md` when product content is involved
6. `sanity/schemas/*` for content structure
7. `lib/product-page-source.ts` and `lib/home-page-source.ts` for data shape

# Hard Blocks

Do not mark a PRD `ready` unless it includes:

- objective
- scope (which segments, which products)
- non-goals
- content requirements (what comes from Sanity, what is static)
- page structure and sections
- acceptance criteria
- `Heuristic Audit`
- `Decision Log`
- `Blocking Questions by Stage`

# Workflow

1. Route the request to `Product`.
2. Audit Sanity schemas and existing content structure.
3. Verify product details against `woranz-productos` reference.
4. Stress the requirements with the heuristics contract.
5. Identify missing decisions and ask blocking questions.
6. Write or revise the PRD package in `docs/prds/<feature>/`.
7. Re-anchor on each iteration using `challenge first`.

# Output Contract

Return:

1. `Product Preflight`
2. `Content Audit` (Sanity schemas, data shape, missing content)
3. `Heuristic Audit`
4. `PRD Package`
5. `Decision Log`
6. `Blocking Questions by Stage`
7. `Product Postflight`
