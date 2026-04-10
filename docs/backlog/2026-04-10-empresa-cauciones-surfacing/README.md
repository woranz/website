# Backlog Batch - Empresa Cauciones Surfacing

Fuente: observación sobre el documento `/.context/attachments/Woranz_Contenidos_Web (1).docx` y contraste con la navegación actual de `empresas`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Diagnóstico base:
- `empresas/garantias-aduaneras` y `empresas/caucion-judicial` ya existen en `data/product-catalog.json`.
- El routing dinámico de `app/[segmento]/coberturas/[slug]/page.tsx` ya permite que ambas páginas se resuelvan.
- Ninguna de las dos aparece hoy en `NAV_COVERAGE.empresas` dentro de `components/site/header.tsx`.
- Ambas coberturas también están presentes en el documento fuente con copy aprobado.

Mapeo del gap detectado:
1. `Cauciones Aduaneras` no aparece en el menú y necesita confirmación de exposición comercial.
   Nueva task: `ECS-001`
2. `Cauciones Judiciales` no aparece en el menú y necesita confirmación de exposición comercial.
   Nueva task: `ECS-002`

Tasks creadas en este batch:
1. `ECS-001` [Audit and surface garantias aduaneras in empresas navigation](./ECS-001-audit-and-surface-garantias-aduaneras-in-empresas-navigation.md)
2. `ECS-002` [Audit and surface caucion judicial in empresas navigation](./ECS-002-audit-and-surface-caucion-judicial-in-empresas-navigation.md)

Prioridad sugerida para arrancar:
1. `ECS-001`
2. `ECS-002`

Notas:
- Estas tasks no piden crear páginas nuevas desde cero; primero deben validar exposición, taxonomía y punto de entrada en navegación.
- Conviene coordinarlas con [CAT-002](../2026-04-10-cauciones-tradicionales-page-feedback/CAT-002-turn-variantes-into-cobertura-cards-with-icons-and-ctas.md) y [CAT-006](../2026-04-10-cauciones-tradicionales-page-feedback/CAT-006-add-empresa-related-products-section-on-cauciones-tradicionales.md), porque la superficie de `Cauciones Tradicionales` también puede funcionar como acceso a estas coberturas.
