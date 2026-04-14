# TD-017 - Audit content ownership: hardcoded vs Sanity

Prioridad: Alta
Tipo: CMS governance / Content architecture
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: matriz de ownership por contenido, limpieza de hardcodes y definición de source of truth.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que al mover contenido a CMS no se degrade jerarquía ni consistencia editorial.

## Problema

No está claro qué contenido debe vivir en Sanity y qué contenido debe permanecer hardcoded. Hoy conviven ambos enfoques dentro del mismo sitio, con defaults y fallbacks que vuelven difuso el ownership editorial.

## Evidencia

- `lib/home-page-source.ts:240-262` define múltiples fallbacks hardcoded para metadata, hero y CTA aunque la home ya viene de Sanity.
- `lib/product-page-source.ts:109-113` y `464-485` define defaults hardcoded para descripción y CTAs de producto.
- `lib/product-page-source.ts:480` cae a `teamCount: "4+"`.
- `lib/home-page-source.ts:205` cae a `teamCount: "+9"`.
- `components/templates/product-page.tsx:40-43` hardcodea links institucionales en navegación.
- `components/site/footer.tsx:9-60` hardcodea columnas enteras del footer y múltiples links placeholder.
- `components/site/header.tsx:120-121` hardcodea el login genérico.
- `app/api/migrate-homes/route.ts:12-168` además contiene contenido seed hardcoded de homes, incluyendo CTAs y `teamCount`.

## Riesgo

- El equipo editorial no sabe qué puede cambiar desde CMS.
- El frontend mantiene defaults que enmascaran ausencia o inconsistencia de contenido real.
- Aumenta el drift entre lo que vive en schemas, lo que se siembra y lo que finalmente se renderiza.

## Alcance propuesto

- Hacer una matriz de ownership por superficie:
  - contenido editorial
  - navegación global
  - trust signals
  - metadata
  - CTAs
  - copies de fallback
- Decidir qué vive en Sanity, qué vive en config tipada y qué no debe ser editable.
- Limpiar hardcodes que hoy compiten con contenido CMS.
- Dejar documentada la fuente de verdad por tipo de contenido.

## Criterio de aceptacion

- Existe una matriz clara `contenido -> owner -> fuente de verdad`.
- Se reducen fallbacks hardcoded en rutas ya gobernadas por CMS.
- Header, footer, trust signals y CTAs tienen ownership explícito.
- El equipo puede distinguir con claridad qué se cambia en Sanity y qué en código.

## Validacion

- Revisión estática de schemas, queries y components.
- `rg` comparativo de hardcodes relevantes antes y después.
- Smoke de render con contenido CMS válido.
