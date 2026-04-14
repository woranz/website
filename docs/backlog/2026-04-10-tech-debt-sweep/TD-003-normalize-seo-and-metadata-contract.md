# TD-003 - Normalize SEO and metadata contract

Prioridad: Alta
Tipo: SEO / Plataforma
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: no aplica

## Problema

El contrato de metadata esta fragmentado y arranca con una base incorrecta. El layout global publica metadata especifica de Accidentes Personales y varias rutas solo completan `title` y `description`, sin canonicals, Open Graph ni politicas consistentes por segmento.

## Evidencia

- `app/layout.tsx:22-26` define metadata global de "Accidentes Personales".
- `app/page.tsx:7-11`, `app/empresas/page.tsx:7-11` y `app/productores/page.tsx:7-11` sobreescriben solo parte del contrato.
- `app/[segmento]/coberturas/[slug]/page.tsx:26-39` devuelve `page.metadata`, que hoy solo contiene `title` y `description`.
- `lib/product-page-source.ts:543-546` genera metadata minima para productos.
- `lib/home-page-source.ts:239-244` genera metadata minima para homes.
- Las paginas de flujos especificos no agregan canonicals ni `robots` aunque son pasos transaccionales: `app/personas/coberturas/accidentes-personales/cotizacion/page.tsx:6-10`, `app/personas/coberturas/caucion-alquiler/preaprobacion/page.tsx:6-10`.

## Riesgo

- El sitio arranca con señales SEO incoherentes desde la raiz.
- Se pierde control sobre compartidos sociales, indexacion y canonicals.
- Las rutas transaccionales pueden terminar indexadas sin una politica explicita.

## Alcance propuesto

- Reemplazar la metadata global hardcodeada por una base institucional neutra.
- Definir un builder comun para metadata de home, producto y flujo transaccional.
- Agregar canonical, Open Graph, Twitter, alternates y `robots` donde aplique.
- Documentar que rutas deben indexarse y cuales no.

## Criterio de aceptacion

- `app/layout.tsx` deja de publicar metadata especifica de un producto.
- Homes y productos comparten un builder comun y consistente.
- Flujos como cotizacion, preaprobacion y exito tienen politica SEO explicita.
- No quedan paginas publicas importantes con metadata minima por omision.

## Validacion

- Revisión de `generateMetadata` y exports `metadata` en `app/`.
- Build sin regresiones.
- Inspeccion manual del `<head>` en home, producto y flujo transaccional.
