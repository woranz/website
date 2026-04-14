import { describe, expect, it } from "vitest"

import { buildPageMetadata } from "@/lib/metadata"

describe("buildPageMetadata", () => {
  it("builds canonical, social and noindex metadata from one contract", () => {
    const metadata = buildPageMetadata({
      title: "Cotización AP — Woranz",
      description: "Flujo transaccional",
      canonicalPath: "/personas/coberturas/accidentes-personales/cotizacion",
      noIndex: true,
    })

    expect(metadata.alternates?.canonical).toBe(
      "https://www.woranz.com/personas/coberturas/accidentes-personales/cotizacion"
    )
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
    })
    expect(metadata.openGraph?.title).toBe("Cotización AP — Woranz")
    expect(metadata.twitter?.card).toBe("summary_large_image")
  })
})
