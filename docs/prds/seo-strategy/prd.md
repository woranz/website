# PRD: TD-010 — SEO Strategy

Status: `ready`
Owner: Product
Prioridad: P0

---

## Product Preflight

| Check | Result |
|-------|--------|
| Stage | Product — strategy and spec, no code |
| Segments affected | All (personas, empresas, productores) |
| Sanity impact | New SEO fields on 3 schemas |
| Frontend impact | New metadata builder, sitemap, robots.txt, JSON-LD (owned by TD-003) |
| Dependencies | TD-003 consumes this PRD for implementation |
| Blocking questions | None remaining |

---

## 1. Objective

Define the site-wide SEO contract for woranz.com: what metadata exists, where it lives (Sanity vs code), what policy applies per page type, and how the migration from the current WordPress site preserves existing authority.

### Success metrics

- Every public page has title, description, canonical, OG tags, and robots policy
- Marketing can edit SEO fields from Sanity without code deploys
- Sitemap covers all indexable pages and updates automatically
- Legacy woranz.com URLs redirect to new equivalents without 404s
- Structured data (JSON-LD) on key page types

---

## 2. Scope

### In scope

- SEO field schema for Sanity (all document types)
- Indexation policy per page type
- Canonical URL strategy (including cross-segment)
- Open Graph tags (WhatsApp/LinkedIn)
- Sitemap generation spec
- robots.txt spec
- JSON-LD structured data recommendations
- Legacy URL redirect map (woranz.com WordPress → woranz.com Next.js)
- Google Search Console setup recommendation

### Non-goals

- Twitter/X cards (deferred)
- Hreflang / multi-language (single language: es-AR)
- Blog SEO (blog is placeholder, deferred)
- Paid search / SEM strategy
- Content writing (copy is separate concern)
- Frontend implementation (owned by TD-003)

---

## 3. Content Audit

### 3.1 Current Sanity SEO fields

| Schema | SEO fields today | Gap |
|--------|-----------------|-----|
| `settings` | `descripcion` (labeled "SEO") | No og, no robots, no canonical |
| `pagina-home` | `metaTitulo`, `metaDescripcion` | No og, no robots, no canonical |
| `producto` | None | Full SEO fieldset missing |
| `secciones` | N/A | Not a page-level document |
| `miembroEquipo` | N/A | Not a page-level document |

### 3.2 Current frontend metadata

| Route pattern | Metadata today | Gap |
|---------------|---------------|-----|
| `/` `/empresas` `/productores` | title + description (static) | No og, no canonical, no robots |
| `/[segmento]/coberturas/[slug]` | title + description (from Sanity) | No og, no canonical, no robots |
| `/[segmento]/coberturas/[slug]/contacto` | title + description (dynamic) | No noindex, no canonical |
| `/personas/coberturas/*/cotizacion` | title + description (hardcoded) | No noindex |
| `/personas/coberturas/*/exito` | Unknown | Should be noindex |
| Institutional pages (contacto, nosotros, etc.) | Placeholder metadata | Full SEO needed |
| `/studio/[[...tool]]` | None | Should be noindex, nofollow |

### 3.3 Current woranz.com (WordPress)

- **108 pages** in page-sitemap.xml
- **51 coberturas** in cobertura-sitemap.xml
- robots.txt exists (Yoast-generated, allows all)
- Many pages are landing pages for specific productores (ej: `/mendozaprop/`, `/litoral/`, `/cordoba/`)
- Core coverage pages use `/coberturas/{slug}/` pattern

---

## 4. SEO Field Schema for Sanity

### 4.1 Reusable SEO object

Create a Sanity object type `seo` that can be embedded in any page-level document:

