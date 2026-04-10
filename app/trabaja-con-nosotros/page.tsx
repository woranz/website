import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "Trabajá con Nosotros — Woranz",
  description: "Página temporal de careers de Woranz.",
}

export default function CareersPage() {
  return (
    <PlaceholderPage
      eyebrow="Equipo"
      title="Trabajá con nosotros"
      description="La página de búsquedas todavía no está definida, pero ya existe como destino real para la navegación institucional."
    />
  )
}
