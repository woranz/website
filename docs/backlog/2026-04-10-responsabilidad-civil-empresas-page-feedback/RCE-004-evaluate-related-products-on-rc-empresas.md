# RCE-004 - Evaluate related products on RC empresas

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: revisar la configuración de productos relacionados de `responsabilidad-civil` y ajustar el set final según afinidad real para el segmento `empresas`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar orden, densidad y legibilidad del carrusel una vez revisado el mix de productos.

## Problema

El feedback no trae una lista cerrada para `Más opciones para tu empresa`, pero sí pide reevaluar los relacionados de `responsabilidad-civil`. Eso sugiere que el mix actual puede no estar representando bien los productos que más afinidad tienen con esta página.

## Evidencia

- `data/product-catalog.json:1254-1258` hoy define estos relacionados para `responsabilidad-civil`:
  - `empresas/responsabilidad-civil-uso-ia`
  - `empresas/hecho-por-humanos`
  - `empresas/integral-de-comercio`
- `lib/product-page-source.ts:407-415` resuelve ese bloque como carrusel de productos.
- Feedback recibido: `Mas opciones para tu empresa: evaluar los productos relacionados.`
- `ERT-001` ya cubre en paralelo el cambio transversal de título para las páginas de `empresas`.

## Riesgo

- El set actual puede mezclar afinidad temática con productos demasiado específicos o poco conectados con la intención principal del usuario.
- Si se cambia sin criterio de orden, el carrusel puede seguir siendo poco útil aunque cambien los ítems.
- Resolver esto sin coordinar con el título transversal puede dejar la sección a mitad de camino.

## Alcance propuesto

- Auditar la lista actual de relacionados para RC empresas.
- Definir si corresponde reemplazar, ampliar o reordenar esos productos.
- Priorizar productos B2B con relación más directa al perfil de riesgo y operación de la empresa.
- Coordinar el resultado con el título segmentado definido en `ERT-001`.

## Criterio de aceptacion

- La sección de relacionados de RC empresas queda revisada con un set final documentado.
- El mix de productos resultante es coherente con un usuario que evalúa `responsabilidad-civil`.
- El carrusel sigue funcionando correctamente en desktop y mobile.
- La tarea no duplica el cambio transversal de título ya cubierto en `ERT-001`.

## Validacion

- Verificación estática de la configuración final de relacionados.
- Smoke manual del carrusel en desktop y mobile.
- Revisión rápida de coherencia temática del set final.
