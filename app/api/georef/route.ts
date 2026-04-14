import { NextRequest, NextResponse } from "next/server"

import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { georefQuerySchema, GEOREF_ENDPOINT_CONFIG } from "@/lib/api/schemas/georef"
import { jsonError } from "@/lib/api/request"

const GEOREF_BASE = "https://apis.datos.gob.ar/georef/api"
const CACHE_TTL = 3600_000 // 1 hour in ms

// In-memory cache to avoid hitting upstream rate limits
const cache = new Map<string, { data: unknown; ts: number }>()

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.georef)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const parsed = georefQuerySchema.safeParse({
    endpoint: request.nextUrl.searchParams.get("endpoint"),
    nombre: request.nextUrl.searchParams.get("nombre"),
  })

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Missing params", 400, {
      rateLimit,
    })
  }

  const config = GEOREF_ENDPOINT_CONFIG[parsed.data.endpoint]
  const cacheKey = `${parsed.data.endpoint}:${parsed.data.nombre.toLowerCase()}:${config.fields}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        "X-Cache": "HIT",
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        "Retry-After": String(rateLimit.retryAfter),
      },
    })
  }

  const url = `${GEOREF_BASE}/${parsed.data.endpoint}?nombre=${encodeURIComponent(parsed.data.nombre)}&max=8&campos=${config.fields}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      // If rate-limited, return cached stale data if available
      if (cached) {
        return NextResponse.json(cached.data, {
          headers: {
            "X-Cache": "STALE",
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
            "Retry-After": String(rateLimit.retryAfter),
          },
        })
      }
      return NextResponse.json(
        { [parsed.data.endpoint]: [] },
        { status: 200 }
      )
    }

    const data = await res.json()
    cache.set(cacheKey, { data, ts: Date.now() })

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Cache": "MISS",
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        "Retry-After": String(rateLimit.retryAfter),
      },
    })
  } catch {
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          "X-Cache": "STALE",
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
          "Retry-After": String(rateLimit.retryAfter),
        },
      })
    }
    return NextResponse.json({ [parsed.data.endpoint]: [] }, { status: 200 })
  }
}
