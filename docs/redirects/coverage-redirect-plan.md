# Coverage Redirect Plan

Source of truth:
- Runtime mapping: [`data/coverage-redirect-plan.json`](../../data/coverage-redirect-plan.json)
- Runtime consumer: [`next.config.mjs`](../../next.config.mjs)

## Scope

This plan covers legacy `woranz.com` coverage URLs that must survive the migration into the current canonical product URL shape:

- product canonicals now live at `/:segmento/:slug`
- the old internal `/:segmento/coberturas/:slug` shape is still redirected to the canonical path
- legacy WordPress coverage URLs redirect directly to the new canonical destination

## Matrix

| Origen | Destino | Tipo | Motivo |
| --- | --- | --- | --- |
| `/coberturas/caucion-del-alquiler` | `/personas/caucion-alquiler` | `exact-match` | Producto core con equivalente directo live. |
| `/coberturas/accidentes-personales` | `/personas/accidentes-personales` | `exact-match` | Producto core con equivalente directo live. |
| `/coberturas/seguro-de-vida` | `/empresas/seguro-de-vida-empresas` | `segment-shift` | El contenido vive ahora dentro del catálogo empresas. |
| `/coberturas/seguro-de-sepelio` | `/empresas` | `temporary-fallback` | No existe todavía `/empresas/sepelio-colectivo`; evitar 404 mientras se resuelve `TD-022`. |
| `/coberturas/caucion-de-servicio` | `/empresas/cauciones-tradicionales` | `many-to-one` | Consolidado bajo la cobertura empresas de cauciones. |
| `/coberturas/caucion-de-obra` | `/empresas/cauciones-tradicionales` | `many-to-one` | Consolidado bajo la cobertura empresas de cauciones. |
| `/coberturas/caucion-de-suministro` | `/empresas/cauciones-tradicionales` | `many-to-one` | Consolidado bajo la cobertura empresas de cauciones. |
| `/coberturas/caucion-actividad-o-profesion` | `/empresas/cauciones-tradicionales` | `many-to-one` | Consolidado bajo la cobertura empresas de cauciones. |
| `/coberturas/garantias-aduaneras` | `/empresas/cauciones-tradicionales` | `many-to-one` | Hoy la mejor entrada live es la misma superficie compartida de cauciones. |
| `/coberturas/seguro-de-salud` | `/` | `retired-to-home` | No hay equivalente live; se manda a home para evitar un destino engañoso. |
| `/turismo` | `/personas/caucion-turismo-estudiantil` | `rename` | La intención se preserva en la cobertura renombrada. |
| `/coberturas` | `/personas` | `index-to-segment` | El índice legacy de coberturas ahora entra por el catálogo personas. |

## Implementation Strategy

1. Keep the plan in `data/coverage-redirect-plan.json`.
2. Load that dataset from `next.config.mjs` and strip metadata down to `{ source, destination, permanent }`.
3. Emit both slash and no-slash variants for exact legacy sources so WordPress trailing-slash URLs do not incur an extra canonicalization hop before the final 301.
4. Leave non-coverage legacy redirects in `data/legacy-redirects.json`.

## Rollout

1. Ship redirects before or at the same time as any domain cutover.
2. Verify representative paths in staging with final status `301 -> 200`, not `301 -> 308 -> 301`.
3. After production deploy, check Search Console coverage and server logs for unresolved `/coberturas/*` hits.
4. Once `TD-022` lands, update the sepelio row from `/empresas` to `/empresas/sepelio-colectivo`.

## Validation Checklist

- Every source in `data/coverage-redirect-plan.json` is unique.
- Every destination is either a live route or an intentional temporary fallback.
- Coverage redirects resolve to the canonical `/:segmento/:slug` form, not the deprecated `/coberturas/` shape.
- Sample staging checks cover:
  - one exact match
  - one many-to-one cauciones redirect
  - the sepelio temporary fallback
  - the `/coberturas` index redirect
