import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { propuestaConfirmarSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { woranzFetch } from "@/lib/woranz-api"
import { getWoranzErrorMessage } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apPropuestaConfirmar)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, propuestaConfirmarSchema, {
    invalidBodyMessage: "ID de emisión requerido",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const res = await woranzFetch(
      `/ap/propuesta/confirmar/${parsed.data.idEmision}`,
      {
        method: "POST",
      }
    )
    const json = await res.json()

    if (json.error) {
      const message = getWoranzErrorMessage(
        json.error,
        "Error al confirmar propuesta"
      )
      if (message.includes("ya fue confirmada")) {
        return jsonData({ data: { alreadyConfirmed: true } }, { rateLimit })
      }

      return jsonError(message, 422, { rateLimit })
    }

    return jsonData({ data: json.data }, { rateLimit })
  } catch {
    return jsonError("Error al confirmar propuesta", 500, { rateLimit })
  }
}
