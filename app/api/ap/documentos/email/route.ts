import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { documentosEmailSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { woranzFetch } from "@/lib/woranz-api"
import { getWoranzErrorMessage } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apDocumentosEmail)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, documentosEmailSchema, {
    invalidBodyMessage: "ID de emisión y email son requeridos",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const res = await woranzFetch(
      `/polizas/documentos/email?idEmision=${parsed.data.idEmision}&itemNro=0&idImpresion=${parsed.data.idImpresion}&email=${encodeURIComponent(parsed.data.email)}`
    )
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(json.error, "Error al enviar documentos"),
        422,
        { rateLimit }
      )
    }

    return jsonData({ data: json.data }, { rateLimit })
  } catch {
    return jsonError("Error al enviar documentos por email", 500, {
      rateLimit,
    })
  }
}
