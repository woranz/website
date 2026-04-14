# EHM-001 - Redesign nuestras coberturas on empresas home as searchable list

Prioridad: Alta
Tipo: IA / Search UX / Home page architecture
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: reemplazar el patron actual de `Nuestras coberturas` por una lista navegable con buscador, manteniendo integracion con la fuente de productos de `empresas`.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir la nueva composicion de lista, estados de busqueda y densidad de informacion para que la seccion sea escaneable y util en desktop y mobile.

## Problema

La seccion `Nuestras coberturas` del home de `empresas` hoy responde a un grid de productos, pero el feedback pide rediseñarla como lista con buscador. Eso cambia la forma de exploracion principal del catalogo B2B: deja de ser una vidriera estatica y pasa a ser una superficie de descubrimiento asistido.

## Evidencia

- `lib/home-page-source.ts:189-197` transforma `seccionGridProductos` en una seccion `product-grid`.
- `components/templates/product-page.tsx:744-789` renderiza `product-grid` como un grid visual de cards con imagen.
- Feedback recibido: `Rediseñar la sección "nuestras coberturas". Tiene que tener un formato lista y un buscador.`
- `app/empresas/page.tsx:14-18` usa `ProductPageTemplate` para renderizar la home de `empresas`, por lo que el cambio impacta el contrato de seccion compartido.

## Riesgo

- Si se resuelve como parche local sobre el grid actual, el buscador puede quedar acoplado a una UI que no fue pensada para exploracion textual.
- Si la lista no tiene buena jerarquia o filtros claros, puede volverse mas pesada que util.
- Sin coordinar contenido y navegacion, se puede terminar con un listado que no refleja bien el catalogo real de `empresas`.

## Alcance propuesto

- Reemplazar el bloque actual de `Nuestras coberturas` por una lista con buscador.
- Definir que campos se buscan y como se ordenan los resultados.
- Mantener el enlace correcto a cada cobertura B2B.
- Validar comportamiento en desktop y mobile.

## Criterio de aceptacion

- La seccion `Nuestras coberturas` de `/empresas` ya no se presenta como grid visual, sino como lista con buscador.
- El usuario puede encontrar coberturas de `empresas` por nombre o criterio definido.
- La seccion sigue siendo navegable y legible en desktop y mobile.
- La implementacion sigue conectada a la fuente real de productos del segmento.

## Validacion

- Smoke manual de la busqueda y navegacion en desktop y mobile.
- Verificacion estatica del mapping entre resultados y rutas de coberturas.
- Revision visual de jerarquia, densidad y estados vacios del buscador.
