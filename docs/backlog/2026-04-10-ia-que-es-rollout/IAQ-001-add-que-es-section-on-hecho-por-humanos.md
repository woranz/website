# IAQ-001 - Add que es section on hecho por humanos

Prioridad: Alta
Tipo: Content architecture / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: incorporar la sección `Qué es` usando la fuente aprobada del documento específico de productos IA.
- Visual: si
- Owner visual: Claude
- Entregable visual: ubicar el bloque en una posición que mejore comprensión sin competir con coberturas ni CTA.

## Problema

`empresas/hecho-por-humanos` ya cuenta con un documento fuente que define claramente su explicación de producto, pero la página todavía no tiene un bloque `Qué es` registrado en backlog operativo.

## Evidencia

- `docs/source-docs/2026-04-10-ia-productos/Woranz_Productos_IA_Humanos.docx` incluye la descripción fuente de `Hecho por Humanos`.
- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md` ya inventaría el texto aprobado para `empresas/hecho-por-humanos`.
- `lib/product-page-source.ts:347-353` ya soporta secciones de explicación con título default `Qué es`.

## Riesgo

- Sin este bloque, la página depende solo del hero y de listados operativos para explicar un producto nuevo y no convencional.
- Si se reescribe la explicación por fuera del documento fuente, puede perderse precisión conceptual.
- Una mala ubicación puede volver más densa la parte superior de la página.

## Alcance propuesto

- Agregar la sección `Qué es` a la página de `hecho-por-humanos`.
- Usar el texto aprobado del documento específico de productos IA.
- Integrar el bloque en una posición coherente con el resto del flujo.
- Evitar duplicar literalmente el hero o el bloque de coberturas.

## Criterio de aceptacion

- `/empresas/coberturas/hecho-por-humanos` muestra una sección `Qué es`.
- El texto proviene del documento fuente guardado en el repo.
- El bloque mejora comprensión del producto sin romper el ritmo de la página.
- La implementación no introduce una segunda fuente editorial para el mismo contenido.

## Validacion

- Verificación estática de la fuente de verdad para `empresas/hecho-por-humanos`.
- Smoke visual en desktop y mobile.
- Revisión editorial rápida del bloque final en contexto.
