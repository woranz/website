import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import {
  buildProductPath,
  type ProductSegment,
} from "@/lib/product-paths"
import {
  type CoverageItem,
  type FaqItem,
  type FeatureCarouselItem,
  type PackageCarouselItem,
  type ProductCarouselItem,
  type ProductGridItem,
  type ProductPageData,
  type ProductPageSection,
  type ProductStep,
  type VariantItem,
} from "@/lib/product-pages"
import { draftMode } from "next/headers"
import { client, previewClient, urlFor } from "@/sanity/lib/client"
import { stegaClean } from "next-sanity"
import {
  productoByRouteQuery,
  productosQuery,
  settingsQuery,
} from "@/sanity/lib/queries"

type SanitySlug = {
  current?: string
}

type SanityCtaLink = {
  href?: string
  label?: string
}

type SanityRelatedProduct = {
  cardImage?: SanityImageSource
  heroImage?: SanityImageSource
  headline?: string
  nombre?: string
  pendientesValidacion?: string[]
  segmento?: ProductSegment
  slug?: SanitySlug
  subtitulo?: string
}

type SanitySectionBlock = {
  _type: string
  // seccionCotizador
  modo?: "contacto" | "inline-accidentes" | "inline-caucion"
  maxWidth?: "default" | "wide"
  mostrarPasosMobile?: boolean
  pasos?: Array<{ descripcion?: string; numero?: string; titulo?: string }>
  // seccionCobertura, seccionFaq, seccionVariantes
  items?: Array<{
    _type?: string
    descripcion?: string
    descripcionMobile?: string
    cta?: "button" | "link"
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
  // seccionExplicacion
  cuerpo?: string
  cuerpoMobile?: string
  // seccionRequisitos
  descripcion?: string
  // seccionCarouselProductos, seccionGridProductos
  productos?: SanityRelatedProduct[]
  // seccionCta
  tituloMobile?: string
  teamCount?: string
  teamLabel?: string
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  // shared
  titulo?: string
}

type SanityProduct = {
  badge?: string
  ctaPrimario?: SanityCtaLink
  ctaSecundario?: SanityCtaLink
  headline?: string
  heroImage?: SanityImageSource
  nombre?: string
  pendientesValidacion?: string[]
  secciones?: SanitySectionBlock[]
  segmento?: ProductSegment
  slug?: SanitySlug
  subtitulo?: string
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
const DEFAULT_SECONDARY_CTA = "Hablá con nosotros →"

export const CTA_DEFAULTS: Record<ProductSegment, {
  title: string
  description: string
  teamCount: string
  teamLabel: string
  primaryCta: string
  secondaryCta: string
}> = {
  personas: {
    title: "¿Querés saber más?",
    description: "Nuestro equipo te ayuda a elegir la cobertura justa para vos.",
    teamCount: "+20",
    teamLabel: "personas cuidando de vos",
    primaryCta: "Cotizá ahora",
    secondaryCta: "Hablá con nosotros →",
  },
  empresas: {
    title: "¿Necesitás proteger tu empresa?",
    description: "Te ayudamos a encontrar la cobertura que tu negocio necesita.",
    teamCount: "+20",
    teamLabel: "asesores listos para ayudarte",
    primaryCta: "Pedí una cotización",
    secondaryCta: "Hablá con nosotros →",
  },
  productores: {
    title: "¿Querés operar con Woranz?",
    description: "Sumate a nuestra red y empezá a cotizar en minutos.",
    teamCount: "+20",
    teamLabel: "personas del otro lado",
    primaryCta: "Empezá ahora",
    secondaryCta: "Hablá con nosotros →",
  },
}
const SANITY_REVALIDATE_SECONDS = 60

function cleanStegaString<T extends string>(value: T | undefined) {
  if (!value) {
    return undefined
  }

  return stegaClean(value).trim() as T
}

function isSanityConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET
  )
}

const WHATSAPP_PHONE = "5491139490433"
const WHATSAPP_BASE_URL = "https://api.whatsapp.com/send/"
const SITE_BASE_URL = "https://www.woranz.com"

function buildWhatsappHref(phone?: string) {
  if (!phone) {
    return undefined
  }

  const digits = phone.replace(/\D/g, "")

  return digits ? `https://wa.me/${digits}` : undefined
}

