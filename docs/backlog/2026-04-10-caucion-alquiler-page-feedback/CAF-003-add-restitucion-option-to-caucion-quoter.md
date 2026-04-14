# CAF-003 - Add restitucion option to caucion quoter

Prioridad: P0
Tipo: Quoter / Pricing / Conversion flow
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: modelar la cobertura opcional en cotizador, querystring, preaprobación y notificación interna con recargo provisorio de `30%`.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir el patrón de switch/selector y su integración visual dentro del quoter sin degradar legibilidad ni jerarquía de precio.

## Problema

La cobertura `Restitución de la propiedad` ya aparece en la página como opcional, pero el quoter no permite activarla ni incorpora su impacto en precio. El feedback pide sumarla con un switch y usar un recargo provisorio de `30%` mientras se define la regla final.

## Evidencia

- `data/product-catalog.json:58-60` ya presenta `Restitución de la propiedad` como cobertura opcional.
- `components/CaucionQuoter.tsx:90-111` calcula precio solo con `alquiler`, `duracion`, `modoPago` y `provincia`.
- `components/CaucionQuoter.tsx:203-280` y `287-360` no exponen ningún control para esa cobertura en mobile ni desktop.
- `app/personas/coberturas/caucion-alquiler/preaprobacion/page.tsx:24-30` solo hidrata cuatro variables de cotización.
- `app/api/forms/submit/handlers/caucion-preaprobacion.ts:36-54` y `lib/email/templates/preaprobacion.ts:70-76` tampoco registran esa selección.

## Riesgo

- La oferta visible en la página no coincide con lo que el cotizador realmente cobra.
- La selección puede perderse entre quoter, formulario y operación interna.
- Si el pricing provisorio se aplica solo en UI, se genera drift con el backend operativo.

## Alcance propuesto

- Agregar un control de activación para `Restitución de la propiedad` en el quoter desktop y mobile.
- Aplicar un recargo provisorio de `30%` sobre el precio calculado cuando la opción esté activa.
- Propagar el estado elegido en `preapprovalHref`, en la página de preaprobación y en la salida operativa del formulario.
- Reusar exactamente el nombre de cobertura ya expuesto en la página para no abrir una variante paralela.
- Señalar explícitamente que la regla de `30%` es transitoria hasta validación comercial.

## Criterio de aceptacion

- El quoter desktop y mobile permite activar o desactivar `Restitución de la propiedad`.
- Al activarlo, el precio mostrado aumenta `30%` respecto del valor base, respetando el modo de pago.
- La selección persiste al navegar al formulario de preaprobación.
- La selección llega al email o payload operativo que recibe el equipo interno.

## Validacion

- Smoke manual del quoter en desktop y mobile comparando precio base vs precio con restitución.
- Verificación de query params y estado inicial en la página de preaprobación.
- Prueba manual del flujo de envío para confirmar que la selección aparece en la salida operativa.
