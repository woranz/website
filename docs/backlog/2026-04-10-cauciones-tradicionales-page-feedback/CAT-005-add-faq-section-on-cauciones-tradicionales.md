# CAT-005 - Add FAQ section on cauciones tradicionales

Prioridad: Alta
Tipo: Content architecture / FAQ / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: agregar una sección FAQ a la página y definir su fuente de verdad dentro del contrato de contenido actual.
- Visual: si
- Owner visual: Claude
- Entregable visual: ajustar la ubicación y densidad del bloque para que cierre objeciones sin volver pesada la página.

## Problema

La página de `cauciones-tradicionales` no muestra preguntas frecuentes, aunque el template ya soporta esa sección y el feedback la pide explícitamente. En un producto técnico y amplio, eso deja sin resolver objeciones básicas sobre tipos de garantías, emisión y requisitos.

## Evidencia

- `data/product-catalog.json:1562-1608` define el producto `cauciones-tradicionales` y no incluye `faqs`.
- `lib/product-page-source.ts:366-374` ya soporta una sección FAQ cuando existe contenido.
- `components/templates/product-page.tsx:464-523` ya renderiza el bloque FAQ en el template de producto.
- Feedback recibido: `Agregar preguntas frecuentes`.

## Riesgo

- La página deja preguntas básicas sin responder antes de la conversión.
- Si se agregan FAQs sin fuente de verdad clara, pueden quedar hardcodeadas y desalineadas con otras coberturas.
- Sin trabajo editorial, la sección puede terminar repitiendo literalmente las cards de coberturas.

## Alcance propuesto

- Definir una primera tanda de FAQs para `cauciones-tradicionales` con foco en dudas reales del producto.
- Incorporar la sección al flujo de la página usando el soporte ya existente del template.
- Dejar explícita la fuente de verdad para estas FAQs.
- Validar el tono y la utilidad del bloque antes de implementarlo.

## Criterio de aceptacion

- `/empresas/coberturas/cauciones-tradicionales` muestra una sección de preguntas frecuentes.
- Las preguntas y respuestas responden dudas reales del producto y no duplican literalmente otras secciones.
- La fuente de verdad para las FAQs queda documentada.
- El bloque se integra sin romper el ritmo de la página.

## Validacion

- Revisión editorial del contenido FAQ.
- Smoke visual en desktop y mobile.
- Verificación estática de que `cauciones-tradicionales` ya expone FAQs en la fuente de contenido elegida.
