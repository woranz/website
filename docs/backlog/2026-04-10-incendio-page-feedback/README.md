# Backlog Batch - Incendio Page Feedback

Fuente: feedback puntual sobre `/personas/coberturas/incendio` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Reveer título y copy del hero, usando `woranz-copy`.
   Nueva task: `INF-001`
2. Agregar cotizador genérico, con research de mercado y PRD previo.
   Nueva task: `INF-002`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md`
   Bloqueo: requiere PRD antes de UI e implementación.
3. Agregar preguntas frecuentes.
   Nueva task: `INF-003`
4. Agregar sección `Qué es`.
   Nueva task: `INF-004`
   Fuente resuelta en: `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`

Tasks creadas en este batch:
1. `INF-001` [Review incendio hero copy with woranz-copy](./INF-001-review-incendio-hero-copy-with-woranz-copy.md)
2. `INF-002` [Produce PRD for incendio generic quoter](./INF-002-produce-prd-for-incendio-generic-quoter.md)
3. `INF-003` [Add FAQ section on incendio page](./INF-003-add-faq-section-on-incendio-page.md)
4. `INF-004` [Add que es section on incendio page](./INF-004-add-que-es-section-on-incendio-page.md)

Prioridad sugerida para arrancar:
1. `INF-002`
2. `INF-001`
3. `INF-004`
4. `INF-003`

Notas:
- `INF-002` no debe pasar a implementación directa. El feedback pide research y PRD previos.
- El texto de `Qué es` ya está disponible en el rollout transversal, así que este punto no quedó bloqueado por contenido.
- Las FAQs no tienen todavía fuente editorial explícita en el catálogo ni en el `.docx`; conviene resolver copy y ownership antes de implementarlas.