```
seo (object)
├── seoTitle        (string)   — Override para <title>. Fallback: nombre/título del documento
├── seoDescription  (text)     — Override para meta description. Fallback: subtítulo/descripción
├── ogTitle         (string)   — Override para og:title. Fallback: seoTitle
├── ogDescription   (text)     — Override para og:description. Fallback: seoDescription
├── ogImage         (image)    — Override para og:image. Fallback: hero image del producto
├── canonicalUrl    (url)      — Override manual. Fallback: URL canónica auto-generada
├── robots          (string)   — Opciones: index/noindex, follow/nofollow. Default: "index, follow"
├── jsonLdType      (string)   — Tipo de structured data (auto-detected, override manual)
```

### 4.2 Schema integration

| Schema | Embed `seo` object | Default fallbacks |
|--------|-------------------|-------------------|
| `pagina-home` | Yes (replaces `metaTitulo`/`metaDescripcion`) | heroHeadline → title, heroSubtitulo → description |
| `producto` | Yes | nombre → title, headline → description, hero image → ogImage |
| `settings` | Keep `descripcion` as global fallback | Used only when page has no own metadata |

### 4.3 Editorial workflow

- Fields are optional — the system generates sensible defaults
- Sanity preview shows character count hints (title: 60 chars, description: 155 chars)
- ogImage shows recommended dimensions (1200x630)

---

## 5. Indexation Policy

### 5.1 Policy by page type

| Page type | Route | robots | Rationale |
|-----------|-------|--------|-----------|
| **Home (personas)** | `/` | index, follow | Main landing |
| **Home (empresas)** | `/empresas` | index, follow | Segment landing |
| **Home (productores)** | `/productores` | index, follow | Segment landing |
| **Product page** | `/[segmento]/coberturas/[slug]` | index, follow | Core content |
| **Product contact** | `/[segmento]/coberturas/[slug]/contacto` | noindex, follow | Transactional step |
| **Product contratación** | `/[segmento]/coberturas/[slug]/contratacion` | noindex, follow | Transactional step |
| **Cotización** | `*/cotizacion` | noindex, follow | Transactional flow |
| **Preaprobación** | `*/preaprobacion` | noindex, follow | Transactional flow |
| **Éxito** | `*/exito` | noindex, nofollow | Thank-you page |
| **Contacto** | `/contacto` | index, follow | Institutional |
| **Nosotros** | `/nosotros` | index, follow | Institutional |
| **FAQ** | `/faq` | index, follow | Informational |
| **Privacidad** | `/privacidad` | index, follow | Legal (SEO value) |
| **Términos** | `/terminos` | index, follow | Legal (SEO value) |
| **Centro de ayuda** | `/centro-de-ayuda` | index, follow | Informational |
| **Trabaja con nosotros** | `/trabaja-con-nosotros` | index, follow | Institutional |
| **Blog** | `/blog` | noindex, nofollow | Placeholder — flip to index when populated |
| **Sanity Studio** | `/studio/*` | noindex, nofollow | Admin |

### 5.2 Default policy

Pages not explicitly listed: `index, follow`. Override available via Sanity `seo.robots` field.

---

## 6. Canonical URL Strategy

### 6.1 Rules

1. **Every indexable page gets a canonical** pointing to itself (absolute URL with `https://woranz.com`)
2. **Cross-segment products** (ej: accidentes-personales exists in personas AND empresas): each URL is canonical to itself. They are distinct pages with distinct audiences and content framing.
3. **Transactional pages** (noindex): still get a canonical to themselves (prevents parameter-based duplication)
4. **Trailing slashes**: enforce no trailing slash (Next.js default). Redirect trailing-slash variants.

### 6.2 Canonical format

```
https://woranz.com/personas/coberturas/caucion-alquiler
https://woranz.com/empresas/coberturas/accidentes-personales
https://woranz.com/contacto
```

---

## 7. Open Graph

### 7.1 Required tags per page

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Woranz" />
<meta property="og:locale" content="es_AR" />
<meta property="og:title" content="{seoTitle || title}" />
<meta property="og:description" content="{seoDescription || description}" />
<meta property="og:url" content="{canonical}" />
<meta property="og:image" content="{ogImage || heroImage || defaultBrandImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### 7.2 Image strategy

