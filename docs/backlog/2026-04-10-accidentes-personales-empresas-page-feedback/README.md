# Backlog Batch - Accidentes Personales Empresas Page Feedback

Fuente: feedback puntual sobre `/empresas/coberturas/accidentes-personales` en viewport `1922x1175`, relevado el `2026-04-10`.

Convencion activa: cada item separa frente `Estructural` y `Visual`.
- `Codex` implementa mejoras estructurales.
- `Claude` implementa mejoras visuales.
- Regla base de backlog: `docs/backlog/README.md`

Estado del repo al momento de bajar este lote:
- No se hicieron cambios de implementacion.
- Este batch solo registra backlog y referencias cruzadas con tasks existentes.

Mapeo del feedback original:
1. Agregar el cotizador de AP personas; puede requerir otro `idCobertura`.
   Nueva task: `APE-001`
2. Agregar sección `Qué es`.
   Nueva task: `APE-002`
   Fuente resuelta en: `docs/backlog/2026-04-10-que-es-rollout/QES-001-source-inventory.md`
3. Cambiar `Hablá con un especialista` por `Cotizar` y hacer scroll al form.
   Nueva task: `APE-003`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`
4. Hacer que `Hablá con nosotros` vaya a WhatsApp.
   Nueva task: `APE-003`
   Relacionada con: `docs/backlog/2026-04-10-tech-debt-sweep/TD-013-audit-and-normalize-every-cta-destination.md`
5. En `Más opciones para tu empresa`, agregar todos los productos de `empresas`.
   Nueva task: `APE-004`

Tasks creadas en este batch:
1. `APE-001` [Reuse AP personas quoter on AP empresas page](./APE-001-reuse-ap-personas-quoter-on-ap-empresas-page.md)
2. `APE-002` [Add que es section on AP empresas](./APE-002-add-que-es-section-on-ap-empresas.md)
3. `APE-003` [Normalize hero CTA behavior on AP empresas](./APE-003-normalize-hero-cta-behavior-on-ap-empresas.md)
4. `APE-004` [Expand related products on AP empresas](./APE-004-expand-related-products-on-ap-empresas.md)

Prioridad sugerida para arrancar:
1. `APE-001`
2. `APE-003`
3. `APE-002`
4. `APE-004`

Notas:
- La página ya tiene FAQs en `data/product-catalog.json`, así que este barrido no abrió task nueva para ese bloque.
- `APE-001` y `APE-003` conviene resolverlos juntos porque el CTA primario final debe apuntar al mismo cotizador inline.
- El texto de `Qué es` ya está disponible en el rollout transversal, así que ese punto no quedó bloqueado por contenido.
