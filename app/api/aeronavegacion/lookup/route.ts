import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { caucionLookupSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { lookupPersonaInfoexperto } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.aeronavegacionLookup)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, caucionLookupSchema, {
    invalidBodyMessage: "DNI inválido. Debe tener 7 u 8 dígitos.",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const persona = await lookupPersonaInfoexperto(parsed.data.dni)
    return jsonData({ data: persona ?? null }, { rateLimit })
  } catch {
    return jsonError("Error al buscar los datos. Intentá de nuevo.", 500, {
      rateLimit,
    })
  }
}
