import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  parseJsonBody,
} from "@/lib/api/request"
import { z } from "zod"
import aircraftData from "@/data/opensky-aircraft-ar.json"

const matriculaSchema = z
  .object({
    matricula: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^L[VQ]-[A-Z]{3}$/,
        "Matrícula inválida. Formato esperado: LV-XXX."
      ),
  })
  .strict()

const aircraftDb = aircraftData as Record<
  string,
  {
    marca?: string
    modelo?: string
    nroSerie?: string
    typecode?: string
    icaoType?: string
    propietario?: string
  }
>

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.aeronavegacionLookup)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsed = await parseJsonBody(request, matriculaSchema, {
    invalidBodyMessage: "Matrícula inválida. Formato esperado: LV-XXX.",
    rateLimit,
  })
  if (!parsed.success) {
    return parsed.response
  }

  const aircraft = aircraftDb[parsed.data.matricula] ?? null
  return jsonData({ data: aircraft }, { rateLimit })
}
