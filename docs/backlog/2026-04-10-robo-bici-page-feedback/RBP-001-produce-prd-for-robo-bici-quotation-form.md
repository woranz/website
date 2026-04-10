# RBP-001 - Produce PRD for robo bici quotation form

Prioridad: Alta
Tipo: Product / Research / Lead flow
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: PRD ejecutable con benchmark, campos requeridos, reglas y destino de lead para un formulario o cotizador de robo de bici.
- Visual: si
- Owner visual: Claude
- Entregable visual: no aplica hasta contar con PRD aprobado.

## Problema

La página de `robo-bici` hoy no tiene un formulario o cotizador real. El feedback pide agregarlo, pero antes exige validar qué campos deberían pedirse, con research y PRD previos. Eso bloquea cualquier decisión de UI o implementación directa.

## Evidencia

- `data/product-catalog.json:385-390` configura `robo-bici` con `cotizador.modo: contacto`.
- `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md` ya registra la necesidad transversal de un formulario genérico para productos sin cotizador inline.
- `lib/product-page-source.ts:331-344` hoy descarta la sección de cotizador cuando el modo no corresponde a un inline soportado.
- Feedback recibido: `Agregar cotizador. Hacer feedback para evaluar campos, requiere PRD.`

## Riesgo

- Implementar sin benchmark puede dejar afuera datos clave de la bici, el uso o el riesgo.
- El producto puede terminar con un formulario incompleto o una captura excesiva para un microseguro.
- Si se salta el PRD, frontend arranca sin contrato de datos ni alcance aprobado.

## Alcance propuesto

- Hacer research de mercado sobre formularios o cotizadores comparables para seguro de bici.
- Definir qué campos son mínimos para una primera captura y cuáles deberían ir en una etapa posterior.
- Producir un PRD específico para `robo-bici`, enlazado a la solución transversal de `TD-015`.
- Definir si el entregable será un quoter real, un lead form enriquecido o una primera etapa híbrida.

## Criterio de aceptacion

- Existe un PRD específico para `robo-bici` con benchmark y alcance aprobado.
- El PRD lista campos, validaciones, dependencias operativas y destino del lead.
- Queda claro cómo este caso se apoya o extiende `TD-015`.
- No se inicia implementación UI o frontend antes de aprobar ese PRD.

## Validacion

- Revisión del PRD contra el feedback original.
- Confirmación explícita de stakeholders sobre campos y alcance mínimo.
- Checklist de readiness antes de pasar a UI o implementación.
