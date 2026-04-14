# RCP-001 - Review robo celular hero copy with woranz-copy

Prioridad: Alta
Tipo: Copy / Hero messaging
Estado: Done (copy aprobado en doc Contenidos Web)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar headline y bajada del hero en la fuente de verdad actual, siguiendo la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo hero mantenga claridad, jerarquía y ritmo sin alargar de más el bloque principal.

## Problema

La página de `robo-celular` necesita revisar el mensaje principal. El feedback pide rever título y bajada del hero. En este producto hay que evitar tanto el tono dramático como el tono demasiado genérico, y hablarle a un usuario que depende del celular todos los días.

## Evidencia

- `data/product-catalog.json:491-492` define hoy:
  - `headline`: `Si te lo sacan, no te quedás sin nada`
  - `subtitulo`: `Cubrir tu celular es cubrir algo que usás todo el día.`
- `.claude/skills/woranz-productos/PRODUCTOS.md:45-49` agrupa celulares dentro de microseguros para objetos personales de uso diario, con tono moderno, cercano y simple.
- El skill `woranz-copy` exige un tono directo, corto y humano.

## Riesgo

- El hero puede sonar demasiado parecido a cualquier seguro de robo genérico.
- Si el mensaje se dramatiza de más, pierde la voz liviana y directa de Woranz.
- Si se corrige sin criterio, puede quedar demasiado parecido a bici o notebook y perder especificidad.

## Alcance propuesto

- Revisar headline y bajada del hero con `woranz-copy`.
- Reforzar el uso cotidiano del celular y la idea de reposición rápida o cobertura concreta.
- Mantener el copy corto y escaneable para no romper el hero existente.
- Si hace falta, proponer más de una alternativa editorial antes de cerrar el wording final.

## Criterio de aceptacion

- El hero deja de usar el copy actual y pasa a un mensaje alineado a `woranz-copy`.
- El nuevo texto suena específico para robo de celular, no intercambiable con otros productos.
- El mensaje mantiene foco en uso cotidiano, rapidez y cobertura concreta.
- Headline y bajada siguen funcionando dentro del layout actual.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero en desktop y mobile.
