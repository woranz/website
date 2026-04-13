import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContactForm } from "@/components/ContactForm"
import { SiteHeader } from "@/components/site/header"
import { getFormConfig } from "@/lib/forms/registry"
import { getProductPageByParams } from "@/lib/product-page-source"
import { isProductSegment } from "@/lib/product-paths"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"

type ContactoPageProps = {
  params: {
    segmento: string
    slug: string
  }
  searchParams: Record<string, string | undefined>
}

export async function generateMetadata({
  params,
}: ContactoPageProps): Promise<Metadata> {
  if (!isProductSegment(params.segmento)) return {}

  const page = await getProductPageByParams(params.segmento, params.slug)
  if (!page) return {}

  const config = getFormConfig(page.slug)
  if (!config) return {}

  return {
    title: `${config.titulo} — Woranz`,
    description: config.descripcionExito ?? `Completá el formulario de ${page.hero.title} y te contactamos.`,
  }
}

export default async function ContactoPage({
  params,
  searchParams,
}: ContactoPageProps) {
  if (!isProductSegment(params.segmento)) {
    notFound()
  }

  const page = await getProductPageByParams(params.segmento, params.slug)
  if (!page) {
    notFound()
  }

  const config = getFormConfig(page.slug)
  if (!config) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        <ContactForm
          config={config}
          productName={page.hero.title}
          returnHref={page.path}
          searchParams={searchParams}
        />
      </main>
    </div>
  )
}
