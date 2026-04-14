import { RATE_LIMITS } from "@/lib/api/limits"
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

const POLICY_DEFAULTS = {
  referencia: "Pago desde MercadoPago",
  detalleRiesgo: "",
  observaciones: "",
  formaCobro: {
    idFormaCobro: 1,
    idTarjetaEmpresa: 0,
    idTipoCuentaBancaria: 0,
    cbu: 0,
    numeroTarjeta: "",
    fechaVTOTarjeta: "2022-12-31",
  },
}

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
      ...POLICY_DEFAULTS,
      idPlanComercial,
      idSeccion: 12,
      idVigencia: 17,
      idCoberturaPaquete: 498,
      idPersonaTipo: 1,
      idCondicionFiscal: 1,
      idFormaCobro: 1,
      idCotizacion: parsed.data.idCotizacion,
      idProvinciaRiesgo: parsed.data.idProvinciaRiesgo,
      vigenciaDesde: parsed.data.vigenciaDesde,
      vigenciaHasta: parsed.data.vigenciaHasta,
      cantidad: parsed.data.cantidad,
      items: parsed.data.items,
      coberturas: parsed.data.coberturas,
      tomador: parsed.data.tomador,
      asegurados: parsed.data.asegurados,
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
