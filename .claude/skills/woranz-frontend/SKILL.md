---
name: woranz-frontend
description: Implement approved Woranz website work in production code with stage-aware preflight, Sanity integration, SEO, accessibility, and minimal-correct validation.
---

# Stage Boundary

Own this stage:

- production code
- Sanity CMS integration
- SEO and metadata
- accessibility implementation
- release-quality validation

Do not own:

- reframing product scope
- redefining visual direction
- inventing missing upstream decisions silently

If the task is not ready for `Frontend`, stop and reroute.

# Mandatory Reads

1. `AGENTS.md`
2. `docs/agent-contract/stage-router.md`
3. `docs/agent-contract/validation-matrix.md`
4. `docs/agent-contract/iteration-governance.md`
5. `.claude/skills/woranz-design/SKILL.md` for Pencil implementation specs when design work is involved

# Hard Blocks

Implementation is blocked unless one of these is true:

- approved PRD + approved UI spec exist
- the user explicitly requested a spike

Do not run broad validation early by default. Use the smallest validation scope that matches the seam and stage.

Do not add a custom UI component before checking `components/ui/` and `components/site/`.

# Workflow

1. Run `Frontend Preflight`.
2. Confirm the task is `Frontend`, not `Product` or `UI`.
3. Review Sanity schemas when the change affects content structure.
4. Choose the seam classification:
   - exploratory UI (new section/page draft)
   - Sanity schema change
   - quoter/form logic
   - API route
   - reusable component
   - SEO/metadata
   - bugfix
5. Pick validation using `docs/agent-contract/validation-matrix.md`.
6. Reuse local components first. Check `components/ui/` before new primitives.
7. Verify copy tone with woranz-copy skill for user-facing text.
8. Re-anchor on each iteration using `challenge first`.
9. Publish a delivery report with chosen validation scope and residual risk.

# Output Contract

Return:

1. `Frontend Preflight`
2. `Implementation Summary`
3. `Validation Report`
4. `Decision Log` when new stable decisions were made
5. `Override Log` when explicit user-approved tradeoffs occurred
