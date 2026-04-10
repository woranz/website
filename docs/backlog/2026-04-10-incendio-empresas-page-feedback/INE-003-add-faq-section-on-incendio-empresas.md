# INE-003 - Add FAQ section on incendio empresas

Prioridad: Alta
Tipo: Content architecture / FAQ / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: agregar una sección FAQ a la página y definir su fuente de verdad dentro del contrato de contenido actual.
- Visual: si
- Owner visual: Claude
- Entregable visual: ajustar ubicación y densidad del bloque para que cierre objeciones sin volver pesada la página.

## Problema

La página de `incendio` empresas no muestra preguntas frecuentes, aunque el producto necesita responder dudas comunes sobre alcance, bienes cubiertos y modalidad de contratación.

## Evidencia

- `data/product-catalog.json:1284-1322` define `empresas/incendio` y no incluye `faqs`.
- `lib/product-page-source.ts:366-374` ya soporta una sección FAQ cuando existe contenido.
- `components/templates/product-page.tsx:464-523` ya renderiza el bloque FAQ en el template de producto.
- Feedback recibido: `Agregar preguntas frecuentes.`

## Riesgo

- La página deja objeciones frecuentes sin resolver antes de la conversión.
- Si se agregan FAQs sin fuente de verdad clara, pueden quedar hardcodeadas o desalineadas con otras coberturas.
- Sin trabajo editorial, la sección puede repetir literalmente coberturas o hero.

## Alcance propuesto

- Definir una primera tanda de FAQs para incendio empresas con foco en dudas reales del producto.
- Incorporar la sección al flujo de la página usando el soporte ya existente del template.
- Dejar explícita la fuente de verdad para estas FAQs.
- Validar el tono y la utilidad del bloque antes de implementarlo.

## Criterio de aceptacion

- `/empresas/coberturas/incendio` muestra una sección de preguntas frecuentes.
- Las preguntas y respuestas responden dudas reales del producto y no duplican literalmente otras secciones.
- La fuente de verdad para las FAQs queda documentada.
- El bloque se integra sin romper el ritmo de la página.

## Validacion

- Revisión editorial del contenido FAQ.
- Smoke visual en desktop y mobile.
- Verificación estática de que `empresas/incendio` ya expone FAQs en la fuente de contenido elegida.
