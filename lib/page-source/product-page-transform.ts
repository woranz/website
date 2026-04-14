import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import {
  CTA_DEFAULTS,
  DEFAULT_PRODUCT_DESCRIPTION,
  FEATURE_CAROUSEL_DEFAULTS,
  LEGACY_EMPRESAS_RELATED_PRODUCTS_TITLE,
  RELATED_PRODUCTS_DEFAULT_TITLE,
} from "@/lib/page-source/fallbacks"
import {
  buildWhatsappCtaHref,
  buildWhatsappHref,
  cleanStegaString,
  createPageSourceContext,
  mapProductReferences,
  resolveOwnedImage,
  resolveOwnedString,
  resolveSanityImage,
  splitIntoColumns,
  type PageSourceContext,
  type SanityCtaLink,
  type SanitySeo,
  type SanitySlug,
} from "@/lib/page-source/shared"
import { getCatalogProduct } from "@/lib/product-catalog"
import {
  PRODUCT_QUOTER_SECTION_ID,
  resolveProductCtaHref,
  WORANZ_WHATSAPP_HREF,
} from "@/lib/site-links"
import { buildProductPath, type ProductSegment } from "@/lib/product-paths"
import type {
  CoverageItem,
  FaqItem,
  FeatureCarouselItem,
  PackageCarouselItem,
  ProductCarouselItem,
  ProductGridItem,
  ProductPageData,
  ProductPageSection,
  ProductStep,
  VariantItem,
} from "@/lib/product-pages"

type SanityRelatedProduct = {
  cardImage?: SanityImageSource
  heroImage?: SanityImageSource
  headline?: string
  nombre?: string
  pendientesValidacion?: string[]
  segmento?: ProductSegment
  slug?: SanitySlug
}

type SanitySectionBlock = {
  _type: string
  cuerpo?: string
  cuerpoMobile?: string
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  descripcion?: string
  formConfigId?: string
  items?: Array<{
    _type?: string
    cta?: "button" | "link"
    descripcion?: string
    descripcionMobile?: string
    href?: string
    icono?: string
    imagen?: SanityImageSource
    items?: string[]
    pregunta?: string
    respuesta?: string
    texto?: string
    textoMobile?: string
    titulo?: string
  }>
  maxWidth?: "default" | "wide"
  modo?: "contacto" | "inline-accidentes" | "inline-caucion" | "inline-generico"
  mostrarPasosMobile?: boolean
  ocultarCtaSecundario?: boolean
  pasos?: Array<{
    descripcion?: string
    numero?: string
    titulo?: string
  }>
  productos?: SanityRelatedProduct[]
  teamCount?: string
  teamLabel?: string
  titulo?: string
  tituloMobile?: string
}

export type SanityProduct = {
  badge?: string
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  headline?: string
  heroImage?: SanityImageSource
  nombre?: string
  ocultarCtaSecundario?: boolean
  pendientesValidacion?: string[]
  secciones?: SanitySectionBlock[]
  segmento?: ProductSegment
  seo?: SanitySeo
  slug?: SanitySlug
  subtitulo?: string
}

export type SanitySettings = {
  ctaPrimarioHref?: string
  ctaSecundarioHref?: string
  emailContacto?: string
  whatsappNumero?: string
}

function mapCoverageItems(
  items: Array<{ descripcion?: string; titulo?: string }> | null | undefined = []
): CoverageItem[] {
  return (items ?? [])
    .filter((item) => item?.titulo || item?.descripcion)
    .map((item) => ({
      title: item?.titulo?.trim() || "Cobertura",
      description:
        item?.descripcion?.trim() ||
        "Cobertura disponible para este producto.",
    }))
}

function mapFaqItems(
  items: Array<{ pregunta?: string; respuesta?: string }> | null | undefined = []
): FaqItem[] {
  return (items ?? [])
    .filter((item) => item?.pregunta || item?.respuesta)
    .map((item) => ({
      question: item?.pregunta?.trim() || "Pregunta frecuente",
      answer:
        item?.respuesta?.trim() || "Estamos preparando esta respuesta.",
    }))
}

