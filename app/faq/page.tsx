import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"
import { buildPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ — Woranz",
  description: "Página temporal de preguntas frecuentes de Woranz.",
  canonicalPath: "/faq",
})

export default function FaqPage() {
  return (
    <PlaceholderPage
      eyebrow="Ayuda"
      title="Preguntas frecuentes"
      description="La versión consolidada de FAQs todavía no está compuesta, pero la ruta ya existe para absorber navegación y footer."
    />
  )
}
