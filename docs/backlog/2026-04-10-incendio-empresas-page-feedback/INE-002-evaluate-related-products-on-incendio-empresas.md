# INE-002 - Evaluate related products on incendio empresas

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: revisar la configuración de productos relacionados de `incendio` empresas y ajustar el set final según afinidad real para el segmento `empresas`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar orden, densidad y legibilidad del carrusel una vez revisado el mix de productos.

## Problema

La sección de relacionados de `incendio` empresas hoy es muy corta y el feedback pide sumar más opciones para el segmento B2B. Eso sugiere que el mix actual no refleja bien la red de productos afines a un usuario que asegura su operación.

## Evidencia

- `data/product-catalog.json:1298-1301` hoy define solo dos relacionados para `empresas/incendio`:
  - `empresas/integral-de-comercio`
  - `empresas/integral-de-consorcio`
- `lib/product-page-source.ts:407-415` resuelve ese bloque como carrusel de productos.
- Feedback recibido: `Mas opciones para tu empresA: agregar mas relacionados.`
- `ERT-001` ya cubre en paralelo el cambio transversal de título para las páginas de `empresas`.

## Riesgo

- El cross-sell actual puede subrepresentar productos con afinidad más directa con incendio empresas.
- Si se agregan más cards sin criterio de orden o volumen, el carrusel puede perder utilidad.
- Resolver esto sin coordinar con el título transversal puede dejar la sección parcialmente alineada.

## Alcance propuesto

- Auditar la lista actual de relacionados para incendio empresas.
- Definir si corresponde reemplazar, ampliar o reordenar esos productos.
- Priorizar productos B2B con relación clara al riesgo patrimonial y continuidad operativa.
- Coordinar el resultado con el título segmentado definido en `ERT-001`.

## Criterio de aceptacion

- La sección de relacionados de incendio empresas queda revisada con un set final documentado.
- El mix de productos resultante es coherente con un usuario que evalúa `incendio` para su empresa.
- El carrusel sigue funcionando correctamente en desktop y mobile.
- La tarea no duplica el cambio transversal de título ya cubierto en `ERT-001`.

## Validacion

- Verificación estática de la configuración final de relacionados.
- Smoke manual del carrusel en desktop y mobile.
- Revisión rápida de coherencia temática del set final.
