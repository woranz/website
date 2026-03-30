import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import {
  getCatalogProduct,
  isCatalogProductPublic,
  productCatalogByKey,
  publicProductCatalog,
  type CatalogCtaLink,
  type CatalogProduct,
} from "@/lib/product-catalog"
import {
  buildProductKey,
  buildProductPath,
  type ProductSegment,
} from "@/lib/product-paths"
import {
  getProductPageData as getStaticProductPageData,
  productPages,
  type CoverageItem,
  type FaqItem,
  type ProductCarouselItem,
  type ProductPageData,
  type ProductStep,
  type VariantItem,
} from "@/lib/product-pages"
import { client, urlFor } from "@/sanity/lib/client"
import {
  productoByRouteQuery,
  productosQuery,
  settingsQuery,
} from "@/sanity/lib/queries"

type SanitySlug = {
  current?: string
}

type SanityCoverageItem = {
  descripcion?: string
  titulo?: string
}

type SanityFaqItem = {
  pregunta?: string
  respuesta?: string
}

type SanityStepItem = {
  descripcion?: string
  numero?: string
  titulo?: string
}

type SanityVariantItem = {
  descripcion?: string
  href?: string
  items?: string[]
  titulo?: string
}

type SanityRequirements = {
  descripcion?: string
  items?: string[]
  titulo?: string
}

type SanityCotizador = {
  ctaHref?: string
  ctaLabel?: string
  descripcion?: string
  modo?: "contacto" | "inline-accidentes" | "inline-caucion" | "none"
  titulo?: string
}

type SanityCtaLink = {
  href?: string
  label?: string
}

type SanityRelatedProduct = {
  heroImage?: SanityImageSource
  headline?: string
  nombre?: string
  pendientesValidacion?: string[]
  segmento?: ProductSegment
  slug?: SanitySlug
}

type SanityProduct = {
  badge?: string
  coberturas?: SanityCoverageItem[]
  cotizador?: SanityCotizador
  ctaBoton?: string
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  ctaSubtitulo?: string
  ctaTitulo?: string
  faqs?: SanityFaqItem[]
  headline?: string
  heroImage?: SanityImageSource
  nombre?: string
  pasos?: SanityStepItem[]
  pendientesValidacion?: string[]
  productosRelacionados?: SanityRelatedProduct[]
  requisitos?: SanityRequirements
  segmento?: ProductSegment
  slug?: SanitySlug
  subtitulo?: string
  variantes?: SanityVariantItem[]
}

type SanitySettings = {
  ctaPrimarioHref?: string
  ctaSecundarioHref?: string
  emailContacto?: string
  whatsappNumero?: string
}

const DEFAULT_DESCRIPTION =
  "Contratá online, con respaldo real y acompañamiento humano en cada paso."
const DEFAULT_PRIMARY_CTA = "Cotizá ahora"
const DEFAULT_RELATED_TITLE = "Más opciones para vos"
const DEFAULT_SECONDARY_CTA = "Hablá con nosotros →"
const SANITY_REVALIDATE_SECONDS = 60

function isSanityConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET
  )
}

function buildWhatsappHref(phone?: string) {
  if (!phone) {
    return undefined
  }

  const digits = phone.replace(/\D/g, "")

  return digits ? `https://wa.me/${digits}` : undefined
}

function splitIntoColumns<T>(items: T[]) {
  if (items.length === 0) {
    return []
  }

  const midpoint = Math.ceil(items.length / 2)

  return [items.slice(0, midpoint), items.slice(midpoint)].filter(
    (column) => column.length > 0
  )
}

