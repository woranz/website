# Backlog Batch - Cauciones Tradicionales Page Feedback

Fuente: feedback puntual sobre `/empresas/coberturas/cauciones-tradicionales` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Cambiar el `h1` a `Todas las garantías que tu operación necesita.`
   Nueva task: `CAT-001`
2. Cambiar `Variantes` por `Coberturas`.
   Nueva task: `CAT-002`
3. Agregar iconos y CTAs en los slides de coberturas; llevan a un formulario de contacto.
   Nueva task: `CAT-002`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-015-create-a-generic-form-for-plans-without-inline-quoter.md`
4. Agregar sección `Qué es`.
   Nueva task: `CAT-003`
   Fuente resuelta en: `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`
5. `Hablá con un especialista` lleva al mismo form que las coberturas.
   Nueva task: `CAT-004`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`
6. `Ver todas las garantías` hace scroll a coberturas.
   Nueva task: `CAT-004`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`
7. Agregar preguntas frecuentes.
   Nueva task: `CAT-005`
8. Agregar sección `Más opciones para tu empresa` con todos los productos de `empresas`.
   Nueva task: `CAT-006`
   Relacionada con: `lib/product-page-source.ts` por el título default actual `Más opciones para vos`

Tasks creadas en este batch:
1. `CAT-001` [Review cauciones tradicionales hero copy with woranz-copy](./CAT-001-review-cauciones-tradicionales-hero-copy-with-woranz-copy.md)
2. `CAT-002` [Turn variantes into cobertura cards with icons and CTAs](./CAT-002-turn-variantes-into-cobertura-cards-with-icons-and-ctas.md)
3. `CAT-003` [Add que es section on cauciones tradicionales](./CAT-003-add-que-es-section-on-cauciones-tradicionales.md)
4. `CAT-004` [Normalize hero CTA behavior on cauciones tradicionales](./CAT-004-normalize-hero-cta-behavior-on-cauciones-tradicionales.md)
5. `CAT-005` [Add FAQ section on cauciones tradicionales](./CAT-005-add-faq-section-on-cauciones-tradicionales.md)
6. `CAT-006` [Add empresa related products section on cauciones tradicionales](./CAT-006-add-empresa-related-products-section-on-cauciones-tradicionales.md)

Prioridad sugerida para arrancar:
1. `CAT-002`
2. `CAT-004`
3. `CAT-006`
4. `CAT-001`
5. `CAT-003`
6. `CAT-005`

Notas:
- `CAT-002` y `CAT-004` dependen de definir o conectar un mismo formulario de contacto, así que conviene coordinarlos con `TD-015`.
- El texto de `Qué es` ya está disponible en el rollout transversal, así que este punto no quedó bloqueado por contenido.
- `CAT-006` requiere decidir si el carrusel de empresa excluye la cobertura actual por consistencia con otros bloques de relacionados; el feedback habla de `todos los de empresa`, así que esa excepción debe validarse al implementarlo.
