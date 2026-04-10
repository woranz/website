# TD-004 - Centralize site navigation and remove placeholder links

Prioridad: Media-alta
Tipo: UX / Arquitectura de informacion
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: si
- Owner visual: Claude
- Entregable visual: revisar jerarquia y claridad de navegacion una vez resuelta la fuente unica de links.

## Problema

La navegacion del sitio esta duplicada en varias capas y todavia contiene placeholders `#`. Eso rompe recorrido, genera deuda de mantenimiento y hace que header, footer y paginas especiales se desalineen entre si.

## Evidencia

- `components/templates/product-page.tsx:40-43` define `SITE_NAVIGATION` con `Nosotros` y `Contacto` apuntando a `#`.
- `app/personas/coberturas/accidentes-personales/cotizacion/page.tsx:12-15` repite el mismo arreglo.
- `app/personas/coberturas/caucion-alquiler/preaprobacion/page.tsx:12-15` repite el mismo arreglo.
- `components/site/footer.tsx:20-57` contiene multiples enlaces `#` en mobile y desktop.
- `components/site/footer.tsx:148-154` tambien deja redes sociales con `#`.
- `components/site/header.tsx:95-116` mantiene la navegacion de coberturas en una constante distinta, no sincronizada con CMS ni con footer.

## Riesgo

- Experiencia rota en links visibles del header y footer.
- Coste alto para actualizar IA o segmentos porque la definicion esta repartida.
- Mayor probabilidad de inconsistencia entre surfaces publicas.

## Alcance propuesto

- Crear una sola fuente de verdad para header, footer y links transversales.
- Reemplazar placeholders por URLs reales o esconder temporalmente items no disponibles.
- Evaluar si parte de la navegacion debe venir de Sanity o de un config tipado en `lib/`.
- Hacer que las paginas de flujo reutilicen la misma navegacion compartida.

## Criterio de aceptacion

- No quedan `href="#"` en header, footer ni pages de formularios.
- Header, footer y flows consumen el mismo contrato de navegacion.
- Alta o baja de un item se hace en un solo lugar.
- Las coberturas por segmento no se desalinean entre desktop, mobile y footer.

## Validacion

- `rg -n 'href=\"#\"|href:\\s*\"#\"' app components lib` devuelve cero ocurrencias funcionales.
- Smoke manual de navegacion en desktop y mobile.