function mapStepItems(
  items: Array<{ descripcion?: string; numero?: string; titulo?: string }> | null | undefined = []
): ProductStep[] {
  return (items ?? [])
    .filter((item) => item?.numero || item?.titulo || item?.descripcion)
    .map((item, index) => ({
      number: item?.numero?.trim() || String(index + 1).padStart(2, "0"),
      title: item?.titulo?.trim() || "Paso",
      description:
        item?.descripcion?.trim() ||
        "Completá la información para mostrar este paso en el proceso.",
    }))
}

function mapVariantItems(
  items: Array<{
    descripcion?: string
    href?: string
    icono?: string
    items?: string[]
    titulo?: string
  }> | null | undefined = []
): VariantItem[] {
  return (items ?? [])
    .filter((item) => item?.titulo)
    .map((item) => ({
      title: item?.titulo?.trim() || "Variante",
      description: item?.descripcion?.trim(),
      href: item?.href?.trim() || undefined,
      icon: item?.icono?.trim() || undefined,
      items: item?.items?.filter(Boolean),
    }))
}

function mapRequirementItems(
  items: SanitySectionBlock["items"] | string[] | undefined
) {
  return (items ?? [])
    .map((item) =>
      typeof item === "string" ? item.trim() : item?.titulo?.trim() || ""
    )
    .filter(Boolean)
}

function resolveDefaultCtaHrefs(settings?: SanitySettings) {
  const secondaryHref =
    settings?.ctaSecundarioHref ||
    buildWhatsappHref(settings?.whatsappNumero) ||
    WORANZ_WHATSAPP_HREF ||
    (settings?.emailContacto
      ? `mailto:${settings.emailContacto}`
      : undefined)

  const primaryHref =
    settings?.ctaPrimarioHref ||
    secondaryHref ||
    (settings?.emailContacto
      ? `mailto:${settings.emailContacto}`
      : undefined)

  return {
    primaryHref,
    secondaryHref,
  }
}

function resolveContextualCtaLink({
  defaultContactHref,
  fallbackHref,
  fallbackLabel,
  hasQuoteSection,
  link,
}: {
  defaultContactHref?: string
  fallbackHref?: string
  fallbackLabel: string
  hasQuoteSection: boolean
  link: SanityCtaLink | undefined
}) {
  const label = link?.label?.trim() || fallbackLabel
  const authoredHref = link?.href?.trim()
  const contextualHref = resolveProductCtaHref({
    label,
    href: authoredHref,
    hasQuoteSection,
    contactHref: defaultContactHref,
  })

  return {
    label,
    href: contextualHref || fallbackHref,
  }
}

function resolveOptionalContextualCtaLink({
  defaultContactHref,
  fallbackHref,
  fallbackLabel,
  hasQuoteSection,
  hidden,
  link,
}: {
  defaultContactHref?: string
  fallbackHref?: string
  fallbackLabel: string
  hasQuoteSection: boolean
  hidden?: boolean
  link: SanityCtaLink | undefined
}) {
  if (hidden) {
    return undefined
  }

  return resolveContextualCtaLink({
    defaultContactHref,
    fallbackHref,
    fallbackLabel,
    hasQuoteSection,
    link,
  })
}

function inferQuoter(
  mode?: "contacto" | "inline-accidentes" | "inline-caucion" | "inline-generico"
) {
  const cleanedMode = cleanStegaString(mode)

  if (cleanedMode === "inline-caucion") {
    return "caucion" as const
  }

  if (cleanedMode === "inline-accidentes") {
    return "accidentes" as const
  }

  if (cleanedMode === "inline-generico") {
    return "generico" as const
  }

  if (cleanedMode === "contacto") {
    return "contacto" as const
  }

  return null
}

