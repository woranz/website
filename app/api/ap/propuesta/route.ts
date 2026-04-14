import { RATE_LIMITS } from "@/lib/api/limits"
import { QUOTE_DEFAULT, POLICY_DEFAULT, applyTomadorDefaults, applyAseguradoDefaults } from "@/lib/api/defaults/ap"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { propuestaSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { getIdPlanComercial, woranzFetch } from "@/lib/woranz-api"
import { getWoranzErrorMessage } from "@/lib/woranz-api"

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apPropuesta)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, propuestaSchema, {
    invalidBodyMessage: "Error al crear propuesta",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  try {
    const idPlanComercial = await getIdPlanComercial()
    const payload = {
      ...POLICY_DEFAULT,
      observaciones: "",
      idPlanComercial,
      idSeccion: 12,
      idVigencia: QUOTE_DEFAULT.idVigencia,
      idCoberturaPaquete: 498,
      idPersonaTipo: QUOTE_DEFAULT.idPersonaTipo,
      idCondicionFiscal: QUOTE_DEFAULT.idCondicionFiscal,
      idFormaCobro: QUOTE_DEFAULT.idFormaCobro,
      idCotizacion: parsed.data.idCotizacion,
      idProvinciaRiesgo: parsed.data.idProvinciaRiesgo,
      vigenciaDesde: parsed.data.vigenciaDesde,
      vigenciaHasta: parsed.data.vigenciaHasta,
      cantidad: parsed.data.cantidad,
      items: parsed.data.items,
      coberturas: parsed.data.coberturas,
      tomador: applyTomadorDefaults(parsed.data.tomador),
      asegurados: parsed.data.asegurados.map(applyAseguradoDefaults),
      domicilioRiesgo: parsed.data.domicilioRiesgo,
      clausulaSubrogacion: parsed.data.clausulaSubrogacion,
      clausulaNoRepeticion: parsed.data.clausulaNoRepeticion,
      nomina: parsed.data.nomina,
      solicitante: parsed.data.solicitante,
      mail: parsed.data.mail,
      telefonoArea: Number(parsed.data.telefonoArea),
      telefonoNumero: Number(parsed.data.telefonoNumero),
    }

    const res = await woranzFetch("/ap/propuesta", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(json.error, "Error al crear propuesta"),
        422,
        { rateLimit }
      )
    }

    return jsonData({ data: json.data }, { rateLimit })
  } catch {
    return jsonError("Error al crear propuesta", 500, { rateLimit })
  }
}
