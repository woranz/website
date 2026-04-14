import { client } from "@/sanity/lib/client"
import { productoByRouteQuery, productosQuery, settingsQuery } from "@/sanity/lib/queries"
import { buildProductPath, type ProductSegment } from "@/lib/product-paths"
import {
  SANITY_REVALIDATE_SECONDS,
  createPageSourceContext,
  getSanityRequestConfig,
  handlePageSourceError,
  isSanityConfigured,
  type SanitySlug,
} from "@/lib/page-source/shared"
import {
  applyProductPageOverrides,
  transformSanityProduct,
  type SanityProduct,
  type SanitySettings,
} from "@/lib/page-source/product-page-transform"

export async function getProductPageByParams(
  segment: ProductSegment,
  slug: string
) {
  if (!isSanityConfigured()) {
    return undefined
  }

  try {
    const { sanityClient, fetchOptions } = await getSanityRequestConfig()

    const [product, settings] = await Promise.all([
      sanityClient.fetch<SanityProduct | null>(
        productoByRouteQuery,
        { segment, segmento: segment, slug },
        fetchOptions
      ),
      sanityClient.fetch<SanitySettings | null>(
        settingsQuery,
        {},
        fetchOptions
      ),
    ])

    if (!product) {
      return undefined
    }

    const page = transformSanityProduct(
      product,
      settings || undefined,
      createPageSourceContext(
        "product",
        `${segment}/${slug}`,
        buildProductPath(segment, slug)
      )
    )

    return page ? applyProductPageOverrides(page) : undefined
  } catch (error) {
    return handlePageSourceError(
      `Failed to resolve product page source for ${segment}/${slug}`,
      error
    )
  }
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
        segment:
          product.segmento
            ?.replace(
              /[\u200B-\u200D\uFEFF\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F]/g,
              ""
            )
            .trim() as ProductSegment | undefined,
        slug: product.slug?.current
          ?.replace(
            /[\u200B-\u200D\uFEFF\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F]/g,
            ""
          )
          .trim(),
      }))
      .filter(
        (
          product
        ): product is {
          segment: ProductSegment
          slug: string
        } => Boolean(product.segment && product.slug)
      )
  } catch (error) {
    handlePageSourceError("Failed to resolve product page params", error)
    return []
  }
}
