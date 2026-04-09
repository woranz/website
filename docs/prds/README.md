# PRD Package Structure

Each feature or page gets its own directory under `docs/prds/`.

## Structure

```
docs/prds/<feature>/
├── prd.md              # Product requirements
├── ui-spec.md          # UI handoff specification
└── questions.md        # Open questions (when needed)
```

## Hard Gates

- Product cannot skip heuristic pressure-test and call PRD ready.
- UI cannot hand off a new key page without benchmark evidence when trigger applies.
- UI cannot skip `Blocking Visual-Intent Questions` when brief is visually vague.
- UI cannot hand off spacing/grouping that fails Gestalt checks.
- UI cannot hand off copy that fails woranz-copy tone compliance.
- Frontend cannot start without PRD + UI spec unless spike explicitly requested.
