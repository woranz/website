# Backlog Batch - Empresa Aeronavegacion Surfacing

Fuente: observación sobre el catálogo de `empresas` y el documento `/.context/attachments/Woranz_Contenidos_Web (1).docx`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Diagnóstico base:
- `empresas/aeronavegacion` ya existe en `data/product-catalog.json`.
- El routing dinámico de `app/[segmento]/coberturas/[slug]/page.tsx` ya permite que la página se resuelva.
- La cobertura no aparece hoy en `NAV_COVERAGE.empresas` dentro de `components/site/header.tsx`.
- El documento fuente ya incluye copy aprobado para esta cobertura.

Mapeo del gap detectado:
1. `Aeronavegación` no aparece en el menú y necesita confirmación de exposición comercial.
   Nueva task: `AES-001`

Tasks creadas en este batch:
1. `AES-001` [Audit and surface aeronavegacion in empresas navigation](./AES-001-audit-and-surface-aeronavegacion-in-empresas-navigation.md)

Prioridad sugerida para arrancar:
1. `AES-001`

Notas:
- Esta task no pide crear la página desde cero; primero debe validar exposición, taxonomía y punto de entrada en navegación.
