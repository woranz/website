# TD-007 - Create a shared field system for form controls

Prioridad: Media-alta
Tipo: UX system / Formularios
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: si
- Owner visual: Claude
- Entregable visual: definir familia visual unica de campos, estados y jerarquia de ayuda/error.

## Problema

Los controles de formulario no comparten una misma superficie, ni estados, ni comportamiento de foco. Hoy `Input`, `Select`, `Combobox` y `GeorefSearch` son cuatro familias distintas, aunque cumplen el mismo rol.

## Evidencia

- `components/ui/input.tsx:11` define una superficie visual propia.
- `components/ui/select.tsx:22-28` usa otro contrato de borde, fondo y foco.
- `components/ui/combobox.tsx:54-75` recompone trigger y lista con otra logica.
- `components/ui/georef-search.tsx:107-175` agrega otro wrapper con placeholders y estados propios.
- `components/PreaprobacionForm.tsx` y `components/APCotizacionForm.tsx` mezclan estos controles en el mismo flujo, haciendo visible la inconsistencia.

## Riesgo

- Experiencia irregular dentro de un mismo formulario.
- Mayor costo de accesibilidad y mantenimiento porque cada control resuelve foco, estados y mensaje de error por su cuenta.
- Difícil incorporar nuevos inputs sin repetir el problema.

## Alcance propuesto

- Diseñar un contrato unico de `field` con superficie, label, helper, error y focus states.
- Hacer que `Input`, `Select`, `Combobox` y `GeorefSearch` compongan ese contrato.
- Unificar placeholders, bordes, paneles y estados disabled/error.
- Documentar el sistema de fields como primitive reutilizable.

## Criterio de aceptacion

- Todos los controles comparten la misma familia visual.
- Error, focus y disabled se comportan igual en todas las variantes.
- Formularios complejos no necesitan overrides cosmeticos por control.
- Existe un punto unico para ajustar estilos de campos.

## Validacion

- Revisión visual de `APCotizacionForm` y `PreaprobacionForm`.
- Navegacion por teclado y foco consistente.
- Comparacion lado a lado de controls antes y despues.
