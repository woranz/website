import type { Metadata } from "next"

import { APCotizacionForm } from "@/components/APCotizacionForm"
import { SiteHeader, type SiteNavLink } from "@/components/site/header"

export const metadata: Metadata = {
  title: "Cotización Accidentes Personales — Woranz",
  description:
    "Cotizá tu seguro de accidentes personales. Elegí tu plan, completá tus datos y pagá online.",
}

const SITE_NAVIGATION: SiteNavLink[] = [
  { href: "#", label: "Nosotros" },
  { href: "#", label: "Contacto" },
]

export default async function CotizacionAPPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams

  const quoter = {
    actividad: params.actividad ?? "",
    desde: params.desde ?? new Date().toISOString().split("T")[0],
    hasta: params.hasta ?? "",
    cantidad: Number.parseInt(params.cantidad ?? "1", 10) || 1,
    provincia: params.provincia && params.provincia !== "undefined" ? params.provincia : "1",
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader links={SITE_NAVIGATION} />
      <main className="flex-1">
        <APCotizacionForm quoter={quoter} />
      </main>
    </div>
  )
}
