# Woranz Website — Agent Entry Point

Read this file before taking any action on a `/frontend` or general request.

## Project

- **Product**: Woranz — insurtech website (landing pages, product pages, quoters)
- **Stack**: Next.js 14 App Router + TypeScript + Tailwind CSS + Sanity CMS
- **Segments**: `/personas` (B2C), `/empresas` (B2B), `/productores` (agent-facing)
- **Content**: Sanity headless CMS with live editing
- **APIs**: Woranz API (`lib/woranz-api.ts`) + SendGrid email
- **Design files**: Pencil (`.pen`), synchronized with Figma

## Truth Hierarchy

1. Code (`components/`, `app/`, `lib/`)
2. Storybook / component catalog
3. Pencil / Figma design files
4. Agent-contract docs (this framework)

## Component Source

- **Primitives**: `components/ui/` — shadcn/ui + Woranz extensions
- **Site patterns**: `components/site/` — header, footer, logo, segment tabs
- **Templates**: `components/templates/` — page-level layouts (product page)
- **Tokens**: `tailwind.config.ts` + `app/globals.css`

## Design System Tokens

- **Brand color**: `woranz-yellow` (#FFE016)
- **Ink**: `woranz-ink` (#1A1A2E), `woranz-slate` (#2E3547), `woranz-text` (#6B7280)
- **Warm palette**: `woranz-warm-1` through `woranz-warm-4`
- **Typography**: Noe Display (headings), Inter (body)
- **Custom scale**: `display`, `section`, `lead`, `body`, `label`, `quote-price`

## Content Architecture

- **Product data**: Sanity CMS schemas (`sanity/schemas/`)
- **Product catalog**: `data/product-catalog.json` + `lib/product-catalog.ts`
- **Page sources**: `lib/home-page-source.ts`, `lib/product-page-source.ts`
- **Dynamic routing**: `app/[segmento]/coberturas/[slug]/`

## Domain Skills (already exist)

- **woranz-copy**: Brand copy engine (Lemonade-inspired, voseo, direct tone)
- **woranz-images**: Image generation engine (Getsafe-inspired, warm tones)
- **woranz-productos**: Product reference (20+ insurance products with tone/visual guidance)
- **woranz-design**: Pencil implementation specs (grid, spacing, components, typography scale)
- **web-design-guidelines**: Vercel Web Interface Guidelines — use for accessibility and UX best practices only. Agent-contract docs have precedence for visual/brand decisions. Do not let generic web guidelines override Woranz-specific design voice.

## Process Skills (agent-contract framework)

- **woranz-orchestrator**: Route requests to the correct stage
- **woranz-product**: Problem framing, scope, PRD
- **woranz-ui-designer**: Visual direction, component reuse, handoff
- **woranz-frontend**: Production implementation
- **woranz-review**: Evidence-first audit

## Commands

```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Production build
npm run agentation:server # Start Agentation MCP server
```

## Canonical Doctrine Read Order

1. This file (`AGENTS.md`)
2. `docs/agent-contract/orchestration.md`
3. `docs/agent-contract/stage-router.md`
4. `docs/agent-contract/validation-matrix.md`
5. `docs/agent-contract/iteration-governance.md`

Then load stage-specific docs as needed.

## Stage-Specific Reads

### For Product Work
- `docs/agent-contract/design-heuristics.md`

### For UI Work
- `docs/agent-contract/design-passes.md`
- `docs/agent-contract/design-intent-questions.md`
- `docs/agent-contract/design-anti-attractor.md`
- `docs/agent-contract/design-heuristics.md`
- `docs/agent-contract/design-anti-patterns.md`
- `docs/agent-contract/design-distillation.md`
- `docs/agent-contract/design-voice.md`

### For Domain-Specific Work
- `.claude/skills/woranz-copy/SKILL.md` — brand copy rules
- `.claude/skills/woranz-images/SKILL.md` — image generation rules
- `.claude/skills/woranz-productos/PRODUCTOS.md` — product reference

## Guardrails

1. **Wrong stage**: stop and reroute.
2. **Unclear stage**: run Preflight first.
3. **Frontend implementation without PRD + UI spec**: blocked unless user explicitly requests a spike.
4. **New primitive without checking `components/ui/`**: blocked.
5. **Visual quality request**: default to `UI` unless user explicitly asks to implement code.
6. **UI-only requests**: do not start production implementation unless user explicitly asked to edit code.
7. **Challenge First**: Default behavior is to challenge contradictions, not execute silently.
8. **Copy changes**: always run through woranz-copy skill for tone compliance.
9. **Image additions**: always run through woranz-images skill for brand compliance.
10. **Product content**: verify against woranz-productos reference before inventing.

## Architecture Notes

This is a **marketing website with integrated quoters**, not a dashboard. Key differences:

- Pages are content-driven (Sanity CMS), not data-driven
- SEO and static generation matter (use `generateStaticParams`)
- Hero sections, carousels, FAQs, testimonials — not tables, charts, panels
- User journey is: discover → understand → quote → contact
- Performance = Core Web Vitals + perceived speed, not real-time reactivity
- Segments (`personas`, `empresas`, `productores`) shape the same products differently
