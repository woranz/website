export const PRODUCT_SEGMENTS = ["personas", "empresas", "productores"] as const

export type ProductSegment = (typeof PRODUCT_SEGMENTS)[number]

export function isProductSegment(value: string): value is ProductSegment {
  return PRODUCT_SEGMENTS.includes(value as ProductSegment)
}

export function buildProductKey(segment: ProductSegment, slug: string) {
  return `${segment}/${slug}`
}

export function buildProductPath(segment: ProductSegment, slug: string) {
  return `/${segment}/coberturas/${slug}`
}
