import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "Privacidad — Woranz",
  description: "Página temporal de privacidad de Woranz.",
}

export default function PrivacidadPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Privacidad"
      description="La política final todavía no está maquetada. Esta página queda creada para sostener rutas y navegación desde hoy."
    />
  )
}
