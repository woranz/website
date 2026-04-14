# APP-005 - Expand related products on AP personas

Prioridad: Alta
Tipo: Navigation / Cross-sell / Product page content
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar la configuración de productos relacionados para incluir la nueva lista pedida en `Más opciones para vos`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el carrusel siga siendo legible y útil con la nueva cantidad de opciones.

## Problema

El carrusel `Más opciones para vos` hoy ofrece una selección muy corta para AP personas. El feedback pide ampliar explícitamente esa lista a cinco coberturas concretas de personas.

## Evidencia

- `data/product-catalog.json:211-214` hoy define solo dos relacionados para AP personas:
  - `empresas/seguro-de-vida-empresas`
  - `personas/caucion-alquiler`
- `lib/product-page-source.ts:407-415` resuelve ese bloque como `carousel` de productos con título por defecto `Más opciones para vos`.
- Feedback recibido: agregar
  - `Seguro de hogar`
  - `Seguro incendio`
  - `Robo bicicleta`
  - `Robo celular`
  - `Robo notebook`

## Riesgo

- El cross-sell actual no refleja afinidad real con el público de AP personas.
- Si se agregan productos sin revisar orden o densidad, el carrusel puede volverse más ruidoso que útil.
- Mantener un mix `personas` / `empresas` en esta superficie puede confundir intención.

## Alcance propuesto

- Reemplazar o ampliar la lista de relacionados de AP personas con los cinco productos pedidos.
- Revisar orden y prioridad de esos cards dentro del carrusel.
- Asegurar que la sección siga representando coberturas relevantes para el mismo público.
- Verificar si la lista actual debe dejar de incluir productos de `empresas` en esta página.

## Criterio de aceptacion

- La sección `Más opciones para vos` de AP personas incluye los cinco productos pedidos.
- El carrusel deja de depender de la lista corta actual.
- La selección resultante es coherente con un usuario de `personas`.
- El bloque sigue funcionando correctamente en desktop y mobile.

## Validacion

- Smoke manual del carrusel en desktop y mobile.
- Verificación estática de `productosRelacionados` para AP personas.
- Revisión visual de legibilidad y navegación del carrusel con la nueva cantidad de cards.