function resolveRelatedProductsTitle(
  title: string | undefined,
  segment: ProductSegment
) {
  const normalizedTitle = title?.trim()

  if (!normalizedTitle) {
    return RELATED_PRODUCTS_DEFAULT_TITLE[segment]
  }

  if (
    segment === "empresas" &&
    normalizedTitle === LEGACY_EMPRESAS_RELATED_PRODUCTS_TITLE
  ) {
    return RELATED_PRODUCTS_DEFAULT_TITLE[segment]
  }

  return normalizedTitle
}

function findLastSectionIndex(
  sections: ProductPageSection[],
  matcher: (section: ProductPageSection) => boolean
) {
  for (let index = sections.length - 1; index >= 0; index -= 1) {
    if (matcher(sections[index])) {
      return index
    }
  }

  return -1
}

function insertSectionBeforeLastCta(
  sections: ProductPageSection[],
  section: ProductPageSection
) {
  const ctaIndex = findLastSectionIndex(
    sections,
    (candidate) => candidate.type === "cta"
  )

  if (ctaIndex === -1) {
    return [...sections, section]
  }

  const nextSections = [...sections]
  nextSections.splice(ctaIndex, 0, section)

  return nextSections
}

function createFeatureCarouselSection(segment: "empresas" | "personas") {
  const defaults = FEATURE_CAROUSEL_DEFAULTS[segment]

  return {
    type: "carousel" as const,
    variant: "feature" as const,
    title: defaults.title,
    items: defaults.items,
  }
}

function createFaqSection(items: FaqItem[]) {
  return {
    type: "faq" as const,
    title: "Preguntas frecuentes",
    mobileItems: items,
    desktopColumns: splitIntoColumns(items),
  }
}

function getCatalogFaqItems(segment: ProductSegment, slug: string) {
  return mapFaqItems(getCatalogProduct(segment, slug)?.faqs)
}

function injectEmpresasFaqFallback(
  sections: ProductPageSection[],
  slug: string
) {
  if (sections.some((section) => section.type === "faq")) {
    return sections
  }

  const faqItems = getCatalogFaqItems("empresas", slug)

  if (faqItems.length === 0) {
    return sections
  }

  return insertSectionBeforeLastCta(sections, createFaqSection(faqItems))
}

function repositionFeatureCarousel(
  sections: ProductPageSection[],
  segment: ProductSegment
) {
  if (segment !== "personas" && segment !== "empresas") {
    return sections
  }

  const featureSections = sections.filter(
    (section): section is Extract<ProductPageSection, { type: "carousel"; variant: "feature" }> =>
      section.type === "carousel" && section.variant === "feature"
  )
  const remainingSections = sections.filter(
    (section) => !(section.type === "carousel" && section.variant === "feature")
  )
  const sectionsToInsert =
    featureSections.length > 0
      ? featureSections
      : [createFeatureCarouselSection(segment)]
  const ctaIndex = findLastSectionIndex(
    remainingSections,
    (section) => section.type === "cta"
  )

  if (ctaIndex === -1) {
    return [...remainingSections, ...sectionsToInsert]
  }

  const nextSections = [...remainingSections]
  nextSections.splice(ctaIndex + 1, 0, ...sectionsToInsert)

  return nextSections
}

function applySharedProductPageRollouts(
  sections: ProductPageSection[],
  segment: ProductSegment,
  slug: string
) {
  const withFaqFallback =
    segment === "empresas"
      ? injectEmpresasFaqFallback(sections, slug)
      : sections

  return repositionFeatureCarousel(withFaqFallback, segment)
}

