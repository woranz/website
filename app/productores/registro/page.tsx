import type { Metadata } from "next"

import { ContactForm } from "@/components/ContactForm"
import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { getFormConfig } from "@/lib/forms/registry"
import { buildPageMetadata } from "@/lib/metadata"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"

const PRODUCER_SIGNUP_FORM_ID = "productores-registro"

export const metadata: Metadata = buildPageMetadata({
  title: "Alta de Productores — Woranz",
  description:
    "Dejanos tus datos y te mostramos cómo empezar a operar con Woranz.",
  canonicalPath: "/productores/registro",
  imageUrl: "/images/features/productores-1-gestion.webp",
  imageAlt: "Alta de productores en Woranz",
  noIndex: true,
})

export default function ProductoresRegistroPage() {
  const config = getFormConfig(PRODUCER_SIGNUP_FORM_ID)

  if (!config) {
    throw new Error(`Formulario "${PRODUCER_SIGNUP_FORM_ID}" no encontrado.`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />

      <main className="flex-1">
        <ContactForm
          config={config}
          returnHref="/productores"
          returnLabel="Volver a productores"
        />
      </main>

      <SiteFooter />
    </div>
  )
}
