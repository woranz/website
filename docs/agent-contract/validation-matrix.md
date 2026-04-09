# Validation Matrix

Use the smallest validation set that matches the current stage and the stability of the seam being changed.

## Canonical Rule

Do not spend tokens on broad validation while the work is still exploratory. Validation should scale with change type and stability, not with anxiety.

## Stage Matrix

| Stage / Change Type | Default Validation | Escalate To | Do Not Default To |
| --- | --- | --- | --- |
| `Product` | Docs + content audit only | None | `npm run build`, Playwright |
| `UI` | Visual review, Playwright screenshot | More visual states if the UI is complex | `npm run build` |
| `Frontend` exploratory UI | Visual review, targeted Playwright, manual smoke | `npm run build` if implementation stabilizes | broad suites |
| `Frontend` Sanity schema change | Verify schema + check content rendering | `npm run build` if types change | full suite |
| `Frontend` quoter / form logic | Targeted tests + manual flow check | `npm run build` if logic spreads | Playwright-only |
| `Frontend` API route (`app/api/*`) | Targeted tests + `npm run build` | Full build when external API contracts involved | Visual-only |
| `Frontend` reusable component | Visual review + 1-3 focused checks | Playwright if browser behavior matters | snapshot-heavy tests |
| `Frontend` SEO / metadata | Build + manual Lighthouse check | Full build when structured data changes | Visual-only |
| `Review` stage | Static evidence, grep, targeted checks | Relevant contract checks if drift suspected | implementation validation suites |

## Mandatory Escalation Rules

- Run `npm run build` when the change affects TypeScript types, Sanity schemas, or API routes.
- Run targeted visual checks for:
  - `components/ui/*`
  - `components/site/*`
  - `components/templates/*`
  - quoter/form components
- Use visual review first for exploratory UI.
- Use Playwright when the feature crosses browser-only seams:
  - navigation between segments
  - form submission flows
  - carousel / interactive behavior
  - responsive breakpoints

## Reporting Requirement

Every implementation or testing response must state:

- what validation scope was chosen
- why it was chosen
- what was intentionally skipped
- residual risk, or explicit `none`