function transformSectionBlock(
  block: SanitySectionBlock,
  settings: SanitySettings | undefined,
  segment: ProductSegment,
  pagePath: string
): ProductPageSection | null {
  const defaultCtas = resolveDefaultCtaHrefs(settings)
  const ctaDefaults = CTA_DEFAULTS[segment]
  const whatsappHref = buildWhatsappCtaHref(
    pagePath,
    settings?.whatsappNumero
  )
  const defaultContactHref = defaultCtas.secondaryHref || whatsappHref

  switch (block._type) {
    case "seccionCotizador": {
      const quoter = inferQuoter(block.modo)

      if (!quoter) {
        return null
      }

      return {
        type: "quote",
        title:
          block.titulo?.trim() ||
          (quoter === "contacto" ? "Contactanos" : "Cotizá tu cobertura"),
        description:
          block.descripcion?.trim() ||
          (quoter === "contacto"
            ? "Completá el formulario y te contactamos en menos de 24hs."
            : "Completá el flujo y recibí una propuesta en segundos."),
        quoter,
        formConfigId:
          quoter === "contacto"
            ? cleanStegaString(block.formConfigId)
            : undefined,
        quoterConfigId:
          quoter === "generico"
            ? cleanStegaString(block.formConfigId)
            : undefined,
        maxWidth:
          cleanStegaString(block.maxWidth) === "wide" ? "wide" : "default",
        mobileSteps: block.mostrarPasosMobile ?? false,
        steps: mapStepItems(block.pasos),
      }
    }

    case "seccionExplicacion": {
      if (!block.cuerpo?.trim()) {
        return null
      }

      return {
        type: "explanation",
        title: block.titulo?.trim() || "Qué es",
        body: block.cuerpo.trim(),
        bodyMobile: block.cuerpoMobile?.trim(),
      }
    }

    case "seccionCobertura": {
      const items = mapCoverageItems(block.items)

      if (items.length === 0) {
        return null
      }

      return {
        type: "coverage",
        title: block.titulo?.trim() || "Qué cubre",
        columns: splitIntoColumns(items),
      }
    }

    case "seccionFaq": {
      const faqItems = mapFaqItems(block.items)

      if (faqItems.length === 0) {
        return null
      }

      return {
        type: "faq",
        title: block.titulo?.trim() || "Preguntas frecuentes",
        mobileItems: faqItems,
        desktopColumns: splitIntoColumns(faqItems),
      }
    }

    case "seccionVariantes": {
      const variants = mapVariantItems(block.items)

      if (variants.length === 0) {
        return null
      }

      return {
        type: "variants",
        title: block.titulo?.trim() || "Variantes",
        items: variants,
      }
    }

    case "seccionRequisitos": {
      const items = mapRequirementItems(block.items)

      if (items.length === 0) {
        return null
      }

      return {
        type: "requirements",
        title: block.titulo?.trim() || "Requisitos",
        description: block.descripcion?.trim(),
        items,
      }
    }

    case "seccionPasos": {
      const steps = mapStepItems(block.pasos)

      if (steps.length === 0) {
        return null
      }

      return {
        type: "steps",
        steps,
      }
    }

    case "seccionCarouselProductos": {
      const items = mapProductReferences(
        block.productos as SanityRelatedProduct[] | undefined
      ) as ProductCarouselItem[]

      if (items.length === 0) {
        return null
      }

      return {
        type: "carousel",
        variant: "product",
        title: resolveRelatedProductsTitle(block.titulo, segment),
        items,
      }
    }

    case "seccionCarouselFeatures": {
      const items: FeatureCarouselItem[] = (block.items ?? [])
        .filter((item) => item.imagen)
        .map((item) => ({
          imageSrc: resolveSanityImage(item.imagen, "/images/hero.png", 1600),
          text: item.texto?.trim(),
          textMobile: item.textoMobile?.trim(),
        }))

      if (items.length === 0) {
        return null
      }

      return {
        type: "carousel",
        variant: "feature",
        title: block.titulo?.trim() || "Features",
        items,
      }
    }

    case "seccionCarouselPaquetes": {
      const items: PackageCarouselItem[] = (block.items ?? [])
        .filter((item) => item.titulo)
        .map((item) => ({
          icon:
            (cleanStegaString(item.icono) as PackageCarouselItem["icon"]) ||
            "user",
          title: item.titulo?.trim() || "Paquete",
          description: item.descripcion?.trim() || "",
          descriptionMobile: item.descripcionMobile?.trim(),
          cta:
            (cleanStegaString(item.cta) as PackageCarouselItem["cta"]) ||
            "link",
        }))

      if (items.length === 0) {
        return null
      }

      return {
        type: "carousel",
        variant: "package",
        title: block.titulo?.trim() || "Paquetes",
        items,
      }
    }

    case "seccionGridProductos": {
      const items = mapProductReferences(
        block.productos as SanityRelatedProduct[] | undefined
      ) as ProductGridItem[]

      if (items.length === 0) {
        return null
      }

      return {
        type: "product-grid",
        title: block.titulo?.trim() || "Productos",
        items,
      }
    }

    case "seccionCta": {
      const primaryCta = resolveContextualCtaLink({
        link: block.ctaPrimario,
        fallbackLabel: ctaDefaults.primaryCta,
        fallbackHref: defaultCtas.primaryHref,
        defaultContactHref,
        hasQuoteSection: true,
      })
      const secondaryCta = resolveOptionalContextualCtaLink({
        link: block.ctaSecundario,
        fallbackLabel: ctaDefaults.secondaryCta,
        fallbackHref: defaultContactHref,
        defaultContactHref,
        hasQuoteSection: false,
        hidden: block.ocultarCtaSecundario,
      })

      return {
        type: "cta",
        title: block.titulo?.trim() || ctaDefaults.title,
        titleMobile: block.tituloMobile?.trim(),
        description: block.descripcion?.trim() || ctaDefaults.description,
        teamCount: block.teamCount?.trim() || ctaDefaults.teamCount,
        teamLabel: block.teamLabel?.trim() || ctaDefaults.teamLabel,
        primaryCta: primaryCta.label,
        primaryCtaHref: primaryCta.href,
        secondaryCta: secondaryCta?.label,
        secondaryCtaHref: secondaryCta?.href,
      }
    }

    default:
      return null
  }
}

