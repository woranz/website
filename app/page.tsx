import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import {
  getHomePageData,
  getHomePageFallbackMetadata,
} from "@/lib/home-page-source"
import { buildPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePageData("personas")

  return buildPageMetadata(page?.metadata || getHomePageFallbackMetadata("personas"))
}

export default async function HomePage() {
  const page = await getHomePageData("personas")

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
