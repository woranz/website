import coverageRedirectPlan from "@/data/coverage-redirect-plan.json"
import productCatalog from "@/data/product-catalog.json"
import { describe, expect, it } from "vitest"

const liveProductPaths = new Set(
  productCatalog.map((product) => `/${product.segmento}/${product.slug}`)
)

describe("coverage redirect plan", () => {
  it("keeps every legacy source unique", () => {
    const uniqueSources = new Set(coverageRedirectPlan.map((redirect) => redirect.source))

    expect(uniqueSources.size).toBe(coverageRedirectPlan.length)
  })

  it("keeps representative coverage mappings in place", () => {
    expect(coverageRedirectPlan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/coberturas/caucion-del-alquiler",
          destination: "/personas/caucion-alquiler",
          matchType: "exact-match",
        }),
        expect.objectContaining({
          source: "/coberturas/caucion-de-obra",
          destination: "/empresas/cauciones-tradicionales",
          matchType: "many-to-one",
        }),
        expect.objectContaining({
          source: "/turismo",
          destination: "/personas/caucion-turismo-estudiantil",
          matchType: "rename",
        }),
      ])
    )
  })

  it("only points at live product pages or intentional fallback routes", () => {
    const allowedFallbacks = new Set(["/", "/empresas", "/personas"])

    for (const redirect of coverageRedirectPlan) {
      const isLiveProduct = liveProductPaths.has(redirect.destination)
      const isAllowedFallback = allowedFallbacks.has(redirect.destination)

      expect(
        isLiveProduct || isAllowedFallback,
        `${redirect.source} points to an unresolved destination ${redirect.destination}`
      ).toBe(true)
    }
  })
})
