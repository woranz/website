import { describe, expect, it } from "vitest"

import {
  applyProductPageOverrides,
  transformSanityProduct,
} from "@/lib/page-source/product-page-transform"
import { createPageSourceContext } from "@/lib/page-source/shared"

describe("transformSanityProduct", () => {
  it("prefers SEO fields and keeps a canonical metadata contract", () => {
    const page = transformSanityProduct(
      {
        nombre: "Seguro de Hogar",
        segmento: "personas",
        slug: { current: "seguro-de-hogar" },
        headline: "Protegé tu casa",
        subtitulo: "Respaldo real para tu hogar.",
        seo: {
          title: "Seguro de Hogar | Woranz",
          description: "SEO description",
        },
        secciones: [{ _type: "seccionCta" }],
      },
      {
        whatsappNumero: "5491112345678",
      },
      createPageSourceContext(
        "product",
        "personas/seguro-de-hogar",
        "/personas/coberturas/seguro-de-hogar",
        false
      )
    )

    expect(page).toBeDefined()
    expect(page?.metadata).toMatchObject({
      canonicalPath: "/personas/coberturas/seguro-de-hogar",
      title: "Seguro de Hogar | Woranz",
      description: "SEO description",
    })
    expect(page?.hero.secondaryCtaHref).toContain("5491112345678")
  })

  it("throws in dev mode when owned product content is missing", () => {
    expect(() =>
      transformSanityProduct(
        {
          segmento: "personas",
          slug: { current: "seguro-de-hogar" },
          secciones: [{ _type: "seccionCta" }],
        },
        undefined,
        createPageSourceContext(
          "product",
          "personas/seguro-de-hogar",
          "/personas/coberturas/seguro-de-hogar",
          true
        )
      )
    ).toThrow(/headline/i)
  })

  it("keeps the explicit AP empresas override wired", () => {
    const page = transformSanityProduct(
      {
        nombre: "Accidentes Personales",
        segmento: "empresas",
        slug: { current: "accidentes-personales" },
        headline: "Cobertura para tu equipo",
        subtitulo: "Protección operativa.",
        secciones: [{ _type: "seccionCta" }],
      },
      undefined,
      createPageSourceContext(
        "product",
        "empresas/accidentes-personales",
        "/empresas/coberturas/accidentes-personales",
        false
      )
    )

    expect(page).toBeDefined()

    const overridden = applyProductPageOverrides(page!)

    expect(overridden.hero.primaryCta).toBe("Cotizar")
    expect(overridden.hero.primaryCtaHref).toBe("#cotizador")
  })
})
