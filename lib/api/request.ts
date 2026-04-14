import { NextResponse } from "next/server"
import { ZodError, type ZodType } from "zod"

import { applyRateLimitHeaders, type RateLimitState } from "@/lib/api/rate-limit"

type BodyParseResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse }

function getFirstIssueMessage(error: ZodError) {
  const issue = error.issues[0]
  if (!issue) return "Invalid request."
  return issue.message
}

function mergeHeaders(headers?: HeadersInit) {
  const result = new Headers(headers)
  return result
}

export function jsonError(
  message: string,
  status: number,
  options?: {
    headers?: HeadersInit
    rateLimit?: RateLimitState
  }
) {
  const response = NextResponse.json(
    { error: message },
    {
      status,
      headers: mergeHeaders(options?.headers),
    }
  )

  return applyRateLimitHeaders(response, options?.rateLimit)
}

export function jsonData<T>(
  payload: T,
  options?: {
    status?: number
    headers?: HeadersInit
    rateLimit?: RateLimitState
  }
) {
  const response = NextResponse.json(payload, {
    status: options?.status ?? 200,
    headers: mergeHeaders(options?.headers),
  })

  return applyRateLimitHeaders(response, options?.rateLimit)
}

export function noStoreHeaders(headers?: HeadersInit) {
  const result = mergeHeaders(headers)
  result.set("Cache-Control", "no-store")
  return result
}

export function enforceSameOrigin(
  request: Request,
  options?: {
    headers?: HeadersInit
    rateLimit?: RateLimitState
  }
) {
  const origin = request.headers.get("origin")
  if (!origin) return null

  try {
    if (origin !== new URL(request.url).origin) {
      return jsonError("Invalid origin.", 403, options)
    }
  } catch {
    return jsonError("Invalid origin.", 403, options)
  }

  return null
}

export function hasSameOriginUrl(request: Request, candidate: string) {
  try {
    return new URL(candidate).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
  options?: {
    invalidBodyMessage?: string
    headers?: HeadersInit
    rateLimit?: RateLimitState
  }
): Promise<BodyParseResult<T>> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return {
      success: false,
      response: jsonError(
        options?.invalidBodyMessage ?? "Invalid JSON body.",
        400,
        options
      ),
    }
  }

  try {
    return { success: true, data: schema.parse(body) }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: jsonError(getFirstIssueMessage(error), 400, options),
      }
    }

    return {
      success: false,
      response: jsonError("Invalid request.", 400, options),
    }
  }
}

export async function readFormData(
  request: Request,
  options?: {
    headers?: HeadersInit
    rateLimit?: RateLimitState
  }
): Promise<BodyParseResult<FormData>> {
  try {
    return { success: true, data: await request.formData() }
  } catch {
    return {
      success: false,
      response: jsonError("Invalid form data.", 400, options),
    }
  }
}
