import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { buildProductPath, type ProductSegment } from "@/lib/product-paths"
import { buildWhatsappCtaHref, CTA_DEFAULTS } from "@/lib/product-page-source"
import type {
  FeatureCarouselItem,
  ProductCarouselItem,
  ProductGridItem,
  ProductPageData,
  ProductPageSection,
  ProductStep,
} from "@/lib/product-pages"
import { draftMode } from "next/headers"

import { client, previewClient, urlFor } from "@/sanity/lib/client"
import { paginaHomeQuery, productosQuery } from "@/sanity/lib/queries"

// ── Sanity response types ─────────────────────────────────────────────

type SanitySlug = { current?: string }

type SanityCtaLink = {
  href?: string
  label?: string
}

type SanityHeroFeature = {
  icon?: string
  icono?: string
  label?: string
  texto?: string
}

type SanityPaso = {
  descripcion?: string
  numero?: string
  titulo?: string
}

type SanityProductRef = {
  _id: string
  cardImage?: SanityImageSource
  heroImage?: SanityImageSource
  headline?: string
  nombre?: string
  pendientesValidacion?: string[]
  segmento?: ProductSegment
  slug?: SanitySlug
  subtitulo?: string
}

type SanityFeatureItem = {
  imagen?: SanityImageSource
  texto?: string
  textoMobile?: string
}

type SanitySeccion =
  | {
      _type: "seccionPasos"
      pasos?: SanityPaso[]
    }
  | {
      _type: "seccionCarouselProductos"
      productos?: SanityProductRef[]
      titulo?: string
    }
  | {
      _type: "seccionCarouselFeatures"
      items?: SanityFeatureItem[]
      titulo?: string
    }
  | {
      _type: "seccionGridProductos"
      productos?: SanityProductRef[]
      titulo?: string
    }
  | {
      _type: "seccionCta"
      ctaPrimario?: SanityCtaLink
      ctaSecundario?: SanityCtaLink
      descripcion?: string
      teamCount?: string
      teamLabel?: string
      titulo?: string
      tituloMobile?: string
    }

type SanityHomeData = {
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  heroFeatures?: SanityHeroFeature[]
  heroImagen?: SanityImageSource
  heroSubtitulo?: string
  heroSubtituloMobile?: string
  heroTitulo?: string
  metaDescripcion?: string
  metaTitulo?: string
  secciones?: SanitySeccion[]
  segmento?: string
}

// ── Constants ─────────────────────────────────────────────────────────

const REVALIDATE_SECONDS = 60

const FEATURE_CAROUSEL_DEFAULTS: Record<ProductSegment, { title: string; items: FeatureCarouselItem[] }> = {
  personas: {
    title: "Seguros pensados para vos.",
    items: [
      { imageSrc: "/images/features/personas-1-online.webp", text: "Cotizá y gestioná todo\nonline, cuando quieras.", textMobile: "Cotizá y gestioná\ntodo online." },
      { imageSrc: "/images/features/productores-2-cerca.webp", text: "Siempre cerca tuyo,\nsiempre a un mensaje.", textMobile: "Siempre cerca tuyo,\na un mensaje." },
      { imageSrc: "/images/features/personas-3-precio.webp", text: "El mejor precio, el mejor\nproducto. Sin vueltas.", textMobile: "El mejor precio.\nSin vueltas." },
      { imageSrc: "/images/features/personas-4-simple.webp", text: "Simple, online y con la\nmejor experiencia.", textMobile: "Simple, online y con\nla mejor experiencia." },
    ],
  },
  empresas: {
    title: "Seguros pensados para tu empresa.",
    items: [
      { imageSrc: "/images/features/empresas-1-online.webp", text: "Cotizá y gestioná las\ncoberturas de tu empresa.", textMobile: "Cotizá y gestioná\ntodo online." },
      { imageSrc: "/images/features/empresas-2-cerca.webp", text: "Un equipo que entiende\ntu negocio, siempre cerca.", textMobile: "Siempre cerca\nde tu empresa." },
      { imageSrc: "/images/features/empresas-3-medida.webp", text: "Coberturas a medida\nde tu operación.", textMobile: "Coberturas a medida\nde tu operación." },
      { imageSrc: "/images/features/empresas-4-simple.webp", text: "Simple para vos\ny para tu equipo.", textMobile: "Simple para vos\ny tu equipo." },
    ],
  },
  productores: {
    title: "Herramientas que te ayudan a vender.",
    items: [
      { imageSrc: "/images/features/productores-1-gestion.webp", text: "Cotizá, emití y seguí cada\noperación desde un solo lugar.", textMobile: "Cotizá, emití y seguí\ndesde un solo lugar." },
      { imageSrc: "/images/features/productores-2-cerca.webp", text: "Soporte real, siempre\na un mensaje.", textMobile: "Soporte real,\na un mensaje." },
      { imageSrc: "/images/features/productores-3-comisiones.webp", text: "Comisiones competitivas\ny liquidación transparente.", textMobile: "Comisiones competitivas\ny transparentes." },
      { imageSrc: "/images/features/productores-4-simple.webp", text: "Tu cartera, simplificada\nen una sola plataforma.", textMobile: "Tu cartera,\nsimplificada." },
    ],
  },
}

