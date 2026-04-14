# Backlog Batch - Caucion Alquiler Page Feedback

Fuente: feedback puntual sobre `/personas/coberturas/caucion-alquiler` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. `Cotizá tu garantía ahora` debe linkear al formulario.
   Prioridad para esta página: `P0`
   Referencia existente: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`
2. `Hablá con nosotros` debe linkear a WhatsApp.
   Prioridad para esta página: `P0`
   Referencia existente: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`
3. Cambiar copy del paso `Preaprobación`.
   Prioridad: `P0`
   Nueva task: `CAF-001`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-017-audit-content-ownership-hardcoded-vs-sanity.md`
4. Cambiar copy del paso `Contrato`.
   Prioridad: `P0`
   Nueva task: `CAF-001`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-017-audit-content-ownership-hardcoded-vs-sanity.md`
5. Borrar el patrón actual de item individual en `Requisitos`.
   Prioridad: `P0`
   Nueva task: `CAF-002`
6. Resolver `Requisitos` como un solo dropdown o con otra composición más clara.
   Prioridad: `P0`
   Nueva task: `CAF-002`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-017-audit-content-ownership-hardcoded-vs-sanity.md`
7. Agregar `Restitución de la propiedad` al quoter con switch y recargo provisorio de `30%`.
   Prioridad: `P0`
   Nueva task: `CAF-003`

Tasks creadas en este batch:
1. `CAF-001` [Refresh process copy on caucion alquiler](./CAF-001-refresh-process-copy-on-caucion-alquiler.md) — **Done** (PR #21)
2. `CAF-002` [Rework requisitos presentation on caucion alquiler](./CAF-002-rework-requisitos-presentation-on-caucion-alquiler.md) — **Done**
3. `CAF-003` [Add restitucion option to caucion quoter](./CAF-003-add-restitucion-option-to-caucion-quoter.md) — **Done**

Prioridad sugerida para arrancar:
1. `TD-013` para resolver los 2 CTA de esta página
2. `CAF-003`
3. `CAF-002`
4. `CAF-001`

Notas:
- Los pedidos de linking no se duplicaron como task nueva porque ya caen de lleno en `TD-013`.
- Todo el feedback de este batch debe considerarse `P0`.
- Los cambios de copy y composición de `Requisitos` hoy viven sobre catálogo hardcodeado, así que conviene resolverlos con el criterio de ownership de `TD-017`.
- `Restitución de la propiedad` ya existe como cobertura visible en el catálogo; el gap real es que el quoter y el flujo de preaprobación todavía no la modelan.
