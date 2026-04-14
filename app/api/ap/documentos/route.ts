import { type NextRequest, NextResponse } from "next/server"

import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { documentosQuerySchema } from "@/lib/api/schemas/ap"
import { jsonData, jsonError } from "@/lib/api/request"
import { getWoranzErrorMessage } from "@/lib/woranz-api"
import { woranzFetch } from "@/lib/woranz-api"

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.apDocumentos)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  try {
    const parsed = documentosQuerySchema.safeParse({
      idEmision: request.nextUrl.searchParams.get("idEmision"),
      idImpresion: request.nextUrl.searchParams.get("idImpresion") ?? "0",
    })
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "ID inválido.", 400, {
        rateLimit,
      })
    }

    const res = await woranzFetch(
      `/polizas/documentos?idEmision=${parsed.data.idEmision}&itemNro=0&idImpresion=${parsed.data.idImpresion}`
    )
    const json = await res.json()

    if (json.error) {
      return jsonError(
        getWoranzErrorMessage(json.error, "Error al obtener documentos"),
        422,
        { rateLimit }
      )
    }

    return jsonData({ data: json.data }, { rateLimit })
  } catch {
    return jsonError("Error al obtener documentos", 500, { rateLimit })
  }
}
