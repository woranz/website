import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { buildProductPath, type ProductSegment } from "@/lib/product-paths"
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
import { paginaHomeQuery } from "@/sanity/lib/queries"

// ── Sanity response types ─────────────────────────────────────────────

type SanitySlug = { current?: string }

type SanityCtaLink = {
  href?: string
  label?: string
}

type SanityHeroFeature = {
  icono?: string
  texto?: string
}

type SanityPaso = {
  descripcion?: string
  numero?: string
  titulo?: string
}

type SanityProductRef = {
  _id: string
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
    title: product.headline?.trim() || product.nombre?.trim() || "Producto Woranz",
    href: buildProductPath(segment, slug),
    imageSrc: resolveImage(product.heroImage, "/images/hero.png"),
  }
}

function mapProductRefs(products: SanityProductRef[] | undefined): ProductCarouselItem[] {
  return (products ?? []).map(mapProductRef).filter((item): item is ProductCarouselItem => item !== null)
}

function mapProductRefsToGrid(products: SanityProductRef[] | undefined): ProductGridItem[] {
  return (products ?? []).map(mapProductRef).filter((item): item is ProductGridItem => item !== null)
}

// ── Section transform ─────────────────────────────────────────────────

function transformSection(section: SanitySeccion): ProductPageSection | null {
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
      const items: FeatureCarouselItem[] = (section.items ?? [])
        .filter((item) => item.imagen || item.texto)
        .map((item) => ({
          imageSrc: resolveImage(item.imagen, "/images/feature-1.png"),
          text: item.texto?.trim(),
          textMobile: item.textoMobile?.trim(),
        }))
      if (items.length === 0) return null
      return {
        type: "carousel",
        variant: "feature",
        title: section.titulo?.trim() || "Features",
        items,
      }
    }

    case "seccionGridProductos": {
      const items = mapProductRefsToGrid(section.productos)
      if (items.length === 0) return null
      return {
        type: "product-grid",
        title: section.titulo?.trim() || "Coberturas",
        items,
      }
    }

    case "seccionCta": {
      return {
        type: "cta",
        title: section.titulo?.trim() || "Estamos para ayudarte.",
        titleMobile: section.tituloMobile?.trim(),
        description: section.descripcion?.trim() || "",
        teamCount: section.teamCount?.trim() || "+9",
        teamLabel: section.teamLabel?.trim() || "personas cuidando de vos",
        primaryCta: section.ctaPrimario?.label?.trim() || "Empezar ahora",
        primaryCtaHref: section.ctaPrimario?.href?.trim(),
        secondaryCta: section.ctaSecundario?.label?.trim() || "Hablá con nosotros →",
        secondaryCtaHref: section.ctaSecundario?.href?.trim(),
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
  const sections: ProductPageSection[] = (data.secciones ?? [])
    .map(transformSection)
    .filter((s): s is ProductPageSection => s !== null)

  return {
    segment,
    slug: segment === "personas" ? "home" : segment,
    path: segmentToPath(segment),
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
        .filter((f) => f.texto)
        .map((f) => ({
          icon: f.icono?.trim() || "shield-check",
          label: f.texto?.trim() || "",
        })),
      primaryCta: data.ctaPrimario?.label?.trim() || "Ver seguros",
      primaryCtaHref: data.ctaPrimario?.href?.trim(),
      secondaryCta: data.ctaSecundario?.label?.trim() || "Hablar con alguien →",
      secondaryCtaHref: data.ctaSecundario?.href?.trim(),
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
      const transformed = transformSanityHome(data, segment)
      // Only use Sanity data if it has ALL key sections (steps, carousel, faq, cta)
      // Otherwise fall through to local fallback which has complete content
      const hasSteps = transformed.sections.some((s) => s.type === "steps")
      const hasCta = transformed.sections.some((s) => s.type === "cta")
      const hasFaq = transformed.sections.some((s) => s.type === "faq")
      if (hasSteps && hasCta && hasFaq) {
        return transformed
      }
      // Sanity data is incomplete — return null so caller uses local fallback
      return null
    }
  } catch {
    // Fall through — caller uses hardcoded fallback
  }

  return null
}
