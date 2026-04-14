import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"
import { buildPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Trabajá con Nosotros — Woranz",
  description: "Página temporal de careers de Woranz.",
  canonicalPath: "/trabaja-con-nosotros",
})

export default function CareersPage() {
  return (
    <PlaceholderPage
      eyebrow="Equipo"
      title="Trabajá con nosotros"
      description="La página de búsquedas todavía no está definida, pero ya existe como destino real para la navegación institucional."
    />
  )
}
