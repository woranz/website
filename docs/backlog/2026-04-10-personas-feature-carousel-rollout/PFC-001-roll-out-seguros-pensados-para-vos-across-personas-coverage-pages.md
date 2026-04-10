# PFC-001 - Roll out "Seguros pensados para vos" across personas coverage pages

Prioridad: Alta
Tipo: IA / Layout architecture / Cross-page content rollout
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir como reutilizar la seccion `Seguros pensados para vos` en todas las coberturas de `personas` y reubicarla debajo del bloque CTA final sin romper el template compartido.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar orden, respiracion y comportamiento del bloque en contexto de pagina de cobertura, coordinado con el sistema de imagenes ya abierto en `TD-012`.

## Problema

La seccion `Seguros pensados para vos` hoy existe como carrusel de features, pero el feedback pide dos cambios de alcance mayor: moverla debajo de la card/CTA final y hacerla aparecer en todas las coberturas de `personas`. Eso deja de ser un ajuste local de home y pasa a ser una decision de arquitectura compartida para el template de producto.

## Evidencia

- `components/templates/product-page.tsx:674-690` renderiza los carruseles dentro del flujo normal de secciones del template.
- `components/templates/product-page.tsx:527-559` define el bloque CTA final que hoy actua como cierre de conversion antes del footer.
- `components/templates/product-page.tsx:818-828` monta todas las secciones dentro de `<main>` y recien despues renderiza `<SiteFooter />`.
- `TD-012` ya cubre especificamente el sistema de imagenes de `Seguros pensados para vos`.
- Feedback recibido:
  - la seccion tiene que estar abajo de la card del footer
  - tiene que aparecer en todas las coberturas de `personas`

## Riesgo

- Si se mueve el bloque sin criterio comun, cada pagina de `personas` puede terminar con un orden distinto.
- Si se extiende a todas las coberturas sin definir source of truth, el template puede depender de contenido repetido o hardcodeado.
- Si no se coordina con `TD-012`, se puede multiplicar un bloque con imagenes todavia no resueltas.

## Alcance propuesto

- Definir la posicion estandar de `Seguros pensados para vos` debajo del bloque CTA final en las coberturas de `personas`.
- Resolver como se inyecta esa seccion en todas las paginas del segmento sin duplicar configuracion por pagina.
- Verificar que el rollout no afecte el comportamiento actual del home mas de lo necesario.
- Coordinar el consumo de assets con `TD-012`.

## Criterio de aceptacion

- Las coberturas de `personas` muestran `Seguros pensados para vos` en una posicion consistente, debajo del bloque CTA final.
- El rollout vive en una capa compartida y no depende de parchear pagina por pagina.
- El bloque sigue funcionando correctamente en desktop y mobile.
- La implementacion queda coordinada con el sistema de imagenes definido en `TD-012`.

## Validacion

- Smoke visual en una muestra representativa de coberturas de `personas`.
- Verificacion estatica del punto de insercion dentro del template compartido.
- Revision visual del orden final entre CTA, carrusel y footer.
