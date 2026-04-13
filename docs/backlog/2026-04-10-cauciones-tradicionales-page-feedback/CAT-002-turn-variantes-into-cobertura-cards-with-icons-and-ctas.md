# CAT-002 - Turn variantes into cobertura cards with icons and CTAs

Prioridad: Alta
Tipo: IA / UX / Conversion architecture
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: reconvertir la sección actual de `Variantes` en una sección `Coberturas` con cards accionables, iconos y CTA a un formulario de contacto compartido.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir iconografía, jerarquía de card y comportamiento del carrusel para que la sección se lea como catálogo de coberturas, no como lista genérica.

## Problema

La sección actual se presenta como `Variantes`, pero el feedback la redefine como `Coberturas` y además pide agregar iconos y CTAs en cada slide. Eso cambia la intención del bloque: deja de ser una lista editorial y pasa a funcionar como entrada accionable a un mismo formulario de contacto.

## Evidencia

- `data/product-catalog.json:1570-1599` define hoy la lista dentro de `variantes`.
- `lib/product-page-source.ts:377-380` transforma ese bloque como `seccionVariantes`.
- `components/templates/product-page.tsx:331-390` lo renderiza como cards sin iconos ni CTA accionable.
- Feedback recibido:
  - cambiar `Variantes` por `Coberturas`
  - agregar iconos
  - agregar CTAs que lleven a un formulario de contacto

## Riesgo

- La sección actual no expresa bien que cada card representa una cobertura concreta y accionable.
- Si cada CTA termina con destinos distintos, la experiencia se fragmenta.
- Si se agrega acción sin definir el formulario compartido, se introduce otro camino roto o ambiguo.

## Alcance propuesto

- Renombrar la sección a `Coberturas`.
- Convertir cada card en una unidad con icono, contenido más claro y CTA.
- Hacer que todos los CTAs del bloque lleven al mismo formulario de contacto.
- Coordinar el destino compartido con la solución transversal de `TD-015`.

## Criterio de aceptacion

- La sección ya no se presenta como `Variantes`, sino como `Coberturas`.
- Cada slide muestra iconografía y un CTA visible.
- Todos los CTAs del bloque apuntan al mismo formulario de contacto.
- El carrusel sigue siendo legible y navegable en desktop y mobile.

## Validacion

- Smoke visual del carrusel en desktop y mobile.
- Verificación estática del destino único de los CTAs del bloque.
- Revisión visual de iconografía y jerarquía de cards.
