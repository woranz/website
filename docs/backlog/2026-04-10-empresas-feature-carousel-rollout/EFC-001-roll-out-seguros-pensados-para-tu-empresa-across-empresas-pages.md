# EFC-001 - Roll out "Seguros pensados para tu empresa" across empresas pages

Prioridad: Alta
Tipo: IA / Layout architecture / Cross-page content rollout
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir como reutilizar la seccion `Seguros pensados para tu empresa` en `/empresas` y en todas las coberturas de `empresas`, resolviendo el punto de insercion y la fuente compartida del bloque.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir la version B2B del bloque, su tono visual, orden y comportamiento en contexto de pagina home y pagina de cobertura.

## Problema

El segmento `empresas` no tiene hoy una seccion equivalente a `Seguros pensados para vos`, pero el feedback pide crear `Seguros pensados para tu empresa` y hacerla aparecer tanto en la home B2B como en todas las coberturas empresariales. Eso exige un rollout transversal sobre dos pipelines distintos de pagina.

## Evidencia

- `app/empresas/page.tsx:14-18` renderiza la home de `empresas` a partir de `getHomePageData("empresas")`.
- `lib/home-page-source.ts:172-186` ya soporta `seccionCarouselFeatures` para home pages.
- `components/templates/product-page.tsx:818-828` renderiza las coberturas de producto con `ProductPageTemplate`, en una capa distinta al home.
- Feedback recibido: agregar una seccion `Seguros pensados para tu empresa` similar a la de `seguros pensados para vos`, en esta pagina y en todas las coberturas de `empresas`.

## Riesgo

- Si se resuelve solo en `/empresas`, el segmento queda inconsistente frente al pedido de rollout total.
- Si se implementa por pagina, se duplica configuracion y mantenimiento entre home y coberturas.
- Sin definir una version B2B del bloque, la seccion puede sentirse reciclada desde `personas` en lugar de pensada para empresa.

## Alcance propuesto

- Definir el bloque `Seguros pensados para tu empresa` como patron del segmento `empresas`.
- Resolver como se inyecta en la home B2B y en las coberturas empresariales sin parchear pagina por pagina.
- Definir titulo, orden, y logica de contenido del carrusel o bloque final.
- Validar que la implementacion no rompa el orden actual de CTA y footer en las paginas de producto.

## Criterio de aceptacion

- `/empresas` muestra la seccion `Seguros pensados para tu empresa`.
- Las coberturas de `empresas` muestran la misma seccion en una posicion consistente.
- El rollout vive en una capa compartida y no depende de configuraciones dispersas por pagina.
- El bloque funciona correctamente en desktop y mobile.

## Validacion

- Smoke visual en `/empresas` y en una muestra representativa de coberturas de `empresas`.
- Verificacion estatica del punto de insercion y de la fuente de contenido compartida.
- Revision visual del orden final entre contenido principal, CTA, nuevo bloque y footer.
