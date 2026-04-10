# Backlog Batch - Empresas Home Page Feedback

Fuente: feedback puntual sobre `/empresas` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Rediseñar la seccion `Nuestras coberturas` con formato lista y buscador.
   Nueva task: `EHM-001`
2. Agregar `Seguros pensados para tu empresa` en esta pagina y en todas las coberturas de `empresas`.
   Relacionada con: `docs/backlog/2026-04-10-empresas-feature-carousel-rollout/EFC-001-roll-out-seguros-pensados-para-tu-empresa-across-empresas-pages.md`

Tasks creadas en este batch:
1. `EHM-001` [Redesign nuestras coberturas on empresas home as searchable list](./EHM-001-redesign-nuestras-coberturas-on-empresas-home-as-searchable-list.md)

Prioridad sugerida para arrancar:
1. `EHM-001`

Notas:
- El segundo punto no se abrio como task local porque pide explicitamente rollout transversal sobre todo el segmento `empresas`.
- La home de `empresas` hoy consume `seccionGridProductos`, por lo que el rediseño con buscador no es solo visual: requiere redefinir el patron de esa seccion.
