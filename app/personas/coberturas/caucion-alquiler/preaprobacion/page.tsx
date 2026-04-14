import type { Metadata } from "next"

import { PreaprobacionForm } from "@/components/PreaprobacionForm"
import { SiteHeader, type SiteNavLink } from "@/components/site/header"

export const metadata: Metadata = {
  title: "Pre-aprobación Caución de Alquiler — Woranz",
  description:
    "Completá tus datos y obtené tu garantía de alquiler en menos de 24hs. Sin garante, 100% online.",
}

const SITE_NAVIGATION: SiteNavLink[] = [
  { href: "#", label: "Nosotros" },
  { href: "#", label: "Contacto" },
]

export default async function PreaprobacionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams

  const quoter = {
    provincia: params.provincia ?? "buenos-aires",
    alquiler: Number.parseInt(params.alquiler ?? "0", 10),
    duracion: Number.parseInt(params.duracion ?? "24", 10),
    modoPago: params.modoPago ?? "cuotas",
    idProductor: params.id ?? "",
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader links={SITE_NAVIGATION} />
      <main className="flex-1">
        <PreaprobacionForm quoter={quoter} />
      </main>
    </div>
  )
}