// ── Helpers ───────────────────────────────────────────────────────────

function isSanityConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET
  )
}

function resolveImage(source: SanityImageSource | undefined, fallback: string): string {
  if (!source) return fallback
  try {
    return urlFor(source).width(1600).auto("format").url()
  } catch {
    return fallback
  }
}

function mapProductRef(product: SanityProductRef): ProductCarouselItem | null {
  const slug = product.slug?.current?.trim()
  const segment = product.segmento
  if (!slug || !segment) return null
  if ((product.pendientesValidacion?.length ?? 0) > 0) return null

  return {
    title: product.nombre?.trim() || product.headline?.trim() || "Producto Woranz",
    subtitle: product.subtitulo?.trim(),
    href: buildProductPath(segment, slug),
    imageSrc: resolveImage(product.cardImage ?? product.heroImage, "/images/hero.png"),
  }
}

function mapProductRefs(products: SanityProductRef[] | undefined): ProductCarouselItem[] {
  return (products ?? []).map(mapProductRef).filter((item): item is ProductCarouselItem => item !== null)
}

function mapProductRefsToGrid(products: SanityProductRef[] | undefined): ProductGridItem[] {
  return (products ?? []).map(mapProductRef).filter((item): item is ProductGridItem => item !== null)
}

// ── Section transform ─────────────────────────────────────────────────

function transformSection(section: SanitySeccion, segment: ProductSegment, pagePath: string): ProductPageSection | null {
  switch (section._type) {
    case "seccionPasos": {
      const steps: ProductStep[] = (section.pasos ?? [])
        .filter((p) => p.titulo || p.descripcion)
        .map((p, i) => ({
          number: p.numero?.trim() || String(i + 1).padStart(2, "0"),
          title: p.titulo?.trim() || "Paso",
          description: p.descripcion?.trim() || "",
        }))
      if (steps.length === 0) return null
      return { type: "steps", steps }
    }

    case "seccionCarouselProductos": {
      const items = mapProductRefs(section.productos)
      if (items.length === 0) return null
      return {
        type: "carousel",
        variant: "product",
        title: section.titulo?.trim() || "Coberturas",
        items,
      }
    }

    case "seccionCarouselFeatures": {
      const defaults = FEATURE_CAROUSEL_DEFAULTS[segment]
      const sanityItems = (section.items ?? []).filter((item) => item.imagen || item.texto)
      const items: FeatureCarouselItem[] = sanityItems.length > 0
        ? sanityItems.map((item, i) => ({
            imageSrc: resolveImage(item.imagen, defaults.items[i]?.imageSrc ?? "/images/feature-1.png"),
            text: item.texto?.trim() || defaults.items[i]?.text,
            textMobile: item.textoMobile?.trim() || defaults.items[i]?.textMobile,
          }))
        : defaults.items
      return {
        type: "carousel",
        variant: "feature",
        title: section.titulo?.trim() || defaults.title,
        items,
      }
    }

    case "seccionGridProductos": {
      const items = mapProductRefsToGrid(section.productos)
      if (items.length === 0) return null
      return {
        type: segment === "empresas" ? "product-search-list" as const : "product-grid" as const,
        title: section.titulo?.trim() || "Coberturas",
        items,
      }
    }

    case "seccionCta": {
      const ctaDefaults = CTA_DEFAULTS[segment]
      const whatsappHref = buildWhatsappCtaHref(pagePath)
      return {
        type: "cta",
        title: section.titulo?.trim() || ctaDefaults.title,
        titleMobile: section.tituloMobile?.trim(),
        description: section.descripcion?.trim() || ctaDefaults.description,
        teamCount: section.teamCount?.trim() || ctaDefaults.teamCount,
        teamLabel: section.teamLabel?.trim() || ctaDefaults.teamLabel,
        primaryCta: section.ctaPrimario?.label?.trim() || ctaDefaults.primaryCta,
        primaryCtaHref: section.ctaPrimario?.href?.trim(),
        secondaryCta: section.ctaSecundario?.label?.trim() || ctaDefaults.secondaryCta,
        secondaryCtaHref: section.ctaSecundario?.href?.trim() || whatsappHref,
      }
    }

    default:
      return null
  }
}

