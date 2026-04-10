# Backlog Authoring Rules

Usar estas reglas para cualquier backlog nuevo dentro de `docs/backlog/`.

## Objetivo

Cada task debe quedar lista para asignacion operativa sin reinterpretar el alcance.

## Formato obligatorio por task

Todo item nuevo debe incluir, al menos:

1. Titulo con ID
2. `Prioridad`
3. `Tipo`
4. `Estado`
5. `Split de ejecucion`
6. `Problema`
7. `Evidencia`
8. `Riesgo`
9. `Alcance propuesto`
10. `Criterio de aceptacion`
11. `Validacion`

## Regla de split

Cada task debe separar explicitamente:

- `Estructural`
- `Visual`

Y asignar ownership recomendado:

- mejoras estructurales: `Codex`
- mejoras visuales: `Claude`

### Casos posibles

- Si el item es solo estructural:
  - `Estructural: si`
  - `Owner estructural: Codex`
  - `Visual: no aplica`
- Si el item es solo visual:
  - `Visual: si`
  - `Owner visual: Claude`
  - `Estructural: no aplica`
- Si el item mezcla ambos:
  - separar entregables de cada frente
  - no dejar un alcance ambiguo
  - si conviene, dividir el item en dos tasks

## Criterio editorial

- No mezclar problemas de arquitectura con polish visual en una descripcion unica.
- Si un ticket tiene impacto visual pero la solucion principal es de arquitectura, el owner principal sigue siendo `Codex` y la parte visual queda como apoyo de `Claude`.
- Si el ticket cambia jerarquia, composicion, ritmo, tono visual o decisiones esteticas, debe explicitar el frente `Visual` y asignarse a `Claude`.

## Convencion para batches

Cada carpeta de batch debe tener su propio `README.md` con:

- fuente del barrido
- estado de validacion
- lista de tasks
- prioridad sugerida

Pero el contrato de formato vive en este archivo y aplica a todo backlog futuro.
