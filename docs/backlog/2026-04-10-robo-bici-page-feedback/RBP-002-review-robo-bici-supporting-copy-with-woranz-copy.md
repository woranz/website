# RBP-002 - Review robo bici supporting copy with woranz-copy

Prioridad: Alta
Tipo: Copy / Supporting copy
Estado: Done (copy aprobado en doc Contenidos Web)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar la bajada del hero y el copy de apoyo en la fuente de verdad actual, siguiendo la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo texto mantenga legibilidad y jerarquía en el hero sin desbalancear la composición.

## Problema

La página de `robo-bici` necesita revisar la bajada. El feedback apunta específicamente a corregir el texto `Si te la roban, tenés cómo recuperarla.`, que hoy también se replica como descripción del bloque de cotización.

## Evidencia

- `data/product-catalog.json:384` define hoy la bajada del hero como `Si te la roban, tenés cómo recuperarla.`
- `data/product-catalog.json:388` reutiliza ese mismo mensaje en la descripción del bloque de cotización.
- `.claude/skills/woranz-productos/PRODUCTOS.md:45-49` ubica a robo bici dentro de los microseguros para objetos personales, con tono moderno, cercano y simple.

## Riesgo

- Un copy débil o genérico puede restarle claridad a un producto muy directo.
- Si se corrige sin criterio unificado, hero y cotización pueden terminar con dos voces distintas.
- El texto puede volverse más largo y romper legibilidad en mobile.

## Alcance propuesto

- Revisar la bajada con `woranz-copy`.
- Alinear el mensaje a uso cotidiano, valor del bien y cobertura concreta.
- Verificar si el mismo texto debe seguir reutilizándose en el bloque de cotización o si conviene separarlo.
- Mantener el texto corto y escaneable.

## Criterio de aceptacion

- La bajada del hero deja de usar el texto actual y pasa a un mensaje alineado a `woranz-copy`.
- El copy resultante suena específico para robo de bici, no intercambiable con otros productos.
- La descripción del bloque de cotización queda alineada con esa decisión editorial.
- El texto final sigue funcionando dentro del layout existente.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero en desktop y mobile.
