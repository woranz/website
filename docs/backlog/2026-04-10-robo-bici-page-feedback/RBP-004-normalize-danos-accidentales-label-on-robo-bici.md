# RBP-004 - Normalize danos accidentales label on robo bici

Prioridad: Alta
Tipo: Content accuracy / Coverage labeling
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar el título de cobertura para explicitar que `Daños accidentales` depende del plan.
- Visual: no aplica

## Problema

La cobertura hoy se presenta como `Daños accidentales`, mientras que la aclaración `según plan` aparece solo en la descripción. El feedback pide subir esa condición al título del item para evitar lectura engañosa.

## Evidencia

- `data/product-catalog.json:401-402` define hoy:
  - `titulo`: `Daños accidentales`
  - `descripcion`: `Según plan, cobertura ante golpes y roturas.`
- Feedback recibido: `Danos accidentales: Agregar "(según plan)"`

## Riesgo

- El usuario puede interpretar que la cobertura siempre aplica.
- La condición comercial queda escondida en un segundo nivel de lectura.
- Un rotulado incompleto puede generar expectativas equivocadas.

## Alcance propuesto

- Cambiar el título visible del item a `Daños accidentales (según plan)`.
- Revisar si la descripción sigue siendo necesaria o si conviene ajustarla para no repetir demasiado la misma aclaración.

## Criterio de aceptacion

- La cobertura ya no aparece como `Daños accidentales` a secas.
- La condición `según plan` es visible desde el primer nivel del acordeón.
- El item mantiene claridad y no duplica información innecesaria.

## Validacion

- Verificación estática del contenido de `robo-bici`.
- Smoke visual del bloque `Qué cubre`.
