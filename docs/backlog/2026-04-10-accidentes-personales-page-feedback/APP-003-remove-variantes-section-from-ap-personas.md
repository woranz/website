# APP-003 - Remove variantes section from AP personas

Prioridad: Alta
Tipo: IA / UX / Product page composition
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: dejar de renderizar la sección `Variantes` para AP personas y resolver el contenido asociado en la fuente actual.
- Visual: si
- Owner visual: Claude
- Entregable visual: recomponer el ritmo de la página una vez removido ese bloque.

## Problema

La página de `accidentes-personales` hoy incluye una sección `Variantes` con planes `Básico`, `Completo` y `Full`. El feedback pide eliminar esa sección completa.

## Evidencia

- `data/product-catalog.json:153-166` define las variantes actuales.
- `components/templates/product-page.tsx:331-390` renderiza ese bloque como un carrusel de cards.
- Feedback recibido: `Elmiminar variantes`.

## Riesgo

- Mantener variantes visibles puede introducir una segmentación comercial no validada.
- Si se elimina el bloque sin recomponer la narrativa de la página, puede quedar un salto brusco entre secciones.
- El contenido puede seguir vivo en la fuente y reaparecer más adelante por error.

## Alcance propuesto

- Quitar la sección `Variantes` de AP personas.
- Revisar si el contenido debe archivarse, migrarse o eliminarse de la fuente actual.
- Reordenar las secciones siguientes para sostener continuidad narrativa.
- Confirmar que el cambio aplica solo a esta página y no como regla general del template.

## Criterio de aceptacion

- `/personas/coberturas/accidentes-personales` ya no muestra la sección `Variantes`.
- No quedan referencias huérfanas a ese bloque dentro del flujo de la página.
- El resto de la composición mantiene continuidad visual y narrativa.
- La fuente de contenido no deja una configuración ambigua para este producto.

## Validacion

- Smoke manual de la página en desktop y mobile.
- Verificación estática de que AP personas no sigue aportando `variantes` activas al render final.
- Revisión visual del ritmo de secciones después de la remoción.
