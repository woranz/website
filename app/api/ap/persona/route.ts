import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { personaLookupSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { lookupPersonaFull } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apPersona)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, personaLookupSchema, {
    invalidBodyMessage: "Documento inválido.",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const persona = await lookupPersonaFull(parsed.data.dni)
    return jsonData({ data: persona ?? null }, { rateLimit })
  } catch {
    return jsonError("Error al buscar los datos. Intentá de nuevo.", 500, {
      rateLimit,
    })
  }
}
