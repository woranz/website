import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "Nosotros — Woranz",
  description: "Página institucional temporal de Woranz.",
}

export default function NosotrosPage() {
  return (
    <PlaceholderPage
      eyebrow="Woranz"
      title="Nosotros"
      description="Estamos armando la versión editorial final de esta página. Por ahora ya funciona como destino real para sostener la navegación institucional."
      notes={[
        "Va a concentrar propuesta, historia y forma de trabajar.",
        "La navegación ya puede apuntar acá sin usar placeholders.",
      ]}
    />
  )
}
