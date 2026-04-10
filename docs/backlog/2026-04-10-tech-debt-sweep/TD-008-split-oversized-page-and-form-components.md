# TD-008 - Split oversized page and form components

Prioridad: Media-alta
Tipo: Mantenibilidad / Frontend
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: no aplica

## Problema

Hay componentes y modulos demasiado grandes, con demasiadas responsabilidades y muy poca separacion entre view, state y reglas de negocio. Eso hace mas costoso cambiar, revisar y testear.

## Evidencia

- `components/APCotizacionForm.tsx` tiene `1852` lineas.
- `components/PreaprobacionForm.tsx` tiene `1032` lineas.
- `components/templates/product-page.tsx` tiene `833` lineas.
- `lib/product-page-source.ts` tiene `657` lineas.
- Dentro de estos archivos conviven parsing, reglas de negocio, UI y wiring de APIs.

## Riesgo

- Alto costo de onboarding y review.
- Cambios chicos disparan regresiones en zonas no relacionadas.
- Se vuelve dificil introducir tests focalizados o ownership por subdominio.

## Alcance propuesto

- Separar logica de negocio, state helpers y presentational components.
- Extraer secciones repetidas de `product-page.tsx`.
- Extraer subflows y hooks en formularios grandes.
- Definir boundaries claros para data mapping, side effects y render.

## Criterio de aceptacion

- Ningun componente principal queda como archivo monolitico sin particion interna.
- Las reglas de negocio testables viven fuera del JSX grande.
- Las secciones compartidas del template se reutilizan entre layouts similares.
- Los formularios pueden revisarse por etapas o submodulos.

## Validacion

- `wc -l` baja de forma significativa en los archivos principales.
- Tests o helpers cubren parseo y reglas sensibles.
- Smoke manual de formularios y template de producto.
