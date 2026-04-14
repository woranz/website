import { RATE_LIMITS } from "@/lib/api/limits"
import { QUOTE_DEFAULT } from "@/lib/api/defaults/ap"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { cotizacionOpcionesSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { getIdPlanComercial, woranzFetch } from "@/lib/woranz-api"
import { getWoranzErrorMessage } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apCotizacionOpciones)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, cotizacionOpcionesSchema, {
    invalidBodyMessage: "Error al obtener opciones de cotización",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const idPlanComercial = await getIdPlanComercial()
    const payload = {
      idVigencia: QUOTE_DEFAULT.idVigencia,
      idPlanComercial,
      idCoberturaPaquete: 498,
      idPersonaTipo: QUOTE_DEFAULT.idPersonaTipo,
      idCondicionFiscal: QUOTE_DEFAULT.idCondicionFiscal,
      idFormaCobro: QUOTE_DEFAULT.idFormaCobro,
      idSeccion: 12,
      idProvinciaRiesgo: parsed.data.idProvinciaRiesgo,
      vigenciaDesde: parsed.data.vigenciaDesde,
      vigenciaHasta: parsed.data.vigenciaHasta,
      items: parsed.data.items,
    }

    const res = await woranzFetch("/ap/cotizacion/opciones", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(
          json.error,
          "Error al obtener opciones de cotización"
        ),
        422,
        { rateLimit }
      )
    }

    return jsonData({ data: json.data }, { rateLimit })
  } catch {
    return jsonError("Error al obtener opciones de cotización", 500, {
      rateLimit,
    })
  }
}
