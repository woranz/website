# EFQ-001 - Roll out FAQ sections across empresas product pages

Prioridad: Alta
Tipo: Content architecture / FAQ / Segment consistency
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir y aplicar un patrón consistente para exponer FAQs en las páginas de `empresas` que hoy no las tienen, incluyendo fuente de verdad y wiring en el contrato de contenido.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar ubicación, densidad y legibilidad del bloque FAQ en las variantes principales de producto B2B.

## Problema

El pedido de sumar preguntas frecuentes ya apareció en múltiples páginas de `empresas`, lo que indica un gap transversal y no un problema aislado de una sola cobertura. Resolverlo caso por caso duplica backlog y favorece implementaciones inconsistentes.

## Evidencia

- `components/templates/product-page.tsx:464-523` ya renderiza una sección FAQ cuando existe contenido.
- `lib/product-page-source.ts:366-374` ya soporta el bloque FAQ en el mapping del page source.
- Feedback reciente pidió FAQs explícitamente para:
  - `empresas/cauciones-tradicionales`
  - `empresas/incendio`
  - `empresas/integral-de-comercio`
- Existen tasks locales ya abiertas para parte de ese gap, como `CAT-005` e `INE-003`.

## Riesgo

- Mantener el rollout fragmentado por página puede producir criterios editoriales distintos para una misma superficie.
- Si cada página define su propia fuente de verdad, el mantenimiento se vuelve inestable.
- Una sección FAQ mal integrada puede repetir hero, coberturas o CTA sin aportar resolución de objeciones.

## Alcance propuesto

- Identificar qué páginas de `empresas` ya tienen FAQs y cuáles todavía no.
- Definir un criterio editorial y estructural común para sumar FAQs donde falten.
- Resolver la fuente de verdad compartida para estas preguntas y respuestas.
- Coordinar o absorber las tasks page-specific ya abiertas dentro del mismo rollout.

## Criterio de aceptacion

- Existe un inventario claro de páginas de `empresas` con y sin FAQs.
- Las páginas priorizadas del segmento incorporan una sección FAQ consistente.
- La fuente de verdad para FAQs de `empresas` queda documentada.
- El rollout evita duplicar implementaciones aisladas por página.

## Validacion

- Verificación estática del inventario y de la fuente de verdad elegida.
- Smoke visual en una muestra representativa de páginas de `empresas`.
- Revisión editorial de preguntas y respuestas para asegurar utilidad real.
