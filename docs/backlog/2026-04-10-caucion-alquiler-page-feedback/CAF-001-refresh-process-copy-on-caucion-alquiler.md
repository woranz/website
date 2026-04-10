# CAF-001 - Refresh process copy on caucion alquiler

Prioridad: P0
Tipo: Copy / Content UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar la fuente de verdad del copy del bloque `Pasos` y dejar explícito dónde vive ese contenido.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el bloque de pasos conserve jerarquía, ritmo y tono después del cambio editorial.

## Problema

El bloque `Pasos` de caución alquiler mantiene copy más rígido y específico que el feedback actual. Hoy menciona `woranz.com/alquileres`, promete respuesta en `2 horas hábiles` y usa una redacción menos directa para el pedido del contrato. Eso deja la página desalineada con el tono pedido y con una promesa operativa demasiado precisa para quedar hardcodeada sin validación.

## Evidencia

- `data/product-catalog.json:62-72` define los textos actuales de `Preaprobación` y `Contrato`.
- `lib/product-page-source.ts:180-187` mapea esos pasos como fuente efectiva del render.
- Feedback recibido:
  - Paso `Preaprobación`: "Completás tus datos y subís tu documentación online. Te respondemos al toque."
  - Paso `Contrato`: "Te vamos a pedir el borrador de tu contrato de alquiler, con eso emitimos la póliza."

## Riesgo

- Copy con promesa operativa rígida que puede quedar desactualizada.
- Fricción de tono frente a un flujo que debería sonar más directo y simple.
- Mayor confusión de ownership porque el texto vive hardcodeado y no queda claro si debe seguir ahí.

## Alcance propuesto

- Actualizar el copy de los pasos `01` y `02` en la fuente de verdad actual.
- Eliminar referencias innecesarias a `woranz.com/alquileres` y a la respuesta en `2 horas hábiles`, salvo que operaciones las ratifique de forma explícita.
- Validar el wording final con el criterio de marca de Woranz antes de cerrar implementación.
- Si el contenido debe migrar a CMS o config compartida, registrar ese follow-up bajo el criterio de `TD-017`.

## Criterio de aceptacion

- El paso `01` refleja el mensaje pedido sobre cargar datos y documentación online, con cierre breve y directo.
- El paso `02` explica que se solicita el borrador del contrato para emitir la póliza.
- El bloque de pasos mantiene consistencia de tono con la voz Woranz.
- No quedan menciones operativas rígidas no validadas dentro de este bloque.

## Validacion

- Smoke manual de `/personas/coberturas/caucion-alquiler`.
- Revisión editorial con criterio de marca Woranz.
- Verificación estática de la fuente de verdad actual para confirmar que el copy no quedó duplicado.
