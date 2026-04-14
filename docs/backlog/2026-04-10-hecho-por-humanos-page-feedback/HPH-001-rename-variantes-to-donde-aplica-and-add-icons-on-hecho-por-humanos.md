# HPH-001 - Rename variantes to donde aplica and add icons on hecho por humanos

Prioridad: Alta
Tipo: IA / Information architecture / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: renombrar la sección actual de `Variantes` a `Dónde aplica` y enriquecer sus cards con soporte de iconografía.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir iconografía, jerarquía y composición de cards para que el bloque se lea como ámbitos de aplicación y no como planes o variantes genéricas.

## Problema

La sección actual se presenta como `Variantes`, pero el feedback redefine su función: no son variantes comerciales, sino contextos de uso del producto. Además, hoy las cards no tienen iconografía, lo que debilita escaneo y diferenciación.

## Evidencia

- `data/product-catalog.json:1368-1386` define hoy una lista de `variantes` para `hecho-por-humanos`.
- El documento `docs/source-docs/2026-04-10-ia-productos/Woranz_Productos_IA_Humanos.docx` nombra esa misma sección como `Dónde aplica`.
- Feedback recibido:
  - cambiar título a `Dónde aplica`
  - agregar iconos a las cards

## Riesgo

- Mantener el label `Variantes` confunde la intención del bloque y lo acerca a una lógica de planes que no corresponde.
- Agregar iconos sin una semántica clara puede volver el bloque decorativo en lugar de más útil.
- Si el cambio se hace solo en copy sin ajustar composición, la sección puede seguir leyendo como un carrusel genérico.

## Alcance propuesto

- Renombrar el bloque visible a `Dónde aplica`.
- Agregar iconografía a cada card de la sección.
- Revisar la jerarquía del contenido para que cada card exprese un ámbito de aplicación concreto.
- Mantener consistencia con el lenguaje del documento fuente de productos IA.

## Criterio de aceptacion

- La sección ya no se presenta como `Variantes`, sino como `Dónde aplica`.
- Cada card muestra iconografía coherente con su ámbito de aplicación.
- El bloque se entiende como mapa de usos del producto y no como lista de planes.
- La sección sigue funcionando correctamente en desktop y mobile.

## Validacion

- Smoke visual del bloque en desktop y mobile.
- Verificación estática del nuevo título visible.
- Revisión visual de iconografía, jerarquía y escaneabilidad de las cards.
