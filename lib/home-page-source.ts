import { getHomePageFallbackMetadata, transformSanityHome, type SanityHomeData } from "@/lib/page-source/home-page-transform"
import {
  getSanityRequestConfig,
  handlePageSourceError,
  isSanityConfigured,
} from "@/lib/page-source/shared"
import type { ProductSegment } from "@/lib/product-paths"
import type { ProductPageData } from "@/lib/product-pages"
import { paginaHomeQuery } from "@/sanity/lib/queries"

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

    return transformSanityHome(data, segment)
  } catch (error) {
    handlePageSourceError(`Failed to resolve home page source for ${segment}`, error)
  }

  return null
}

export { getHomePageFallbackMetadata }
