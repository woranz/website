import { draftMode } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import {
  getSafeDraftModeRedirect,
  validateDraftModeRequest,
} from "@/app/api/draft-mode/_shared"

export async function GET(request: NextRequest) {
  const invalidResponse = validateDraftModeRequest(request)

  if (invalidResponse) {
    return invalidResponse
  }

  const dm = await draftMode()
  dm.enable()

  const redirectTo = getSafeDraftModeRedirect(
    request.nextUrl.searchParams.get("redirect")
  )

  return NextResponse.redirect(new URL(redirectTo, request.url))
}
