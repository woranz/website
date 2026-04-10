# Backlog Analysis And Implementation Proposal

Fecha: `2026-04-10`
Workspace: `website/montreal`

## Foto del backlog

- Tasks relevadas: `89`
- Prioridad `P0`: `3`
- Prioridad `Alta`: `77`
- Prioridad `Media-alta`: `7`
- Prioridad `Media`: `2`
- Tech debt transversal ya abierto: `21` tasks

## Lectura ejecutiva

El backlog no conviene ejecutarlo en orden cronológico ni página por página. Hay varias requests repetidas que ya quedaron correctamente absorbidas como rollouts o tasks transversales, y si se ignora eso se duplica trabajo:

- `QES-001`: rollout de `Qué es`
- `TD-013`: normalización de destinos CTA
- `TD-015`: formulario genérico para planes sin cotizador inline
- `ERT-001`: título de relacionados para `empresas`
- `EFQ-001`: rollout de FAQs en `empresas`
- `TD-012`: sistema de imágenes de `Seguros pensados para vos`

La propuesta correcta es ejecutar por capas:

1. conversion y puntos rotos
2. bloques transversales reutilizables
3. páginas prioritarias ya desbloqueadas
4. research y PRDs pendientes
5. surfacing y navegación del catálogo oculto

## Principios de implementación

- No abrir 20 PRs de copy antes de resolver `QES-001` y `TD-017`.
- No tocar CTAs de páginas aisladas por fuera de `TD-013`.
- No construir formularios específicos sin definir primero `TD-015` o una excepción explícita.
- No resolver relacionados de `empresas` sin pasar por `ERT-001`.
- No implementar FAQs B2B página por página si `EFQ-001` puede absorber el patrón.

## Reparto entre Claude y Codex

La división no debe hacerse por página completa. Debe hacerse por tipo de trabajo.

### Regla base

- `Claude` define cómo se ve y cómo se dice.
- `Codex` implementa cómo funciona en el repo.

### Claude

Tomar:
- copy de hero, bajadas, pasos, badges y FAQs
- naming de secciones
- jerarquía visual y orden de bloques
- iconografía
- framing de imágenes
- composición de listas, carruseles y cards

Ejemplos claros:
- `APP-001`
- `CAT-001`
- `RCE-001`
- `HPH-001`
- `RUI-001`
- `RUI-002`
- `ICE-001`
- `ICE-003`

### Codex

Tomar:
- wiring de CTAs
- formularios y quoters
- rollouts transversales
- templates compartidos
- source mapping y data layer
- navegación y surfacing
- relacionados y defaults compartidos

Ejemplos claros:
- `TD-013`
- `QES-001`
- `TD-015`
- `ERT-001`
- `EFQ-001`
- `PFC-001`
- `EFC-001`
- `EHM-001`
- `APE-001`
- `PRD-002`

### Regla de no pisarse

- No asignar la misma página completa a ambos al mismo tiempo.
- No asignar el mismo batch a ambos al mismo tiempo.
- No tocar los mismos archivos en paralelo.
- `Claude` entrega definición, dirección visual o copy aprobable.
- `Codex` implementa después sobre esa definición.
- Si un ticket es puramente técnico, va directo a `Codex`.
- Si un ticket es puramente editorial o visual, va primero a `Claude` y luego a `Codex` solo si requiere cambios de código.

### Unidad correcta de trabajo

La unidad de ejecución no es “una página”, sino “un patrón compartido” o “un batch de la misma naturaleza”.

Ejemplos:
- `Claude` puede tomar todos los heroes y renombres de secciones.
- `Codex` puede tomar todos los rollouts de `Qué es`, CTAs, FAQs y formularios.

Eso minimiza conflictos y evita que ambos reabran la misma decisión desde lados distintos.

## Olas propuestas

### Ola 0 — Hotfix P0

Objetivo: cerrar lo urgente de `caucion-alquiler`.

Orden:
1. `TD-013` para los dos CTA de la página
2. `CAF-003` restitución en el quoter
3. `CAF-002` rediseño de requisitos
4. `CAF-001` refresh de copy de pasos

Salida esperada:
- `/personas/coberturas/caucion-alquiler` alineada con feedback crítico
- CTA funcionales
- quoter actualizado

### Ola 1 — Infra transversal mínima

Objetivo: crear la base que desbloquea varias páginas a la vez.

Orden:
1. `TD-013` cerrar convención de destinos CTA en homes y productos
2. `QES-001` materializar `Qué es` en la capa compartida
3. `ERT-001` fijar `Más opciones para tu empresa` en B2B
4. `EFQ-001` definir patrón y source of truth para FAQs en `empresas`
5. `FTC-001` unificar footer copy
6. `TD-017` dejar claro ownership editorial entre hardcoded y Sanity

Salida esperada:
- menos drift por página
- menos backlog duplicado
- una base clara para empezar a bajar páginas rápido

### Ola 2 — Conversión y formularios

Objetivo: resolver los puntos que destraban lead flow.

Orden:
1. `TD-015` definir el patrón de formulario genérico
2. `PRD-002` alta de productores
3. `PRD-003` wiring CTA de `/productores`
4. `APE-001` cotizador AP empresas
5. `APE-003` CTA AP empresas
6. `CAT-002` + `CAT-004` como paquete de coberturas/CTA/formulario compartido

No arrancar implementación directa de estos hasta cerrar PRD/product decision:
- `HGF-003`
- `INF-002`
- `RBP-001`
- `RCP-002`
- `RNP-002`

