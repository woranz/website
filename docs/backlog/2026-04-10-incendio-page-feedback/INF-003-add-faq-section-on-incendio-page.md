# INF-003 - Add FAQ section on incendio page

Prioridad: Alta
Tipo: Content architecture / FAQ / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: agregar una sección FAQ a la página y definir su fuente de verdad dentro del contrato de contenido actual.
- Visual: si
- Owner visual: Claude
- Entregable visual: ajustar la ubicación y la densidad del bloque para que cierre objeciones sin volver pesada la página.

## Problema

La página de `incendio` no muestra preguntas frecuentes, aunque el template ya soporta esa sección y el feedback la pide explícitamente. Eso deja sin resolver objeciones típicas de una cobertura que muchas veces se contrata por exigencia bancaria o por necesidad puntual.

## Evidencia

- `data/product-catalog.json:1520-1558` define el producto `incendio` y no incluye `faqs`.
- `lib/product-page-source.ts:366-374` ya soporta una sección FAQ cuando existe contenido.
- `components/templates/product-page.tsx:464-523` ya renderiza el bloque FAQ en el template de producto.
- Feedback recibido: `Agregar preguntas frecuentes.`

## Riesgo

- La página deja preguntas básicas sin responder antes de la conversión.
- Si se agregan FAQs sin fuente de verdad clara, pueden quedar hardcodeadas y desalineadas con otras coberturas.
- Sin trabajo editorial, la sección puede terminar repitiendo información de cobertura en lugar de cerrar objeciones reales.

## Alcance propuesto

- Definir una primera tanda de FAQs para `incendio` con foco en dudas reales de contratación.
- Incorporar la sección al flujo de la página usando el soporte ya existente del template.
- Dejar explícita la fuente de verdad para estas FAQs.
- Validar el tono y la utilidad del bloque antes de implementarlo.

## Criterio de aceptacion

- `/personas/coberturas/incendio` muestra una sección de preguntas frecuentes.
- Las preguntas y respuestas responden dudas reales del producto y no duplican literalmente otras secciones.
- La fuente de verdad para las FAQs queda documentada.
- El bloque se integra sin romper el ritmo de la página.

## Validacion

- Revisión editorial del contenido FAQ.
- Smoke visual en desktop y mobile.
- Verificación estática de que `incendio` ya expone FAQs en la fuente de contenido elegida.
