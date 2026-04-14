# ECS-001 - Audit and surface garantias aduaneras in empresas navigation

Prioridad: Alta
Tipo: IA / Navigation / Product discoverability
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: auditar la exposición actual de `empresas/garantias-aduaneras` y agregar el punto de entrada correcto en la navegación o superficie equivalente si corresponde mantenerla visible como cobertura standalone.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar naming, iconografía y ubicación del acceso para que conviva con el resto del menú de `empresas` sin romper jerarquía.

## Problema

`Garantías Aduaneras` ya existe como cobertura en catálogo y tiene copy aprobado, pero hoy no aparece en la navegación principal de `empresas`. Eso deja una cobertura activa sin punto de entrada claro y genera duda sobre si realmente está publicada como página utilizable.

## Evidencia

- `data/product-catalog.json:960-996` define `empresas/garantias-aduaneras` con contenido propio.
- `app/[segmento]/coberturas/[slug]/page.tsx` resuelve páginas de cobertura vía routing dinámico, por lo que la cobertura puede renderizarse sin ruta dedicada manual.
- `components/site/header.tsx:102-115` lista los ítems visibles del menú `empresas` y no incluye `Garantías Aduaneras`.
- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md:72-75` confirma que el documento fuente ya trae texto aprobado para esta cobertura.

## Riesgo

- La cobertura existe técnicamente pero queda invisible para navegación directa.
- Si no se define si debe vivir como entry de menú o solo como subcobertura de `Cauciones Tradicionales`, puede duplicarse o canibalizarse su posicionamiento.
- Mantener el producto sin superficie visible vuelve inconsistente la promesa del catálogo con la experiencia real del sitio.

## Alcance propuesto

- Confirmar si `Garantías Aduaneras` debe exponerse como página standalone en la navegación de `empresas`.
- Si corresponde, sumarla al menú o a la superficie de acceso principal definida para coberturas B2B.
- Validar también su presencia en relacionados, carruseles o accesos desde `Cauciones Tradicionales`.
- Dejar documentado si queda standalone, derivada desde otra página o ambas cosas.

## Criterio de aceptacion

- Existe una definición explícita de cómo se expone `empresas/garantias-aduaneras`.
- Si se mantiene como cobertura standalone, tiene al menos un punto de entrada claro desde la navegación o una superficie equivalente.
- La decisión no contradice el catálogo actual ni duplica sin criterio la arquitectura de `Cauciones Tradicionales`.
- La cobertura deja de depender de acceso manual por URL para ser descubierta.

## Validacion

- Verificación estática del menú y de la superficie elegida para el acceso.
- Smoke manual del recorrido hasta `empresas/garantias-aduaneras`.
- Revisión de consistencia entre catálogo, navegación y posicionamiento comercial.
