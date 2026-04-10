# Backlog Batch - Robo Celular Page Feedback

Fuente: feedback puntual sobre `/personas/coberturas/robo-celular` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Reveer el título del hero.
   Nueva task: `RCP-001`
2. Reveer la bajada del hero.
   Nueva task: `RCP-001`
3. Agregar formulario de cotización con research de mercado y PRD previo.
   Nueva task: `RCP-002`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md`
   Bloqueo: requiere PRD antes de UI e implementación.
4. Agregar sección `Qué es`.
   Nueva task: `RCP-003`
   Fuente resuelta en: `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`
5. En `Más opciones para vos`, sumar todos los robos menos este, además de hogar e incendio.
   Nueva task: `RCP-004`

Tasks creadas en este batch:
1. `RCP-001` [Review robo celular hero copy with woranz-copy](./RCP-001-review-robo-celular-hero-copy-with-woranz-copy.md)
2. `RCP-002` [Produce PRD for robo celular quotation form](./RCP-002-produce-prd-for-robo-celular-quotation-form.md)
3. `RCP-003` [Add que es section on robo celular](./RCP-003-add-que-es-section-on-robo-celular.md)
4. `RCP-004` [Expand related products on robo celular](./RCP-004-expand-related-products-on-robo-celular.md)

Prioridad sugerida para arrancar:
1. `RCP-002`
2. `RCP-001`
3. `RCP-003`
4. `RCP-004`

Notas:
- `RCP-002` no debe pasar a implementación directa. El feedback pide research y PRD previos.
- El texto de `Qué es` ya está disponible en el rollout transversal, así que este punto no quedó bloqueado por contenido.
- La página ya tiene FAQs; por eso no se abrió una task separada para ese bloque.
