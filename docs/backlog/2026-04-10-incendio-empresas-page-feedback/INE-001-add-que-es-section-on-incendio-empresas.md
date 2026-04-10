# INE-001 - Add que es section on incendio empresas

Prioridad: Alta
Tipo: Content architecture / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: incorporar la sección `Qué es` usando la fuente aprobada ya relevada para `empresas/incendio`.
- Visual: si
- Owner visual: Claude
- Entregable visual: ubicar el bloque en una posición que mejore comprensión sin recargar la página.

## Problema

La página de `empresas/incendio` no expone hoy un bloque `Qué es`, aunque el producto necesita una explicación más clara de alcance general y ya existe texto fuente aprobado para eso.

## Evidencia

- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md:107-110` ya mapea el texto aprobado para `empresas/incendio`.
- `lib/product-page-source.ts:347-353` ya soporta secciones de explicación con título default `Qué es`.
- Feedback recibido: `Agregar sección que es`.

## Riesgo

- Sin este bloque, la página depende demasiado del hero y del listado de coberturas para explicar el producto.
- Si el texto se arma por fuera del rollout transversal, se pierde consistencia editorial.
- Una mala ubicación puede volver más densa la parte alta de la página.

## Alcance propuesto

- Agregar la sección `Qué es` a la página de incendio empresas.
- Usar el texto aprobado ya relevado en el inventario transversal.
- Integrar el bloque en una posición coherente con el resto del flujo.
- Evitar duplicar literalmente el hero o las coberturas.

## Criterio de aceptacion

- `/empresas/coberturas/incendio` muestra una sección `Qué es`.
- El texto proviene de la fuente aprobada ya inventariada.
- El bloque mejora comprensión del producto sin romper el ritmo de la página.
- La implementación no introduce una segunda fuente editorial para el mismo contenido.

## Validacion

- Verificación estática de la fuente de verdad para `empresas/incendio`.
- Smoke visual en desktop y mobile.
- Revisión editorial rápida del bloque final en contexto.
