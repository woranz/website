import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { buildPageMetadata } from "@/lib/metadata"
import { getAllProductPageParams, getProductPageByParams } from "@/lib/product-page-source"
import { isProductSegment } from "@/lib/product-paths"

type ProductPageRouteProps = {
  params: {
    segmento: string
    slug: string
  }
}

export const dynamicParams = true

export async function generateStaticParams() {
  const params = await getAllProductPageParams()

  return params.map((param: { segment: string; slug: string }) => ({
    segmento: param.segment,
    slug: param.slug,
  }))
}

export async function generateMetadata({
  params,
}: ProductPageRouteProps): Promise<Metadata> {
  if (!isProductSegment(params.segmento)) {
    return {}
  }

  const page = await getProductPageByParams(params.segmento, params.slug)

  if (!page) {
    return {}
  }

  return buildPageMetadata(page.metadata)
}

export default async function ProductPageRoute({ params }: ProductPageRouteProps) {
  if (!isProductSegment(params.segmento)) {
    notFound()
  }

  const page = await getProductPageByParams(params.segmento, params.slug)

  if (!page) {
    notFound()
  }

  return <ProductPageTemplate page={page} />
}
