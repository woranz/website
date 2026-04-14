import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { caucionLookupSchema } from "@/lib/api/schemas/ap"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { lookupPersonaInfoexperto, lookupPersonaFull } from "@/lib/woranz-api"

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
    // Call both endpoints: infoexperto (cuit, nombre, localidad, provincia)
    // and personas/all with type=tomador (domicilio, emails)
    const [infoexperto, personaFull] = await Promise.all([
      lookupPersonaInfoexperto(parsed.data.dni),
      lookupPersonaFull(parsed.data.dni),
    ])

    if (!infoexperto && !personaFull) {
      return jsonData({ data: null }, { rateLimit })
    }

    const email = personaFull?.emails?.[0]?.email ?? ""

    const data = {
      cuit: infoexperto?.cuit ?? "",
      nombreCompleto: infoexperto?.nombreCompleto ?? "",
      localidad: infoexperto?.localidad ?? "",
      provincia: infoexperto?.provincia ?? "",
      email,
    }

    return jsonData({ data }, { rateLimit })
  } catch {
    return jsonError("Error al buscar los datos. Intentá de nuevo.", 500, {
      rateLimit,
    })
  }
}
