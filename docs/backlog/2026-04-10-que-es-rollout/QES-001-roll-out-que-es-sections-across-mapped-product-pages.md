# QES-001 - Roll out que es sections across mapped product pages

Prioridad: Alta
Tipo: Content rollout / Product page architecture
Estado: Done (commit 0ea06bb, PR #14)
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: incorporar una fuente de verdad para bloques `Qué es` y renderizarlos en todas las páginas mapeadas, respetando el orden pedido dentro del template.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar el ritmo entre hero, imagen, `Qué es` y resto de secciones para que el patrón no se sienta repetitivo o agregado a la fuerza.

## Problema

El sitio ya soporta técnicamente una sección `Qué es`, pero hoy no existe una carga sistemática de ese contenido para las páginas de producto. El documento `Woranz_Contenidos_Web (1).docx` sí trae esos textos para la mayoría de las coberturas actuales, por lo que falta convertir esa fuente editorial en un rollout consistente dentro del frontend.

## Evidencia

- El `.docx` adjunto contiene bloques `Qué es` para `22` productos hoy presentes en `data/product-catalog.json`.
- `lib/product-page-source.ts:346-353` ya soporta el tipo `explanation` con título por defecto `Qué es`.
- `components/templates/product-page.tsx:288-303` ya renderiza la sección `explanation`.
- `data/product-catalog.json` no tiene hoy un contrato equivalente y tipado para estos bloques.
- El inventario mapeado de textos y rutas quedó documentado en `QES-001-source-inventory.md`.

## Riesgo

- Seguir cargando páginas de producto sin una explicación básica del producto genera huecos narrativos.
- Si los textos se agregan ad hoc por página, vuelve a aparecer drift entre documento fuente, catálogo local y Sanity.
- Un rollout sin listado de exclusiones puede terminar inyectando copy genérico en páginas que no tienen texto aprobado.

## Alcance propuesto

- Definir una fuente de verdad para `Qué es` en el contrato de contenido actual.
- Cargar los textos del documento para todas las rutas mapeadas en el inventario.
- Insertar el bloque `Qué es` en una posición consistente del flujo de página, idealmente después de la imagen principal cuando aplique.
- Dejar explícito qué rutas quedan fuera del rollout inicial por falta de fuente aprobada.
- Relacionar este rollout con tasks específicas de página cuando ya exista feedback adicional sobre hero o composición.

## Criterio de aceptacion

- Todas las rutas mapeadas en `QES-001-source-inventory.md` muestran una sección `Qué es` con el texto aprobado.
- La fuente de verdad para esos textos queda tipada y centralizada.
- Las rutas sin fuente explícita quedan documentadas y no reciben copy inventado.
- El bloque mantiene posición y jerarquía consistentes dentro de las páginas de producto.

## Validacion

- Smoke manual de una muestra de rutas de `personas` y `empresas`.
- Verificación estática de la nueva fuente de verdad para confirmar cobertura de todas las rutas mapeadas.
- Revisión visual de la ubicación del bloque `Qué es` dentro del template de producto.
