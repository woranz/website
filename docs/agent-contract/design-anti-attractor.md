# Design Anti-Attractor

Use this file to stop the model from reaching for the same safe UI reflexes every time.

## Canonical Rule

Before locking a UI direction, enumerate the default patterns you are tempted to use and reject them explicitly.

1. Name the reflex defaults
2. Reject the ones that flatten the page into generic insurtech
3. Choose one or two Woranz-backed expression levers instead

## Reflex Defaults To Reject

Common AI defaults for marketing websites:

- generic hero with stock photo, generic headline, and two buttons
- three-column feature grid with icon + title + description
- interchangeable testimonial cards
- FAQ accordion that looks like every other FAQ accordion
- "Trust us" section with generic trust badges
- explanatory copy that narrates what the CTA already makes obvious
- decorative gradients and illustrations with no brand grounding

Reject a default when it:

- could belong to any insurance website
- does not map to a real Woranz component or pattern
- adds explanation without reducing uncertainty
- makes the page safe but forgettable

## Woranz Expression Levers

Pick one or two levers that are already supportable in the repo:

- typography contrast
  - Noe Display headlines with strong weight, Inter body quietly supporting
- warm color palette
  - `woranz-warm-*` backgrounds, `woranz-yellow` as accent, ink as anchor
- product-language copy
  - specific insurance nouns, direct verbs, voseo tone (woranz-copy skill)
- quoter integration
  - real interactive value (quote price, calculator) above the fold when appropriate
- segment-aware framing
  - different hero angles for personas vs. empresas vs. productores
- social proof with specificity
  - real team photos, specific numbers, named coverage details

Do not add all levers at once. Deliberate restraint beats noisy personality.

## Output Contract

UI work must produce `Anti-Attractor Notes` that answer:

- Which 2 or 3 reflex defaults were rejected?
- Why would those defaults have made the page generic?
- Which Woranz-backed expression levers were chosen instead?

## Blocking Smells

Reject the proposal if:

- no rejected defaults are named
- the chosen expression still depends on generic stock imagery or decoration
- the design claims to be distinctive but cannot say what reflex it avoided
