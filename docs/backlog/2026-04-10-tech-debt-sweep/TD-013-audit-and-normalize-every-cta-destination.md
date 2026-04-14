# TD-013 - Audit and normalize every CTA destination

Prioridad: Alta
Tipo: Conversion / IA / Linking
Estado: Done
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: inventario completo de CTAs, destinos reales, fuente de verdad y corrección de wiring.
- Visual: si
- Owner visual: Claude
- Entregable visual: revisar que la jerarquía y el wording de CTA sigan siendo correctos una vez definidos los destinos reales.

## Problema

No hay un inventario único y confiable de CTAs con sus destinos. Ya aparecen placeholders `#`, fallbacks y rutas definidas en múltiples capas, lo que vuelve frágil la conversión y el mantenimiento.

## Evidencia

- `components/templates/product-page.tsx:40-43` define navegación con links placeholder.
- `components/site/footer.tsx:20-57` contiene múltiples links `#`.
- `components/site/footer.tsx:148-154` deja redes sociales con `#`.
- `lib/product-page-source.ts:203-228` y `520-530` resuelven CTAs por fallback, por settings y por contenido.
- `lib/home-page-source.ts:207-210` y `259-262` también resuelven CTAs desde contenido sin un inventario transversal.

## Riesgo

- CTAs que no llevan a ningún lado o llevan a destinos inconsistentes.
- Dificultad para auditar conversion path por segmento.
- Mayor probabilidad de drift entre CMS, templates, header, footer y flows.

## Alcance propuesto

- Relevar todos los CTAs visibles del sitio por tipo de página y segmento.
- Registrar label, ubicación, intención y destino esperado.
- Definir una fuente de verdad para destinos globales y otra para destinos editoriales cuando aplique.
- Corregir placeholders, duplicaciones y fallbacks peligrosos.

## Criterio de aceptacion

- Existe un inventario completo de CTAs con destino esperado.
- No quedan CTAs visibles con `#` ni destinos ambiguos.
- Header, footer, homes, productos y flows responden a una convención única de linking.
- Los labels y jerarquías de CTA siguen siendo coherentes con la intención de cada contexto.

## Validacion

- `rg -n 'href=\"#\"|href:\\s*\"#\"' app components lib` sin ocurrencias funcionales.
- Smoke manual de CTAs principales por segmento.
- Revisión visual de jerarquía CTA en páginas clave.
