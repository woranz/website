# TD-015 - Create a generic form for plans without inline quoter

Prioridad: Alta
Tipo: Leads / Formularios / Producto
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: definir contrato de datos, flujo de submit, integración con CMS y componente reutilizable para planes sin cotizador.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir la experiencia, jerarquía y estados del formulario genérico para que no se sienta como fallback pobre.

## Problema

El sistema contempla en Sanity un modo `contacto` para secciones de cotizador, pero frontend hoy solo implementa cotizadores inline de AP y caución. Los planes sin cotizador quedan sin una solución genérica reusable para captar lead.

## Evidencia

- `sanity/schemas/secciones.ts:11-19` permite `modo: 'contacto'` en `seccionCotizador`.
- `lib/product-page-source.ts:255-268` solo reconoce `inline-caucion` e `inline-accidentes`.
- `lib/product-page-source.ts:331-344` descarta la sección si `inferQuoter` devuelve `null`.
- No existe hoy en `components/` un formulario genérico reusable para productos sin cotizador inline.

## Riesgo

- Productos sin cotizador no tienen un camino de conversión consistente.
- El CMS permite una variante que el frontend no soporta.
- Cada plan futuro puede terminar resolviéndose con soluciones ad hoc.

## Alcance propuesto

- Diseñar un formulario genérico para productos sin cotizador.
- Definir qué campos son comunes y cuáles configurables por producto.
- Integrarlo como variante soportada desde Sanity.
- Definir submit, destino de lead y confirmación de estado.

## Criterio de aceptacion

- `modo: contacto` deja de ser una opción muerta en CMS.
- Existe un componente reusable para planes sin cotizador inline.
- El flujo de envío queda integrado y validado.
- La experiencia visual mantiene nivel de producto, no de parche.

## Validacion

- Smoke de un producto configurado con `modo: contacto`.
- Verificación de submit y estado de éxito/error.
- Revisión visual en desktop y mobile.
