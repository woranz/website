import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/site/placeholder-page"
import { buildPageMetadata } from "@/lib/metadata"
import { WORANZ_WHATSAPP_HREF } from "@/lib/site-links"

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto — Woranz",
  description: "Canales de contacto temporales de Woranz.",
  canonicalPath: "/contacto",
})

export default function ContactoPage() {
  return (
    <PlaceholderPage
      eyebrow="Contacto"
      title="Hablemos"
      description="Esta página queda activa como destino estable mientras definimos el layout final de contacto."
      notes={[
        "Canal más directo hoy: WhatsApp.",
        "También podemos convertirla después en formulario o hub de canales.",
      ]}
      actions={[
        { href: WORANZ_WHATSAPP_HREF, label: "Escribir por WhatsApp" },
        { href: "mailto:live@woranz.com", label: "Escribir por email", variant: "secondary" },
      ]}
    />
  )
}
