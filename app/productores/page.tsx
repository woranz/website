import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { getHomePageData } from "@/lib/home-page-source"

export const metadata: Metadata = {
  title: "Woranz — Productores",
  description:
    "Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.",
}

export default async function ProductoresPage() {
  const page = await getHomePageData("productores")

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
