import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"

export const metadata: Metadata = {
  title: "Centro de Ayuda — Woranz",
  description: "Página temporal de soporte de Woranz.",
}

export default function HelpCenterPage() {
  return (
    <PlaceholderPage
      eyebrow="Soporte"
      title="Centro de ayuda"
      description="Acá va a vivir la base de ayuda final. Por ahora dejamos una ruta estable para soporte y navegación."
      actions={[
        { href: "/contacto", label: "Ir a contacto" },
        { href: "/faq", label: "Ver preguntas frecuentes", variant: "secondary" },
      ]}
    />
  )
}
