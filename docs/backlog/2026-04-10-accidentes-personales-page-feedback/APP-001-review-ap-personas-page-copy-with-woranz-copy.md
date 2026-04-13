# APP-001 - Review AP personas page copy with woranz-copy

Prioridad: Alta
Tipo: Copy / UX writing
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: actualizar headline, bajada y copy de pasos en la fuente de verdad actual, usando la ficha de producto y el criterio de `woranz-copy`.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que los nuevos textos mantengan jerarquía y no rompan el layout del hero ni del bloque de pasos.

## Problema

La página de `accidentes-personales` necesita una revisión editorial en varias superficies visibles: hero, bloque descriptivo y pasos del flujo. El feedback pide un headline nuevo y ajustes de copy, y además exige revisar el tono general para que suene más directo, más humano y más alineado con la promesa de tranquilidad del producto.

## Evidencia

- `data/product-catalog.json:144-145` define hoy:
  - `headline`: `La cobertura ante accidentes que podés obtener en tiempo real`
  - `subtitulo`: `Te cubrís hoy, para cualquier cosa que pase mañana.`
- El feedback pide reemplazar el título por `Protección real para que trabajes tranquilo.`
- `components/templates/product-page.tsx:123` usa `section-copy` para el bloque descriptivo del hero.
- `data/product-catalog.json:216-226` define los pasos actuales:
  - `Elegí tu cobertura y recibí tu precio al instante. Sin datos personales ni formularios.`
  - `Pagá con Mercado Pago con tarjeta de crédito, débito o transferencia.`
- El feedback propone:
  - `Elegí tu cobertura y recibi el precio al instante sin ingresar tus datos personales.`
  - `Pagá con Mercado Pago, con débito o con tarjeta de crédito.`
- `.claude/skills/woranz-productos/PRODUCTOS.md:16-21` pide un tono de tranquilidad y practicidad para AP personas.

## Riesgo

- El hero puede sonar demasiado genérico o demasiado atado a “accidentes”, cuando la guía pide no dramatizar.
- Si se cambian textos sin criterio unificado, el hero y los pasos pueden terminar con voces distintas.
- El wording nuevo puede volverse más largo o más técnico y romper legibilidad en mobile.

## Alcance propuesto

- Revisar headline, bajada y copy de pasos con `woranz-copy`.
- Alinear el mensaje central a tranquilidad, protección concreta y practicidad para gente que trabaja independiente o sin ART.
- Validar el wording final de los pasos para que mantengan claridad y fluidez de marca.
- Si hace falta, proponer más de una variante editorial antes de cerrar el texto final.

## Criterio de aceptacion

- El hero deja de usar el título actual y pasa a un mensaje alineado al tono de Woranz.
- La bajada del hero queda revisada con el mismo criterio editorial.
- Los pasos `Cotizá online` y `Contratá` usan copy actualizado, más claro y consistente.
- Los textos finales siguen funcionando dentro del layout existente.

## Validacion

- Revisión editorial contra `.claude/skills/woranz-productos/PRODUCTOS.md`.
- Validación de tono con el criterio de `woranz-copy`.
- Smoke visual del hero y del bloque de pasos en desktop y mobile.
