# Backlog Batch - Empresas Feature Carousel Rollout

Fuente: feedback puntual sobre `/empresas`, con impacto transversal sobre coberturas de `empresas`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback:
1. Agregar una seccion `Seguros pensados para tu empresa`, similar a `Seguros pensados para vos`.
   Nueva task: `EFC-001`
2. La misma seccion debe aparecer en `/empresas` y en todas las coberturas de `empresas`.
   Nueva task: `EFC-001`

Tasks creadas en este batch:
1. `EFC-001` [Roll out "Seguros pensados para tu empresa" across empresas pages](./EFC-001-roll-out-seguros-pensados-para-tu-empresa-across-empresas-pages.md)

Prioridad sugerida para arrancar:
1. `EFC-001`

Notas:
- Este pedido se parece al rollout ya abierto para `personas`, pero no se mezclo con el porque cambia segmento, tono y alcance.
- El home de `empresas` hoy obtiene secciones desde `getHomePageData("empresas")`, mientras que las coberturas usan `ProductPageTemplate` con otra fuente de datos, asi que el rollout necesita resolver dos superficies distintas.
