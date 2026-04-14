# TD-012 - Create image system for "Seguros pensados para vos"

Prioridad: Media-alta
Tipo: Visual system / Assets
Estado: Done (commit 04aa2dc, PR #20)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir source of truth para assets, naming, integración con Sanity o `public/`, y contrato de consumo en frontend.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir y producir la línea visual de imágenes para la sección "Seguros pensados para vos" siguiendo guía Woranz.

## Problema

La sección "Seguros pensados para vos" depende de imágenes, pero hoy no existe un sistema explícito para producirlas, versionarlas y consumirlas con consistencia de marca.

## Evidencia

- `app/api/migrate-homes/route.ts:57-83` siembra la sección `seccionCarouselFeatures` para home personas con textos, pero sin estrategia editorial de imágenes.
- `lib/home-page-source.ts:172-186` transforma `seccionCarouselFeatures` y cae a `"/images/feature-1.png"` si falta imagen.
- `components/templates/product-page.tsx` consume este carrusel como parte relevante del home, por lo que la calidad visual del asset impacta directamente en la propuesta principal.
- El skill local `woranz-images` define criterios de marca, pero hoy eso no está bajado como proceso ni contrato operativo en el backlog.

## Riesgo

- La sección puede quedar con placeholders, assets inconsistentes o imágenes genéricas.
- Se pierde una oportunidad de reforzar identidad Woranz en una zona de alto impacto.
- Si los assets no tienen source of truth, el frontend queda atado a nombres sueltos o fallbacks frágiles.

## Alcance propuesto

- Definir si estas imágenes viven en Sanity, en `public/` o en un esquema mixto.
- Crear lineamientos concretos para cantidad, formato, ratio, peso y naming.
- Producir o comisionar las imágenes con criterio Woranz para esa sección.
- Reemplazar fallbacks genéricos por un flujo explícito de asset requerido.

## Criterio de aceptacion

- La sección tiene imágenes finales, consistentes y aprobadas visualmente.
- Existe un contrato claro de dónde se cargan y cómo las consume frontend.
- No depende de placeholders genéricos para renderizar correctamente.
- La línea visual responde a la guía Woranz y no a stock genérico.

## Validacion

- Revisión visual de la sección en desktop y mobile.
- Verificación de peso y formato de assets.
- Smoke de render desde la fuente elegida.
