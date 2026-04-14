import { createHash } from "node:crypto"

import type { NextResponse } from "next/server"

const CLIENT_IP_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
] as const

const buckets = new Map<string, number[]>()

export type RateLimitConfig = {
  key: string
  limit: number
  windowMs: number
}

export type RateLimitState = {
  allowed: boolean
  key: string
  limit: number
  remaining: number
  resetAt: number
  retryAfter: number
}

function getClientIp(request: Request) {
  for (const header of CLIENT_IP_HEADERS) {
    const value = request.headers.get(header)
    if (!value) continue

    const ip = value.split(",")[0]?.trim()
    if (ip) return ip
  }

  return null
}

function getFallbackIdentifier(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "unknown"
  return createHash("sha256").update(userAgent).digest("hex")
}

export function getRateLimitFingerprint(request: Request) {
  return getClientIp(request) ?? getFallbackIdentifier(request)
}

export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): RateLimitState {
  const now = Date.now()
  const identifier = getRateLimitFingerprint(request)
  const bucketKey = `${config.key}:${identifier}`
  const existing = buckets.get(bucketKey) ?? []
  const active = existing.filter((timestamp) => now - timestamp < config.windowMs)
  const resetBase = active[0] ?? now

  if (active.length >= config.limit) {
    const resetAt = resetBase + config.windowMs
    return {
      allowed: false,
      key: config.key,
      limit: config.limit,
      remaining: 0,
      resetAt,
      retryAfter: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    }
  }

  active.push(now)
  buckets.set(bucketKey, active)

  const resetAt = (active[0] ?? now) + config.windowMs
  return {
    allowed: true,
    key: config.key,
    limit: config.limit,
    remaining: Math.max(0, config.limit - active.length),
    resetAt,
    retryAfter: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  }
}

export function getRateLimitHeaders(state: RateLimitState) {
  return new Headers({
    "X-RateLimit-Limit": String(state.limit),
    "X-RateLimit-Remaining": String(state.remaining),
    "X-RateLimit-Reset": String(Math.ceil(state.resetAt / 1000)),
    "Retry-After": String(state.retryAfter),
  })
}

export function applyRateLimitHeaders<T extends NextResponse>(
  response: T,
  state?: RateLimitState
) {
  if (!state) return response

  const headers = getRateLimitHeaders(state)
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}
