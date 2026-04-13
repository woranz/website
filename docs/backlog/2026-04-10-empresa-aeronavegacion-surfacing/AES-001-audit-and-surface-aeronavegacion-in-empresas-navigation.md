# AES-001 - Audit and surface aeronavegacion in empresas navigation

Prioridad: Alta
Tipo: IA / Navigation / Product discoverability
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: auditar la exposición actual de `empresas/aeronavegacion` y agregar el punto de entrada correcto en la navegación o superficie equivalente si corresponde mantenerla visible como cobertura standalone.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar naming, iconografía y ubicación del acceso para que conviva con el resto del menú de `empresas` sin romper jerarquía.

## Problema

`Aeronavegación` ya existe como cobertura en catálogo y tiene copy aprobado, pero hoy no aparece en la navegación principal de `empresas`. Eso deja una cobertura activa sin punto de entrada claro y genera duda sobre si realmente está publicada como página utilizable.

## Evidencia

- `data/product-catalog.json:1324-1360` define `empresas/aeronavegacion` con contenido propio.
- `app/[segmento]/coberturas/[slug]/page.tsx` resuelve páginas de cobertura vía routing dinámico, por lo que la cobertura puede renderizarse sin ruta dedicada manual.
- `components/site/header.tsx:102-115` lista los ítems visibles del menú `empresas` y no incluye `Aeronavegación`.
- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md:112-115` confirma que el documento fuente ya trae texto aprobado para esta cobertura.

## Riesgo

- La cobertura existe técnicamente pero queda invisible para navegación directa.
- Si no se define cómo debe surfacerse, puede quedar como una URL aislada sin descubribilidad real.
- Mantener el producto sin superficie visible vuelve inconsistente la promesa del catálogo con la experiencia real del sitio.

## Alcance propuesto

- Confirmar si `Aeronavegación` debe exponerse como página standalone en la navegación de `empresas`.
- Si corresponde, sumarla al menú o a la superficie de acceso principal definida para coberturas B2B.
- Validar también su presencia en relacionados, carruseles o accesos desde otras páginas afines.
- Dejar documentado si queda standalone, derivada desde otra página o ambas cosas.

## Criterio de aceptacion

- Existe una definición explícita de cómo se expone `empresas/aeronavegacion`.
- Si se mantiene como cobertura standalone, tiene al menos un punto de entrada claro desde la navegación o una superficie equivalente.
- La cobertura deja de depender de acceso manual por URL para ser descubierta.
- La decisión queda alineada con la arquitectura general del segmento `empresas`.

## Validacion

- Verificación estática del menú y de la superficie elegida para el acceso.
- Smoke manual del recorrido hasta `empresas/aeronavegacion`.
- Revisión de consistencia entre catálogo, navegación y posicionamiento comercial.
