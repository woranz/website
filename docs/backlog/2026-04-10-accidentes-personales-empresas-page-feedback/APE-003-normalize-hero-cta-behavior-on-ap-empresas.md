# APE-003 - Normalize hero CTA behavior on AP empresas

Prioridad: Alta
Tipo: CTA / Navigation / Conversion flow
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: hacer que el CTA primario del hero pase a `Cotizar` con scroll real al cotizador, y que el secundario apunte a WhatsApp.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar jerarquía, naming y claridad de ambos CTAs una vez definido el comportamiento final.

## Problema

Los CTAs actuales del hero de AP empresas siguen un patrón de contacto genérico, pero el feedback pide una lógica más directa: primario de cotización con scroll al form y secundario a WhatsApp.

## Evidencia

- `data/product-catalog.json:798-805` define hoy:
  - primario: `Hablá con un especialista`
  - secundario: `Hablá con nosotros →`
- Feedback recibido:
  - cambiar el primario a `Cotizar` con scroll al form
  - hacer que el secundario vaya a WhatsApp
- `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md` ya cubre normalización transversal de destinos CTA.
- `APE-001` define el bloque de cotización que debería convertirse en el destino del scroll.

## Riesgo

- Si el primario no apunta al cotizador real, la promesa principal de la página queda rota.
- Si el secundario mantiene un destino ambiguo, la página sigue sin un canal directo de contacto.
- Resolver CTAs antes del cotizador puede obligar a rehacer IDs, anclas o copy.

## Alcance propuesto

- Cambiar el label y comportamiento del CTA primario a `Cotizar` con scroll real al bloque de cotización.
- Hacer que el CTA secundario lleve a WhatsApp.
- Alinear el wiring final con `TD-013`.
- Verificar que ambos comportamientos funcionen igual en desktop y mobile.

## Criterio de aceptacion

- El CTA primario visible del hero dice `Cotizar`.
- El CTA primario hace scroll real al cotizador final de la página.
- El CTA secundario lleva a WhatsApp.
- No quedan destinos ambiguos o inconsistentes entre hero y cotizador.

## Validacion

- Smoke manual de ambos CTAs en desktop y mobile.
- Verificación estática de anclas, IDs o links usados.
- Revisión visual de jerarquía CTA luego del wiring final.