export function buildWhatsappCtaHref(pagePath: string) {
  const pageUrl = `${SITE_BASE_URL}${pagePath}`
  const text = `Hola, estoy visitando este link ${pageUrl} podrías asistirme con el seguro?`
  const params = new URLSearchParams({
    phone: WHATSAPP_PHONE,
    text,
    type: "phone_number",
    app_absent: "0",
  })
  return `${WHATSAPP_BASE_URL}?${params.toString()}`
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
  items: Array<{ titulo?: string; descripcion?: string }> | null | undefined = []
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
      answer: item?.respuesta?.trim() || "Estamos preparando esta respuesta.",
    }))
}

function mapStepItems(
  items: Array<{ numero?: string; titulo?: string; descripcion?: string }> | null | undefined = []
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
  items: Array<{ titulo?: string; descripcion?: string; href?: string; items?: string[] }> | null | undefined = []
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
  link: SanityCtaLink | undefined,
  fallbackLabel: string,
  fallbackHref?: string
) {
  return {
    href: link?.href?.trim() || fallbackHref,
    label: link?.label?.trim() || fallbackLabel,
  }
}

function resolveHeroImage(heroImage: SanityImageSource | undefined) {
  if (heroImage) {
    try {
      return urlFor(heroImage).width(1600).auto("format").url()
    } catch {
      return "/images/hero.png"
    }
  }

  return "/images/hero.png"
}

function resolveSanityImageUrl(image: SanityImageSource | undefined) {
  if (image) {
    try {
      return urlFor(image).width(800).auto("format").url()
    } catch {
      return "/images/hero.png"
    }
  }

  return "/images/hero.png"
}

function inferQuoter(
  mode?: "contacto" | "inline-accidentes" | "inline-caucion"
) {
  const cleanedMode = cleanStegaString(mode)

  if (cleanedMode === "inline-caucion") {
    return "caucion" as const
  }

  if (cleanedMode === "inline-accidentes") {
    return "accidentes" as const
  }

  return null
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

      return {
        title:
          product.nombre?.trim() ||
          product.headline?.trim() ||
          "Producto Woranz",
        href: buildProductPath(segment, slug),
        imageSrc: resolveHeroImage(product.cardImage ?? product.heroImage),
      }
    })
}

function mapProductGridItems(
  products: SanityRelatedProduct[] | undefined
): ProductGridItem[] {
  return (products ?? [])
    .filter((product) => {
      const pendingCount = product.pendientesValidacion?.length ?? 0
      return Boolean(product.segmento && product.slug?.current) && pendingCount === 0
    })
    .map((product) => {
      const slug = product.slug?.current?.trim() || ""
      const segment = product.segmento as ProductSegment

      return {
        title:
          product.nombre?.trim() ||
          product.headline?.trim() ||
          "Producto Woranz",
        href: buildProductPath(segment, slug),
        imageSrc: resolveHeroImage(product.cardImage ?? product.heroImage),
      }
    })
}

function mapRequirementItems(
  items: SanitySectionBlock["items"] | string[] | undefined
) {
  return (items ?? [])
    .map((item) => (typeof item === "string" ? item.trim() : item?.titulo?.trim() || ""))
    .filter(Boolean)
}