export function transformSanityProduct(
  product: SanityProduct,
  settings?: SanitySettings,
  context?: PageSourceContext
): ProductPageData | undefined {
  const slug = product.slug?.current?.trim()
  const segment = product.segmento?.trim() as ProductSegment | undefined

  if (!slug || !segment) {
    return undefined
  }

  const pagePath = buildProductPath(segment, slug)
  const sourceContext =
    context ||
    createPageSourceContext("product", `${segment}/${slug}`, pagePath)

  const sections = (product.secciones ?? [])
    .map((block) =>
      transformSectionBlock(block, settings, segment, sourceContext.path)
    )
    .filter((section): section is ProductPageSection => section !== null)

  const quoteIndex = sections.findIndex((section) => section.type === "quote")

  if (quoteIndex > 0) {
    const [quoteSection] = sections.splice(quoteIndex, 1)
    sections.unshift(quoteSection)
  }

  if (sections.length === 0) {
    return undefined
  }

  const normalizedSections = applySharedProductPageRollouts(
    sections,
    segment,
    slug
  )

  const defaultCtas = resolveDefaultCtaHrefs(settings)
  const hasQuoteSection = normalizedSections.some(
    (section) => section.type === "quote"
  )
  const ctaDefaults = CTA_DEFAULTS[segment]
  const whatsappHref = buildWhatsappCtaHref(
    sourceContext.path,
    settings?.whatsappNumero
  )
  const defaultContactHref = defaultCtas.secondaryHref || whatsappHref
  const primaryCta = resolveContextualCtaLink({
    link: product.ctaPrimario,
    fallbackLabel: ctaDefaults.primaryCta,
    fallbackHref: defaultCtas.primaryHref,
    defaultContactHref,
    hasQuoteSection,
  })
  const secondaryCta = resolveOptionalContextualCtaLink({
    link: product.ctaSecundario,
    fallbackLabel: ctaDefaults.secondaryCta,
    fallbackHref: defaultContactHref,
    defaultContactHref,
    hasQuoteSection: false,
    hidden: product.ocultarCtaSecundario,
  })
  const title = resolveOwnedString({
    context: sourceContext,
    field: "headline",
    fallback: "Producto Woranz",
    value: product.headline?.trim() || product.nombre?.trim(),
  })
  const description = resolveOwnedString({
    context: sourceContext,
    field: "subtitulo",
    fallback: DEFAULT_PRODUCT_DESCRIPTION,
    value: product.subtitulo,
  })
  const heroImage = resolveOwnedImage({
    context: sourceContext,
    field: "heroImage",
    fallback: "/images/hero.png",
    source: product.heroImage,
    width: 2400,
  })

  return {
    segment,
    slug,
    path: sourceContext.path,
    metadata: {
      canonicalPath: sourceContext.path,
      title: product.seo?.title?.trim() || `Woranz - ${product.nombre?.trim() || title}`,
      description: product.seo?.description?.trim() || description,
      imageUrl: product.seo?.image
        ? resolveSanityImage(product.seo.image, heroImage, 1600)
        : heroImage,
      imageAlt: product.nombre?.trim() || title,
    },
    hero: {
      badge: product.badge?.trim() || product.nombre?.trim() || "Producto",
      title,
      description,
      descriptionMobile: description,
      primaryCta: primaryCta.label,
      primaryCtaHref: primaryCta.href,
      secondaryCta: secondaryCta?.label,
      secondaryCtaHref: secondaryCta?.href,
      imageSrc: heroImage,
      imageAlt: product.nombre?.trim() || title,
    },
    sections: normalizedSections,
  }
}

