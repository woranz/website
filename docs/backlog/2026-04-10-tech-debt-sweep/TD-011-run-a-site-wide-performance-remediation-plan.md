# TD-011 - Run a site-wide performance remediation plan

Prioridad: Alta
Tipo: Performance / Core Web Vitals
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: si
- Owner visual: Claude
- Entregable visual: revisar media strategy, jerarquia above-the-fold y peso perceptual de shells visuales despues de la auditoria tecnica.

## Problema

El sitio necesita una iniciativa explicita de performance. Hoy el build compila, pero no hay un plan sistematico para mejorar Lighthouse y Core Web Vitals en rutas clave.

## Evidencia

- El build muestra rutas publicas con `First Load JS` alto para una web de marketing:
  - `/` `298 kB`
  - `/empresas` `298 kB`
  - `/productores` `298 kB`
- `components/templates/product-page.tsx` concentra mucha logica y wiring para la experiencia principal.
- `components/APCotizacionForm.tsx` y `components/PreaprobacionForm.tsx` son componentes client-side grandes.
- `components/Carousel.tsx`, `components/site/header.tsx` y otros componentes interactivos forman parte del shell visual recurrente.
- No hay, en la estructura actual relevada, una estrategia visible de budget, medicion o remediation por categoria.

## Riesgo

- Mala performance percibida en landings y flujos de conversion.
- Peores resultados de Lighthouse y potencial impacto SEO.
- Coste incremental: cada nueva feature puede seguir cargando el baseline sin control.

## Alcance propuesto

- Armar una auditoria de performance por tipo de ruta:
  - home
  - product page
  - formulario AP
  - preaprobacion de caucion
- Medir y priorizar:
  - JS inicial
  - client components en shell compartido
  - peso de imágenes
  - hydration cost
  - third-party y dependencias pesadas
  - oportunidades de streaming, split points y server components
- Definir un remediation plan por olas:
  - quick wins
  - refactors medianos
  - cambios estructurales
- Establecer budgets o umbrales minimos para no volver a degradar.

## Criterio de aceptacion

- Existe una línea base de performance por ruta crítica.
- Hay un plan priorizado con quick wins y cambios estructurales.
- Se reducen métricas relevantes de Lighthouse/Core Web Vitals en las rutas foco.
- El equipo cuenta con budgets o checks mínimos para sostener la mejora.

## Validacion

- Medición antes y después con Lighthouse en rutas críticas.
- Build y revisión del route output.
- Verificación manual de desktop y mobile en rutas foco.
