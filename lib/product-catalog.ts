import productCatalogSource from "@/data/product-catalog.json"
import {
  buildProductKey,
  buildProductPath,
  type ProductSegment,
} from "@/lib/product-paths"

export type CatalogCtaLink = {
  href?: string
  label: string
}

export type CatalogVariant = {
  descripcion?: string
  href?: string
  items?: string[]
  titulo: string
}

export type CatalogRequirements = {
  descripcion?: string
  items: string[]
  titulo?: string
}

export type CatalogCotizador = {
  ctaHref?: string
  ctaLabel?: string
  descripcion?: string
  modo: "contacto" | "inline-accidentes" | "inline-caucion" | "none"
  titulo?: string
}

export type CatalogProduct = {
  badge: string
  coberturas?: Array<{
    descripcion: string
    titulo: string
  }>
  cotizador?: CatalogCotizador
  ctaPrimario?: CatalogCtaLink
  ctaSecundario?: CatalogCtaLink
  ctaSubtitulo?: string
  ctaTitulo?: string
  destacado?: boolean
  faqs?: Array<{
    pregunta: string
    respuesta: string
  }>
  headline: string
  heroImageSrc?: string
  legacyPaths?: string[]
  nombre: string
  orden?: number
  pasos?: Array<{
    descripcion: string
    numero: string
    titulo: string
  }>
  pendientesValidacion?: string[]
  productosRelacionados?: string[]
  requisitos?: CatalogRequirements
  segmento: ProductSegment
  slug: string
  subtitulo: string
  variantes?: CatalogVariant[]
}

function compareCatalogProducts(a: CatalogProduct, b: CatalogProduct) {
  const featuredDelta = Number(Boolean(b.destacado)) - Number(Boolean(a.destacado))

  if (featuredDelta !== 0) {
    return featuredDelta
  }

  const orderDelta = (a.orden ?? Number.MAX_SAFE_INTEGER) - (b.orden ?? Number.MAX_SAFE_INTEGER)

  if (orderDelta !== 0) {
    return orderDelta
  }

  return a.nombre.localeCompare(b.nombre, "es")
}

const productCatalog = [...(productCatalogSource as CatalogProduct[])].sort(compareCatalogProducts)

export { productCatalog }

export function getProductCatalogKey(product: Pick<CatalogProduct, "segmento" | "slug">) {
  return buildProductKey(product.segmento, product.slug)
}

export const productCatalogByKey = new Map(
  productCatalog.map((product) => [getProductCatalogKey(product), product])
)

export function getCatalogProduct(segment: ProductSegment, slug: string) {
  return productCatalogByKey.get(buildProductKey(segment, slug))
}

export function isCatalogProductPublic(product: CatalogProduct) {
  return (product.pendientesValidacion?.length ?? 0) === 0
}

export const publicProductCatalog = productCatalog.filter(isCatalogProductPublic)

export const legacyProductRedirects = productCatalog.flatMap((product) =>
  (product.legacyPaths ?? []).map((source) => ({
    destination: buildProductPath(product.segmento, product.slug),
    permanent: true,
    source,
  }))
)
