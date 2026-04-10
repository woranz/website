# Backlog Batch - Que Es Rollout

Fuente: extracción estructurada de `/.context/attachments/Woranz_Contenidos_Web (1).docx` y `docs/source-docs/2026-04-10-ia-productos/Woranz_Productos_IA_Humanos.docx`, relevada el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog e inventario de contenido fuente.

Archivos de este batch:
1. `QES-001` [Roll out que es sections across mapped product pages](./QES-001-roll-out-que-es-sections-across-mapped-product-pages.md)
2. `QES-001-source-inventory` [Inventario fuente de textos "Qué es"](./QES-001-source-inventory.md)

Resumen del relevamiento:
- Los documentos fuente traen copy `Qué es` para `24` productos existentes en el catálogo actual.
- La capa técnica ya soporta una sección `explanation` / `Qué es`, pero hoy no existe una fuente de verdad equivalente dentro de `data/product-catalog.json`.
- Quedan `7` páginas actuales sin texto fuente explícito en el documento, por lo que no deben incluirse ciegamente en el rollout inicial.

Rutas actuales sin `Qué es` fuente en el documento:
- `personas/robo-monopatin`
- `empresas/caucion-alquiler-beneficios-corporativos`
- `empresas/caucion-servicios`
- `empresas/caucion-obra`
- `empresas/caucion-suministro`
- `empresas/caucion-actividad-o-profesion`
- `empresas/seguro-de-salud`

Notas:
- El inventario fuente se construyó leyendo el `.docx` con `python-docx`; no hizo falta validación visual porque acá solo interesaba el contenido textual.
- `seguro-de-hogar` ya no queda bloqueado por falta de texto para `Qué es`; ese contenido ahora está mapeado en este batch.
- `hecho-por-humanos` y `responsabilidad-civil-uso-ia` dejaron de estar bloqueadas por falta de fuente tras incorporar el documento específico de productos IA al repo.
- Este rollout debe coordinarse con tareas específicas de página cuando existan cambios adicionales de hero o composición.
