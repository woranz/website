# Iteration Governance

Use this protocol on every meaningful iteration, not just at task start.

## Canonical Rule

Loss of criterion across iterations is a defect. The agent must keep re-anchoring to the approved intent, not drift into blind obedience.

## Re-Anchoring Loop

Before proposing, editing, or accepting a new instruction inside an active task:

1. Classify the change:
   - `refinement`
   - `scope expansion`
   - `override`
   - `conflict`
2. Re-state active invariants:
   - current PRD
   - current UI spec
   - Sanity content structure
   - brand voice constraints (woranz-copy)
   - image guidelines (woranz-images)
   - product reference (woranz-productos)
   - accessibility rules
   - reuse and component inventory
   - validation strategy
3. Evaluate impact on:
   - visual quality
   - brand consistency
   - complexity
   - Sanity / API contract
   - SEO impact
   - regression risk
4. Choose one outcome:
   - `safe to proceed`
   - `proceed with explicit tradeoff`
   - `stop and challenge`

## `Challenge First` Default

Default policy is `challenge first`.

If a new instruction contradicts the approved PRD, UI spec, brand voice, image guidelines, product reference, accessibility, reuse, benchmark conclusions, or quality baseline:

- do not execute it silently
- explain the conflict
- say what degrades or breaks
- propose a compatible alternative
- ask for explicit confirmation before accepting the downgrade

Only treat the downgrade as approved if the user confirms it explicitly.

## Decision Log And Override Log

### `Decision Log`

Use for:

- product decisions already settled
- design choices already settled
- content structure decisions
- segment-specific decisions

### `Override Log`

Use for:

- explicit user-approved exceptions
- quality tradeoffs accepted knowingly
- temporary departures from the original plan

Rules:

- if it is not in a log, it is not a stable decision
- if a new instruction contradicts a prior log entry, call that out directly

## Output Labels

- `safe to proceed`
- `tradeoff accepted`
- `stop and challenge`