| Page type | OG image source |
|-----------|----------------|
| Home pages | Default brand OG image (Woranz logo + tagline) |
| Product pages | Hero image of the product |
| Institutional | Default brand OG image |
| Fallback | Default brand OG image |

The default brand OG image needs to be created (1200x630, Woranz branding).

---

## 8. Structured Data (JSON-LD)

### 8.1 Recommended schemas

| Page type | JSON-LD type | Key fields |
|-----------|-------------|------------|
| All pages | `Organization` | name, url, logo, contactPoint, sameAs |
| Home pages | `WebSite` + `Organization` | name, url, potentialAction (SearchAction optional) |
| Product pages | `Product` + `BreadcrumbList` | name, description, brand, offers (if quotable) |
| FAQ (when populated) | `FAQPage` | mainEntity with Question/Answer pairs |
| Contacto | `ContactPage` + `Organization` | contactPoint with phone, email, whatsApp |

### 8.2 Implementation notes

- `Organization` goes in root layout (global)
- Page-specific JSON-LD goes in each page's `<head>` via metadata
- `BreadcrumbList` on all pages with depth > 1:
  ```
  Woranz > Personas > Coberturas > Caución de Alquiler
  ```

---

## 9. Sitemap

### 9.1 Spec

Generate `app/sitemap.ts` using Next.js App Router convention.

**Include:**
- All pages with `robots: "index, follow"` (see Section 5)
- Dynamic product pages from Sanity query
- Institutional pages (static)

**Exclude:**
- All noindex pages (transactional flows, studio, placeholder blog)
- API routes

**Fields per entry:**
- `url`: absolute URL
- `lastModified`: from Sanity `_updatedAt` for CMS pages, build time for static pages
- `changeFrequency`: `weekly` for homes, `monthly` for products and institutional
- `priority`: `1.0` for homes, `0.8` for products, `0.6` for institutional

### 9.2 Format

Single sitemap (not sitemap index) — the site has fewer than 50,000 URLs.

---

## 10. robots.txt

### 10.1 Spec

Generate `app/robots.ts` using Next.js App Router convention.

```
User-agent: *
Allow: /
Disallow: /studio/
Disallow: /api/

Sitemap: https://woranz.com/sitemap.xml
```

---

## 11. Legacy Redirect Map

### 11.1 Strategy

The current woranz.com (WordPress) will be replaced by the new Next.js site on the same domain. All existing URLs that have SEO value need 301 redirects to their new equivalents.

### 11.2 Coverage page redirects

| Legacy URL (WordPress) | New URL (Next.js) | Notes |
|------------------------|-------------------|-------|
| `/coberturas/caucion-del-alquiler/` | `/personas/coberturas/caucion-alquiler` | Core product |
| `/coberturas/accidentes-personales/` | `/personas/coberturas/accidentes-personales` | Core product |
| `/coberturas/seguro-de-vida/` | `/empresas/coberturas/seguro-de-vida-empresas` | Segment shift |
| `/coberturas/seguro-de-sepelio/` | `/empresas/coberturas/sepelio-colectivo` | Producto nuevo a crear en Sanity (contenido disponible en docx) |
| `/coberturas/caucion-de-servicio/` | `/empresas/coberturas/cauciones-tradicionales` | Grouped under cauciones |
| `/coberturas/caucion-de-obra/` | `/empresas/coberturas/cauciones-tradicionales` | Grouped under cauciones |
| `/coberturas/caucion-de-suministro/` | `/empresas/coberturas/cauciones-tradicionales` | Grouped under cauciones |
| `/coberturas/caucion-actividad-o-profesion/` | `/empresas/coberturas/cauciones-tradicionales` | Grouped under cauciones |
| `/coberturas/garantias-aduaneras/` | `/empresas/coberturas/cauciones-tradicionales` | Grouped under cauciones |
| `/coberturas/seguro-de-salud/` | `/` | No equivalent — redirect to home |
| `/turismo/` | `/personas/coberturas/caucion-turismo-estudiantil` | Renamed |
| `/coberturas/` | `/personas` | Index → segment home |

