# Design Anti-Patterns

Use this file to keep LLM-generated UI from collapsing into generic, low-judgment output.

## Canonical Rule

If a proposal contains one or more of these anti-patterns, it is not ready for handoff. These are blocking defects.

## Structural Anti-Patterns

### Template sameness

- hero sections that default to stock photo + generic headline + two buttons
- three-column feature grids that could belong to any SaaS or insurtech
- safe but emotionally flat pages with no stronger read

Fix:

- establish one dominant read before adding supporting sections
- let the insurance domain and segment shape the page, not a landing page template
- use `docs/agent-contract/design-voice.md` to recover Woranz-specific character

### Fake Woranz

- custom sections, banners, or controls that do not map to actual Woranz components
- freeform mockups that merely "look plausible" but bypass `components/ui/`, `components/site/`, or `components/templates/`
- invented styles that do not exist in `tailwind.config.ts` or `globals.css`

Fix:

- work repo-first, not imagination-first
- map every visible region to a real component or pattern
- if a region has no mapping, stop and document the gap explicitly

### Card soup

- every section rendered as a generic card
- cards inside cards
- no clear page-level rhythm or hierarchy

Fix:

- define page structure first (hero → value prop → features → social proof → CTA)
- use one dominant container pattern per section
- reserve cards for actual grouped content, not as a default wrapper

### Proximity inversion

- spacing inside a section is equal to or larger than spacing between sections
- labels, helpers, or inline errors feel detached from the fields they explain
- CTAs are visually closer to the wrong content block

Fix:

- make intra-section spacing tighter than inter-section spacing
- keep CTAs nearest to the value proposition they support
- use `docs/agent-contract/design-heuristics.md` to correct grouping

### Over-explaining

- helper paragraphs that repeat the headline or CTA
- "friendly" text that adds words without reducing uncertainty
- insurance jargon wrapped in extra explanation instead of being simplified

Fix:

- keep only the line that changes a decision or lowers real anxiety
- run `docs/agent-contract/design-distillation.md` before approving
- use woranz-copy skill for tone and conciseness

## Typography Anti-Patterns

### Default-stack drift

- interchangeable typography with no clear hierarchy
- not using Noe Display for headlines
- overuse of the same weight everywhere

Fix:

- use Woranz type scale (`display`, `section`, `lead`, `body`, `label`)
- Noe Display for structural headings, Inter for supporting content
- let the type scale create hierarchy, not color or decoration

## Color Anti-Patterns

### Yellow overload

- `woranz-yellow` used everywhere, losing its accent power
- all buttons, tags, and highlights compete equally

Fix:

- keep yellow scarce and meaningful (primary CTAs, key accents)
- use warm palette (`woranz-warm-*`) for backgrounds and subtle emphasis
- reserve `woranz-ink` for strong contrast

### Washed contrast

- light text on warm backgrounds becoming unreadable
- low-contrast metadata

Fix:

- ensure accessible contrast ratios (WCAG AA minimum)
- test warm backgrounds with dark ink text

## Interaction Anti-Patterns

### Hover-only intelligence

- meaning or actions appear only on hover
- desktop-centric affordances without touch equivalent

Fix:

- ensure mobile and keyboard users can discover the same behavior
- treat hover as enhancement, not dependency

### Dead empty states

- quoter shows no guidance before input
- product pages show nothing meaningful before Sanity content loads

Fix:

- acknowledge the state
- explain value
- give one clear next action or useful default

## Layout Anti-Patterns

### Mobile afterthought

- desktop layout merely stacked on mobile
- hero images blocking the viewport
- quoter forms too wide for mobile

Fix:

- define mobile hierarchy intentionally
- simplify sections and reduce simultaneous decisions on small screens
- test quoter flows on mobile viewports

## Quality Gate

Before approving a UI handoff, explicitly ask:

- Is this page structurally legible without decorative chrome?
- Is there one clear value proposition in the hero?
- Does the hierarchy survive on mobile?
- Did I reuse Woranz patterns before inventing?
- Can every visible region be traced to a real Woranz component or Tailwind token?
- Is the copy Woranz-toned (direct, human, voseo) or generic corporate?
