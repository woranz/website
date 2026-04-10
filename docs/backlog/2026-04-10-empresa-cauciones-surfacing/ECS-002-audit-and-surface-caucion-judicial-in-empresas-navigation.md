# ECS-002 - Audit and surface caucion judicial in empresas navigation

Prioridad: Alta
Tipo: IA / Navigation / Product discoverability
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: auditar la exposición actual de `empresas/caucion-judicial` y agregar el punto de entrada correcto en la navegación o superficie equivalente si corresponde mantenerla visible como cobertura standalone.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar naming, iconografía y ubicación del acceso para que la cobertura sea encontrable sin recargar el menú de `empresas`.

## Problema

`Caución Judicial` ya está cargada en catálogo y tiene copy aprobado en fuente, pero hoy no aparece en la navegación principal de `empresas`. Eso la deja fuera del descubrimiento natural del sitio aunque exista como página resoluble.

## Evidencia

- `data/product-catalog.json:1081-1112` define `empresas/caucion-judicial` con contenido propio.
- `app/[segmento]/coberturas/[slug]/page.tsx` resuelve páginas de cobertura vía routing dinámico, por lo que la cobertura ya tiene soporte técnico de rendering.
- `components/site/header.tsx:102-115` lista los accesos visibles del menú `empresas` y no incluye `Caución Judicial`.
- `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md:77-80` confirma que el documento fuente ya trae texto aprobado para esta cobertura.

## Riesgo

- La cobertura puede existir solo para acceso manual o interno, sin descubribilidad real desde la web.
- Si no se define su relación con `Cauciones Tradicionales`, la arquitectura comercial de cauciones queda ambigua.
- La ausencia en navegación puede hacer que el usuario interprete que la oferta no existe.

## Alcance propuesto

- Confirmar si `Caución Judicial` debe exponerse como página standalone en la navegación de `empresas`.
- Si corresponde, sumarla al menú o a la superficie principal de acceso para coberturas empresariales.
- Revisar también si debe aparecer como derivación clara desde `Cauciones Tradicionales`.
- Documentar la decisión final de exposición para evitar que la cobertura quede otra vez huérfana.

## Criterio de aceptacion

- Existe una definición explícita de cómo se expone `empresas/caucion-judicial`.
- Si se mantiene como cobertura standalone, tiene al menos un punto de entrada claro desde navegación o una superficie equivalente.
- La decisión es consistente con el resto de la arquitectura de cauciones B2B.
- La cobertura deja de depender de acceso manual por URL para ser descubierta.

## Validacion

- Verificación estática del menú y de la superficie elegida para el acceso.
- Smoke manual del recorrido hasta `empresas/caucion-judicial`.
- Revisión de consistencia entre catálogo, navegación y posicionamiento comercial.
