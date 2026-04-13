# ICE-003 - Set page-specific badge on integral de comercio

Prioridad: Alta
Tipo: Copy / IA / Hero metadata
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: cambiar el badge del hero de `integral-de-comercio` para que deje de usar el label genérico actual y pase a identificar esta página de forma específica.
- Visual: si
- Owner visual: Claude
- Entregable visual: validar que el nuevo badge se lea bien dentro del hero y mantenga jerarquía visual frente al título principal.

## Problema

La página de `integral-de-comercio` hoy usa el badge genérico `Tu Negocio`, pero el feedback pide que el badge identifique explícitamente la página como `Integral de Comercio`.

## Evidencia

- `data/product-catalog.json:1179` define hoy el `badge` como `Tu Negocio`.
- `components/templates/product-page.tsx:110-115` renderiza el badge del hero cuando existe `page.hero.badge`.
- Feedback recibido: `Integral comercio -> badge pagina`.

## Riesgo

- El badge actual es demasiado genérico y no suma contexto diferencial a la página.
- Si el cambio se hace sin revisar jerarquía visual, el badge puede competir innecesariamente con el título.
- Mantener labels genéricos en páginas específicas debilita la identidad del producto.

## Alcance propuesto

- Cambiar el badge visible del hero a una versión específica de la página.
- Validar que el wording final sea `Integral de Comercio` o equivalente aprobado.
- Revisar su largo y comportamiento en desktop y mobile.
- Mantener consistencia con otras páginas B2B donde el badge también pueda requerir especificidad.

## Criterio de aceptacion

- El hero de `/empresas/coberturas/integral-de-comercio` deja de mostrar el badge genérico actual.
- El badge visible identifica correctamente la página.
- El badge sigue siendo legible y armónico en desktop y mobile.
- El cambio no rompe la jerarquía del hero.

## Validacion

- Verificación estática del badge configurado para la página.
- Smoke visual del hero en desktop y mobile.
- Revisión rápida de longitud y jerarquía del badge final.
