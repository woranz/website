# CAT-006 - Add empresa related products section on cauciones tradicionales

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: poblar la sección de productos relacionados para `cauciones-tradicionales` con el set acordado de productos de `empresas` y ajustar el título del bloque.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar densidad, orden y rotulación del carrusel para que la nueva sección siga siendo escaneable y relevante para un usuario B2B.

## Problema

La página de `cauciones-tradicionales` hoy no explicita una sección de cross-sell orientada a empresa con el wording pedido en feedback. El usuario pidió sumar `Más opciones para tu empresa` con todos los productos de `empresas`, pero la implementación actual depende del bloque genérico de relacionados y del título default `Más opciones para vos`.

## Evidencia

- `data/product-catalog.json:1562-1608` define `empresas/cauciones-tradicionales` sin `productosRelacionados`.
- `lib/product-page-source.ts:407-415` transforma `seccionCarouselProductos` en un carrusel y usa `Más opciones para vos` como título por defecto.
- `data/product-catalog.json:591-1612` evidencia que el catálogo ya tiene múltiples coberturas bajo el segmento `empresas`, por lo que existe base para armar el set pedido.
- Feedback recibido: agregar sección `Más opciones para tu empresa` con `todos los de empresa`.

## Riesgo

- Sin este bloque, la página pierde oportunidad de navegación lateral y descubrimiento dentro del segmento `empresas`.
- Si se vuelca literalmente todo el segmento sin criterio de orden o exclusión, el carrusel puede degradarse y volverse poco útil.
- Si el título no se cambia, la sección mantiene un tono genérico y no refleja el contexto B2B del pedido.

## Alcance propuesto

- Definir el listado de productos relacionados para `cauciones-tradicionales` dentro del segmento `empresas`.
- Ajustar el título visible del bloque a `Más opciones para tu empresa`.
- Ordenar los cards con una lógica clara de prioridad comercial o afinidad temática.
- Validar si la cobertura actual debe excluirse del set final aunque el feedback diga `todos los de empresa`.

## Criterio de aceptacion

- `/empresas/coberturas/cauciones-tradicionales` muestra una sección titulada `Más opciones para tu empresa`.
- La sección expone el set acordado de productos de `empresas`.
- El carrusel sigue funcionando correctamente en desktop y mobile pese al aumento de opciones.
- La selección final queda documentada en la fuente de contenido correspondiente.

## Validacion

- Verificación estática de la configuración de relacionados y del título del bloque.
- Smoke manual del carrusel en desktop y mobile.
- Revisión visual del orden, legibilidad y utilidad de la sección con el nuevo volumen de cards.