function transformSectionBlock(
  block: SanitySectionBlock,
  settings: SanitySettings | undefined,
  segment: ProductSegment,
  pagePath: string
): ProductPageSection | null {
  const defaultCtas = resolveDefaultCtaHrefs(settings)
  const ctaDefaults = CTA_DEFAULTS[segment]

  switch (block._type) {
    case "seccionCotizador": {
      const quoter = inferQuoter(block.modo)
      if (!quoter) return null
      return {
        type: "quote",
        title: block.titulo?.trim() || "Cotizá tu cobertura",
        description: block.descripcion?.trim() || "Completá el flujo y recibí una propuesta en segundos.",
        quoter,
        maxWidth: cleanStegaString(block.maxWidth) === "wide" ? "wide" : "default",
        mobileSteps: block.mostrarPasosMobile ?? false,
        steps: mapStepItems(block.pasos),
      }
    }

    case "seccionExplicacion": {
      if (!block.cuerpo?.trim()) return null
      return {
        type: "explanation",
        title: block.titulo?.trim() || "Qué es",
        body: block.cuerpo.trim(),
        bodyMobile: block.cuerpoMobile?.trim(),
      }
    }

    case "seccionCobertura": {
      const items = mapCoverageItems(block.items)
      if (items.length === 0) return null
      return {
        type: "coverage",
        title: block.titulo?.trim() || "Qué cubre",
        columns: splitIntoColumns(items),
      }
    }

    case "seccionFaq": {
      const faqItems = mapFaqItems(block.items)
      if (faqItems.length === 0) return null
      return {
        type: "faq",
        title: block.titulo?.trim() || "Preguntas frecuentes",
        mobileItems: faqItems,
        desktopColumns: splitIntoColumns(faqItems),
      }
    }

    case "seccionVariantes": {
      const variants = mapVariantItems(block.items)
      if (variants.length === 0) return null
      return {
        type: "variants",
        title: block.titulo?.trim() || "Variantes",
        items: variants,
      }
    }

    case "seccionRequisitos": {
      const reqItems = mapRequirementItems(block.items)
      if (reqItems.length === 0) return null
      return {
        type: "requirements",
        title: block.titulo?.trim() || "Requisitos",
        description: block.descripcion?.trim(),
        items: reqItems,
      }
    }

    case "seccionPasos": {
      const steps = mapStepItems(block.pasos)
      if (steps.length === 0) return null
      return {
        type: "steps",
        steps,
      }
    }

    case "seccionCarouselProductos": {
      const items = mapRelatedSanityProducts(block.productos)
      if (items.length === 0) return null
      return {
        type: "carousel",
        variant: "product",
        title: block.titulo?.trim() || "Más opciones para vos",
        items,
      }
    }

    case "seccionCarouselFeatures": {
      const items: FeatureCarouselItem[] = (block.items ?? [])
        .filter((i) => i.imagen)
        .map((i) => ({
          imageSrc: resolveSanityImageUrl(i.imagen),
          text: i.texto?.trim(),
          textMobile: i.textoMobile?.trim(),
        }))
      if (items.length === 0) return null
      return {
        type: "carousel",
        variant: "feature",
        title: block.titulo?.trim() || "Features",
        items,
      }
    }

    case "seccionCarouselPaquetes": {
      const items: PackageCarouselItem[] = (block.items ?? [])
        .filter((i) => i.titulo)
        .map((i) => ({
          icon: (cleanStegaString(i.icono) as PackageCarouselItem["icon"]) || "user",
          title: i.titulo?.trim() || "Paquete",
          description: i.descripcion?.trim() || "",
          descriptionMobile: i.descripcionMobile?.trim(),
          cta: (cleanStegaString(i.cta) as PackageCarouselItem["cta"]) || "link",
        }))
      if (items.length === 0) return null
      return {
        type: "carousel",
        variant: "package",
        title: block.titulo?.trim() || "Paquetes",
        items,
      }
    }

    case "seccionGridProductos": {
      const items = mapProductGridItems(block.productos)
      if (items.length === 0) return null
      return {
        type: "product-grid",
        title: block.titulo?.trim() || "Productos",
        items,
      }
    }

    case "seccionCta": {
      const whatsappHref = buildWhatsappCtaHref(pagePath)
      const primaryCta = resolveCtaLink(
        block.ctaPrimario,
        ctaDefaults.primaryCta,
        defaultCtas.primaryHref
      )
      const secondaryCta = resolveCtaLink(
        block.ctaSecundario,
        ctaDefaults.secondaryCta,
        defaultCtas.secondaryHref || whatsappHref
      )
      return {
        type: "cta",
        title: block.titulo?.trim() || ctaDefaults.title,
        titleMobile: block.tituloMobile?.trim(),
        description: block.descripcion?.trim() || ctaDefaults.description,
        teamCount: block.teamCount?.trim() || ctaDefaults.teamCount,
        teamLabel: block.teamLabel?.trim() || ctaDefaults.teamLabel,
        primaryCta: primaryCta.label,
        primaryCtaHref: primaryCta.href,
        secondaryCta: secondaryCta.label,
        secondaryCtaHref: secondaryCta.href,
      }
    }

    default:
      return null
  }
}