Esos cinco deben pasar primero por una mini etapa de producto y research, porque si no van a divergir entre sí.

### Ola 3 — Rollouts de segmento

Objetivo: bajar cambios repetidos en lote, no manualmente por página.

#### Personas

- `PFC-001` para `Seguros pensados para vos` en coberturas
- aplicar `QES-001` a todas las rutas mapeadas del segmento
- luego ajustar relacionados específicos:
  - `APP-005`
  - `CTP-002`
  - `RBP-005`
  - `RCP-004`
  - `RNP-004`

#### Empresas

- `EFC-001` para `Seguros pensados para tu empresa`
- `EFQ-001` para FAQs donde falten
- `QES-001` + `IAQ-001` + `IAQ-002` para `Qué es`
- luego relacionados específicos:
  - `CAT-006`
  - `APE-004`
  - `RCE-004`
  - `INE-002`
  - `ICE-002`

### Ola 4 — Home y navegación

Objetivo: mejorar descubrimiento del catálogo.

Orden:
1. `EHM-001` rediseño de `Nuestras coberturas` en `/empresas`
2. `ECS-001`
3. `ECS-002`
4. `AES-001`
5. revisar impacto sobre `TD-004` navegación centralizada

Salida esperada:
- catálogo B2B más encontrable
- menos productos “existentes pero invisibles”

### Ola 5 — Polishing por página

Objetivo: cerrar copys, badges, labels y composición fina una vez estable la base.

Entraría acá:
- `APP-001`, `APP-002`, `APP-003`
- `HGF-001`, `HGF-002`
- `INF-001`, `INF-003`, `INF-004`
- `RBP-002`, `RBP-004`
- `RCP-001`, `RCP-003`
- `RNP-001`, `RNP-003`
- `RCE-001`, `RCE-002`, `RCE-003`
- `HPH-001`
- `RUI-001`, `RUI-002`
- `ICE-001`, `ICE-003`
- `CAT-001`, `CAT-003`, `CAT-005`

## Streams paralelos recomendados

### Stream A — Frontend estructural

Propietario natural: `Codex`

Tomar:
- `TD-013`
- `QES-001`
- `TD-015`
- `ERT-001`
- `EFQ-001`
- `EHM-001`
- `PFC-001`
- `EFC-001`

### Stream B — UI y composición

Propietario natural: `Claude`

Tomar:
- ajustes de jerarquía visual
- iconografía
- image framing
- rediseño de listas y carruseles

### Stream C — Copy y contenido

Necesita pasar por `woranz-copy`

Tomar:
- heroes
- pasos
- footer
- badges
- FAQs

### Stream D — Producto / research

Tomar:
- los cinco formularios genéricos pendientes
- alta de productores si requiere definición operativa

## Asignación concreta recomendada

### Darle a Codex

- `TD-013`
- `QES-001`
- `TD-015`
- `ERT-001`
- `EFQ-001`
- `PFC-001`
- `EFC-001`
- `EHM-001`
- `CAF-003`
- `CAF-002`
- `APE-001`
- `APE-003`
- `PRD-002`
- `PRD-003`
- `ECS-001`
- `ECS-002`
- `AES-001`

### Darle a Claude

- todos los review de hero copy
- todos los renombres de secciones
- iconografía de cards
- framing y dirección visual de imágenes
- orden visual de bloques cuando el ticket no sea puramente técnico

En batches concretos:
- `2026-04-10-accidentes-personales-page-feedback`
- `2026-04-10-seguro-hogar-page-feedback`
- `2026-04-10-incendio-page-feedback`
- `2026-04-10-responsabilidad-civil-empresas-page-feedback`
- `2026-04-10-hecho-por-humanos-page-feedback`
- `2026-04-10-rc-uso-ia-page-feedback`
- `2026-04-10-integral-comercio-empresas-page-feedback`

### Darle a producto o research antes de implementar

- `HGF-003`
- `INF-002`
- `RBP-001`
- `RCP-002`
- `RNP-002`

Sin cerrar esos cinco, no conviene poner a `Codex` a construir formularios finales.

## Qué implementaría primero si arrancáramos mañana

1. `TD-013`
2. `CAF-003`
3. `CAF-002`
4. `QES-001`
5. `TD-015`
6. `APE-001`
7. `PRD-002`
8. `ERT-001`
9. `EFQ-001`
10. `EHM-001`

Ese orden prioriza:
- conversión rota
- reutilización
- desbloqueo de muchas páginas con pocos cambios

## Qué dejaría explícitamente fuera del primer sprint

- formulaciones de research aún no definidas para hogar, incendio, robos
- surfacing completo de productos ocultos si antes no cerramos navegación y catálogo
- polish visual fino de badges, crops y labels antes de estabilizar la arquitectura compartida

## Riesgos principales

- Si se implementa por página, el backlog explota en trabajo repetido.
- Si no se cierra `TD-017`, varias mejoras pueden volver a romperse por drift entre código y CMS.
- Si se ataca CTA/formularios sin `TD-013` y `TD-015`, se crean flujos incoherentes.
- Si se hace el rollout de carruseles antes de resolver assets y orden, se propaga una UI incompleta.

## Recomendación final

Trabajaría en `3` sprints cortos:

- Sprint 1: `P0` + CTA + `Qué es` + base de forms
- Sprint 2: rollouts de segmento (`personas` y `empresas`) + FAQs + relacionados
- Sprint 3: homes, navegación oculta y polish de páginas específicas

La mejor unidad de ejecución no es “una página”, sino “un patrón compartido”. El backlog ya quedó estructurado para eso y conviene respetarlo.
