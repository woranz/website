# TD-006 - Unify UI primitive contract and token usage

Prioridad: Alta
Tipo: Design system / Frontend architecture
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Visual: si
- Owner visual: Claude
- Entregable visual: definir criterio de marca para primitives, superficies y uso de tokens antes de consolidar variantes finales.

## Problema

`components/ui` mezcla primitives shadcn casi genericos con capas Woranz y termina obligando a sobreescribir cada uso desde `components/site` y `components/templates`. El sistema no tiene un contrato visual unico.

## Evidencia

- `tailwind.config.ts:18-31` define tokens de marca Woranz.
- `components/ui/button.tsx:10-35` y `components/ui/card.tsx:12-19` siguen semanticas genericas.
- `components/ui/select.tsx:22-28` y `components/ui/navigation-menu.tsx:58-132` usan estilos base ajenos al lenguaje Woranz.
- `app/globals.css:114-199` ya contiene helpers compartidos para tabs, faq, botones y avatars.
- `components/templates/product-page.tsx:94`, `348`, `771` reintroduce medidas, colores y surfaces propias en vez de reutilizar primitives.
- `components/site/logo.tsx:29` hardcodea `#2D3547` en vez del token oficial.

## Riesgo

- Cada nueva pantalla sale con drift visual por defecto.
- El sistema no escala: los templates pisan a las primitives en vez de componerlas.
- Ajustar marca o spacing implica tocar demasiados lugares.

## Alcance propuesto

- Definir el contrato publico de primitives Woranz-first.
- Mapear o eliminar semanticas genericas que hoy compiten con tokens de marca.
- Subir literales recurrentes a tokens o variantes oficiales.
- Revisar helpers globales que hoy existen pero no gobiernan el uso real.

## Criterio de aceptacion

- Las primitives base responden al sistema Woranz sin sobrescrituras ad hoc en cada template.
- Se reducen hardcodes de color, tamaño y radius fuera de tokens.
- Helpers globales y primitives dejan de duplicarse.
- Templates consumen variantes oficiales para superficies, botones y agrupaciones comunes.

## Validacion

- Revisión visual en al menos home, product page y un flujo.
- `rg` de hex hardcodeados y tamaños arbitrarios cae significativamente.
- Build sin warnings nuevos.
