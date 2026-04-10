# TD-018 - Add dual login entry points in the header

Prioridad: Media-alta
Tipo: Navegacion / Conversion
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: soportar dos destinos claros en el header para ingreso de productor y de asegurado.
- Visual: si
- Owner visual: Claude
- Entregable visual: definir jerarquía y presentación de ambos accesos sin recargar el header.

## Problema

El header hoy solo contempla un ingreso genérico. Falta explicitar dos caminos distintos: `Ingresar como productor` e `Ingresar como asegurado`.

## Evidencia

- `components/site/header.tsx:120-121` solo define `loginHref` y `loginLabel = "Ingresar"`.
- `components/site/header.tsx:194-197` renderiza un único CTA de login en desktop.
- `components/site/header.tsx:253-255` renderiza un único CTA de login en mobile.
- `components/site/header.tsx:263-265` usa un ícono de usuario decorativo en mobile sin destino funcional adicional.

## Riesgo

- Ambigüedad para usuarios con dos perfiles de entrada distintos.
- Pérdida de claridad en una navegación con segmentos ya diferenciados.
- Mayor fricción para productores y asegurados que buscan entrar directo.

## Alcance propuesto

- Definir ambos destinos reales de login.
- Ajustar el contrato del header para soportar dual-entry.
- Resolver la variante desktop y mobile.
- Validar cómo se integra esto con CTA globales y navegación existente.

## Criterio de aceptacion

- El header muestra claramente ambos caminos de ingreso.
- Desktop y mobile mantienen consistencia.
- No queda un CTA genérico ambiguo si hay dos destinos reales.
- La solución no recarga visualmente el header.

## Validacion

- Smoke manual de navegación en desktop y mobile.
- Revisión visual del header en todos los segmentos.
