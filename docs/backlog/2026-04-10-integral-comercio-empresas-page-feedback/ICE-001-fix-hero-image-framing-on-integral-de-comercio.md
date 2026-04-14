# ICE-001 - Fix hero image framing on integral de comercio

Prioridad: Alta
Tipo: Visual QA / Hero media / Product page polish
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: identificar si el problema se resuelve desde la fuente de imagen, desde el crop o desde el comportamiento de render del hero en esta página.
- Visual: si
- Owner visual: Claude
- Entregable visual: ajustar el framing del hero para que el sujeto principal no quede cortado y la imagen mantenga intención editorial.

## Problema

La imagen del hero de `integral-de-comercio` está mal encuadrada y el recorte actual corta la cabeza del personaje. En una página con foco comercial, ese defecto daña la percepción de calidad de forma inmediata.

## Evidencia

- Feedback recibido: `Ver la imagen, se corta la cabeza del tipo`.
- `components/templates/product-page.tsx:149-155` renderiza el hero media dentro de `hero-media-frame` con `object-cover`, lo que puede recortar la imagen según proporción disponible.
- La observación se reporta específicamente sobre `/empresas/coberturas/integral-de-comercio`.

## Riesgo

- Mantener el crop actual degrada la primera impresión visual de la página.
- Si se corrige con un hack local sin revisar la fuente del asset, el problema puede reaparecer en otros breakpoints.
- Un ajuste de encuadre mal resuelto puede mejorar desktop y romper mobile, o viceversa.

## Alcance propuesto

- Auditar el asset y su encuadre actual en el hero de la página.
- Definir si conviene reemplazar la imagen, ajustar el foco del crop o cambiar el comportamiento de render para este caso.
- Validar el resultado en desktop y mobile.
- Evitar una solución genérica que empeore otros heroes.

## Criterio de aceptacion

- El sujeto principal de la imagen ya no aparece cortado en el hero.
- La corrección funciona en desktop y mobile.
- La solución aplicada es consistente con la intención visual de la página.
- No se introducen regresiones en el resto del layout del hero.

## Validacion

- Revisión visual del hero en desktop y mobile.
- Comparación rápida antes/después del encuadre.
- Verificación de que el asset o crop final no produce recortes obvios en otros tamaños.
