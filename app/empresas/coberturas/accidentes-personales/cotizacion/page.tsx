import type { Metadata } from "next"

import { APCotizacionForm } from "@/components/APCotizacionForm"
import { SiteHeader } from "@/components/site/header"
import { buildPageMetadata } from "@/lib/metadata"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"

export const metadata: Metadata = buildPageMetadata({
  title: "Cotización Accidentes Personales — Woranz",
  description:
    "Cotizá tu seguro de accidentes personales para tu empresa. Elegí tu plan, completá tus datos y pagá online.",
  canonicalPath: "/empresas/coberturas/accidentes-personales/cotizacion",
  noIndex: true,
})

export default async function CotizacionAPEmpresasPage({
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
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        <APCotizacionForm quoter={quoter} segment="empresas" />
      </main>
    </div>
  )
}
