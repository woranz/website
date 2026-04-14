# Backlog Batch - Integral de Comercio Empresas Page Feedback

Fuente: feedback puntual sobre `/empresas/coberturas/integral-de-comercio` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Revisar la imagen del hero porque se corta la cabeza.
   Nueva task: `ICE-001`
2. Agregar sección `Qué es`.
   Relacionada con: `docs/backlog/2026-04-10-que-es-rollout/QES-001-roll-out-que-es-sections-across-mapped-product-pages.md`
3. Agregar sección de preguntas frecuentes en la página.
   Relacionada con: `docs/backlog/2026-04-10-empresas-faq-rollout/EFQ-001-roll-out-faq-sections-across-empresas-product-pages.md`
4. En `Más opciones para tu empresa`, agregar todas las relacionadas.
   Nueva task: `ICE-002`
   Relacionada con: `docs/backlog/2026-04-10-empresas-related-carousel-title-normalization/ERT-001-normalize-related-products-carousel-title-across-empresas-pages.md`
5. Cambiar el badge de la página a `Integral de Comercio`.
   Nueva task: `ICE-003`

Tasks creadas en este batch:
1. `ICE-001` [Fix hero image framing on integral de comercio](./ICE-001-fix-hero-image-framing-on-integral-de-comercio.md)
2. `ICE-002` [Expand related products on integral de comercio empresas](./ICE-002-expand-related-products-on-integral-de-comercio-empresas.md)
3. `ICE-003` [Set page-specific badge on integral de comercio](./ICE-003-set-page-specific-badge-on-integral-de-comercio.md)

Prioridad sugerida para arrancar:
1. `ICE-001`
2. `ICE-003`
3. `ICE-002`

Notas:
- El `Qué es` de esta página ya quedó cubierto por el rollout transversal `QES-001`, así que no abrí una task duplicada.
- El pedido de FAQs se bajó como rollout transversal para `empresas` en `EFQ-001`, porque ya se repitió en varias coberturas B2B.
- El cambio de título del carrusel de relacionados para páginas de `empresas` ya quedó cubierto en `ERT-001`; este batch solo abre el ajuste del set de productos.
