import type { Metadata } from "next"

import { PreaprobacionForm } from "@/components/PreaprobacionForm"
import { SiteHeader } from "@/components/site/header"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"

export const metadata: Metadata = {
  title: "Pre-aprobación Caución de Alquiler — Woranz",
  description:
    "Completá tus datos y obtené tu garantía de alquiler en menos de 24hs. Sin garante, 100% online.",
}

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
    restitucion: params.restitucion === "true",
    idProductor: params.id ?? "",
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        <PreaprobacionForm quoter={quoter} />
      </main>
    </div>
  )
}