### 11.3 Institutional page redirects

| Legacy URL | New URL | Notes |
|------------|---------|-------|
| `/contacto/` | `/contacto` | Direct match |
| `/contacto-2/` | `/contacto` | Duplicate |
| `/contacto-web/` | `/contacto` | Form variant |
| `/politica-de-privacidad/` | `/privacidad` | Renamed |
| `/politica-de-privacidad-2/` | `/privacidad` | Duplicate |
| `/reclamos/` | `/contacto` | Merged into contact |
| `/siniestros-y-reclamos/` | `/contacto` | Merged into contact |
| `/productores/` | `/productores` | Direct match |
| `/blog/` | `/blog` | Direct match |
| `/novedades/` | `/blog` | Merged |
| `/arrepentimiento/` | TBD | Regulatory — needs its own page or section |
| `/botondebaja/` | TBD | Regulatory — needs its own page or section |
| `/tyc/` | `/terminos` | Renamed |
| `/fraude/` | TBD | May need its own page |
| `/solicitud/` | `/empresas/coberturas/cauciones-tradicionales/contacto` | Solicitud de caución |

### 11.4 Producer landing pages (low priority)

31 custom landing pages for specific producers/brokers. Full list:

`/mendozaffaa/`, `/fletalo/`, `/grupol/`, `/hchseguros/`, `/covergroup/`, `/mgp/`, `/mardelplata/`, `/mdp/`, `/grupoabseguros/`, `/jpmarin/`, `/mendozaprop/`, `/rp/`, `/sanjuan/`, `/mz/`, `/actisbayugar/`, `/litoral/`, `/sanrafael/`, `/satler/`, `/red/`, `/delpuerto/`, `/abad/`, `/molina/`, `/sirito/`, `/tgasesores/`, `/dlbroker/`, `/cordoba/`, `/nationalbroker/`, `/altanovels/`, `/fcm/`, `/maryta/`, `/cfer/`

Strategy: 301 redirect all to `/productores`. Revisit post-migration if analytics show significant individual traffic.

### 11.5 Regulatory pages (requires decision)

| Page | Action needed |
|------|--------------|
| `/arrepentimiento/` | Required by Argentine insurance regulation (SSN). Needs its own page in new site |
| `/botondebaja/` | Required by Argentine consumer protection (Ley 24.240). Needs its own page |
| `/fraude/` | Recommended. Could be a section in contacto or its own page |

### 11.6 Implementation

Redirects go in `next.config.mjs` `redirects()` array and/or extend `data/legacy-redirects.json`. Total estimated redirects: ~50 critical + ~30 producer pages.

---

## 12. Google Search Console

### 12.1 Recommendations

1. **Set up GSC** for woranz.com before migration
2. **Submit sitemap** once the new site is live
3. **Monitor coverage** for 30 days post-migration
4. **Use Change of Address** tool if domain changes (not applicable — same domain)
5. **Check redirect chains** — ensure no redirect goes through more than 1 hop

---

## 13. Page Structure & Sections

This PRD defines strategy, not pages. The deliverables that feed into implementation are:

| Deliverable | Consumer |
|-------------|----------|
| Sanity `seo` object schema | TD-003 (frontend metadata builder) + Sanity schema implementation |
| Indexation policy table | TD-003 (robots meta per route) |
| Canonical rules | TD-003 (canonical URL builder) |
| OG tag spec | TD-003 (OG metadata builder) |
| JSON-LD specs | TD-003 (structured data components) |
| Sitemap spec | New task: implement `app/sitemap.ts` |
| robots.txt spec | New task: implement `app/robots.ts` |
| Redirect map | New task: populate `next.config.mjs` redirects |

