# TD-016 - Standardize spacing between components and sections

Prioridad: Alta
Tipo: Layout system / Consistencia visual
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: consolidar tokens, wrappers y reglas de spacing para secciones, bloques y componentes.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir el criterio de ritmo, proximidad y densidad para que el sitio se sienta consistente.

## Problema

Hay inconsistencias visibles en spacing entre componentes y secciones. El sitio mezcla gaps, paddings y ritmos resueltos desde globals, templates y componentes con valores distintos, lo que rompe continuidad.

## Evidencia

- `components/templates/product-page.tsx` repite shells de sección con variantes de `gap` y `padding` distribuidas en múltiples bloques.
- `app/globals.css:98-199` ya define parte del sistema de spacing y helpers compartidos.
- `components/site/header.tsx:145` y varios bloques de `components/templates/product-page.tsx` usan medidas arbitrarias fuera de un wrapper único.
- El hallazgo de review ya detectó proximity inversion y repetición de wrappers en la plantilla principal.

## Riesgo

- La experiencia se percibe desordenada o inconsistente aunque los componentes sean correctos por separado.
- Cada nueva sección puede seguir resolviendo spacing por intuición.
- Se hace más costoso sostener calidad visual entre desktop y mobile.

## Alcance propuesto

- Auditar spacing actual entre secciones, dentro de secciones y dentro de componentes.
- Definir una escala operativa clara para:
  - separación entre secciones
  - separación entre header, cuerpo y CTA
  - separación entre controles de formulario
  - separación entre cards y carousels
- Extraer wrappers o clases reutilizables donde hoy hay repetición.

## Criterio de aceptacion

- Existe una convención clara de spacing aplicada en todo el sitio.
- Las secciones comparten un ritmo consistente.
- Intra-section spacing es menor que inter-section spacing de forma sistemática.
- Desktop y mobile mantienen agrupación y proximidad correctas.

## Validacion

- Revisión visual transversal de home, producto y formularios.
- Comparación antes/después por capturas.
- Build sin regresiones.
