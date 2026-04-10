# Backlog Batch - Seguro Hogar Page Feedback

Fuente: feedback puntual sobre `/personas/coberturas/seguro-de-hogar` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Cambiar el `h1` a `Protección para tu hogar en el momento.`
   Nueva task: `HGF-001`
2. Eliminar la sección `Variantes`.
   Nueva task: `HGF-002`
3. Agregar después de la imagen una sección `Qué es`.
   Nueva task: `HGF-001`
   Fuente resuelta en: `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`
4. Agregar un cotizador genérico con research de mercado sobre campos habituales.
   Nueva task: `HGF-003`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md`
   Bloqueo: requiere PRD antes de UI e implementación.

Tasks creadas en este batch:
1. `HGF-001` [Refresh hero and add que es section on seguro de hogar](./HGF-001-refresh-hero-and-add-que-es-section-on-seguro-de-hogar.md)
2. `HGF-002` [Remove variantes section from seguro de hogar](./HGF-002-remove-variantes-section-from-seguro-de-hogar.md)
3. `HGF-003` [Produce PRD for seguro de hogar generic quoter](./HGF-003-produce-prd-for-seguro-de-hogar-generic-quoter.md)

Prioridad sugerida para arrancar:
1. `HGF-003`
2. `HGF-001`
3. `HGF-002`

Notas:
- `HGF-003` no debe pasar a implementación directa. El propio feedback pide research y PRD previos.
- La sección `Qué es` ya existe como tipo soportado en la capa de page source y el texto fuente quedó mapeado en `QES-001-source-inventory.md`.
- La remoción de `Variantes` es específica de `seguro-de-hogar`; no se bajó como regla global para todas las páginas de producto.
