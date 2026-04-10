# CAT-001 - Review cauciones tradicionales hero copy with woranz-copy

Prioridad: Alta
Tipo: Copy / Hero messaging
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar headline del hero en la fuente de verdad actual, siguiendo la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo título mantenga claridad, jerarquía y contundencia dentro del hero actual.

## Problema

El hero actual de `cauciones-tradicionales` usa un mensaje correcto pero más largo de lo necesario. El feedback pide acotarlo a `Todas las garantías que tu operación necesita.`.

## Evidencia

- `data/product-catalog.json:1565` define hoy el headline como `Todas las garantías que tu operación necesita, en una sola línea`.
- El feedback pide reemplazarlo por `Todas las garantias que tu operacion necesita.`
- `.claude/skills/woranz-productos/PRODUCTOS.md:70-79` define este producto como una familia de garantías técnicas, con tono profesional y concreto.

## Riesgo

- El hero puede sonar más difuso de lo necesario para un producto técnico.
- Si se acorta sin criterio, puede perder precisión o fuerza comercial.
- Si no se revisa con la ficha de producto, puede quedar demasiado genérico para un decisor empresarial.

## Alcance propuesto

- Ajustar el título del hero con criterio de `woranz-copy`.
- Mantener el tono profesional y concreto propio de cauciones tradicionales.
- Verificar si la bajada actual sigue acompañando bien el nuevo titular o necesita ajuste secundario durante implementación.

## Criterio de aceptacion

- El hero deja de usar el título actual y pasa al mensaje aprobado o su versión editorial final.
- El nuevo titular mantiene precisión para público empresarial.
- El texto final sigue funcionando dentro del layout actual.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero en desktop y mobile.
