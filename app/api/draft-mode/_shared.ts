import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"

const DRAFT_MODE_SECRET_ENV = "DRAFT_MODE_SECRET"
const DEFAULT_REDIRECT = "/"

function getConfiguredSecret() {
  return process.env[DRAFT_MODE_SECRET_ENV]?.trim() ?? ""
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function getSafeDraftModeRedirect(redirectTo: string | null) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return DEFAULT_REDIRECT
  }

  try {
    const url = new URL(redirectTo, "https://woranz.local")
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return DEFAULT_REDIRECT
  }
}

export function validateDraftModeRequest(request: NextRequest) {
  const configuredSecret = getConfiguredSecret()

  if (!configuredSecret) {
    return NextResponse.json(
      { error: `Missing ${DRAFT_MODE_SECRET_ENV} configuration` },
      { status: 500 }
    )
  }

  const providedSecret = request.nextUrl.searchParams.get("secret")?.trim() ?? ""

  if (!providedSecret || !safeCompare(providedSecret, configuredSecret)) {
    return NextResponse.json({ error: "Invalid draft mode secret" }, { status: 401 })
  }

  return null
}
