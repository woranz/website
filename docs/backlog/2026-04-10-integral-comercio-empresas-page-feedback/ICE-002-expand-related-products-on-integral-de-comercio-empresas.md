# ICE-002 - Expand related products on integral de comercio empresas

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: revisar la configuración de productos relacionados de `integral-de-comercio` y ampliarla con el set final de coberturas B2B afines.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar orden, densidad y legibilidad del carrusel una vez ampliado el mix de productos.

## Problema

La sección de relacionados de `integral-de-comercio` hoy es corta y el feedback pide sumar todas las coberturas relacionadas. Eso sugiere que el mix actual no está reflejando bien el ecosistema de productos afines para un usuario empresa.

## Evidencia

- `data/product-catalog.json:1189-1192` hoy define solo dos relacionados para `empresas/integral-de-comercio`:
  - `empresas/caucion-alquiler-comercial`
  - `empresas/responsabilidad-civil`
- `lib/product-page-source.ts:407-415` resuelve ese bloque como carrusel de productos.
- Feedback recibido: `Mas opciones para tu empresa: agregar todas las relacionadas`.
- `ERT-001` ya cubre en paralelo el cambio transversal de título para las páginas de `empresas`.

## Riesgo

- El cross-sell actual puede subrepresentar coberturas con afinidad más clara con integral de comercio.
- Si se agregan más cards sin criterio de orden o volumen, el carrusel puede perder utilidad.
- Resolver esto sin coordinar con el título transversal puede dejar la sección parcialmente alineada.

## Alcance propuesto

- Auditar la lista actual de relacionados para integral de comercio empresas.
- Definir qué coberturas deben incorporarse al set final por afinidad real.
- Priorizar productos B2B conectados con riesgo patrimonial, continuidad operativa y actividad comercial.
- Coordinar el resultado con el título segmentado definido en `ERT-001`.

## Criterio de aceptacion

- La sección de relacionados de integral de comercio empresas queda revisada con un set final documentado.
- El mix de productos resultante es coherente con un usuario que evalúa `integral-de-comercio`.
- El carrusel sigue funcionando correctamente en desktop y mobile.
- La tarea no duplica el cambio transversal de título ya cubierto en `ERT-001`.

## Validacion

- Verificación estática de la configuración final de relacionados.
- Smoke manual del carrusel en desktop y mobile.
- Revisión rápida de coherencia temática del set final.