function mapCoverageItems(
  items: SanityCoverageItem[] | CatalogProduct["coberturas"] | null | undefined = []
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

function normalizeSectionTitle(title?: string) {
  return title
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function isCoverageLikeRequirements(
  requirements?: SanityRequirements | CatalogProduct["requisitos"]
) {
  if (!requirements?.items?.length) {
    return false
  }

  const normalizedTitle = normalizeSectionTitle(requirements.titulo)

  return normalizedTitle === "que cubre" || normalizedTitle === "que asegura"
}

function mapCoverageItemsFromRequirements(
  requirements?: SanityRequirements | CatalogProduct["requisitos"]
): CoverageItem[] {
  if (!isCoverageLikeRequirements(requirements)) {
    return []
  }

  const fallbackDescription =
    requirements?.descripcion?.trim() || "Cobertura disponible para este producto."

  return (requirements?.items ?? [])
    .filter(Boolean)
    .map((item) => ({
      title: item.trim(),
      description: fallbackDescription,
    }))
}

function mapFaqItems(
  items: SanityFaqItem[] | CatalogProduct["faqs"] | null | undefined = []
): FaqItem[] {
  return (items ?? [])
    .filter((item) => item?.pregunta || item?.respuesta)
    .map((item) => ({
      question: item?.pregunta?.trim() || "Pregunta frecuente",
      answer: item?.respuesta?.trim() || "Estamos preparando esta respuesta.",
    }))
}

function mapStepItems(
  items: SanityStepItem[] | CatalogProduct["pasos"] | null | undefined = []
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
  items: SanityVariantItem[] | CatalogProduct["variantes"] | null | undefined = []
): VariantItem[] {
  return (items ?? [])
    .filter((item) => item?.titulo)
    .map((item) => ({
      title: item?.titulo?.trim() || "Variante",
      description: item?.descripcion?.trim(),
      href: item?.href?.trim() || undefined,
      items: item?.items?.filter(Boolean),
    }))
}

function resolveDefaultCtaHrefs(settings?: SanitySettings) {
  const secondaryHref =
    settings?.ctaSecundarioHref ||
    buildWhatsappHref(settings?.whatsappNumero) ||
    (settings?.emailContacto ? `mailto:${settings.emailContacto}` : undefined)

  const primaryHref =
    settings?.ctaPrimarioHref ||
    secondaryHref ||
    (settings?.emailContacto ? `mailto:${settings.emailContacto}` : undefined)

  return {
    primaryHref,
    secondaryHref,
  }
}

function resolveCtaLink(
  link: CatalogCtaLink | SanityCtaLink | undefined,
  fallbackLabel: string,
  fallbackHref?: string
) {
  return {
    href: link?.href?.trim() || fallbackHref,
    label: link?.label?.trim() || fallbackLabel,
  }
}

function resolveHeroImage(
  heroImage: SanityImageSource | undefined,
  fallbackProduct?: CatalogProduct
) {
  if (heroImage) {
    try {
      return urlFor(heroImage).width(1600).auto("format").url()
    } catch {
      return fallbackProduct?.heroImageSrc || "/images/hero.png"
    }
  }

  return fallbackProduct?.heroImageSrc || "/images/hero.png"
}

function mapRelatedCatalogProducts(keys: string[] | undefined): ProductCarouselItem[] {
  return (keys ?? [])
    .map((key) => productCatalogByKey.get(key))
    .filter((product): product is CatalogProduct => Boolean(product))
    .filter(isCatalogProductPublic)
    .map((product) => ({
      title: product.nombre,
      href: buildProductPath(product.segmento, product.slug),
      imageSrc: product.heroImageSrc || "/images/hero.png",
    }))
}

function mapRelatedSanityProducts(
  products: SanityRelatedProduct[] | undefined
): ProductCarouselItem[] {
  return (products ?? [])
    .filter((product) => {
      const pendingCount = product.pendientesValidacion?.length ?? 0
      return Boolean(product.segmento && product.slug?.current) && pendingCount === 0
    })
    .map((product) => {
      const slug = product.slug?.current?.trim() || ""
      const segment = product.segmento as ProductSegment
      const fallbackProduct = getCatalogProduct(segment, slug)

      return {
        title:
          product.headline?.trim() ||
          product.nombre?.trim() ||
          fallbackProduct?.nombre ||
          "Producto Woranz",
        href: buildProductPath(segment, slug),
        imageSrc: resolveHeroImage(product.heroImage, fallbackProduct),
      }
    })
}

function buildSections({
  coverageItems,
  ctaDescription,
  ctaPrimary,
  ctaSecondary,
  ctaTitle,
  faqItems,
  relatedItems,
  requirements,
  steps,
  variants,
  quote,
}: {
  coverageItems: CoverageItem[]
  ctaDescription: string
  ctaPrimary: ReturnType<typeof resolveCtaLink>
  ctaSecondary: ReturnType<typeof resolveCtaLink>
  ctaTitle: string
  faqItems: FaqItem[]
  quote: {
    description?: string
    quoter: "accidentes" | "caucion" | null
    title?: string
  }
  relatedItems: ProductCarouselItem[]
  requirements?: SanityRequirements | CatalogProduct["requisitos"]
  steps: ProductStep[]
  variants: VariantItem[]
}) {
  const normalizedCoverageItems =
    coverageItems.length > 0
      ? coverageItems
      : mapCoverageItemsFromRequirements(requirements)
  const sections: ProductPageData["sections"] = []

  if (variants.length > 0) {
    sections.push({
      type: "variants",
      title: "Variantes",
      items: variants,
    })
  }

  if (requirements?.items?.length && !isCoverageLikeRequirements(requirements)) {
    sections.push({
      type: "requirements",
      title: requirements.titulo?.trim() || "Requisitos",
      description: requirements.descripcion?.trim(),
      items: requirements.items.filter(Boolean),
    })
  }

  if (quote.quoter) {
    sections.push({
      type: "quote",
      title: quote.title?.trim() || "Cotizá tu cobertura",
      description:
        quote.description?.trim() ||
        "Completá el flujo y recibí una propuesta en segundos.",
      quoter: quote.quoter,
      mobileSteps: steps.length > 0,
      steps,
      maxWidth: quote.quoter === "caucion" ? "wide" : "default",
    })
  }

  if (normalizedCoverageItems.length > 0) {
    sections.push({
      type: "coverage",
      title: "Qué cubre",
      columns: splitIntoColumns(normalizedCoverageItems),
    })
  }

  if (faqItems.length > 0) {
    sections.push({
      type: "faq",
      title: "Preguntas frecuentes",
      mobileItems: faqItems,
      desktopColumns: splitIntoColumns(faqItems),
    })
  }

  if (relatedItems.length > 0) {
    sections.push({
      type: "carousel",
      title: DEFAULT_RELATED_TITLE,
      variant: "product",
      items: relatedItems,
    })
  }

  sections.push({
    type: "cta",
    title: ctaTitle,
    description: ctaDescription,
    teamCount: "4+",
    teamLabel: "personas acompañándote del otro lado",
    primaryCta: ctaPrimary.label,
    primaryCtaHref: ctaPrimary.href,
    secondaryCta: ctaSecondary.label,
    secondaryCtaHref: ctaSecondary.href,
  })

  return sections
}

function inferQuoter(
  mode?: "contacto" | "inline-accidentes" | "inline-caucion" | "none"
) {
  if (mode === "inline-caucion") {
    return "caucion" as const
  }

  if (mode === "inline-accidentes") {
    return "accidentes" as const
  }

  return null
}

function buildCatalogProductPageData(
  product: CatalogProduct,
  settings?: SanitySettings
): ProductPageData {
  const defaultCtas = resolveDefaultCtaHrefs(settings)
  const primaryCta = resolveCtaLink(
    product.ctaPrimario,
    DEFAULT_PRIMARY_CTA,
    defaultCtas.primaryHref
  )
  const secondaryCta = resolveCtaLink(
    product.ctaSecundario,
    DEFAULT_SECONDARY_CTA,
    defaultCtas.secondaryHref
  )

  return {
    segment: product.segmento,
    slug: product.slug,
    path: buildProductPath(product.segmento, product.slug),
    metadata: {
      title: `Woranz - ${product.nombre}`,
      description: product.subtitulo || DEFAULT_DESCRIPTION,
    },
    hero: {
      badge: product.badge,
      title: product.headline,
      description: product.subtitulo,
      descriptionMobile: product.subtitulo,
      primaryCta: primaryCta.label,
      primaryCtaHref: primaryCta.href,
      secondaryCta: secondaryCta.label,
      secondaryCtaHref: secondaryCta.href,
      imageSrc: product.heroImageSrc || "/images/hero.png",
      imageAlt: product.nombre,
    },
    sections: buildSections({
      coverageItems: mapCoverageItems(product.coberturas),
      ctaDescription:
        product.ctaSubtitulo?.trim() ||
        "Te acompañamos para encontrar la cobertura correcta.",
      ctaPrimary: primaryCta,
      ctaSecondary: secondaryCta,
      ctaTitle: product.ctaTitulo?.trim() || "¿Querés que te ayudemos a elegir?",
      faqItems: mapFaqItems(product.faqs),
      relatedItems: mapRelatedCatalogProducts(product.productosRelacionados),
      requirements: product.requisitos,
      steps: mapStepItems(product.pasos),
      variants: mapVariantItems(product.variantes),
      quote: {
        title: product.cotizador?.titulo,
        description: product.cotizador?.descripcion,
        quoter: inferQuoter(product.cotizador?.modo),
      },
    }),
  }
}

function transformSanityProduct(
  product: SanityProduct,
  settings?: SanitySettings,
  fallbackProduct?: CatalogProduct
): ProductPageData | undefined {
  const slug = product.slug?.current?.trim()
  const segment = product.segmento?.trim() as ProductSegment | undefined

  if (!slug || !segment) {
    return undefined
  }

  const defaultCtas = resolveDefaultCtaHrefs(settings)
  const primaryCta = resolveCtaLink(
    product.ctaPrimario || fallbackProduct?.ctaPrimario,
    product.ctaBoton?.trim() ||
      fallbackProduct?.ctaPrimario?.label ||
      DEFAULT_PRIMARY_CTA,
    defaultCtas.primaryHref
  )
  const secondaryCta = resolveCtaLink(
    product.ctaSecundario || fallbackProduct?.ctaSecundario,
    fallbackProduct?.ctaSecundario?.label || DEFAULT_SECONDARY_CTA,
    defaultCtas.secondaryHref
  )
  const title =
    product.headline?.trim() ||
    fallbackProduct?.headline ||
    product.nombre?.trim() ||
    fallbackProduct?.nombre ||
    "Producto Woranz"
  const description =
    product.subtitulo?.trim() ||
    fallbackProduct?.subtitulo ||
    DEFAULT_DESCRIPTION

  return {
    segment,
    slug,
    path: buildProductPath(segment, slug),
    metadata: {
      title: `Woranz - ${product.nombre?.trim() || fallbackProduct?.nombre || title}`,
      description,
    },
    hero: {
      badge:
        product.badge?.trim() ||
        fallbackProduct?.badge ||
        product.nombre?.trim() ||
        "Producto",
      title,
      description,
      descriptionMobile: description,
      primaryCta: primaryCta.label,
      primaryCtaHref: primaryCta.href,
      secondaryCta: secondaryCta.label,
      secondaryCtaHref: secondaryCta.href,
      imageSrc: resolveHeroImage(product.heroImage, fallbackProduct),
      imageAlt: product.nombre?.trim() || fallbackProduct?.nombre || title,
    },
    sections: buildSections({
      coverageItems:
        mapCoverageItems(product.coberturas).length > 0
          ? mapCoverageItems(product.coberturas)
          : mapCoverageItems(fallbackProduct?.coberturas),
      ctaDescription:
        product.ctaSubtitulo?.trim() ||
        fallbackProduct?.ctaSubtitulo ||
        "Te acompañamos para encontrar la cobertura correcta y terminar la contratación sin fricción.",
      ctaPrimary: primaryCta,
      ctaSecondary: secondaryCta,
      ctaTitle:
        product.ctaTitulo?.trim() ||
        fallbackProduct?.ctaTitulo ||
        "¿Querés que te ayudemos a elegir?",
      faqItems:
        mapFaqItems(product.faqs).length > 0
          ? mapFaqItems(product.faqs)
          : mapFaqItems(fallbackProduct?.faqs),
      relatedItems:
        mapRelatedSanityProducts(product.productosRelacionados).length > 0
          ? mapRelatedSanityProducts(product.productosRelacionados)
          : mapRelatedCatalogProducts(fallbackProduct?.productosRelacionados),
      requirements: product.requisitos || fallbackProduct?.requisitos,
      steps:
        mapStepItems(product.pasos).length > 0
          ? mapStepItems(product.pasos)
          : mapStepItems(fallbackProduct?.pasos),
      variants:
        mapVariantItems(product.variantes).length > 0
          ? mapVariantItems(product.variantes)
          : mapVariantItems(fallbackProduct?.variantes),
      quote: {
        title: product.cotizador?.titulo || fallbackProduct?.cotizador?.titulo,
        description:
          product.cotizador?.descripcion || fallbackProduct?.cotizador?.descripcion,
        quoter: inferQuoter(
          product.cotizador?.modo || fallbackProduct?.cotizador?.modo
        ),
      },
    }),
  }
}

async function fetchSanityProduct(segment: ProductSegment, slug: string) {
  if (!isSanityConfigured()) {
    return undefined
  }

  try {
    return await client.fetch<SanityProduct | null>(
      productoByRouteQuery,
      { segment, segmento: segment, slug },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    )
  } catch {
    return undefined
  }
}

async function fetchSettings() {
  if (!isSanityConfigured()) {
    return undefined
  }

  try {
    return await client.fetch<SanitySettings | null>(
      settingsQuery,
      {},
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    )
  } catch {
    return undefined
  }
}

export async function getProductPageByParams(
  segment: ProductSegment,
  slug: string
) {
  const fallbackCatalogProduct = getCatalogProduct(segment, slug)
  const fallbackStaticPage = getStaticProductPageData(segment, slug)
  const [settings, sanityProduct] = await Promise.all([
    fetchSettings(),
    fetchSanityProduct(segment, slug),
  ])

  if (sanityProduct) {
    const transformed = transformSanityProduct(
      sanityProduct,
      settings || undefined,
      fallbackCatalogProduct
    )

    if (transformed) {
      return transformed
    }
  }

  if (fallbackStaticPage) {
    if (!fallbackCatalogProduct || isCatalogProductPublic(fallbackCatalogProduct)) {
      return fallbackStaticPage
    }
  }

  if (fallbackCatalogProduct && isCatalogProductPublic(fallbackCatalogProduct)) {
    return buildCatalogProductPageData(fallbackCatalogProduct, settings || undefined)
  }

  return undefined
}

export async function getAllProductPageParams() {
  const staticParams = Object.values(productPages)
    .filter((page) => {
      const catalogProduct = getCatalogProduct(page.segment, page.slug)

      return !catalogProduct || isCatalogProductPublic(catalogProduct)
    })
    .map((page) => ({
      segment: page.segment,
      slug: page.slug,
    }))

  if (!isSanityConfigured()) {
    return staticParams
  }

  try {
    const products = await client.fetch<
      Array<{ segmento?: ProductSegment; slug?: SanitySlug }>
    >(productosQuery, {}, { next: { revalidate: SANITY_REVALIDATE_SECONDS } })

    const sanityParams = products
      .map((product) => ({
        segment: product.segmento,
        slug: product.slug?.current?.trim(),
      }))
      .filter(
        (
          product
        ): product is {
          segment: ProductSegment
          slug: string
        } => Boolean(product.segment && product.slug)
      )

    return Array.from(
      new Map(
        [...publicProductCatalog, ...sanityParams].map((product) => {
          const segment = "segmento" in product ? product.segmento : product.segment
          const slug = product.slug

          return [buildProductKey(segment, slug), { segment, slug }]
        })
      ).values()
    )
  } catch {
    return staticParams
  }
}
