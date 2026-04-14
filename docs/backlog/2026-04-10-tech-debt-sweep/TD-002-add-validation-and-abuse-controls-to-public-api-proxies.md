# TD-002 - Add validation and abuse controls to public API proxies

Prioridad: Alta
Tipo: Backend boundary / Seguridad
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: no aplica

## Problema

La mayoria de las rutas publicas bajo `app/api` actuan como proxies hacia Woranz API o SendGrid con validacion minima o inconsistente. Hoy el boundary confia demasiado en `request.json()` y en payloads client-side.

## Evidencia

- `app/api/ap/propuesta/route.ts:21-33` mergea `body` completo con defaults y lo reenvia al backend externo.
- `app/api/ap/cotizacion/trigger/route.ts:7-24` hace lo mismo con cotizacion AP.
- `app/api/ap/mercadopago/route.ts:5-12` reenvia el body tal como llega.
- `app/api/ap/persona/route.ts:7-23` y `app/api/caucion/lookup/route.ts:7-23` validan DNI con reglas distintas.
- `app/api/forms/submit/route.ts:13-29` decide el handler por `_formType` pero no valida estructura de campos antes de delegar.
- `app/api/forms/submit/handlers/caucion-preaprobacion.ts:32-93` valida a mano con strings, sin schema compartido.
- `lib/woranz-api.ts:135-156` devuelve `Promise<any | null>` para `lookupPersonaFull`, dejando el adapter sin contrato tipado.
- `rg` sobre `app/api` no encontro rate limiting, control de origen ni proteccion anti abuso.

## Riesgo

- Inconsistencias de negocio segun que endpoint toque el usuario.
- Mayor facilidad para abuso automatizado de endpoints que pegan a APIs pagas o sensibles.
- Dificultad para depurar errores porque la validacion esta dispersa y es parcialmente implicita.

## Alcance propuesto

- Introducir schemas compartidos para cada request y response boundary.
- Centralizar reglas de documento, email y payload minimo por endpoint.
- Tipar respuestas externas y adaptar payloads antes de exponerlos a UI o handlers.
- Agregar rate limiting basico por IP o por fingerprint para endpoints publicos de lookup, cotizacion y submit.
- Agregar controles de origen donde corresponda y estandarizar mensajes de error.

## Criterio de aceptacion

- Cada route handler publica valida el input con schema declarativo.
- DNI, CUIT, email y payloads de cotizacion usan reglas unificadas.
- No quedan adapters publicos devolviendo `any` en el boundary con Woranz API.
- Endpoints sensibles rechazan abuso obvio con rate limiting o proteccion equivalente.
- Los handlers ya no reenvian `body` arbitrario a servicios externos.

## Validacion

- Casos invalidos dan `400` consistente antes de tocar APIs externas.
- Casos validos siguen funcionando con payloads documentados.
- Existe una utilidad compartida o modulo comun para schemas y guards de API.
