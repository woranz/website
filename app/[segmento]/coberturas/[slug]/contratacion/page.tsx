import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContratacionView } from "./contratacion-view"
import { SiteHeader } from "@/components/site/header"
import { getFormConfig } from "@/lib/forms/registry"
import { buildPageMetadata } from "@/lib/metadata"
import { getProductPageByParams } from "@/lib/product-page-source"
import { isProductSegment } from "@/lib/product-paths"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"

type ContratacionPageProps = {
  params: {
    segmento: string
    slug: string
  }
  searchParams: Record<string, string | undefined>
}

export async function generateMetadata({
  params,
}: ContratacionPageProps): Promise<Metadata> {
  if (!isProductSegment(params.segmento)) return {}

  const page = await getProductPageByParams(params.segmento, params.slug)
  if (!page) return {}

  return buildPageMetadata({
    title: `Contratar ${page.hero.title} — Woranz`,
    description: `Completá tus datos para contratar ${page.hero.title}.`,
    canonicalPath: `${page.path}/contratacion`,
    imageUrl: page.metadata.imageUrl,
    imageAlt: page.metadata.imageAlt || page.hero.title,
    noIndex: true,
  })
}

export default async function ContratacionPage({
  params,
  searchParams,
}: ContratacionPageProps) {
  if (!isProductSegment(params.segmento)) {
    notFound()
  }

  const page = await getProductPageByParams(params.segmento, params.slug)
  if (!page) {
    notFound()
  }

  const formConfig = getFormConfig(page.slug)

  if (!formConfig) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        <ContratacionView
          formConfig={formConfig}
          quoterConfigId={page.slug}
          searchParams={searchParams}
          productName={page.hero.title}
          returnHref={page.path}
        />
      </main>
    </div>
  )
}
