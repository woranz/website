# PRD-003 - Normalize hero CTA behavior on productores home

Prioridad: Alta
Tipo: CTA / Navigation / Conversion flow
Estado: Done (commit 07a2b48, PR #17)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: hacer que el CTA primario del hero apunte al alta real de productores y que el secundario lleve a WhatsApp.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que la jerarquia y el wording de ambos CTAs sigan siendo claros una vez definidos sus destinos reales.

## Problema

Los CTAs del hero de `productores` necesitan destinos concretos. El feedback pide que `Empezar gratis` abra el alta de productores y que `Conoce el portal` funcione como acceso a WhatsApp.

## Evidencia

- `lib/home-page-source.ts:207-210` resuelve CTAs del home desde contenido, sin un inventario transversal de destinos.
- `TD-013` ya cubre la normalizacion transversal de destinos CTA.
- Feedback recibido:
  - `Empezar gratis`: crear formulario de alta de productores
  - `Conocé el portal`: link a WhatsApp

## Riesgo

- Si los CTAs no se alinean con destinos reales, la conversion del segmento `productores` queda rota.
- Resolver el secundario sin coordinar con `TD-013` puede introducir otro criterio aislado de linking.
- Si el primario se cablea antes de definir el alta real, el hero puede quedar apuntando a un placeholder nuevo.

## Alcance propuesto

- Hacer que `Empezar gratis` apunte al flujo de alta definido en `PRD-002`.
- Hacer que `Conoce el portal` lleve a WhatsApp.
- Alinear el wiring final con `TD-013`.
- Verificar que ambos comportamientos funcionen correctamente en desktop y mobile.

## Criterio de aceptacion

- El CTA primario del hero apunta al alta real de productores.
- El CTA secundario lleva a WhatsApp.
- No quedan destinos ambiguos ni placeholders en los CTAs principales de `/productores`.
- La jerarquia CTA de la pagina sigue siendo coherente.

## Validacion

- Smoke manual de ambos CTAs en desktop y mobile.
- Verificacion estatica de links, anclas o rutas usadas.
- Revision visual de jerarquia CTA luego del wiring final.
