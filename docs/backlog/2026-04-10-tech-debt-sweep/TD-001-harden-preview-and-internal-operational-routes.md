# TD-001 - Harden preview and internal operational routes

Prioridad: Alta
Tipo: Seguridad / Operacion
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: no aplica

## Problema

Hay endpoints internos expuestos dentro de `app/api` sin un mecanismo de autenticacion o secreto de control. Eso mezcla superficies operativas con superficie publica y deja acciones sensibles accesibles por URL.

## Evidencia

- `app/api/draft-mode/enable/route.ts:4-9` habilita draft mode para cualquier request y redirige segun query string.
- `app/api/draft-mode/disable/route.ts:4-11` deshabilita draft mode sin validar origen ni secreto.
- `app/api/migrate-homes/route.ts:171-199` deja un endpoint de escritura a Sanity dentro del runtime web.
- `app/api/migrate-homes/route.ts:176-180` devuelve instruccion operativa para crear token de Sanity desde la propia ruta.
- `app/api/migrate-homes/route.ts:190` usa `client.createOrReplace(home as any)` sobre contenido hardcodeado.

## Riesgo

- Cualquier persona con la URL puede activar preview y navegar el sitio en draft mode.
- La superficie operativa queda mezclada con el deploy de produccion aunque la ruta responda `403` fuera de `development`.
- Se institucionaliza un patron peligroso: scripts de migracion expuestos como route handlers.

## Alcance propuesto

- Proteger `draft-mode/enable` y `draft-mode/disable` con `secret` firmado o token compartido.
- Validar y sanear `redirect` para evitar open redirects.
- Mover `migrate-homes` fuera de `app/api` a un script operativo o accion interna no expuesta publicamente.
- Eliminar mensajes operativos sensibles desde respuestas HTTP publicas.

## Criterio de aceptacion

- Activar o desactivar draft mode sin `secret` devuelve `401` o `403`.
- El redirect de preview solo acepta destinos internos permitidos.
- No queda ningun endpoint publico dedicado a sembrar o migrar contenido en Sanity.
- La operacion equivalente existe como script local o procedimiento documentado fuera del runtime web.

## Validacion

- Request manual a draft mode sin secreto falla.
- Request con secreto valido activa preview.
- `rg -n "migrate-homes" app/api scripts` deja la version operativa solo en `scripts/` o documentacion.
