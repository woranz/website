import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import {
  getHomePageData,
  getHomePageFallbackMetadata,
} from "@/lib/home-page-source"
import { buildPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePageData("productores")

  return buildPageMetadata(
    page?.metadata || getHomePageFallbackMetadata("productores")
  )
}

export default async function ProductoresPage() {
  const page = await getHomePageData("productores")

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
