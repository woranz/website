# TD-014 - Create a redirect plan from woranz.com coverages to the new site

Prioridad: Alta
Tipo: Migracion / SEO / Plataforma
Estado: Todo
Split de ejecucion:
- Estructural: si
- Owner estructural: Codex
- Entregable estructural: plan de mapping URL-origen a URL-destino, estrategia de implementación y validación técnica.
- Visual: no aplica

## Problema

Hace falta un plan explícito para redirigir las coberturas existentes de `woranz.com` al nuevo sitio, evitando pérdida de tráfico, SEO y navegación rota durante la migración.

## Evidencia

- El nuevo sitio ya expone rutas de coberturas bajo `app/[segmento]/coberturas/[slug]/page.tsx`.
- `lib/product-paths.ts` y la capa de page sources ya asumen una estructura de URLs nueva por segmento y slug.
- No existe todavía, en este backlog, un deliverable específico para mapping y rollout de redirects desde el sitio actual.

## Riesgo

- Pérdida de posicionamiento orgánico por páginas antiguas sin redirect consistente.
- Tráfico caído en enlaces históricos, campañas o indexación previa.
- Migración desordenada entre dominio viejo y nuevo.

## Alcance propuesto

- Relevar todas las URLs actuales de coberturas en `woranz.com`.
- Mapear cada URL vieja a su mejor destino en el nuevo sitio.
- Identificar casos exact match, many-to-one, consolidación y páginas sin equivalente directo.
- Definir implementación técnica:
  - redirects en plataforma
  - reglas permanentes vs temporales
  - manejo de canonicals y sitemap
- Definir rollout y checklist de validación post-release.

## Criterio de aceptacion

- Existe una matriz completa `origen -> destino -> tipo de redirect -> motivo`.
- Se identifican explícitamente las URLs sin equivalente directo y su tratamiento.
- El plan incluye impacto SEO, orden de despliegue y validación posterior.
- El equipo puede implementar redirects sin reinterpretar intención ni mapping.

## Validacion

- Revisión del mapping completo.
- Prueba de una muestra representativa de redirects en staging o entorno equivalente.
- Verificación posterior de crawl y canonicals una vez implementado.
