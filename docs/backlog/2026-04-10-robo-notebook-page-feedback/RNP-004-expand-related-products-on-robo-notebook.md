# RNP-004 - Expand related products on robo notebook

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar la configuración de productos relacionados para incluir todos los robos, además de hogar e incendio.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el carrusel siga siendo claro y útil con la nueva selección de productos.

## Problema

El carrusel `Más opciones para vos` hoy ofrece una selección demasiado corta para `robo-notebook`. El feedback pide ampliarla con todos los robos, más `seguro-de-hogar` e `incendio`.

## Evidencia

- `data/product-catalog.json:585-587` hoy define solo un relacionado:
  - `personas/seguro-de-hogar`
- `lib/product-page-source.ts:407-415` resuelve ese bloque como `carousel` de productos con título por defecto `Más opciones para vos`.
- Feedback recibido: agregar todos los de robo, `hogar`, `incendio`.

## Riesgo

- El cross-sell actual desaprovecha una superficie clara para navegación entre microseguros y coberturas afines.
- Si se amplía sin criterio, el carrusel puede perder foco o densidad útil.
- La página puede quedar sin continuidad temática entre microseguros y coberturas patrimoniales cercanas.

## Alcance propuesto

- Reemplazar o ampliar la lista de relacionados para incluir, como mínimo:
  - `personas/robo-bici`
  - `personas/robo-monopatin`
  - `personas/robo-celular`
  - `personas/seguro-de-hogar`
  - `personas/incendio`
- Evaluar explícitamente si tiene sentido incluir también el mismo producto actual; por defecto no debería autocitearse.
- Revisar orden y prioridad de esos cards dentro del carrusel.
- Asegurar que la selección final siga siendo coherente para un usuario de `personas`.

## Criterio de aceptacion

- La sección `Más opciones para vos` incluye todos los robos relevantes para `personas`, además de `seguro-de-hogar` e `incendio`.
- El carrusel deja de depender de la lista corta actual.
- La selección final es coherente con un usuario de `personas`.
- El bloque sigue funcionando correctamente en desktop y mobile.

## Validacion

- Smoke manual del carrusel en desktop y mobile.
- Verificación estática de `productosRelacionados` para `personas/robo-notebook`.
- Revisión visual de legibilidad y navegación del carrusel con la nueva selección.
