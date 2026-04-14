import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { mercadoPagoSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  hasSameOriginUrl,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { woranzFetch } from "@/lib/woranz-api"
import { getWoranzErrorMessage } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apMercadoPago)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, mercadoPagoSchema, {
    invalidBodyMessage: "Error al crear preferencia de pago",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  if (
    !hasSameOriginUrl(request, parsed.data.base_url) ||
    !hasSameOriginUrl(request, parsed.data.source_url)
  ) {
    return jsonError("URL inválida.", 400, { rateLimit })
  }

  try {
    const payload = {
      data: parsed.data.data,
      base_url: parsed.data.base_url,
      source_url: parsed.data.source_url,
    }

    const res = await woranzFetch("/mercadopago/preference-ap", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(
          json.error,
          "Error al crear preferencia de pago"
        ),
        422,
        { rateLimit }
      )
    }

    return jsonData(json, { rateLimit })
  } catch {
    return jsonError("Error al crear preferencia de pago", 500, { rateLimit })
  }
}
