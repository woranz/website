# TD-020 - Create the Nosotros page

Prioridad: Media-alta
Tipo: Institutional page / Content / UI
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: crear la ruta, fuente de datos y estructura implementable de la página.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir la composición, jerarquía y narrativa visual de la página Nosotros.

## Problema

Falta la página `Nosotros`, aunque ya aparece implícitamente como destino esperado desde navegación y footer.

## Evidencia

- `components/templates/product-page.tsx:41` agrega `Nosotros` en navegación con placeholder.
- `components/site/footer.tsx:20`, `39` vuelve a exponer `Nosotros`.
- No existe `app/nosotros/page.tsx` en el árbol actual de `app/`.

## Riesgo

- Navegación institucional incompleta.
- Pérdida de confianza al prometer una sección que no existe.
- Se limita la posibilidad de contar equipo, propuesta y respaldo de marca.

## Alcance propuesto

- Definir objetivo y contenido de la página Nosotros.
- Decidir qué partes viven en CMS y cuáles en código.
- Diseñar y construir la página con jerarquía institucional clara.
- Conectar header/footer hacia el destino real.

## Criterio de aceptacion

- Existe una página `Nosotros` accesible desde la navegación.
- La página responde a una narrativa institucional clara y consistente con Woranz.
- Header y footer apuntan al destino real.
- El contenido tiene ownership definido entre CMS y código.

## Validacion

- Smoke manual de ruta y navegación.
- Revisión visual desktop/mobile.
- Validación de metadata y enlazado interno.
