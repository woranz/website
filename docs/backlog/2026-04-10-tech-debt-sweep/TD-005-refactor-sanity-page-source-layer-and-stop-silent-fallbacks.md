# TD-005 - Refactor Sanity page-source layer and stop silent fallbacks

Prioridad: Alta
Tipo: CMS / Data layer
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: no aplica

## Problema

La capa que transforma contenido de Sanity hacia `ProductPageData` esta duplicada entre home y producto, usa fallbacks hardcodeados y silencia errores con `catch {}`. Hoy funciona, pero deja poca observabilidad y hace mas caro cualquier cambio de contenido o seccion.

## Evidencia

- `lib/home-page-source.ts:108-122` y `lib/product-page-source.ts:123-149` repiten helpers base como `isSanityConfigured` y resolucion de imagenes.
- `lib/home-page-source.ts:147-217` y `lib/product-page-source.ts:325-491` resuelven secciones parecidas con logica separada.
- `lib/home-page-source.ts:292-296` traga errores y devuelve `null`.
- `lib/product-page-source.ts:582-584`, `603-605` y `654-655` tragan errores y degradan en silencio.
- `lib/home-page-source.ts:176` cae a `"/images/feature-1.png"`.
- `lib/home-page-source.ts:263` y `lib/product-page-source.ts:236-252` caen a `"/images/hero.png"` en varios caminos.

## Riesgo

- Errores de CMS parecen "contenido vacio" o assets genéricos en vez de incidentes detectables.
- Cualquier cambio de seccion debe tocar dos pipelines.
- Los fallbacks ocultan datos faltantes que deberian bloquear publicacion o encender alerta.

## Alcance propuesto

- Extraer helpers compartidos para fetch, mapeo de imagenes y transformacion base.
- Unificar un contrato comun para sections compartidas entre home y producto.
- Reemplazar `catch {}` por manejo observable: logging, errored state o alertas.
- Definir que fallbacks visuales son aceptables y cuales deben cortar publicacion.

## Criterio de aceptacion

- Las transformaciones compartidas viven en modulos reutilizables.
- No quedan `catch {}` silenciosos en la capa de content source.
- Los fallbacks de imagen quedan centralizados y justificados.
- Un error de fetch o shape invalido deja trazabilidad suficiente para diagnostico.

## Validacion

- `rg -n 'catch \\{\\}' lib/home-page-source.ts lib/product-page-source.ts` devuelve cero.
- Tests unitarios o fixtures para transformacion de al menos home y producto.
- Smoke con contenido valido y con contenido faltante.
