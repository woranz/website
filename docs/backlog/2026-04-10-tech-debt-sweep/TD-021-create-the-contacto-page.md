# TD-021 - Create the Contacto page

Prioridad: Media-alta
Tipo: Institutional page / Leads / UI
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: crear la ruta, resolver fuente de datos y definir el mecanismo de contacto.
- Visual: si
- Owner visual: Claude
- Entregable visual: diseñar una página de contacto clara, confiable y consistente con el resto del sitio.

## Problema

Falta la página `Contacto`, aunque navegación y footer ya la prometen como destino.

## Evidencia

- `components/templates/product-page.tsx:42` agrega `Contacto` en navegación con placeholder.
- `components/site/footer.tsx:21` y `48` vuelve a exponer `Contacto`.
- No existe `app/contacto/page.tsx` en el árbol actual de `app/`.
- `sanity/schemas/settings.ts:47-73` ya sugiere que existe información de contacto útil que podría alimentar esta página.

## Riesgo

- Se corta un camino clave de contacto para usuarios que no quieren cotizar de inmediato.
- La navegación pública ofrece un destino inexistente.
- Se desaprovecha información ya modelada en settings.

## Alcance propuesto

- Definir qué debe resolver la página Contacto:
  - contacto comercial
  - ayuda
  - canales directos
  - formulario o CTA a WhatsApp/email
- Diseñar y construir la página.
- Integrar settings de contacto si corresponde.
- Conectar header/footer al destino real.

## Criterio de aceptacion

- Existe una página `Contacto` accesible desde la navegación.
- La página ofrece un camino claro de contacto.
- Header y footer apuntan al destino real.
- La fuente de verdad para datos de contacto está definida.

## Validacion

- Smoke manual de ruta y navegación.
- Verificación de CTAs/canales de contacto.
- Revisión visual desktop/mobile.
