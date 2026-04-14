# HGF-003 - Produce PRD for seguro de hogar generic quoter

Prioridad: Alta
Tipo: Product / Research / Lead flow
Estado: Done (PR #24)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: PRD ejecutable con benchmark, campos requeridos, reglas, destino de lead y criterios de éxito para un cotizador genérico de hogar.
- Visual: si
- Owner visual: Claude
- Entregable visual: no aplica hasta contar con PRD aprobado.

## Problema

`seguro-de-hogar` hoy no tiene un cotizador inline real. El feedback pide sumar un cotizador genérico, pero antes exige research de mercado para definir qué campos pide normalmente el rubro. Sin ese trabajo previo, implementación y UI quedan bloqueadas.

## Evidencia

- `data/product-catalog.json:304-309` configura el bloque de cotización de hogar con `modo: contacto`.
- `lib/product-page-source.ts:331-344` hoy descarta `seccionCotizador` cuando el modo no corresponde a un inline soportado.
- `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md` ya registra la necesidad transversal de un formulario genérico para productos sin cotizador inline.
- Feedback recibido: `Agregar un cotizador generico, hay que hacer un research del mercado y ver que campos piden normalmente. Requiere PRD.`

## Riesgo

- Implementar sin benchmark puede producir un formulario incompleto o con fricción innecesaria.
- El producto puede terminar con un pseudo-cotizador que no responde al mercado ni a operaciones.
- Si se salta el PRD, frontend arranca sin contrato de datos ni criterio de alcance aprobado.

## Alcance propuesto

- Hacer research de mercado sobre cotizadores o formularios de seguro de hogar comparables.
- Definir qué campos son estándar, cuáles opcionales y cuáles no conviene pedir en primera captura.
- Producir un PRD específico para `seguro-de-hogar`, enlazado a la solución transversal de `TD-015`.
- Dejar explícito si el entregable será un quoter real, un lead form enriquecido o una primera etapa híbrida.

## Criterio de aceptacion

- Existe un PRD específico para `seguro-de-hogar` con benchmark y alcance aprobado.
- El PRD lista campos, validaciones, dependencias operativas y destino del lead.
- Queda claro cómo este caso se apoya o extiende `TD-015`.
- No se inicia implementación UI o frontend antes de aprobar ese PRD.

## Validacion

- Revisión del PRD contra el feedback original.
- Confirmación explícita de stakeholders sobre campos y alcance mínimo.
- Checklist de readiness antes de pasar a UI o implementación.
