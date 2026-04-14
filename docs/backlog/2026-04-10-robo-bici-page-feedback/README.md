# Backlog Batch - Robo Bici Page Feedback

Fuente: feedback puntual sobre `/personas/coberturas/robo-bici` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Agregar cotizador; requiere feedback de campos, research y PRD.
   Nueva task: `RBP-001`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md`
   Bloqueo: requiere PRD antes de UI e implementación.
2. Arreglar la bajada.
   Nueva task: `RBP-002`
3. Agregar sección `Qué es`.
   Nueva task: `RBP-003`
   Fuente resuelta en: `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`
4. En cobertura, cambiar `Daños accidentales` por `Daños accidentales (según plan)`.
   Nueva task: `RBP-004`
5. En `Más opciones para vos`, agregar todos los robos menos este, más hogar e incendio.
   Nueva task: `RBP-005`

Tasks creadas en este batch:
1. `RBP-001` [Produce PRD for robo bici quotation form](./RBP-001-produce-prd-for-robo-bici-quotation-form.md)
2. `RBP-002` [Review robo bici supporting copy with woranz-copy](./RBP-002-review-robo-bici-supporting-copy-with-woranz-copy.md)
3. `RBP-003` [Add que es section on robo bici](./RBP-003-add-que-es-section-on-robo-bici.md)
4. `RBP-004` [Normalize danos accidentales label on robo bici](./RBP-004-normalize-danos-accidentales-label-on-robo-bici.md)
5. `RBP-005` [Expand related products on robo bici](./RBP-005-expand-related-products-on-robo-bici.md)

Prioridad sugerida para arrancar:
1. `RBP-001`
2. `RBP-002`
3. `RBP-003`
4. `RBP-004`
5. `RBP-005`

Notas:
- `RBP-001` no debe pasar a implementación directa. El feedback pide research y PRD previos.
- El texto de `Qué es` ya está disponible en el rollout transversal, así que este punto no quedó bloqueado por contenido.
- La página ya tiene FAQs; por eso no se abrió una task separada para ese bloque.
