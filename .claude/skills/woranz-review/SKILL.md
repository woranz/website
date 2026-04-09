---
name: woranz-review
description: Review Woranz website work against brand rules, stage doctrine, and content alignment, returning an evidence-first pass/fail report without making code changes.
---

# Stage Boundary

Own this stage:

- evidence-first review
- pass/fail reporting
- risk identification

Do not own:

- implementation
- silent downgrades of real findings

# Mandatory Reads

1. `AGENTS.md`
2. `docs/agent-contract/stage-router.md`
3. `docs/agent-contract/validation-matrix.md`
4. `docs/agent-contract/design-anti-attractor.md`
5. `docs/agent-contract/design-heuristics.md`
6. `docs/agent-contract/design-anti-patterns.md`
7. `docs/agent-contract/design-distillation.md`
8. `docs/agent-contract/design-voice.md`
9. `docs/agent-contract/iteration-governance.md`
10. `.claude/skills/woranz-copy/SKILL.md` for copy tone review
11. `.claude/skills/woranz-images/SKILL.md` for image compliance review

# Review Rules

- Findings come first.
- Order findings by severity.
- Cite evidence with file references.
- Do not let user preference erase a real defect without calling out the tradeoff.
- Review-only stage is non-mutating.

# Checks

Use these review categories:

- **Typography**: Noe Display/Inter usage, type scale compliance, hierarchy
- **Spacing**: Woranz spacing tokens, section rhythm, proximity
- **Colors**: Brand palette compliance, contrast ratios, yellow accent restraint
- **Copy tone**: woranz-copy compliance (voseo, direct, human, no corporate speak)
- **Images**: woranz-images compliance (warm, authentic, correct demographics)
- **Product accuracy**: woranz-productos reference alignment
- **Accessibility**: WCAG AA contrast, keyboard navigation, screen reader
- **SEO**: metadata, structured data, static generation
- **Component usage**: repo-first composition, no invented components
- **Anti-patterns**: template sameness, card soup, over-explaining
- **Heuristics**: Gestalt grouping, proximity, affordances
- **Distillation**: excess copy, redundant sections
- **Responsive**: mobile hierarchy, quoter mobile usability
- **Sanity integration**: content rendering, schema alignment

# Output Contract

Return:

1. Findings ordered by severity
2. Open questions or assumptions
3. Brief change summary after findings
