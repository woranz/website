# APE-001 - Reuse AP personas quoter on AP empresas page

Prioridad: Alta
Tipo: IA / Quoter reuse / Conversion flow
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: reemplazar el modo de contacto actual por un cotizador inline reutilizando el flujo de AP personas, validando si la variante empresas necesita otro `idCoberturaPaquete` o adaptación mínima de parámetros.
- Visual: si
- Owner visual: Claude
- Entregable visual: ajustar el layout del cotizador para que funcione correctamente en el contexto B2B y no se perciba como un bloque pegado desde personas.

## Problema

La página de `empresas/accidentes-personales` hoy usa un bloque de contacto genérico, pero el feedback pide llevar ahí el cotizador de AP personas. Ese reuse no es trivial: el flujo actual de personas empuja a una ruta propia y el formulario operativo usa un `idCoberturaPaquete` hardcodeado, así que primero hay que validar compatibilidad con la variante empresas.

## Evidencia

- `data/product-catalog.json:759-764` define hoy el cotizador de `empresas/accidentes-personales` con `modo: contacto`.
- `lib/product-page-source.ts:255-268` solo renderiza cotizador inline si el modo es `inline-accidentes` o `inline-caucion`.
- `components/Quoter.tsx:133-145` hoy navega a `/personas/coberturas/accidentes-personales/cotizacion`.
- `components/APCotizacionForm.tsx:506`, `components/APCotizacionForm.tsx:951` y `app/api/ap/cotizacion/trigger/route.ts:13` usan `idCoberturaPaquete: 498`.
- Feedback recibido: agregar el cotizador de AP personas; puede que tenga otro `idCobertura`.

## Riesgo

- Si se copia el quoter sin revisar endpoints y paquete, la página empresas puede terminar cotizando el producto equivocado.
- Reusar el flujo de personas sin adaptación de copy y layout puede romper consistencia B2B.
- Si el cotizador sigue resolviendo en otra ruta sin ancla clara, el CTA del hero queda ambiguo.

## Alcance propuesto

- Reutilizar el quoter de AP personas como base para la página empresas.
- Validar si el paquete/cobertura operativa es el mismo o si empresas requiere otro identificador.
- Definir si el cotizador vive inline en la misma página o si deriva a un flujo dedicado de empresas con el mismo modelo.
- Asegurar que el bloque final pueda ser el destino del CTA primario del hero.

## Criterio de aceptacion

- `/empresas/coberturas/accidentes-personales` deja de depender de un bloque genérico de contacto y pasa a exponer un cotizador de AP coherente con el feedback.
- Queda documentado si empresas usa el mismo `idCoberturaPaquete` que personas o uno distinto.
- El flujo resultante no envía al usuario a un producto incorrecto.
- El cotizador funciona de manera consistente en desktop y mobile.

## Validacion

- Verificación estática del modo de cotizador configurado para la página.
- Prueba manual del flujo hasta la pantalla o resultado final correspondiente.
- Revisión de consistencia entre endpoint, `idCoberturaPaquete` y copy visible del producto.
