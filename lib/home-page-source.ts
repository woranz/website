import { getHomePageFallbackMetadata, transformSanityHome, type SanityHomeData } from "@/lib/page-source/home-page-transform"
import {
  getSanityRequestConfig,
  handlePageSourceError,
  isSanityConfigured,
  mapProductReferences,
  type SanityProductReference,
} from "@/lib/page-source/shared"
import type { ProductSegment } from "@/lib/product-paths"
import type { ProductGridItem, ProductPageData } from "@/lib/product-pages"
import { paginaHomeQuery, productosQuery } from "@/sanity/lib/queries"

export async function getHomePageData(
  segment: ProductSegment
): Promise<ProductPageData | null> {
  if (!isSanityConfigured()) {
    return null
  }

  try {
    const { sanityClient, fetchOptions } = await getSanityRequestConfig()

    const data = await sanityClient.fetch<SanityHomeData | null>(
      paginaHomeQuery,
      { segmento: segment },
      fetchOptions
    )

    if (!data) {
      return null
    }

    const page = transformSanityHome(data, segment)

    // For empresas, replace search list items with ALL segment products
    if (segment === "empresas") {
      const allProducts = await sanityClient.fetch<SanityProductReference[]>(
        productosQuery,
        {},
        fetchOptions
      )
      const segmentItems = mapProductReferences(
        allProducts.filter((p) => p.segmento === "empresas")
      ) as ProductGridItem[]

      if (segmentItems.length > 0) {
        for (const section of page.sections) {
          if (section.type === "product-search-list") {
            section.items = segmentItems
          }
        }
      }
    }

    return page
  } catch (error) {
    handlePageSourceError(`Failed to resolve home page source for ${segment}`, error)
  }

  return null
}

export { getHomePageFallbackMetadata }
