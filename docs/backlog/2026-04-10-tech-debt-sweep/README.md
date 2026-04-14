# Backlog Sweep - 2026-04-10

Fuente: paneo de deuda tecnica en stage `Review`, usando doctrina Woranz y chequeos estaticos sobre `app/`, `components/`, `lib/`, `sanity/` y `app/api/`.

Convencion activa: cada item de este batch separa frente `Estructural` y frente `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: [docs/backlog/README.md](/Users/marcos/conductor/workspaces/website/edinburgh-v1/docs/backlog/README.md)

Estado del repo al momento del barrido:
- `npm run build` paso.
- El build emitio 2 warnings de Tailwind por clases ambiguas en `components/ui/navigation-menu.tsx`.
- No se hicieron cambios de implementacion; este lote solo baja backlog.

Tasks creadas en este barrido:

| #  | Task | Prioridad | LLM | Need PRD |
|----|------|-----------|-----|----------|
| 1  | `TD-001` [Harden preview and internal operational routes](./TD-001-harden-preview-and-internal-operational-routes.md) | **P0** | Codex | — |
| 2  | `TD-002` [Add validation and abuse controls to public API proxies](./TD-002-add-validation-and-abuse-controls-to-public-api-proxies.md) | **P0** | Codex | — |
| 3  | `TD-003` [Normalize SEO and metadata contract](./TD-003-normalize-seo-and-metadata-contract.md) | **P0** | Codex | — |
| 4  | `TD-004` [Centralize site navigation and remove placeholder links](./TD-004-centralize-site-navigation-and-remove-placeholder-links.md) | **P0** | Claude | — |
| 5  | `TD-005` [Refactor Sanity page-source layer and stop silent fallbacks](./TD-005-refactor-sanity-page-source-layer-and-stop-silent-fallbacks.md) | P1 | Codex | — |
| 6  | `TD-006` [Unify UI primitive contract and token usage](./TD-006-unify-ui-primitive-contract-and-token-usage.md) | P1 | Claude | need PRD |
| 7  | `TD-007` [Create a shared field system for form controls](./TD-007-create-a-shared-field-system-for-form-controls.md) | P1 | Claude | need PRD |
| 8  | `TD-008` [Split oversized page and form components](./TD-008-split-oversized-page-and-form-components.md) | P2 | Codex | — |
| 9  | `TD-009` [Fix Tailwind ambiguous classes and motion tokens](./TD-009-fix-tailwind-ambiguous-classes-and-motion-tokens.md) | P2 | Claude | — |
| 10 | `TD-010` [Define site-wide SEO strategy across Sanity and frontend](./TD-010-define-site-wide-seo-strategy-across-sanity-and-frontend.md) | **P0** | Codex | need PRD |
| 11 | `TD-011` [Run a site-wide performance remediation plan](./TD-011-run-a-site-wide-performance-remediation-plan.md) | P1 | Claude | need PRD |
| 12 | `TD-012` [Create image system for "Seguros pensados para vos"](./TD-012-create-image-system-for-seguros-pensados-para-vos.md) | **P0** | Claude | ~~need PRD~~ **Done** (PR #20) |
| 13 | `TD-013` [Audit and normalize every CTA destination](./TD-013-audit-and-normalize-every-cta-destination.md) | **P0** | Claude | **Done** |
| 14 | `TD-014` [Create a redirect plan from woranz.com coverages to the new site](./TD-014-create-a-redirect-plan-from-woranz-com-coverages-to-the-new-site.md) | **P0** | Codex | — |
| 15 | `TD-015` [Create a generic form for plans without inline quoter](./TD-015-create-a-generic-form-for-plans-without-inline-quoter.md) | **P0** | Claude | ~~need PRD~~ **Done** (PR #18) |
| 16 | `TD-016` [Standardize spacing between components and sections](./TD-016-standardize-spacing-between-components-and-sections.md) | P1 | Claude | — |
| 17 | `TD-017` [Audit content ownership: hardcoded vs Sanity](./TD-017-audit-content-ownership-hardcoded-vs-sanity.md) | P1 | Claude | need PRD |
| 18 | `TD-018` [Add dual login entry points in the header](./TD-018-add-dual-login-entry-points-in-the-header.md) | P1 | Claude | need PRD |
| 19 | `TD-019` [Normalize the team-count trust signal to +20](./TD-019-normalize-the-team-count-trust-signal-to-plus-20.md) | P2 | Claude | — |
| 20 | `TD-020` [Create the Nosotros page](./TD-020-create-the-nosotros-page.md) | **P0** | Claude | need PRD |
| 21 | `TD-021` [Create the Contacto page](./TD-021-create-the-contacto-page.md) | **P0** | Claude | need PRD |

Prioridad sugerida para arrancar:
1. `TD-001`
2. `TD-002`
3. `TD-003`
4. `TD-005`
5. `TD-006`
6. `TD-010`
7. `TD-011`
8. `TD-013`
9. `TD-014`
10. `TD-017`
11. `TD-015`
12. `TD-016`

Notas:
- El route footprint de `/studio` quedo fuera de este batch como tarea separada porque no afecta el first load del sitio publico, aunque conviene revisarlo mas adelante.
- Varias observaciones de UI convergen entre si. Por eso se separaron en contrato de primitives, sistema de campos y decomposition, para que se puedan ejecutar sin mezclar alcances.
- Los tickets de assets visuales y CTA/linking deben seguir la misma regla de split: criterio visual con `Claude`, wiring y destino final con `Codex`.
- Las páginas institucionales nuevas deben seguir la misma convención: contenido/estructura en backlog, definición visual separada y ownership explícito por frente.
