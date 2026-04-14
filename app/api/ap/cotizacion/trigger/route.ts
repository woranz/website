import { RATE_LIMITS } from "@/lib/api/limits"
import { QUOTE_DEFAULT, POLICY_DEFAULT, applyTomadorDefaults, applyAseguradoDefaults } from "@/lib/api/defaults/ap"
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
      ...(parsed.data.idCotizacion != null && { idCotizacion: parsed.data.idCotizacion }),
      referencia: POLICY_DEFAULT.referencia,
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
      coberturas: parsed.data.coberturas,
      cantidad: parsed.data.cantidad,
      tomador: applyTomadorDefaults(parsed.data.tomador),
      asegurados: parsed.data.asegurados.map(applyAseguradoDefaults),
      domicilioRiesgo: parsed.data.domicilioRiesgo,
      detalleRiesgo: POLICY_DEFAULT.detalleRiesgo,
      clausulaSubrogacion: parsed.data.clausulaSubrogacion,
      clausulaNoRepeticion: parsed.data.clausulaNoRepeticion,
      nomina: parsed.data.nomina,
      formaCobro: POLICY_DEFAULT.formaCobro,
      solicitante: parsed.data.solicitante,
      mail: parsed.data.mail,
      telefonoArea: Number(parsed.data.telefonoArea),
      telefonoNumero: Number(parsed.data.telefonoNumero),
      observaciones: QUOTE_DEFAULT.observaciones,
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
