import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { jsonData, jsonError } from "@/lib/api/request"
import { getWoranzErrorMessage } from "@/lib/woranz-api"
import { woranzFetch } from "@/lib/woranz-api"

export async function GET(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apProvincias)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  try {
    const res = await woranzFetch("/personas/provincias")
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(json.error, "Error al obtener provincias"),
        422,
        { rateLimit }
      )
    }

    return jsonData({ data: json.data ?? [] }, { rateLimit })
  } catch {
    return jsonError("Error al obtener provincias", 500, { rateLimit })
  }
}
