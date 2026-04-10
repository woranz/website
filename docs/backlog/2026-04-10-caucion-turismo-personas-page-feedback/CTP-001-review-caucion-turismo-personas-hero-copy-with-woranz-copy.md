# CTP-001 - Review caucion turismo personas hero copy with woranz-copy

Prioridad: Alta
Tipo: Copy / Hero messaging
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar headline y bajada del hero en la fuente de verdad actual, siguiendo la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo hero mantenga claridad, jerarquía y confianza sin alargar de más el bloque principal.

## Problema

La página de `caucion-turismo-estudiantil` necesita revisar el mensaje principal. El feedback pide explícitamente rever título y bajada del hero. En este producto eso es sensible porque hay que hablarle al padre o madre, transmitir seguridad real y evitar que el mensaje suene burocrático o demasiado técnico.

## Evidencia

- `data/product-catalog.json:239-240` define hoy:
  - `headline`: `El viaje está respaldado desde el primer día`
  - `subtitulo`: `Antes de firmar, podés verificar que existe una póliza real que garantiza el viaje.`
- `.claude/skills/woranz-productos/PRODUCTOS.md` define para `Caución Turismo Estudiantil` un tono de cercanía y seguridad, hablándole al padre o madre y enfocando en respaldo legal y económico.
- El skill `woranz-copy` exige un tono directo, corto y humano.

## Riesgo

- El hero puede sonar correcto pero demasiado genérico para un producto de alta sensibilidad.
- Si el mensaje se vuelve más legalista, pierde cercanía con el decisor real.
- Si se dramatiza demasiado, se desalinearía con la voz Woranz.

## Alcance propuesto

- Revisar headline y bajada del hero con `woranz-copy`.
- Reforzar el mensaje de seguridad y verificación real de la póliza, hablándole al padre o madre.
- Mantener el copy corto y escaneable para no romper el hero existente.
- Si hace falta, proponer más de una alternativa editorial antes de cerrar el wording final.

## Criterio de aceptacion

- El hero deja de usar el copy actual y pasa a un mensaje alineado a `woranz-copy`.
- El nuevo texto habla con claridad al decisor real de esta cobertura.
- El mensaje mantiene foco en respaldo real y verificación de la póliza.
- Headline y bajada siguen funcionando dentro del layout actual.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero en desktop y mobile.
