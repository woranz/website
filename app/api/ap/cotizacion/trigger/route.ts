import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { cotizacionTriggerSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { getIdPlanComercial, woranzFetch } from "@/lib/woranz-api"
import { getWoranzErrorMessage } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apCotizacionTrigger)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, cotizacionTriggerSchema, {
    invalidBodyMessage: "Error al generar cotización",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const idPlanComercial = await getIdPlanComercial()
    const payload = {
      idVigencia: 17,
      idPlanComercial,
      idCoberturaPaquete: 498,
      idPersonaTipo: 1,
      idCondicionFiscal: 1,
      idFormaCobro: 1,
      idSeccion: 12,
      idProvinciaRiesgo: parsed.data.idProvinciaRiesgo,
      vigenciaDesde: parsed.data.vigenciaDesde,
      vigenciaHasta: parsed.data.vigenciaHasta,
      items: parsed.data.items,
      coberturas: parsed.data.coberturas,
      solicitante: parsed.data.solicitante,
      mail: parsed.data.mail,
      telefonoArea: Number(parsed.data.telefonoArea),
      telefonoNumero: Number(parsed.data.telefonoNumero),
    }

    const res = await woranzFetch("/ap/cotizacion/trigger", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(json.error, "Error al generar cotización"),
        422,
        { rateLimit }
      )
    }

    return jsonData({ data: json.data }, { rateLimit })
  } catch {
    return jsonError("Error al generar cotización", 500, { rateLimit })
  }
}
