# APE-004 - Expand related products on AP empresas

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar la configuración de productos relacionados para que la sección pase a `Más opciones para tu empresa` e incluya el set acordado de productos de `empresas`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar densidad, orden y legibilidad del carrusel con el nuevo volumen de opciones.

## Problema

La sección de relacionados de AP empresas hoy es corta y no responde al pedido de abrir `Más opciones para tu empresa` con todos los productos del segmento `empresas`.

## Evidencia

- `data/product-catalog.json:806-809` hoy define solo dos relacionados para AP empresas:
  - `empresas/seguro-de-vida-empresas`
  - `empresas/seguro-de-sepelio`
- `lib/product-page-source.ts:407-415` resuelve el bloque como carrusel de productos con título default `Más opciones para vos`.
- Feedback recibido: `Más opciones para tu empresa: Todos los de empresas`.

## Riesgo

- El cross-sell actual subrepresenta el resto de la oferta B2B.
- Si se vuelca literalmente todo el segmento sin criterio, el carrusel puede volverse pesado o poco navegable.
- Si se mantiene el título genérico, la sección no refleja el contexto empresa pedido en feedback.

## Alcance propuesto

- Reemplazar o ampliar la lista actual de relacionados con el set acordado de productos de `empresas`.
- Ajustar el título visible del bloque a `Más opciones para tu empresa`.
- Revisar orden y prioridad para que el carrusel siga siendo útil.
- Validar si la cobertura actual debe excluirse del set final por consistencia con otros bloques de relacionados.

## Criterio de aceptacion

- La página muestra una sección titulada `Más opciones para tu empresa`.
- La sección expone el set acordado de productos de `empresas`.
- El carrusel sigue funcionando correctamente en desktop y mobile.
- La selección final queda documentada en la fuente de contenido correspondiente.

## Validacion

- Verificación estática de la configuración de relacionados y del título del bloque.
- Smoke manual del carrusel en desktop y mobile.
- Revisión visual del orden, legibilidad y utilidad de la sección con el nuevo volumen de cards.
