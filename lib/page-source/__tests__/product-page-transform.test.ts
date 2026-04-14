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

  it("injects the shared personas feature carousel after the final CTA", () => {
    const page = transformSanityProduct(
      {
        nombre: "Seguro de Hogar",
        segmento: "personas",
        slug: { current: "seguro-de-hogar" },
        headline: "Protegé tu casa",
        subtitulo: "Respaldo real para tu hogar.",
        secciones: [
          {
            _type: "seccionExplicacion",
            titulo: "Qué es",
            cuerpo: "Una cobertura simple para tu casa.",
          },
          { _type: "seccionCta" },
        ],
      },
      undefined,
      createPageSourceContext(
        "product",
        "personas/seguro-de-hogar",
        "/personas/coberturas/seguro-de-hogar",
        false
      )
    )

    expect(page).toBeDefined()

    const ctaIndex = page!.sections.findIndex((section) => section.type === "cta")
    const featureIndex = page!.sections.findIndex(
      (section) => section.type === "carousel" && section.variant === "feature"
    )

    expect(ctaIndex).toBeGreaterThan(-1)
    expect(featureIndex).toBe(ctaIndex + 1)
  })

  it("injects empresas FAQ fallback before the CTA and feature carousel after it", () => {
    const page = transformSanityProduct(
      {
        nombre: "Incendio - Empresas",
        segmento: "empresas",
        slug: { current: "incendio" },
        headline: "Protegés lo que sostiene tu operación",
        subtitulo: "Un evento no debería poner en riesgo todo tu negocio.",
        secciones: [
          {
            _type: "seccionExplicacion",
            titulo: "Qué es",
            cuerpo: "Protección para activos críticos de tu operación.",
          },
          { _type: "seccionCta" },
        ],
      },
      undefined,
      createPageSourceContext(
        "product",
        "empresas/incendio",
        "/empresas/coberturas/incendio",
        false
      )
    )

    expect(page).toBeDefined()

    const faqIndex = page!.sections.findIndex((section) => section.type === "faq")
    const ctaIndex = page!.sections.findIndex((section) => section.type === "cta")
    const featureIndex = page!.sections.findIndex(
      (section) => section.type === "carousel" && section.variant === "feature"
    )

    expect(faqIndex).toBeGreaterThan(-1)
    expect(ctaIndex).toBeGreaterThan(faqIndex)
    expect(featureIndex).toBe(ctaIndex + 1)
  })

  it("does not duplicate an authored FAQ section for empresas", () => {
    const page = transformSanityProduct(
      {
        nombre: "Incendio - Empresas",
        segmento: "empresas",
        slug: { current: "incendio" },
        headline: "Protegés lo que sostiene tu operación",
        subtitulo: "Un evento no debería poner en riesgo todo tu negocio.",
        secciones: [
          {
            _type: "seccionFaq",
            items: [
              {
                pregunta: "¿Esta pregunta viene de Sanity?",
                respuesta: "Sí, y no debe duplicarse con el fallback.",
              },
            ],
          },
          { _type: "seccionCta" },
        ],
      },
      undefined,
      createPageSourceContext(
        "product",
        "empresas/incendio",
        "/empresas/coberturas/incendio",
        false
      )
    )

    expect(page).toBeDefined()

    const faqSections = page!.sections.filter((section) => section.type === "faq")

    expect(faqSections).toHaveLength(1)
    expect(faqSections[0]).toMatchObject({
      mobileItems: [
        {
          question: "¿Esta pregunta viene de Sanity?",
          answer: "Sí, y no debe duplicarse con el fallback.",
        },
      ],
    })
  })
})
