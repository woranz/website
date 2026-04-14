import type { Metadata } from "next"

import { AeronavegacionSolicitudForm } from "@/components/AeronavegacionSolicitudForm"
import { SiteHeader } from "@/components/site/header"
import { buildPageMetadata } from "@/lib/metadata"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"

export const metadata: Metadata = buildPageMetadata({
  title: "Solicitud Aeronavegación — Woranz",
  description:
    "Completá los datos de tu aeronave y operación para recibir una cotización de seguro de aeronavegación.",
  canonicalPath: "/empresas/coberturas/aeronavegacion/solicitud",
  noIndex: true,
})

export default function AeronavegacionSolicitudPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        <AeronavegacionSolicitudForm />
      </main>
    </div>
  )
}