// ── Main transform ────────────────────────────────────────────────────

function segmentToPath(segment: ProductSegment): string {
  if (segment === "personas") return "/"
  return `/${segment}`
}

function transformSanityHome(
  data: SanityHomeData,
  segment: ProductSegment
): ProductPageData {
  const pagePath = segmentToPath(segment)
  const whatsappHref = buildWhatsappCtaHref(pagePath)
  const sections: ProductPageSection[] = (data.secciones ?? [])
    .map((s) => transformSection(s, segment, pagePath))
    .filter((s): s is ProductPageSection => s !== null)

  // Inject default feature carousel if Sanity doesn't provide one
  const hasFeatureCarousel = sections.some(
    (s) => s.type === "carousel" && s.variant === "feature"
  )
  if (!hasFeatureCarousel) {
    const defaults = FEATURE_CAROUSEL_DEFAULTS[segment]
    sections.push({
      type: "carousel",
      variant: "feature",
      title: defaults.title,
      items: defaults.items,
    })
  }

  return {
    segment,
    slug: segment === "personas" ? "home" : segment,
    path: pagePath,
    isHome: true,
    metadata: {
      title: data.metaTitulo?.trim() || `Woranz — ${segment.charAt(0).toUpperCase() + segment.slice(1)}`,
      description:
        data.metaDescripcion?.trim() ||
        data.heroSubtitulo?.trim() ||
        "Seguros 100% online con personas reales del otro lado.",
    },
    hero: {
      badge: "",
      title: data.heroTitulo?.trim() || "Woranz",
      description:
        data.heroSubtitulo?.trim() ||
        "Seguros 100% online con personas reales del otro lado.",
      descriptionMobile: data.heroSubtituloMobile?.trim(),
      features: (data.heroFeatures ?? [])
        .filter((f) => f.texto || f.label)
        .map((f) => ({
          icon: f.icono?.trim() || f.icon?.trim() || "shield-check",
          label: f.texto?.trim() || f.label?.trim() || "",
        })),
      primaryCta: data.ctaPrimario?.label?.trim() || (segment === "empresas" ? "Ver coberturas" : "Ver seguros"),
      primaryCtaHref: data.ctaPrimario?.href?.trim() ?? (segment === "empresas" ? "#coberturas" : undefined),
      secondaryCta: data.ctaSecundario?.label?.trim() || (segment === "empresas" ? "¡Hablemos!" : "Hablar con alguien →"),
      secondaryCtaHref: data.ctaSecundario?.href?.trim() || whatsappHref,
      imageSrc: resolveImage(data.heroImagen, "/images/hero.png"),
      imageAlt: `Woranz ${segment}`,
    },
    sections,
  }
}

// ── Public API ─────────────────────────────────────────────────────────

export async function getHomePageData(
  segment: ProductSegment
): Promise<ProductPageData | null> {
  if (!isSanityConfigured()) return null

  try {
    const dm = await draftMode()
    const sanityClient = dm.isEnabled ? previewClient : client

    const data = await sanityClient.fetch<SanityHomeData | null>(
      paginaHomeQuery,
      { segmento: segment },
      dm.isEnabled
        ? { perspective: "previewDrafts" }
        : { next: { revalidate: REVALIDATE_SECONDS } }
    )

    if (data) {
      const page = transformSanityHome(data, segment)

      // For empresas, replace search list items with ALL segment products
      if (segment === "empresas") {
        const allProducts = await sanityClient.fetch<SanityProductRef[]>(
          productosQuery,
          {},
          dm.isEnabled
            ? { perspective: "previewDrafts" as const }
            : { next: { revalidate: REVALIDATE_SECONDS } }
        )
        const segmentItems = mapProductRefsToGrid(
          allProducts.filter((p) => p.segmento === "empresas")
        )
        if (segmentItems.length > 0) {
          for (const section of page.sections) {
            if (section.type === "product-search-list") {
              section.items = segmentItems
            }
          }
        }
      }

      return page
    }
  } catch {
    // Fall through — caller uses hardcoded fallback
  }

  return null
}
