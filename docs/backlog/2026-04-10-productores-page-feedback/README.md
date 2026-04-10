# Backlog Batch - Productores Page Feedback

Fuente: feedback puntual sobre `/productores` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Agregar mas items a `Herramientas que te ayudan a vender`.
   Nueva task: `PRD-001`
2. Crear formulario de alta de productores para `Empezar gratis`.
   Nueva task: `PRD-002`
3. Hacer que `Conoce el portal` vaya a WhatsApp.
   Nueva task: `PRD-003`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`

Tasks creadas en este batch:
1. `PRD-001` [Expand tools carousel on productores home](./PRD-001-expand-tools-carousel-on-productores-home.md)
2. `PRD-002` [Create producer signup form for productores home](./PRD-002-create-producer-signup-form-for-productores-home.md)
3. `PRD-003` [Normalize hero CTA behavior on productores home](./PRD-003-normalize-hero-cta-behavior-on-productores-home.md)

Prioridad sugerida para arrancar:
1. `PRD-002`
2. `PRD-003`
3. `PRD-001`

Notas:
- `PRD-002` y `PRD-003` conviene resolverlos juntos porque el CTA primario del hero debe terminar apuntando al alta real de productores.
- El punto de WhatsApp se referencio a `TD-013` para no perder alineacion con la normalizacion transversal de destinos CTA.