---

## 14. Acceptance Criteria

1. [ ] Sanity `seo` object type defined and documented
2. [ ] `seo` embedded in `pagina-home` and `producto` schemas
3. [ ] Indexation policy covers every route in the app
4. [ ] Canonical URL rules are unambiguous (including cross-segment)
5. [ ] OG tags specified with fallback chain
6. [ ] JSON-LD types chosen per page type
7. [ ] Sitemap spec defines inclusion/exclusion rules
8. [ ] robots.txt spec defines allowed/disallowed paths
9. [ ] Legacy redirect map covers all coverage pages and institutional pages
10. [ ] Regulatory pages (arrepentimiento, botondebaja) have a defined plan
11. [ ] Google Search Console setup is documented

---

## Heuristic Audit

| Heuristic | Risk | Assessment |
|-----------|------|------------|
| **Visibility of system status** | Low | SEO is invisible to users. No UX impact. |
| **Match between system and domain** | Medium | SEO titles/descriptions must match insurance domain language. Fallbacks from product `nombre` ensure alignment. |
| **Consistency and standards** | High | Currently inconsistent — this PRD fixes it with a single `seo` object and policy table. |
| **Error prevention** | Medium | Fallback chain (seoTitle → nombre → default) prevents blank metadata. Character count hints in Sanity prevent truncation. |
| **Recognition rather than recall** | Low | Sanity editors see all SEO fields in one place per document. |

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Each cross-segment URL is canonical to itself | Products in personas vs empresas have different framing, audience, and content. Not duplicate content. |
| D2 | OG images use product hero images | Avoids generating custom social images. Hero images already represent the product visually. |
| D3 | Only Open Graph, no Twitter cards | User decision — revisit when X/Twitter becomes relevant. |
| D4 | Single sitemap, not sitemap index | Site has <100 indexable URLs. No need for splitting. |
| D5 | Producer landing pages redirect to /productores | Low SEO value individually. Can be revisited with analytics data. |
| D6 | Regulatory pages (arrepentimiento, botondebaja) need their own routes | SSN and Ley 24.240 require these. Cannot merge into contacto. |
| D7 | Blog stays noindex until populated | Prevents Google from indexing an empty page. |
| D8 | Sanity SEO fields are optional with auto-fallbacks | Reduces editorial burden. Marketing only overrides when defaults aren't good enough. |

---

## Blocking Questions by Stage

### For Frontend (TD-003)

1. **Default brand OG image**: to be generated with woranz-images skill (1200x630, logo + brand colors)
2. **Regulatory pages**: `/arrepentimiento` and `/botondebaja` — need separate PRDs (user confirmed)
3. **Producer landing pages**: 31 pages, all redirect to `/productores`. Revisit post-migration with analytics.
4. **Sepelio**: redirect to `/empresas/coberturas/sepelio-colectivo` — new product to create in Sanity (content available in docx)

### For Sanity Implementation

5. **Migration of existing `metaTitulo`/`metaDescripcion`**: when the `seo` object replaces these fields in `pagina-home`, existing content needs migration.

---

## Product Postflight

| Check | Result |
|-------|--------|
| Objective clear | Yes — unified SEO contract across Sanity + frontend |
| Scope bounded | Yes — strategy only, implementation in TD-003 |
| Non-goals explicit | Yes — no Twitter, no hreflang, no blog SEO, no SEM |
| Content requirements defined | Yes — Sanity `seo` object with fallback chain |
| Acceptance criteria testable | Yes — 11 criteria, all verifiable |
| Heuristic audit done | Yes — 5 heuristics assessed |
| Decision log populated | Yes — 8 decisions recorded |
| Blocking questions identified | Yes — 5 questions for downstream stages |
| Dependencies documented | Yes — TD-003 consumes this PRD |
