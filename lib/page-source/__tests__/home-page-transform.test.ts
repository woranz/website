import { describe, expect, it } from "vitest"

import {
  getHomePageFallbackMetadata,
  transformSanityHome,
} from "@/lib/page-source/home-page-transform"
import { createPageSourceContext } from "@/lib/page-source/shared"

describe("transformSanityHome", () => {
  it("uses SEO fields when present and injects the default feature carousel", () => {
    const page = transformSanityHome(
      {
        heroTitulo: "Seguros claros",
        heroSubtitulo: "Una cobertura simple para cada etapa.",
        seo: {
          title: "SEO home title",
          description: "SEO home description",
        },
        secciones: [],
      },
      "personas",
      createPageSourceContext("home", "personas", "/", false)
    )

    expect(page.metadata.title).toBe("SEO home title")
    expect(page.metadata.description).toBe("SEO home description")
    expect(
      page.sections.some(
        (section) =>
          section.type === "carousel" && section.variant === "feature"
      )
    ).toBe(true)
  })

  it("throws in dev mode when owned hero fields are missing", () => {
    expect(() =>
      transformSanityHome(
        {
          heroSubtitulo: "Texto presente",
          secciones: [],
        },
        "personas",
        createPageSourceContext("home", "personas", "/", true)
      )
    ).toThrow(/heroTitulo/i)
  })

  it("exposes stable fallback metadata for homes", () => {
    expect(getHomePageFallbackMetadata("empresas")).toMatchObject({
      canonicalPath: "/empresas",
      title: "Woranz — Seguros para Empresas",
    })
  })
})
