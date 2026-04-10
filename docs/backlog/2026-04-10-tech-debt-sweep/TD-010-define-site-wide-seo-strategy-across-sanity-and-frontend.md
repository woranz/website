# TD-010 - Define site-wide SEO strategy across Sanity and frontend

Prioridad: Alta
Tipo: SEO / CMS / Plataforma
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: no aplica

## Problema

Hoy el sitio tiene metadata minima y fragmentada, pero no una estrategia SEO integral. Falta definir que señales SEO controla editorialmente Sanity, cuales resuelve frontend de forma sistemica y como se gobiernan homes, productos, flows transaccionales y contenido institucional.

## Evidencia

- `app/layout.tsx:22-26` hoy define metadata global hardcodeada y especifica de un producto.
- `lib/home-page-source.ts:239-244` y `lib/product-page-source.ts:543-546` solo exponen `title` y `description`.
- `sanity/schemas/` no muestra, en la estructura actual, un contrato visible para SEO por pagina con campos dedicados para canonical, social, robots o structured data.
- `app/page.tsx`, `app/empresas/page.tsx`, `app/productores/page.tsx` y `app/[segmento]/coberturas/[slug]/page.tsx` resuelven metadata por ruta, pero sin estrategia comun.

## Riesgo

- El SEO queda preso de defaults tecnicos y no de una estrategia editorial clara.
- El equipo no puede gestionar ni priorizar SEO desde CMS sin tocar código.
- Diferentes tipos de pagina pueden terminar con señales incompletas o contradictorias.

## Alcance propuesto

- Definir una estrategia SEO para todo el sitio:
  - homes por segmento
  - paginas de producto
  - flows transaccionales
  - paginas institucionales futuras
- Diseñar el contrato SEO en Sanity:
  - `seoTitle`
  - `seoDescription`
  - `canonicalUrl` o equivalente
  - `ogTitle`
  - `ogDescription`
  - `ogImage`
  - `robots`
  - campos necesarios para structured data cuando aplique
- Implementar un builder unico en frontend para consumir ese contrato y completar defaults razonables.
- Definir qué campos son obligatorios, cuáles opcionales y cuándo usar fallback tecnico.

## Criterio de aceptacion

- Existe una estrategia documentada de SEO por tipo de pagina.
- Sanity expone campos SEO suficientes para que contenido y frontend no dependan de hardcodes dispersos.
- El frontend consume un builder unico de metadata.
- Las paginas importantes del sitio pueden administrarse desde CMS sin editar codigo para cambios SEO normales.

## Validacion

- Revisión de schemas de Sanity y rutas `generateMetadata`.
- Smoke manual del `<head>` en home, producto y flow.
- Build sin regresiones.
