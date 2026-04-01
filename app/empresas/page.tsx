import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { getHomePageData } from "@/lib/home-page-source"

export const metadata: Metadata = {
  title: "Woranz — Seguros para Empresas",
  description:
    "Tu operación no se puede frenar. Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.",
}

export default async function EmpresasPage() {
  const page = await getHomePageData("empresas")

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
