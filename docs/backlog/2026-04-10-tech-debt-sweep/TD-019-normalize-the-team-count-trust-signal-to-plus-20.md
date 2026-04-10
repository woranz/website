# TD-019 - Normalize the team-count trust signal to +20

Prioridad: Media
Tipo: Content consistency / Trust signal
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: unificar la fuente de verdad de `teamCount` y eliminar defaults inconsistentes.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar el tratamiento visual del trust signal para que se perciba consistente en todo el sitio.

## Problema

El trust signal del equipo aparece con valores distintos según la superficie. El objetivo actual es que todos digan `+20`, pero el sistema hoy mezcla datos de Sanity, seeds y fallbacks hardcoded.

## Evidencia

- `lib/product-page-source.ts:480` usa fallback `teamCount: "4+"`.
- `lib/home-page-source.ts:205` usa fallback `teamCount: "+9"`.
- `app/api/migrate-homes/route.ts:91`, `125` y `159` siembra valores `+21`, `+9` y `+21`.
- `components/ui/team-avatars.tsx:65` además puede computar un `+remaining` si no se pasa `teamCount`.

## Riesgo

- Inconsistencia de confianza en una señal visible para el usuario.
- Imposibilidad de sostener un mensaje uniforme si el dato tiene múltiples fuentes.
- Más deuda editorial al mezclar fallback, seed y render dinámico.

## Alcance propuesto

- Definir `+20` como valor actual único donde corresponda.
- Resolver si ese valor vive en Sanity, settings o config tipada.
- Limpiar defaults inconsistentes y cálculo implícito de `remaining` cuando no aplique.
- Revisar todas las superficies donde aparece el trust signal.

## Criterio de aceptacion

- Todas las apariciones relevantes muestran `+20`.
- Existe una sola fuente de verdad o una convención explícita para este valor.
- No quedan defaults `4+`, `+9` o variaciones no aprobadas.
- La presentación visual es consistente en home, productos y CTA sections.

## Validacion

- `rg -n 'teamCount|4\\+|\\+9|\\+21' app components lib sanity` sin variantes no aprobadas.
- Revisión visual de todas las superficies con team signal.
