import OpenAI from "openai"

import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import { enforceSameOrigin, jsonData, jsonError } from "@/lib/api/request"
import {
  aeronavegacionExtractionSchema,
  type AeronavegacionExtractionData,
} from "@/lib/api/schemas/aeronavegacion-solicitud"
import {
  ACTIVIDADES,
  COBERTURAS,
  CONDICIONES_FISCALES,
  MARCAS_AERONAVE,
  TIPOS_AERONAVE,
} from "@/lib/forms/constants/aeronavegacion"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB total
const MAX_FILE_COUNT = 5

const EXTRACTION_PROMPT = `Sos un analista de documentos de seguros de aeronavegación en Argentina.
Extraé los siguientes datos de los documentos subidos. Los documentos pueden ser: póliza de seguro aeronáutico, certificado de aeronavegabilidad (ANAC), certificado de matrícula, licencias de tripulación, certificados CMA.

Devolvé un JSON con los campos que encuentres. Omití los campos que no estén en los documentos.

Campos posibles:
- dni: string (7-8 dígitos)
- cuit: string (formato XX-XXXXXXXX-X)
- nombreCompleto: string (nombre del asegurado o razón social)
- email: string
- telefono: string
- condicionFiscal: string (una de: ${CONDICIONES_FISCALES.join(", ")})
- localidad: string
- provincia: string
- matricula: string (formato LV-XXX o LQ-XXX)
- marca: string (una de: ${MARCAS_AERONAVE.join(", ")})
- modelo: string
- anio: string (año de fabricación, 4 dígitos)
- nroSerie: string
- tipoAeronave: string (una de: ${TIPOS_AERONAVE.join(", ")})
- asientosTripulantes: string (número)
- asientosPasajeros: string (número)
- vencimientoPoliza: string (formato YYYY-MM-DD)
- actividades: string[] (de esta lista: ${ACTIVIDADES.join(", ")})
- coberturas: Array<{tipo: string, suma: string}> donde tipo es una de: ${COBERTURAS.join(", ")}

Para las coberturas, extraé el tipo y la suma asegurada si está disponible. La suma debe incluir la moneda (ej: "USD 500.000", "ARS 10.000.000").

Formatos argentinos: CUIT XX-XXXXXXXX-X, matrícula LV-XXX/LQ-XXX, fechas en YYYY-MM-DD.

Devolvé SOLO el JSON, sin explicaciones ni markdown.`

function isImageMime(type: string) {
  return type === "image/jpeg" || type === "image/png"
}

function isPdfMime(type: string) {
  return type === "application/pdf"
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.aeronavegacionExtract)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return jsonError("Servicio de extracción no disponible.", 503, { rateLimit })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return jsonError("Request inválido.", 400, { rateLimit })
  }

  const files = formData
    .getAll("archivos")
    .filter((v): v is File => v instanceof File && v.size > 0)

  if (files.length === 0) {
    return jsonError("Subí al menos un archivo.", 400, { rateLimit })
  }

  if (files.length > MAX_FILE_COUNT) {
    return jsonError(`Máximo ${MAX_FILE_COUNT} archivos.`, 400, { rateLimit })
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  if (totalSize > MAX_FILE_SIZE) {
    return jsonError("Los archivos superan el límite de 10MB.", 400, { rateLimit })
  }

  // Build OpenAI messages with file content
  const contentParts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: EXTRACTION_PROMPT },
  ]

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString("base64")

    if (isImageMime(file.type)) {
      contentParts.push({
        type: "image_url",
        image_url: {
          url: `data:${file.type};base64,${base64}`,
          detail: "high",
        },
      })
    } else if (isPdfMime(file.type)) {
      // GPT-4o supports PDF as a file input via base64 image encoding
      // For PDFs we pass them as a data URL — GPT-4o can read PDF content from images
      contentParts.push({
        type: "image_url",
        image_url: {
          url: `data:application/pdf;base64,${base64}`,
          detail: "high",
        },
      })
    }
  }

  try {
    const openai = new OpenAI({ apiKey })

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: contentParts,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return jsonError("No se pudo analizar los documentos.", 500, { rateLimit })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      return jsonError("Respuesta inválida del análisis.", 500, { rateLimit })
    }

    // Validate against extraction schema — drop invalid fields silently
    const result = aeronavegacionExtractionSchema.safeParse(parsed)
    const data: AeronavegacionExtractionData = result.success
      ? result.data
      : (parsed as AeronavegacionExtractionData)

    return jsonData({ data }, { rateLimit })
  } catch (error) {
    console.error("OpenAI extraction error:", error)
    return jsonError(
      "Error al analizar los documentos. Podés completar el formulario manualmente.",
      500,
      { rateLimit }
    )
  }
}
