# RCE-003 - Add que es section on RC empresas

Prioridad: Alta
Tipo: Content architecture / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: incorporar la sección `Qué es` usando la fuente aprobada ya relevada para `empresas/responsabilidad-civil`.
- Visual: si
- Owner visual: Claude
- Entregable visual: ubicar el bloque en una posición que mejore comprensión sin volver pesada la página.

## Problema

La página de `responsabilidad-civil` no expone hoy un bloque `Qué es`, aunque el producto lo necesita para explicar mejor el alcance general de la cobertura. El feedback pide incorporarlo.

## Evidencia

- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md:101-104` ya mapea el texto aprobado para `empresas/responsabilidad-civil`.
- `lib/product-page-source.ts:347-353` ya soporta secciones de explicación con título default `Qué es`.
- Feedback recibido: `Agregar sección que es.`

## Riesgo

- Sin este bloque, la página depende demasiado del hero y de listados operativos para explicar el producto.
- Si el texto se inventa por fuera del rollout, se rompe la consistencia editorial.
- Una mala ubicación puede volver más densa la parte alta de la página.

## Alcance propuesto

- Agregar la sección `Qué es` a la página de RC empresas.
- Usar el texto aprobado ya relevado en el inventario transversal.
- Integrar el bloque en una posición coherente con el resto del flujo.
- Evitar duplicar literalmente hero, coberturas o FAQs.

## Criterio de aceptacion

- `/empresas/coberturas/responsabilidad-civil` muestra una sección `Qué es`.
- El texto proviene de la fuente aprobada ya inventariada.
- El bloque mejora comprensión del producto sin romper el ritmo de la página.
- La implementación no introduce una segunda fuente editorial para el mismo contenido.

## Validacion

- Verificación estática de la fuente de verdad para `empresas/responsabilidad-civil`.
- Smoke visual en desktop y mobile.
- Revisión editorial rápida del bloque final en contexto.
