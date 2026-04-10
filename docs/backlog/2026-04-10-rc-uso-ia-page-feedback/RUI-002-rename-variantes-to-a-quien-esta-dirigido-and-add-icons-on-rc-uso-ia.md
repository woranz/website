# RUI-002 - Rename variantes to a quien esta dirigido and add icons on RC uso IA

Prioridad: Alta
Tipo: IA / Information architecture / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: renombrar la seccion actual de `Variantes` a `A quien esta dirigido` y enriquecer sus cards con soporte de iconografia.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir iconografia, jerarquia y composicion de cards para que el bloque se lea como mapa de audiencias y no como lista de planes o variantes genericas.

## Problema

La seccion actual se presenta como `Variantes`, pero el feedback redefine su funcion: no son variantes comerciales, sino perfiles o audiencias para las que el producto aplica. Ademas, hoy las cards no tienen iconografia, lo que debilita escaneo y diferenciacion.

## Evidencia

- `data/product-catalog.json:1442-1457` define hoy una lista de `variantes` para `responsabilidad-civil-uso-ia`.
- El documento `docs/source-docs/2026-04-10-ia-productos/Woranz_Productos_IA_Humanos.docx` nombra esa misma seccion como `A quien esta dirigido`.
- Feedback recibido:
  - cambiar titulo a `a quien esta dirigido`
  - agregar iconos a las cards

## Riesgo

- Mantener el label `Variantes` confunde la intencion del bloque y lo acerca a una logica de planes que no corresponde.
- Agregar iconos sin semantica clara puede volver el bloque decorativo en lugar de mas util.
- Si el cambio se hace solo en copy sin ajustar composicion, la seccion puede seguir leyendo como un carrusel generico.

## Alcance propuesto

- Renombrar el bloque visible a `A quien esta dirigido`.
- Agregar iconografia a cada card de la seccion.
- Revisar la jerarquia del contenido para que cada card exprese una audiencia concreta.
- Mantener consistencia con el lenguaje del documento fuente de productos IA.

## Criterio de aceptacion

- La seccion ya no se presenta como `Variantes`, sino como `A quien esta dirigido`.
- Cada card muestra iconografia coherente con su audiencia.
- El bloque se entiende como mapa de destinatarios del producto y no como lista de planes.
- La seccion sigue funcionando correctamente en desktop y mobile.

## Validacion

- Smoke visual del bloque en desktop y mobile.
- Verificacion estatica del nuevo titulo visible.
- Revision visual de iconografia, jerarquia y escaneabilidad de las cards.
