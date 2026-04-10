# CAT-003 - Add que es section on cauciones tradicionales

Prioridad: Alta
Tipo: Content rollout / Product page architecture
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: insertar la sección `Qué es` en cauciones tradicionales usando la fuente de contenido ya mapeada en el rollout transversal.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar la ubicación del bloque dentro del ritmo de la página y su relación con hero, coberturas y conversión.

## Problema

La página de `cauciones-tradicionales` todavía no expone una sección `Qué es`, aunque el template ya la soporta y el texto fuente ya existe en el inventario editorial extraído del documento de contenidos.

## Evidencia

- `lib/product-page-source.ts:346-353` soporta una sección `explanation` con título por defecto `Qué es`.
- `components/templates/product-page.tsx:288-303` ya renderiza esa sección.
- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md` ya mapea el texto aprobado para `empresas/cauciones-tradicionales`.
- Feedback recibido: `Agregar sección que es`.

## Riesgo

- La página sigue sin explicar el producto antes de empujar conversión.
- Si se agrega por fuera del rollout transversal, puede reaparecer drift entre páginas.
- Una mala ubicación del bloque puede competir con el carrusel de coberturas en lugar de complementarlo.

## Alcance propuesto

- Agregar la sección `Qué es` a cauciones tradicionales.
- Reusar el contenido ya inventariado en `QES-001-source-inventory.md`.
- Ubicar el bloque en una posición consistente con el patrón definido para las páginas de producto.
- Mantener alineación con el rollout transversal `QES-001`.

## Criterio de aceptacion

- `/empresas/coberturas/cauciones-tradicionales` muestra la sección `Qué es` con el texto aprobado.
- La sección usa la misma fuente de verdad definida para el rollout transversal.
- El bloque se integra de forma coherente en la narrativa de la página.
- No queda copy inventado ni duplicado para este producto.

## Validacion

- Smoke manual de la página.
- Verificación estática de la fuente de verdad para `empresas/cauciones-tradicionales`.
- Revisión visual de la posición del bloque dentro del template.
