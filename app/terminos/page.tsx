import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"
import { buildPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Términos — Woranz",
  description: "Página temporal de términos de Woranz.",
  canonicalPath: "/terminos",
})

export default function TerminosPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Términos"
      description="La versión legal final todavía no está publicada. Dejamos esta ruta activa para sostener linking y luego reemplazamos el contenido."
    />
  )
}
