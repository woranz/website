import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "FAQ — Woranz",
  description: "Página temporal de preguntas frecuentes de Woranz.",
}

export default function FaqPage() {
  return (
    <PlaceholderPage
      eyebrow="Ayuda"
      title="Preguntas frecuentes"
      description="La versión consolidada de FAQs todavía no está compuesta, pero la ruta ya existe para absorber navegación y footer."
    />
  )
}
