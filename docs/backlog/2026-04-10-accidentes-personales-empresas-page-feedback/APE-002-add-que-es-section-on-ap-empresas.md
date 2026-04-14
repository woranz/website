# APE-002 - Add que es section on AP empresas

Prioridad: Alta
Tipo: Content architecture / Product page content
Estado: Done (resuelto por QES-001, commit 0ea06bb)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: incorporar la sección `Qué es` usando la fuente aprobada ya relevada para `empresas/accidentes-personales`.
- Visual: si
- Owner visual: Claude
- Entregable visual: ubicar el bloque en una posición que mejore comprensión sin competir con el cotizador ni con las coberturas.

## Problema

La página de `empresas/accidentes-personales` no expone hoy un bloque `Qué es`, aunque existe texto aprobado para explicar el producto con más claridad. El feedback pide incorporarlo explícitamente.

## Evidencia

- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md:57-60` ya mapea el texto aprobado para `empresas/accidentes-personales`.
- `lib/product-page-source.ts:347-353` ya soporta secciones de explicación con título default `Qué es`.
- Feedback recibido: `Agregar sección que es`.

## Riesgo

- Sin este bloque, la página depende demasiado del hero y del listado de coberturas para explicar el producto.
- Si el texto se reescribe por fuera de la fuente aprobada, se pierde consistencia con el rollout transversal.
- Mal ubicado, el bloque puede competir con el cotizador o hacer más pesada la parte superior de la página.

## Alcance propuesto

- Agregar la sección `Qué es` a la página de AP empresas.
- Usar el texto aprobado ya relevado en el rollout transversal.
- Integrar el bloque en una posición coherente con el resto del flujo de la página.
- Evitar duplicar literalmente el contenido del hero o de las FAQs.

## Criterio de aceptacion

- `/empresas/coberturas/accidentes-personales` muestra una sección `Qué es`.
- El texto proviene de la fuente aprobada ya inventariada.
- El bloque mejora comprensión del producto sin romper el ritmo de la página.
- La implementación no introduce una segunda fuente editorial para el mismo contenido.

## Validacion

- Verificación estática de la fuente de verdad para `empresas/accidentes-personales`.
- Smoke visual en desktop y mobile.
- Revisión editorial rápida del bloque final en contexto.
