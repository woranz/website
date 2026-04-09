# Woranz Design Heuristics

Use this file to ground Product, UI, and Review work in explicit UX heuristics instead of vague "good taste".

## Scope & Authority

This doc owns **process and judgment** — when a proposal violates a heuristic, what to reject, what questions to ask. For **concrete Pencil values** (spacing px, corner radius, component construction code), use `.claude/skills/woranz-design/SKILL.md`. Both docs complement each other; neither overrides the other in its own domain.

## Canonical Rule

If a proposal violates a core heuristic, the issue is structural. Do not hide it with polish.

## Website-Specific Translation

### Visibility Of System Status

- The user should always know whether a quoter is calculating, a form is submitting, or content is loading.
- Loading states should appear close to the affected component, not in a distant global location.
- Quote results, form confirmations, and error states should feel immediate and local.

### Match Between System And Domain

- Use insurance domain language that feels human, not corporate (see woranz-copy skill).
- Name the product the user is exploring, not the layout shape around it.
- Empty states and CTAs should explain why the coverage matters, not just what is absent.

### User Control And Freedom

- Users browsing product pages should be able to navigate freely between segments.
- Quoter flows should allow going back without losing entered data.
- Do not trap users in forced funnels when they are still exploring.

### Consistency And Standards

- Reuse Woranz terms, button hierarchy, card patterns, and section conventions.
- Equal styling implies equal behavior. Do not style unrelated actions as peers.
- If a pattern already exists in `components/ui/` or `components/site/`, use it before inventing.

### Error Prevention And Recovery

- Validate quoter inputs as early as possible.
- Show field-level guidance when the user can fix the problem locally.
- Error states must say what failed and what the next action is.

### Recognition Rather Than Recall

- Keep the active product, segment, and coverage visible.
- Prefer visible labels and inline state over hidden memory burden.
- Product comparison should not require remembering details from other pages.

### Affordances And Signifiers

- Interactive elements need visible signifiers without relying on hover.
- CTAs must be obviously clickable and distinct from informational content.
- Quoter inputs should look and feel like form controls, not content blocks.

### Constraints And Feedback

- When a coverage is not available, explain why visibly.
- Disabled quoter fields need enough context to feel intentional, not broken.
- When a quote is generated, the result should appear immediately and clearly.

## Gestalt Rules For Woranz

### Proximity

- Related elements must sit closer to each other than to unrelated neighbors.
- Product feature + description + CTA belong to one visual family.
- Section spacing must be larger than the spacing inside a section.
- Hero headline, supporting text, and primary CTA should read as one decision cluster.

### Common Region

- Use a shared container only when the items are truly one conceptual group.
- Do not wrap every block in a card just to force grouping.
- Quoter form fields that affect the same calculation belong in one region.

### Similarity

- Repeated visual treatment signals repeated role.
- Do not use the same card style for product features, testimonials, and FAQ items.
- Product cards across segments should encode state consistently.

### Continuity And Alignment

- Scan lines should feel intentional.
- Section headings and content should align on a consistent grid.
- Avoid stair-step layouts that make the eye restart on every section.

### Figure And Ground

- One block should clearly own the user's first read (usually the hero).
- Supporting sections must stay visually subordinate to the main value proposition.
- Decorative warmth must not overpower the content.

## Proximity Checklist

Run this check whenever spacing or grouping feels off:

- Is the gap inside a section smaller than the gap between sections?
- Are quoter field labels closer to their fields than to the next field?
- Are product CTAs grouped with the product framing, not floating in a distant corner?
- On mobile, does stacking preserve the same conceptual groups, or does it scramble them?

## Output Contract

### Product

PRDs must include a `Heuristic Audit` that calls out risky or weak requirements.

### UI

UI specs must include a `Heuristic Audit` showing which heuristics drove the layout choices.

### Review

Review findings should cite the violated heuristic when it explains the defect clearly.
