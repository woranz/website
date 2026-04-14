import { NextRequest } from "next/server"
import { afterEach, describe, expect, it } from "vitest"
import {
  getSafeDraftModeRedirect,
  validateDraftModeRequest,
} from "@/app/api/draft-mode/_shared"

const originalSecret = process.env.DRAFT_MODE_SECRET

function buildRequest(search = "") {
  return new NextRequest(`https://www.woranz.com/api/draft-mode/enable${search}`)
}

afterEach(() => {
  if (typeof originalSecret === "undefined") {
    delete process.env.DRAFT_MODE_SECRET
    return
  }

  process.env.DRAFT_MODE_SECRET = originalSecret
})

describe("draft mode route helpers", () => {
  it("sanitizes redirects down to internal destinations", () => {
    expect(getSafeDraftModeRedirect("/personas/caucion-alquiler?draft=1#hero")).toBe(
      "/personas/caucion-alquiler?draft=1#hero"
    )
    expect(getSafeDraftModeRedirect("https://evil.example/phish")).toBe("/")
    expect(getSafeDraftModeRedirect("//evil.example/phish")).toBe("/")
    expect(getSafeDraftModeRedirect(null)).toBe("/")
  })

  it("rejects invalid secrets", () => {
    process.env.DRAFT_MODE_SECRET = "top-secret"

    const response = validateDraftModeRequest(buildRequest("?secret=wrong"))

    expect(response?.status).toBe(401)
  })

  it("accepts the configured shared secret", () => {
    process.env.DRAFT_MODE_SECRET = "top-secret"

    const response = validateDraftModeRequest(buildRequest("?secret=top-secret"))

    expect(response).toBeNull()
  })

  it("fails closed when the shared secret is not configured", () => {
    delete process.env.DRAFT_MODE_SECRET

    const response = validateDraftModeRequest(buildRequest("?secret=anything"))

    expect(response?.status).toBe(500)
  })
})
