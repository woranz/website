import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "Blog — Woranz",
  description: "Página temporal del blog de Woranz.",
}

export default function BlogPage() {
  return (
    <PlaceholderPage
      eyebrow="Contenido"
      title="Blog"
      description="El índice editorial todavía no está definido, pero la ruta ya existe para que el footer no quede roto."
    />
  )
}
