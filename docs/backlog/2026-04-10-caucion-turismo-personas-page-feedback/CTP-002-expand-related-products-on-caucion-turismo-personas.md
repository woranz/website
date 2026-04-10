# CTP-002 - Expand related products on caucion turismo personas

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar la configuración de productos relacionados para incluir los robos pedidos en `Más opciones para vos`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el carrusel siga siendo claro y útil con la nueva selección de productos.

## Problema

El carrusel `Más opciones para vos` hoy no prioriza productos afines al público de esta página. El feedback pide sumar coberturas de robos para objetos personales: bicicleta, notebook y celular.

## Evidencia

- `data/product-catalog.json:291-294` hoy define solo dos relacionados:
  - `personas/accidentes-personales`
  - `empresas/caucion-turismo-estudiantil-agencias`
- `lib/product-page-source.ts:407-415` resuelve ese bloque como `carousel` de productos con título por defecto `Más opciones para vos`.
- Feedback recibido: sumar robos de bicicleta, notebook y celular.

## Riesgo

- El cross-sell actual mezcla `personas` con `empresas` y puede confundir intención.
- Si se agregan productos sin revisar coherencia, el carrusel puede perder foco.
- Mantener una selección poco afín desaprovecha una superficie clara de navegación lateral.

## Alcance propuesto

- Reemplazar o ampliar la lista de relacionados para incluir:
  - `personas/robo-bici`
  - `personas/robo-notebook`
  - `personas/robo-celular`
- Revisar si corresponde sacar el relacionado de `empresas` en esta página.
- Ordenar la lista final para que represente productos afines al mismo público.

## Criterio de aceptacion

- La sección `Más opciones para vos` incluye los productos de robos pedidos.
- El carrusel deja de depender solo de la lista corta actual.
- La selección final es coherente con un usuario de `personas`.
- El bloque sigue funcionando correctamente en desktop y mobile.

## Validacion

- Smoke manual del carrusel en desktop y mobile.
- Verificación estática de `productosRelacionados` para `personas/caucion-turismo-estudiantil`.
- Revisión visual de legibilidad y navegación del carrusel con la nueva selección.