export function applyProductPageOverrides(page: ProductPageData): ProductPageData {
  if (
    page.segment !== "empresas" ||
    page.slug !== "accidentes-personales"
  ) {
    return page
  }

  const quoteHref = `#${PRODUCT_QUOTER_SECTION_ID}`
  const whatsappHref = buildWhatsappCtaHref(page.path)
  const normalizedQuoteTitle = "Cotizá la cobertura"
  const quoteSteps: ProductStep[] = [
    {
      number: "01",
      title: "Cotizá online",
      description:
        "Elegí tu cobertura y recibí el precio al instante, sin ingresar datos personales.",
    },
    {
      number: "02",
      title: "Contratá",
      description:
        "Pagá con Mercado Pago, con débito o tarjeta de crédito.",
    },
    {
      number: "03",
      title: "Listo, estás cubierto",
      description:
        "Tu póliza llega al instante a tu celular. Siempre disponible en tu cuenta Woranz.",
    },
  ]
  const defaultQuoteSection: Extract<ProductPageSection, { type: "quote" }> = {
    type: "quote",
    title: normalizedQuoteTitle,
    description: "",
    quoter: "accidentes",
    maxWidth: "default",
    mobileSteps: true,
    steps: quoteSteps,
  }

  let hasRenderableQuote = false

  const sections = page.sections.map((section) => {
    if (section.type === "quote") {
      hasRenderableQuote = true

      if (section.quoter === "contacto") {
        return {
          ...section,
          title: normalizedQuoteTitle,
          description: "",
          quoter: "accidentes" as const,
          formConfigId: undefined,
          mobileSteps: true,
          steps: quoteSteps,
        }
      }

      return {
        ...section,
        title: normalizedQuoteTitle,
        description: "",
        mobileSteps: true,
        steps: section.steps.length > 0 ? section.steps : quoteSteps,
      }
    }

    if (section.type === "cta") {
      return {
        ...section,
        primaryCta: "Cotizar",
        primaryCtaHref: quoteHref,
        secondaryCtaHref: whatsappHref,
      }
    }

    return section
  })

  return {
    ...page,
    hero: {
      ...page.hero,
      primaryCta: "Cotizar",
      primaryCtaHref: quoteHref,
      secondaryCtaHref: whatsappHref,
    },
    sections: hasRenderableQuote ? sections : [defaultQuoteSection, ...sections],
  }
}
