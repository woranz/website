# INF-001 - Review incendio hero copy with woranz-copy

Prioridad: Alta
Tipo: Copy / Hero messaging
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar headline y bajada del hero en la fuente de verdad actual, siguiendo la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo hero mantenga claridad, jerarquía y tensión visual sin volverlo más largo de lo necesario.

## Problema

El hero actual de `incendio` usa un mensaje correcto pero genérico. El feedback pide rever título y copy, explícitamente con `woranz-copy`, para que el mensaje suene más directo, más propio de Woranz y más alineado al producto real: una cobertura básica, concreta y muchas veces obligatoria.

## Evidencia

- `data/product-catalog.json:1523-1524` define hoy:
  - `headline`: `Cobertura concreta para uno de los riesgos más grandes`
  - `subtitulo`: `Protegés tu propiedad frente a daños que pueden cambiarlo todo.`
- `.claude/skills/woranz-productos/PRODUCTOS.md:37-40` define `Incendio (Personas)` como una cobertura específica, más acotada y económica que el combinado familiar, muchas veces pedida por bancos o hipotecas.
- El skill `woranz-copy` exige un tono directo, concreto y sin dramatizar.

## Riesgo

- El hero puede sonar intercambiable con otros seguros patrimoniales.
- Si el copy dramatiza el riesgo, se desalinearía con la guía de producto.
- Si el copy se corrige sin revisar la ficha del producto, puede terminar pareciéndose demasiado a `seguro-de-hogar`.

## Alcance propuesto

- Revisar headline y bajada del hero usando la ficha de producto y el criterio de `woranz-copy`.
- Diferenciar el mensaje respecto de `seguro-de-hogar`, reforzando que es una cobertura puntual y más básica.
- Mantener el copy corto y escaneable para no romper el hero existente.
- Si hace falta, proponer más de una opción editorial antes de cerrar el wording final.

## Criterio de aceptacion

- El hero deja de usar el copy actual y pasa a un mensaje alineado a `woranz-copy`.
- El nuevo texto diferencia con claridad `incendio` frente a `seguro-de-hogar`.
- El mensaje evita dramatizar y conserva foco en protección concreta y accesible.
- Headline y bajada siguen funcionando dentro del layout actual.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero en desktop y mobile.
