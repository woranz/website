export const PRODUCT_SEGMENTS = ["personas", "empresas", "productores"] as const

export type ProductSegment = (typeof PRODUCT_SEGMENTS)[number]
const LEGACY_PRODUCT_PATH_PATTERN =
  /^\/(personas|empresas|productores)\/coberturas(?=\/|$)/

export function isProductSegment(value: string): value is ProductSegment {
  return PRODUCT_SEGMENTS.includes(value as ProductSegment)
}

export function buildProductKey(segment: ProductSegment, slug: string) {
  return `${segment}/${slug}`
}

export function buildProductPath(segment: ProductSegment, slug: string) {
  return `/${segment}/${slug}`
}

export function buildProductSubpath(
  segment: ProductSegment,
  slug: string,
  ...parts: string[]
) {
  const suffix = parts
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .join("/")

  return suffix ? `${buildProductPath(segment, slug)}/${suffix}` : buildProductPath(segment, slug)
}

export function normalizeInternalHref(href?: string) {
  const trimmedHref = href?.trim()

  if (!trimmedHref || !trimmedHref.startsWith("/")) {
    return trimmedHref
  }

  return trimmedHref.replace(LEGACY_PRODUCT_PATH_PATTERN, "/$1")
}
