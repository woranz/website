import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { draftMode } from "next/headers"
import { stegaClean } from "next-sanity"

import type { ProductSegment } from "@/lib/product-paths"
import { buildProductPath } from "@/lib/product-paths"
import {
  WORANZ_SITE_URL,
  WORANZ_WHATSAPP_HREF,
  WORANZ_WHATSAPP_NUMBER,
} from "@/lib/site-config"
import { client, previewClient, urlFor } from "@/sanity/lib/client"

export type SanitySlug = {
  current?: string
}

export type SanityCtaLink = {
  href?: string
  label?: string
}

export type SanitySeo = {
  description?: string
  image?: SanityImageSource
  title?: string
}

export type SanityProductReference = {
  cardImage?: SanityImageSource
  heroImage?: SanityImageSource
  headline?: string
  nombre?: string
  pendientesValidacion?: string[]
  segmento?: ProductSegment
  slug?: SanitySlug
  subtitulo?: string
}

export type PageSourceContext = {
  documentType: "home" | "product"
  failOnMissingOwnedContent: boolean
  identifier: string
  path: string
}

export const SANITY_REVALIDATE_SECONDS = 60

export function createPageSourceContext(
  documentType: PageSourceContext["documentType"],
  identifier: string,
  path: string,
  failOnMissingOwnedContent = process.env.NODE_ENV === "development"
): PageSourceContext {
  return {
    documentType,
    identifier,
    path,
    failOnMissingOwnedContent,
  }
}

function useFallbackWithContext<T>(
  context: PageSourceContext,
  field: string,
  fallback: T,
  reason?: string
) {
  const detail = reason ? ` (${reason})` : ""
  const message = `[page-source] Missing ${field} for ${context.documentType}:${context.identifier}${detail}.`

  if (context.failOnMissingOwnedContent) {
    throw new Error(message)
  }

  return fallback
}

export function resolveOwnedString({
  context,
  fallback,
  field,
  value,
}: {
  context: PageSourceContext
  fallback: string
  field: string
  value?: string
}) {
  const cleaned = value?.trim()

  if (cleaned) {
    return cleaned
  }

  return useFallbackWithContext(context, field, fallback, "fallback used")
}

export function resolveSanityImage(
  source: SanityImageSource | undefined,
  fallback: string,
  width = 1600
) {
  if (!source) {
    return fallback
  }

  try {
    return urlFor(source).width(width).auto("format").url()
  } catch {
    return fallback
  }
}

export function resolveOwnedImage({
  context,
  fallback,
  field,
  source,
  width = 1600,
}: {
  context: PageSourceContext
  fallback: string
  field: string
  source?: SanityImageSource
  width?: number
}) {
  if (!source) {
    return useFallbackWithContext(context, field, fallback, "missing asset")
  }

  try {
    return urlFor(source).width(width).auto("format").url()
  } catch {
    return useFallbackWithContext(context, field, fallback, "invalid asset")
  }
}

export function splitIntoColumns<T>(items: T[]) {
  if (items.length === 0) {
    return []
  }

  const midpoint = Math.ceil(items.length / 2)

  return [items.slice(0, midpoint), items.slice(midpoint)].filter(
    (column) => column.length > 0
  )
}

export function isSanityConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET
  )
}

export async function getSanityRequestConfig() {
  const dm = await draftMode()

  return {
    sanityClient: dm.isEnabled ? previewClient : client,
    fetchOptions: dm.isEnabled
      ? ({ perspective: "previewDrafts" } as const)
      : ({ next: { revalidate: SANITY_REVALIDATE_SECONDS } } as const),
  }
}

export function cleanStegaString<T extends string>(value: T | undefined) {
  if (!value) {
    return undefined
  }

  return stegaClean(value).trim() as T
}

export function handlePageSourceError(scope: string, error: unknown) {
  const fallbackError =
    error instanceof Error ? error : new Error(`[page-source] ${scope}`)

  if (process.env.NODE_ENV === "development") {
    throw fallbackError
  }

  console.error(`[page-source] ${scope}`, error)

  return undefined
}

export function buildWhatsappHref(phone?: string) {
  const digits = (phone || WORANZ_WHATSAPP_NUMBER).replace(/\D/g, "")

  return digits ? `https://wa.me/${digits}` : WORANZ_WHATSAPP_HREF
}

export function buildWhatsappCtaHref(pagePath: string, phone = WORANZ_WHATSAPP_NUMBER) {
  const pageUrl = `${WORANZ_SITE_URL}${pagePath}`
  const digits = phone.replace(/\D/g, "")
  const text = `Hola, estoy visitando este link ${pageUrl} podrías asistirme con el seguro?`
  const params = new URLSearchParams({
    phone: digits,
    text,
    type: "phone_number",
    app_absent: "0",
  })

  return `https://api.whatsapp.com/send/?${params.toString()}`
}

function mapProductReference(
  product: SanityProductReference,
  fallbackImage = "/images/hero.png"
) {
  const slug = product.slug?.current?.trim()
  const segment = product.segmento

  if (!slug || !segment) {
    return null
  }

  if ((product.pendientesValidacion?.length ?? 0) > 0) {
    return null
  }

  return {
    title: product.nombre?.trim() || product.headline?.trim() || "Producto Woranz",
    subtitle: product.subtitulo?.trim(),
    href: buildProductPath(segment, slug),
    imageSrc: resolveSanityImage(
      product.cardImage ?? product.heroImage,
      fallbackImage,
      1600
    ),
  }
}

export function mapProductReferences(
  products: SanityProductReference[] | undefined,
  fallbackImage = "/images/hero.png"
): Array<{ href?: string; imageSrc: string; subtitle?: string; title: string }> {
  const items: Array<{ href?: string; imageSrc: string; subtitle?: string; title: string }> = []

  for (const product of products ?? []) {
    const mapped = mapProductReference(product, fallbackImage)

    if (mapped) {
      items.push(mapped)
    }
  }

  return items
}
