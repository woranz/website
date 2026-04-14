import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import {
  getHomePageData,
  getHomePageFallbackMetadata,
} from "@/lib/home-page-source"
import { buildPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePageData("empresas")

  return buildPageMetadata(page?.metadata || getHomePageFallbackMetadata("empresas"))
}

export default async function EmpresasPage() {
  const page = await getHomePageData("empresas")

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
