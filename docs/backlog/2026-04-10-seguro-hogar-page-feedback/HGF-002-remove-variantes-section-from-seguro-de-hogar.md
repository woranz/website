# HGF-002 - Remove variantes section from seguro de hogar

Prioridad: Alta
Tipo: IA / UX / Product page composition
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: dejar de renderizar la sección `Variantes` para esta página y resolver el contenido asociado sin romper el resto del contrato de producto.
- Visual: si
- Owner visual: Claude
- Entregable visual: recomponer el ritmo de la página una vez removido ese bloque para que no quede un hueco ni se degrade la progresión narrativa.

## Problema

La página de `seguro-de-hogar` hoy incluye una sección `Variantes` con tres planes (`Básico`, `Completo`, `Full`). El feedback pide eliminar esa sección completa de esta cobertura.

## Evidencia

- `data/product-catalog.json:310-323` define las variantes actuales para `seguro-de-hogar`.
- `lib/product-page-source.ts:377-380` transforma `seccionVariantes` cuando existe contenido válido.
- `components/templates/product-page.tsx:331-390` renderiza ese bloque como un carrusel de cards.
- Feedback recibido: `Sección variantes: eliminar.`

## Riesgo

- Mantener variantes visibles puede forzar una segmentación comercial no aprobada.
- Si el bloque se elimina sin recomponer el orden de secciones, la página puede perder ritmo.
- El contenido de variantes puede seguir vivo en la fuente y reintroducirse más adelante por error.

## Alcance propuesto

- Quitar la sección `Variantes` de `seguro-de-hogar`.
- Revisar si el contenido de esas variantes debe archivarse, migrarse o eliminarse de la fuente actual.
- Reordenar las secciones siguientes para que la página siga teniendo progresión clara.
- Confirmar que el cambio aplica solo a esta cobertura y no como decisión global del template.

## Criterio de aceptacion

- `/personas/coberturas/seguro-de-hogar` ya no muestra la sección `Variantes`.
- No quedan referencias huérfanas a ese bloque dentro del flujo de la página.
- El resto de la composición mantiene continuidad visual y narrativa.
- La fuente de contenido no deja una configuración ambigua para este producto.

## Validacion

- Smoke manual de la página en desktop y mobile.
- Verificación estática de que `seguro-de-hogar` no sigue aportando `variantes` activas al render final.
- Revisión visual del ritmo de secciones después de la remoción.
