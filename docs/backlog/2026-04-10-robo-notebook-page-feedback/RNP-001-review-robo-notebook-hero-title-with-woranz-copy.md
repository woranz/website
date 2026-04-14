# RNP-001 - Review robo notebook hero title with woranz-copy

Prioridad: Alta
Tipo: Copy / Hero messaging
Estado: Done (copy aprobado en doc Contenidos Web)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar el headline del hero en la fuente de verdad actual, siguiendo la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo título mantenga claridad, jerarquía y tensión visual sin romper el hero.

## Problema

La página de `robo-notebook` necesita revisar el título del hero. El feedback pide puntualmente revisar ese headline para que suene más propio de Woranz y más específico para una notebook como herramienta de trabajo o estudio.

## Evidencia

- `data/product-catalog.json:545` define hoy el headline como `Si tu notebook es clave, no puede quedar descubierta`.
- `.claude/skills/woranz-productos/PRODUCTOS.md:45-49` ubica a notebook dentro de los microseguros para objetos personales de uso diario, con tono moderno, cercano y simple.
- El skill `woranz-copy` exige un tono directo, corto y humano.

## Riesgo

- El headline puede sonar correcto pero poco distintivo.
- Si el nuevo título dramatiza de más, pierde la voz liviana y directa de Woranz.
- Si se corrige sin criterio, puede quedar demasiado parecido a otros robos y perder especificidad.

## Alcance propuesto

- Revisar el título del hero con `woranz-copy`.
- Reforzar el valor de la notebook como herramienta clave para trabajo o estudio.
- Mantener el texto corto y escaneable para no romper el hero existente.
- Si hace falta, proponer más de una alternativa editorial antes de cerrar el wording final.

## Criterio de aceptacion

- El hero deja de usar el título actual y pasa a un mensaje alineado a `woranz-copy`.
- El nuevo texto suena específico para robo de notebook, no intercambiable con otros productos.
- El mensaje mantiene foco en uso cotidiano, valor de la herramienta y cobertura concreta.
- El título final sigue funcionando dentro del layout actual.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero en desktop y mobile.