function transformSanityProduct(
  product: SanityProduct,
  settings?: SanitySettings
): ProductPageData | undefined {
  const slug = product.slug?.current?.trim()
  const segment = product.segmento?.trim() as ProductSegment | undefined

  if (!slug || !segment) {
    return undefined
  }

  const pagePath = buildProductPath(segment, slug)
  const sections = (product.secciones ?? [])
    .map((block) => transformSectionBlock(block, settings, segment, pagePath))
    .filter((s): s is ProductPageSection => s !== null)

  // Ensure the quoter section always appears first
  const quoteIndex = sections.findIndex((s) => s.type === "quote")
  if (quoteIndex > 0) {
    const [quoteSection] = sections.splice(quoteIndex, 1)
    sections.unshift(quoteSection)
  }

  if (sections.length === 0) {
    return undefined
  }

  const defaultCtas = resolveDefaultCtaHrefs(settings)
  const whatsappHref = buildWhatsappCtaHref(pagePath)
  const ctaDefaults = CTA_DEFAULTS[segment]
  const primaryCta = resolveCtaLink(
    product.ctaPrimario,
    ctaDefaults.primaryCta,
    defaultCtas.primaryHref
  )
  const secondaryCta = resolveCtaLink(
    product.ctaSecundario,
    ctaDefaults.secondaryCta,
    defaultCtas.secondaryHref || whatsappHref
  )
  const title =
    product.headline?.trim() ||
    product.nombre?.trim() ||
    "Producto Woranz"
  const description =
    product.subtitulo?.trim() ||
    DEFAULT_DESCRIPTION

  return {
    segment,
    slug,
    path: pagePath,
    metadata: {
      title: `Woranz - ${product.nombre?.trim() || title}`,
      description,
    },
    hero: {
      badge:
        product.badge?.trim() ||
        product.nombre?.trim() ||
        "Producto",
      title,
      description,
      descriptionMobile: description,
      primaryCta: primaryCta.label,
      primaryCtaHref: primaryCta.href,
      secondaryCta: secondaryCta.label,
      secondaryCtaHref: secondaryCta.href,
      imageSrc: resolveHeroImage(product.heroImage),
      imageAlt: product.nombre?.trim() || title,
    },
    sections,
  }
}

async function fetchSanityProduct(segment: ProductSegment, slug: string) {
  if (!isSanityConfigured()) {
    return undefined
  }

  try {
    const dm = await draftMode()
    const sanityClient = dm.isEnabled ? previewClient : client

    return await sanityClient.fetch<SanityProduct | null>(
      productoByRouteQuery,
      { segment, segmento: segment, slug },
      dm.isEnabled
        ? { perspective: "previewDrafts" }
        : { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
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
    const dm = await draftMode()
    const sanityClient = dm.isEnabled ? previewClient : client

    return await sanityClient.fetch<SanitySettings | null>(
      settingsQuery,
      {},
      dm.isEnabled
        ? { perspective: "previewDrafts" }
        : { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    )
  } catch {
    return undefined
  }
}

export async function getProductPageByParams(
  segment: ProductSegment,
  slug: string
) {
  const [settings, sanityProduct] = await Promise.all([
    fetchSettings(),
    fetchSanityProduct(segment, slug),
  ])

  if (sanityProduct) {
    const transformed = transformSanityProduct(
      sanityProduct,
      settings || undefined
    )

    if (transformed) {
      return transformed
    }
  }

  return undefined
}

export async function getAllProductPageParams() {
  if (!isSanityConfigured()) {
    return []
  }

  try {
    const products = await client.fetch<
      Array<{ segmento?: ProductSegment; slug?: SanitySlug }>
    >(productosQuery, {}, { next: { revalidate: SANITY_REVALIDATE_SECONDS } })

    return products
      .map((product) => ({
        segment: product.segmento?.replace(/[\u200B-\u200D\uFEFF\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F]/g, "").trim() as ProductSegment | undefined,
        slug: product.slug?.current?.replace(/[\u200B-\u200D\uFEFF\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F]/g, "").trim(),
      }))
      .filter(
        (
          product
        ): product is {
          segment: ProductSegment
          slug: string
        } => Boolean(product.segment && product.slug)
      )
  } catch {
    return []
  }
}
