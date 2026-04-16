import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react"

import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { SUPPORT_NAVIGATION_LINKS, WORANZ_WHATSAPP_HREF } from "@/lib/site-links"
import { buildPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto — Woranz",
  description:
    "Contactá a Woranz por WhatsApp, email o teléfono. Estamos para ayudarte con tus seguros.",
  canonicalPath: "/contacto",
})

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "El canal más rápido. Respuesta en minutos.",
    detail: "+54 9 11 6006-1771",
    href: WORANZ_WHATSAPP_HREF,
    cta: "Escribinos",
    primary: true,
  },
  {
    icon: Mail,
    title: "Email",
    description: "Para consultas que necesitan más detalle.",
    detail: "live@woranz.com",
    href: "mailto:live@woranz.com",
    cta: "Enviar email",
    primary: false,
  },
  {
    icon: Phone,
    title: "Teléfono",
    description: "Atención telefónica de lunes a viernes.",
    detail: "0800-266-4240",
    href: "tel:08002664240",
    cta: "Llamar",
    primary: false,
  },
]

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        {/* Hero */}
        <section className="page-shell section-padding px-page-mobile md:px-page-wide">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="eyebrow-badge">Contacto</span>
            <h1 className="display-title">Hablemos</h1>
            <p className="section-copy mx-auto max-w-xl">
              Elegí el canal que prefieras. Estamos disponibles para ayudarte
              con cualquier consulta sobre tus seguros.
            </p>
          </div>
        </section>

        {/* Canales */}
        <section className="page-shell px-page-mobile md:px-page-wide">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {CHANNELS.map((channel) => {
              const Icon = channel.icon
              return (
                <Link
                  key={channel.title}
                  href={channel.href}
                  className="group flex flex-col gap-4 rounded-2xl bg-woranz-warm-1 px-6 py-7 transition-colors hover:bg-woranz-warm-2 md:px-7 md:py-8"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <Icon className="h-5 w-5 text-woranz-slate" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-lg font-semibold text-woranz-ink">
                      {channel.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-woranz-text">
                      {channel.description}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-woranz-slate">
                    {channel.detail}
                  </span>
                  <span
                    className={
                      channel.primary
                        ? "btn-primary mt-auto w-full px-5 py-3 text-center text-sm font-semibold"
                        : "mt-auto w-full rounded-lg border border-woranz-line bg-white px-5 py-3 text-center text-sm font-semibold text-woranz-ink transition-colors group-hover:bg-woranz-warm-1"
                    }
                  >
                    {channel.cta}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Info adicional */}
        <section className="page-shell section-padding px-page-mobile md:px-page-wide">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 md:flex-row md:gap-5">
            <div className="flex flex-1 items-start gap-4 rounded-2xl bg-woranz-warm-1 px-6 py-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <Clock className="h-4 w-4 text-woranz-slate" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-woranz-ink">
                  Horario de atención
                </span>
                <span className="text-sm text-woranz-text">
                  Lunes a viernes de 9 a 18hs
                </span>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 rounded-2xl bg-woranz-warm-1 px-6 py-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <MapPin className="h-4 w-4 text-woranz-slate" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-woranz-ink">
                  Oficina
                </span>
                <span className="text-sm text-woranz-text">
                  Buenos Aires, Argentina
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
