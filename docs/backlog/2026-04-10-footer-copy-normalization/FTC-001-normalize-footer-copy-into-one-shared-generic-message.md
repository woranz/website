# FTC-001 - Normalize footer copy into one shared generic message

Prioridad: Alta
Tipo: Shared content / Footer / Copy governance
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: unificar el texto compartido del footer en una sola fuente de verdad reusable para todas las variantes del sitio.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo texto funcione en desktop y mobile sin romper densidad, ritmo ni legibilidad del footer.

## Problema

El footer hoy no usa un solo mensaje compartido. Tiene una versión corta en mobile y otra mucho más extensa en desktop, ambas hardcodeadas dentro del mismo componente. El pedido es definir un único texto más genérico para todos los footers, evitando duplicación, drift y exceso de densidad.

## Evidencia

- `components/site/footer.tsx:108-131` renderiza un texto legal corto en mobile y otro más largo en desktop mediante dos `span` distintos.
- `components/site/footer.tsx` es hoy la fuente efectiva del copy del footer.
- `docs/backlog/2026-04-10-tech-debt-sweep/TD-017-audit-content-ownership-hardcoded-vs-sanity.md` ya marca que el footer mantiene contenido hardcodeado y ownership difuso.

## Riesgo

- Mobile y desktop comunican mensajes distintos en el mismo bloque compartido.
- El footer suma demasiado peso visual en desktop y puede quedar demasiado escueto en mobile.
- Sin una fuente única de verdad, cualquier ajuste futuro vuelve a fragmentarse.

## Alcance propuesto

- Definir un solo texto compartido para el footer, más genérico y consistente con la marca.
- Revisar el wording con criterio de `woranz-copy` para que no suene jurídico ni corporativo de más, sin perder la obligación informativa que corresponda.
- Mover ese texto a una fuente de verdad única dentro del contrato de contenido actual.
- Hacer que desktop y mobile consuman la misma pieza de copy, con diferencias solo de layout si hicieran falta.

## Criterio de aceptacion

- Existe un único texto de footer compartido para todas las variantes visibles del sitio.
- Desktop y mobile dejan de usar copies distintos para ese bloque.
- El texto resultante es más genérico, más corto y más consistente con el tono de Woranz.
- La fuente de verdad del copy del footer queda explícita.

## Validacion

- Revisión estática de `components/site/footer.tsx` para confirmar que no quedan dos literales distintos para el mismo bloque.
- Smoke visual del footer en mobile y desktop.
- Revisión editorial del texto final con criterio de marca Woranz.
