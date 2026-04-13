# CAT-004 - Normalize hero CTA behavior on cauciones tradicionales

Prioridad: Alta
Tipo: CTA / Navigation / Conversion flow
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: hacer que el CTA primario del hero y los CTAs de coberturas compartan el mismo formulario de contacto, y que el CTA secundario haga scroll a la sección de coberturas.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que la jerarquía y wording de los dos CTAs sigan siendo claros una vez definido el comportamiento real.

## Problema

Los CTAs del hero necesitan un comportamiento más preciso. El feedback pide que `Hablá con un especialista` lleve al mismo formulario que las cards de coberturas, y que `Ver todas las garantías` haga scroll a la sección correspondiente.

## Evidencia

- `data/product-catalog.json:1602-1607` define hoy:
  - primario: `Hablá con un especialista`
  - secundario: `Ver todas las garantías →`
- El feedback pide:
  - primario al mismo formulario que las coberturas
  - secundario con scroll a coberturas
- `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md` ya cubre normalización de destinos CTA.
- `CAT-002` redefine además las cards de coberturas como entradas accionables al mismo formulario.

## Riesgo

- Si hero y coberturas no comparten destino, la conversión queda fragmentada.
- Si el CTA secundario no hace scroll real, mantiene una promesa vaga.
- Sin coordinación con `CAT-002`, pueden aparecer dos lógicas distintas de contacto en la misma página.

## Alcance propuesto

- Hacer que el CTA primario del hero apunte al mismo formulario compartido que las cards de coberturas.
- Hacer que el CTA secundario haga scroll real a la sección `Coberturas`.
- Alinear el wiring final con `TD-013`.
- Verificar que el comportamiento siga siendo claro en desktop y mobile.

## Criterio de aceptacion

- `Hablá con un especialista` lleva al mismo formulario compartido que las coberturas.
- `Ver todas las garantías` hace scroll real a la sección `Coberturas`.
- No hay destinos ambiguos ni divergentes entre hero y carrusel.
- La jerarquía CTA de la página sigue siendo coherente.

## Validacion

- Smoke manual de ambos CTAs en desktop y mobile.
- Verificación estática de anclas, IDs o destinos usados.
- Revisión visual de jerarquía CTA después del wiring final.
