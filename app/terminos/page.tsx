import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "Términos — Woranz",
  description: "Página temporal de términos de Woranz.",
}

export default function TerminosPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Términos"
      description="La versión legal final todavía no está publicada. Dejamos esta ruta activa para sostener linking y luego reemplazamos el contenido."
    />
  )
}
