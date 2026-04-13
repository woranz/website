import { NextRequest, NextResponse } from "next/server"

const GEOREF_BASE = "https://apis.datos.gob.ar/georef/api"
const CACHE_TTL = 3600_000 // 1 hour in ms

// In-memory cache to avoid hitting upstream rate limits
const cache = new Map<string, { data: unknown; ts: number }>()

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get("endpoint")
  const nombre = searchParams.get("nombre")
  const campos = searchParams.get("campos") ?? "id,nombre"

  if (!endpoint || !nombre) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  const cacheKey = `${endpoint}:${nombre.toLowerCase()}:${campos}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    })
  }

  const url = `${GEOREF_BASE}/${endpoint}?nombre=${encodeURIComponent(nombre)}&max=8&campos=${campos}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      // If rate-limited, return cached stale data if available
      if (cached) {
        return NextResponse.json(cached.data, {
          headers: { "X-Cache": "STALE" },
        })
      }
      return NextResponse.json(
        { [endpoint]: [] },
        { status: 200 }
      )
    }

    const data = await res.json()
    cache.set(cacheKey, { data, ts: Date.now() })

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Cache": "MISS",
      },
    })
  } catch {
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: { "X-Cache": "STALE" },
      })
    }
    return NextResponse.json({ [endpoint]: [] }, { status: 200 })
  }
}
