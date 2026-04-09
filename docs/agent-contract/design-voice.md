# Woranz Design Voice

Use this file when a page is technically correct but still feels generic, flat, or template-driven.

## Source Hierarchy

1. `tailwind.config.ts` + `app/globals.css` (tokens)
2. `components/ui/`, `components/site/`, `components/templates/` (components)
3. `.claude/skills/woranz-copy/SKILL.md` (brand voice)
4. `.claude/skills/woranz-images/SKILL.md` (visual identity)
5. `.claude/skills/woranz-productos/PRODUCTOS.md` (product knowledge)

The goal is not "more decoration". The goal is a Woranz page that feels specific, trustworthy, warm, and direct.

## Canonical Read

Woranz should not feel like:

- a generic insurance website with stock photos and corporate copy
- a neutral landing page template with interchangeable sections
- a flat wireframe upgraded only with the brand color

Woranz should feel like:

- direct and human (Lemonade-inspired tone, Argentine voseo)
- warm but not playful (warm palette, Noe Display confidence)
- trustworthy through specificity, not through badges and logos
- clear about what coverage does and what the next step is
- grounded in real products, real team, real numbers

## Core Principles

### 1. Direct Core, Warm Edge

The page should inform and convert first, but it must not feel corporate.

Apply:

- clear structure for the main value proposition and conversion path
- warm accents where they help trust and orientation
- copy that sounds human and specific, not robotic or insurance-speak

Avoid:

- corporate jargon and passive voice
- identical neutral sections with no emotional hierarchy
- "professional" pages that read as lifeless

### 2. One Strong Read In 3 Seconds

The user should know quickly:

- what this product covers
- who it is for (segment)
- what to do next (quote, contact, learn more)

Apply:

- one dominant headline per hero
- one dominant CTA per context
- supporting sections that reinforce, not compete

Avoid:

- multiple competing value propositions in the hero
- sections that all fight for attention equally
- CTAs scattered everywhere with equal emphasis

### 3. Domain Before Template

If the product is about rental guarantees, accident coverage, or home insurance, the page should show that domain clearly.

Apply:

- visible product names and coverage details
- patterns that expose real next actions (get a quote, see coverage)
- framing that sounds like a knowledgeable insurance advisor, not a template

Avoid:

- imported landing page tropes when a domain-specific pattern exists
- generic "our services" sections
- empty shells that only prove layout, not product understanding

### 4. Warmth Through Copy And Rhythm, Not Decoration

Woranz does not need louder gradients or novelty UI to feel alive.

Apply:

- labels that explain why a coverage matters
- CTAs that use active verbs and voseo ("Cotizá ahora", "Protegé tu hogar")
- spacing and warm backgrounds that create calm rhythm

Avoid:

- arbitrary chrome and decorative hero bands
- "trust" expressed only through badge collections
- warmth expressed only as color, not as useful content

### 5. Character Must Be Traceable To The System

If a proposal feels distinctive, the distinctiveness must come from real Woranz tokens, components, copy tone, and image guidelines.

Apply:

- Tailwind token-led warmth (woranz-warm-*, woranz-yellow)
- Noe Display for confident headings
- woranz-copy tone compliance (voseo, direct, human)
- woranz-images visual compliance (warm, authentic, Latin/Mediterranean)

Avoid:

- custom invented sections that bypass the component library
- ad-hoc typography or color that is not in tailwind.config.ts
- copy that sounds warm but does not follow the woranz-copy skill

### 6. Trustworthy With Restraint

Woranz should feel reliable, not salesy and not sterile.

Apply:

- one small trust signal where the flow benefits (team photo, specific number, real testimonial)
- friendly but business-legible copy
- specific coverage details instead of vague promises

Avoid:

- trust badge collections as a substitute for real content
- salesy pressure tactics ("Limited time!", "Act now!")
- generic testimonials without specificity

## Voice Check

Before approving a UI direction, answer these:

- What makes this page recognizably Woranz instead of generic insurtech?
- Where is the single strongest read for the user in 3 seconds?
- Does the copy follow woranz-copy tone (voseo, direct, human)?
- Which region carries warmth without disrupting clarity?
- Is there a small, justified trust moment?
- Did the page get more alive through rhythm, copy, or specificity instead of extra decoration?
- Is the voice coming from real tokens, components, and brand guidelines?

## Blocking Smells

Reject the proposal if:

- the hero could belong to any insurance website
- the copy uses "usted" or corporate insurance-speak
- the page needs extra decorative blocks just to feel warm
- the only personality comes from the yellow accent color
- the page is system-compliant but emotionally flat
- the proposal cannot explain why it feels Woranz in repo-backed terms
