# ERT-001 - Normalize related products carousel title across empresas pages

Prioridad: Alta
Tipo: Content architecture / Segment consistency / Product page UX
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir un título segmentado para el carrusel de relacionados en `empresas` y aplicarlo de forma consistente en la fuente o mapping compartido.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo título conserve jerarquía y lectura natural en todas las variantes de página B2B.

## Problema

Las páginas de `empresas` siguen heredando el título genérico `Más opciones para vos` en el carrusel de relacionados. El feedback ya pidió explícitamente cambiarlo por `Más opciones para tu empresa`, y ese ajuste no debería resolverse caso por caso.

## Evidencia

- `lib/product-page-source.ts:407-415` resuelve `seccionCarouselProductos` con título default `Más opciones para vos`.
- El feedback de `/empresas/coberturas/responsabilidad-civil` pide explícitamente cambiar ese título en todos los productos de `empresas`.
- El mismo requerimiento ya apareció en tasks como `CAT-006` y `APE-004`, lo que confirma que no es un caso aislado.

## Riesgo

- Resolver este wording página por página genera backlog duplicado y comportamiento inconsistente.
- Mantener un título genérico en B2B debilita la adaptación por segmento.
- Si se cambia solo en algunas páginas, la navegación entre productos de `empresas` queda editorialmente rota.

## Alcance propuesto

- Definir `Más opciones para tu empresa` como wording base del carrusel de relacionados para el segmento `empresas`.
- Aplicar el cambio en la capa compartida correcta para evitar overrides dispersos.
- Revisar el impacto sobre páginas de `personas` para no alterar su comportamiento.
- Actualizar o referenciar tasks abiertas que hoy incluyen este mismo cambio dentro de alcance local.

## Criterio de aceptacion

- Las páginas de `empresas` dejan de mostrar `Más opciones para vos` en el carrusel de relacionados por defecto.
- El título base pasa a ser `Más opciones para tu empresa` o un equivalente final validado.
- El cambio vive en una fuente compartida y no depende de parches por página.
- Las páginas de `personas` no se ven afectadas por este ajuste.

## Validacion

- Verificación estática del mapping compartido del título.
- Smoke visual en al menos dos páginas de `empresas` con relacionados.
- Revisión rápida de no regresión en páginas de `personas`.
