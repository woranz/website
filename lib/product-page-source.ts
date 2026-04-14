import {
  applyProductPageOverrides,
  type SanityProduct,
  type SanitySettings,
  transformSanityProduct,
} from "@/lib/page-source/product-page-transform"
import { CTA_DEFAULTS } from "@/lib/page-source/fallbacks"
import {
  buildWhatsappCtaHref,
  cleanStegaString,
  getSanityRequestConfig,
  handlePageSourceError,
  isSanityConfigured,
  SANITY_REVALIDATE_SECONDS,
  type SanitySlug,
} from "@/lib/page-source/shared"
import { type ProductSegment } from "@/lib/product-paths"
import {
  productoByRouteQuery,
  productosQuery,
  settingsQuery,
} from "@/sanity/lib/queries"
import { client } from "@/sanity/lib/client"

async function fetchSanityProduct(segment: ProductSegment, slug: string) {
  if (!isSanityConfigured()) {
    return undefined
  }

  try {
    const { sanityClient, fetchOptions } = await getSanityRequestConfig()

    return await sanityClient.fetch<SanityProduct | null>(
      productoByRouteQuery,
      { segmento: segment, slug },
      fetchOptions
    )
  } catch (error) {
    return handlePageSourceError(
      `Failed to fetch product source for ${segment}/${slug}`,
      error
    )
  }
}

async function fetchSettings() {
  if (!isSanityConfigured()) {
    return undefined
  }

  try {
    const { sanityClient, fetchOptions } = await getSanityRequestConfig()

    return await sanityClient.fetch<SanitySettings | null>(
      settingsQuery,
      {},
      fetchOptions
    )
  } catch (error) {
    return handlePageSourceError("Failed to fetch shared settings", error)
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
      return applyProductPageOverrides(transformed)
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
