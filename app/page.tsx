import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { getHomePageData } from "@/lib/home-page-source"

export const metadata: Metadata = {
  title: "Woranz — Seguros para Personas",
  description:
    "Cuando pasa algo, necesitás que alguien responda. Seguros 100% online con personas reales del otro lado.",
}

export default async function HomePage() {
  const page = await getHomePageData("personas")

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
