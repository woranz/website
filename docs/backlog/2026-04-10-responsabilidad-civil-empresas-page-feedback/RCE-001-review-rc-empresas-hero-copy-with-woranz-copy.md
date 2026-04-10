# RCE-001 - Review RC empresas hero copy with woranz-copy

Prioridad: Alta
Tipo: Copy / Hero / Product positioning
Estado: Todo
Split de ejecucion:
- Estructural: no aplica
- Visual: si
- Owner visual: Claude
- Entregable visual: revisar título y bajada del hero de `responsabilidad-civil` con criterio de `woranz-copy`, manteniendo una propuesta más clara para contexto empresa.

## Problema

El hero de `responsabilidad-civil` necesita revisión editorial tanto en título como en bajada. El feedback no pide un texto cerrado, sino reevaluar la propuesta actual para que el producto se entienda mejor y suene más sólido en contexto B2B.

## Evidencia

- `data/product-catalog.json:1222-1224` define hoy:
  - título: `Si tu actividad genera un daño, tenés respaldo`
  - bajada: `Operás con tranquilidad frente a terceros.`
- Feedback recibido:
  - `Reveer el titulo`
  - `Reveer bajada`

## Riesgo

- El hero actual puede sonar genérico para un producto tan central como responsabilidad civil.
- Si se retoca solo el título o solo la bajada, el mensaje puede quedar desbalanceado.
- Sin pasar por `woranz-copy`, la revisión puede alejarse del tono de marca.

## Alcance propuesto

- Revisar el título actual del hero.
- Revisar también la bajada para que ambas piezas trabajen juntas.
- Alinear el resultado con tono Woranz y con intención B2B.
- Confirmar que el nuevo mensaje no duplique literalmente el bloque `Qué es`.

## Criterio de aceptacion

- La página tiene una propuesta de hero revisada para `responsabilidad-civil`.
- Título y bajada quedan editorialmente coherentes entre sí.
- El tono final es consistente con `woranz-copy`.
- El hero comunica mejor el valor del producto para empresas.

## Validacion

- Revisión editorial del copy final.
- Comparación rápida contra la versión actual.
- Chequeo visual del largo de título y bajada en desktop y mobile.
