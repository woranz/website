# PRD-001 - Expand tools carousel on productores home

Prioridad: Alta
Tipo: Content architecture / Carousel / Segment UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: ampliar la configuracion de items para la seccion `Herramientas que te ayudan a vender` manteniendo compatibilidad con el carrusel de features del home.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar orden, densidad y legibilidad del carrusel con la nueva cantidad de herramientas.

## Problema

La seccion `Herramientas que te ayudan a vender` hoy queda corta para el valor que la pagina de `productores` quiere comunicar. El feedback pide sumar mas items, lo que implica revisar el alcance del carrusel y no solo agregar slides sueltos.

## Evidencia

- `app/productores/page.tsx:14-18` renderiza la pagina via `getHomePageData("productores")`.
- `lib/home-page-source.ts:172-186` transforma `seccionCarouselFeatures` para las home pages.
- Feedback recibido: `Agregar más items a "herramientas que te ayudan a vender"`.

## Riesgo

- Si se agregan items sin criterio de prioridad, el carrusel puede volverse mas largo pero no mas util.
- Demasiadas cards con poco contraste narrativo pueden degradar escaneo y percepcion de valor.
- Sin revisar la fuente de contenido, el bloque puede quedar dependiente de textos o assets dispersos.

## Alcance propuesto

- Ampliar el set de herramientas visibles en el carrusel.
- Revisar el orden y la seleccion final para que reflejen mejor la propuesta de valor para productores.
- Mantener consistencia con el patron actual de `seccionCarouselFeatures`.
- Validar la legibilidad del bloque en desktop y mobile.

## Criterio de aceptacion

- La seccion `Herramientas que te ayudan a vender` muestra mas items que la version actual.
- El carrusel sigue siendo util, navegable y legible en desktop y mobile.
- La seleccion final de herramientas esta documentada en la fuente de contenido correspondiente.
- La pagina comunica mejor el valor operativo del portal para productores.

## Validacion

- Smoke visual del carrusel en desktop y mobile.
- Verificacion estatica del set final de items.
- Revision visual del orden y de la claridad de cada card.
