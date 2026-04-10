# INF-002 - Produce PRD for incendio generic quoter

Prioridad: Alta
Tipo: Product / Research / Lead flow
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: PRD ejecutable con benchmark, campos requeridos, reglas y destino de lead para un cotizador genérico de incendio.
- Visual: si
- Owner visual: Claude
- Entregable visual: no aplica hasta contar con PRD aprobado.

## Problema

La página de `incendio` hoy no tiene un cotizador inline real. El feedback pide agregar un cotizador genérico, pero antes exige research de mercado para entender qué campos se piden normalmente. Eso bloquea cualquier decisión de UI o implementación directa.

## Evidencia

- `data/product-catalog.json:1525-1527` configura `incendio` con `cotizador.modo: contacto`.
- `lib/product-page-source.ts:331-344` hoy descarta la sección de cotizador cuando el modo no corresponde a un inline soportado.
- `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md` ya registra la necesidad transversal de un formulario genérico para productos sin cotizador inline.
- Feedback recibido: `Agregar cotizador generico. Mirar que tiene el mercado con research. Requiere PRD`.

## Riesgo

- Implementar sin benchmark puede dejar fuera datos críticos del riesgo o pedir demasiado de entrada.
- El producto puede terminar con un formulario genérico pobre que no refleje cómo se cotiza incendio en el mercado.
- Si se salta el PRD, frontend arranca sin contrato de datos ni alcance aprobado.

## Alcance propuesto

- Hacer research de mercado sobre cotizadores o formularios de seguro de incendio comparables.
- Definir qué campos son mínimos para una primera captura y cuáles deberían quedar para una etapa posterior.
- Producir un PRD específico para `incendio`, enlazado a la solución transversal de `TD-015`.
- Definir si el entregable será un quoter real, un lead form enriquecido o una primera etapa híbrida.

## Criterio de aceptacion

- Existe un PRD específico para `incendio` con benchmark y alcance aprobado.
- El PRD lista campos, validaciones, dependencias operativas y destino del lead.
- Queda claro cómo este caso se apoya o extiende `TD-015`.
- No se inicia implementación UI o frontend antes de aprobar ese PRD.

## Validacion

- Revisión del PRD contra el feedback original.
- Confirmación explícita de stakeholders sobre campos y alcance mínimo.
- Checklist de readiness antes de pasar a UI o implementación.
