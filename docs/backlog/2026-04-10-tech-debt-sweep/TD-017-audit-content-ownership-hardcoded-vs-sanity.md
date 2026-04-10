# TD-017 - Audit content ownership: hardcoded vs Sanity

Prioridad: Alta
Tipo: CMS governance / Content architecture
Estado: Definido
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: eliminar fallbacks silenciosos, mover defaults de CTA y descripción a `settings` en Sanity, borrar `product-catalog.json`.
- Visual: no aplica (la regla no cambia jerarquía ni composición)

## Decisión

**Regla**: salvo header y footer, todo el contenido editorial vive en Sanity.

## Matriz de ownership

| Superficie | Owner | Fuente de verdad | Notas |
|---|---|---|---|
| Header (nav, dropdown coberturas, login) | Código | `header.tsx` | Se queda hardcoded. Si el catálogo crece, evaluar mover dropdown a Sanity. |
| Footer (columnas, links, legal, copyright) | Código | `footer.tsx` | Se queda hardcoded. Varios links apuntan a "#" (páginas inexistentes). |
| Hero de producto (título, descripción, imagen) | Sanity | `producto` schema | Ya migrado. Eliminar fallback silencioso en `product-page-source.ts:109`. |
| CTAs de producto (labels, hrefs) | Sanity | `producto` → `seccionCotizador` / `seccionCta` | Eliminar `DEFAULT_PRIMARY_CTA` y `DEFAULT_SECONDARY_CTA` en `product-page-source.ts:111-112`. |
| Hero de home (título, descripción, CTA) | Sanity | `paginaHome` schema | Eliminar fallbacks en `home-page-source.ts:240-262`. |
| Secciones de producto (cobertura, FAQ, pasos, requisitos, variantes) | Sanity | `producto` schema | Ya migrado. Sin problemas. |
| Carruseles (features, productos, paquetes) | Sanity | `producto` / `paginaHome` schemas | Ya migrado. |
| Team count ("4+", "+9") | Sanity | Mover a `settings` o `seccionCta` | Hardcoded en `product-page-source.ts:480` y `home-page-source.ts:205`. |
| Links institucionales ("Nosotros", "Contacto") | Sanity | Mover a `settings` → `navigationLinks[]` | Hardcoded en `product-page.tsx:40-43`, apuntan a "#". |
| Imágenes editoriales | Sanity | `producto` / `paginaHome` schemas | Eliminar fallback silencioso a `/images/hero.png`. |
| Metadata SEO | Sanity | `producto` / `paginaHome` schemas | Ya migrado. |
| Mapeo de iconos (`FEATURE_ICONS`, `NAV_ICONS`) | Código | Componentes | Estructural, no contenido. Se queda. |
| Lógica de formularios y handlers | Código | `app/api/forms/` | Estructural. Se queda. |
| `product-catalog.json` | Eliminar | N/A | Legacy post-migración. No se usa. |

## Acciones concretas para cerrar

1. Eliminar fallbacks silenciosos en `product-page-source.ts` y `home-page-source.ts` — si falta contenido en Sanity, que falle explícito en dev.
2. Mover defaults de CTA labels y descripción genérica al documento `settings` en Sanity (el schema ya existe, solo faltan campos).
3. Mover `teamCount` a `settings` o a `seccionCta` en Sanity.
4. Mover links institucionales a `settings` → `navigationLinks[]`.
5. Borrar `/data/product-catalog.json`.
6. Borrar contenido seed hardcoded en `app/api/migrate-homes/route.ts` si ya no se usa.

## Evidencia original

- `lib/home-page-source.ts:240-262` define múltiples fallbacks hardcoded para metadata, hero y CTA aunque la home ya viene de Sanity.
- `lib/product-page-source.ts:109-113` y `464-485` define defaults hardcoded para descripción y CTAs de producto.
- `lib/product-page-source.ts:480` cae a `teamCount: "4+"`.
- `lib/home-page-source.ts:205` cae a `teamCount: "+9"`.
- `components/templates/product-page.tsx:40-43` hardcodea links institucionales en navegación.
- `components/site/footer.tsx:9-60` hardcodea columnas enteras del footer y múltiples links placeholder.
- `components/site/header.tsx:120-121` hardcodea el login genérico.
- `app/api/migrate-homes/route.ts:12-168` contiene contenido seed hardcoded de homes.

## Riesgo

- Si se eliminan fallbacks sin completar el contenido en Sanity, páginas pueden romper en dev.
- Mitigación: verificar que cada producto y home tenga los campos requeridos en Sanity antes de eliminar fallbacks.

## Criterio de aceptacion

- Matriz de ownership documentada (este archivo).
- Fallbacks hardcoded eliminados o reemplazados por datos de `settings` en Sanity.
- `product-catalog.json` eliminado.
- En dev, contenido faltante en Sanity produce error visible, no copy fantasma.

## Validacion

- `rg` comparativo de hardcodes antes y después.
- Smoke de render con contenido CMS válido.
- Verificar que no queden fallbacks silenciosos en `product-page-source.ts` ni `home-page-source.ts`.
