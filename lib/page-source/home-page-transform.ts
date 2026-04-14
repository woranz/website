import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import {
  CTA_DEFAULTS,
  FEATURE_CAROUSEL_DEFAULTS,
  HOME_PAGE_FALLBACKS,
} from "@/lib/page-source/fallbacks"
import {
  buildWhatsappCtaHref,
  createPageSourceContext,
  mapProductReferences,
  resolveOwnedImage,
  resolveOwnedString,
  resolveSanityImage,
  type PageSourceContext,
  type SanityCtaLink,
  type SanityProductReference,
  type SanitySeo,
} from "@/lib/page-source/shared"
import type {
  FeatureCarouselItem,
  ProductGridItem,
  ProductPageData,
  ProductPageSection,
  ProductStep,
} from "@/lib/product-pages"
import type { ProductSegment } from "@/lib/product-paths"

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
      productos?: SanityProductReference[]
      titulo?: string
    }
  | {
      _type: "seccionCarouselFeatures"
      items?: SanityFeatureItem[]
      titulo?: string
    }
  | {
      _type: "seccionGridProductos"
      productos?: SanityProductReference[]
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

export type SanityHomeData = {
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  heroFeatures?: SanityHeroFeature[]
  heroImagen?: SanityImageSource
  heroSubtitulo?: string
  heroSubtituloMobile?: string
  heroTitulo?: string
  metaDescripcion?: string
  metaTitulo?: string
  segmento?: string
  seo?: SanitySeo
  secciones?: SanitySeccion[]
}

function segmentToPath(segment: ProductSegment) {
  if (segment === "personas") {
    return "/"
  }

  return `/${segment}`
}

function mapProductGridItems(products: SanityProductReference[] | undefined) {
  return mapProductReferences(products) as ProductGridItem[]
}

function transformSection(
  section: SanitySeccion,
  segment: ProductSegment,
  pagePath: string
): ProductPageSection | null {
  switch (section._type) {
    case "seccionPasos": {
      const steps: ProductStep[] = (section.pasos ?? [])
        .filter((paso) => paso.titulo || paso.descripcion)
        .map((paso, index) => ({
          number: paso.numero?.trim() || String(index + 1).padStart(2, "0"),
          title: paso.titulo?.trim() || "Paso",
          description: paso.descripcion?.trim() || "",
        }))

      if (steps.length === 0) {
        return null
      }

      return { type: "steps", steps }
    }

    case "seccionCarouselProductos": {
      const items = mapProductReferences(section.productos)

      if (items.length === 0) {
        return null
      }

      return {
        type: "carousel",
        variant: "product",
        title: section.titulo?.trim() || "Coberturas",
        items,
      }
    }

    case "seccionCarouselFeatures": {
      const defaults = FEATURE_CAROUSEL_DEFAULTS[segment]
      const sanityItems = (section.items ?? []).filter(
        (item) => item.imagen || item.texto
      )

      const items: FeatureCarouselItem[] =
        sanityItems.length > 0
          ? sanityItems.map((item, index) => ({
              imageSrc: resolveSanityImage(
                item.imagen,
                defaults.items[index]?.imageSrc ?? "/images/feature-1.png",
                1600
              ),
              text: item.texto?.trim() || defaults.items[index]?.text,
              textMobile:
                item.textoMobile?.trim() || defaults.items[index]?.textMobile,
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
      const items = mapProductGridItems(section.productos)

      if (items.length === 0) {
        return null
      }

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
        primaryCta:
          section.ctaPrimario?.label?.trim() || ctaDefaults.primaryCta,
        primaryCtaHref: section.ctaPrimario?.href?.trim(),
        secondaryCta:
          section.ctaSecundario?.label?.trim() || ctaDefaults.secondaryCta,
        secondaryCtaHref:
          section.ctaSecundario?.href?.trim() || whatsappHref,
      }
    }

    default:
      return null
  }
}

export function getHomePageFallbackMetadata(segment: ProductSegment) {
  const path = segmentToPath(segment)
  const fallback = HOME_PAGE_FALLBACKS[segment]

  return {
    canonicalPath: path,
    description: fallback.metadataDescription,
    imageAlt: fallback.imageAlt,
    imageUrl: "/images/hero.png",
    title: fallback.metadataTitle,
  }
}

export function transformSanityHome(
  data: SanityHomeData,
  segment: ProductSegment,
  context = createPageSourceContext("home", segment, segmentToPath(segment))
): ProductPageData {
  const pagePath = context.path
  const fallback = HOME_PAGE_FALLBACKS[segment]
  const whatsappHref = buildWhatsappCtaHref(pagePath)
  const sections: ProductPageSection[] = (data.secciones ?? [])
    .map((section) => transformSection(section, segment, pagePath))
    .filter((section): section is ProductPageSection => section !== null)

  const hasFeatureCarousel = sections.some(
    (section) => section.type === "carousel" && section.variant === "feature"
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

  const heroTitle = resolveOwnedString({
    context,
    field: "heroTitulo",
    fallback: fallback.heroTitle,
    value: data.heroTitulo,
  })
  const heroDescription = resolveOwnedString({
    context,
    field: "heroSubtitulo",
    fallback: fallback.heroDescription,
    value: data.heroSubtitulo,
  })
  const heroImage = resolveOwnedImage({
    context,
    field: "heroImagen",
    fallback: "/images/hero.png",
    source: data.heroImagen,
    width: 2400,
  })

  return {
    segment,
    slug: segment === "personas" ? "home" : segment,
    path: pagePath,
    isHome: true,
    metadata: {
      canonicalPath: pagePath,
      title:
        data.seo?.title?.trim() ||
        data.metaTitulo?.trim() ||
        fallback.metadataTitle,
      description:
        data.seo?.description?.trim() ||
        data.metaDescripcion?.trim() ||
        heroDescription ||
        fallback.metadataDescription,
      imageUrl: data.seo?.image
        ? resolveSanityImage(data.seo.image, heroImage, 1600)
        : heroImage,
      imageAlt: fallback.imageAlt,
    },
    hero: {
      badge: "",
      title: heroTitle,
      description: heroDescription,
      descriptionMobile: data.heroSubtituloMobile?.trim(),
      features: (data.heroFeatures ?? [])
        .filter((feature) => feature.texto || feature.label)
        .map((feature) => ({
          icon:
            feature.icono?.trim() || feature.icon?.trim() || "shield-check",
          label: feature.texto?.trim() || feature.label?.trim() || "",
        })),
      primaryCta: data.ctaPrimario?.label?.trim() || fallback.primaryCta,
      primaryCtaHref: data.ctaPrimario?.href?.trim() ?? (segment === "empresas" ? "#coberturas" : undefined),
      secondaryCta:
        data.ctaSecundario?.label?.trim() || fallback.secondaryCta,
      secondaryCtaHref: data.ctaSecundario?.href?.trim() || whatsappHref,
      imageSrc: heroImage,
      imageAlt: fallback.imageAlt,
    },
    sections,
  }
}
