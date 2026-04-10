# HGF-001 - Refresh hero and add que es section on seguro de hogar

Prioridad: Alta
Tipo: Copy / Content architecture / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar el headline del hero y agregar la sección `Qué es` en el orden pedido, usando una fuente de verdad consistente.
- Visual: si
- Owner visual: Claude
- Entregable visual: ajustar jerarquía y ritmo entre hero, imagen y nueva sección para que la página no pierda claridad ni tensión visual.

## Problema

El hero actual de `seguro-de-hogar` comunica un claim más largo y orientado a la completitud del seguro. El feedback pide un mensaje más directo y además sumar, inmediatamente después de la imagen, una sección `Qué es` que hoy no está presente en esta página.

## Evidencia

- `data/product-catalog.json:299-308` define el headline actual como `El seguro de hogar más completo que podés cotizar en el momento`.
- El feedback pide reemplazarlo por `Protección para tu hogar en el momento.`
- `lib/product-page-source.ts:346-353` ya soporta una sección de tipo `explanation` con título por defecto `Qué es`.
- El texto fuente de `Qué es` para este producto quedó mapeado en `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`.

## Riesgo

- El hero puede quedar largo o menos directo que el mensaje buscado para esta cobertura.
- La página pasa de hero a secciones transaccionales sin una explicación básica del producto.
- Si se agrega la sección sin definir fuente de verdad, el contenido puede quedar otra vez hardcodeado y disperso.

## Alcance propuesto

- Reemplazar el headline del hero por el texto pedido.
- Insertar una sección `Qué es` después del bloque de imagen principal.
- Reusar la fuente de verdad documentada en `QES-001-source-inventory.md` o en la implementación resultante de `QES-001`.
- Validar el copy final de hero y explicación con criterio de marca Woranz.

## Criterio de aceptacion

- El hero muestra `Protección para tu hogar en el momento.` como título principal.
- La sección `Qué es` aparece después de la imagen principal, no más abajo en el flujo.
- La nueva sección tiene contenido editorial aprobado y no queda vacía.
- La página mantiene una lectura clara entre promesa, explicación y conversión.

## Validacion

- Smoke manual de `/personas/coberturas/seguro-de-hogar`.
- Revisión editorial del headline y del cuerpo de `Qué es`.
- Verificación estática de la fuente de verdad usada para evitar duplicación de copy.
