import { ZodError } from "zod"

import { RATE_LIMITS } from "@/lib/api/limits"
import { checkRateLimit } from "@/lib/api/rate-limit"
import {
  buildContactFormSchema,
  type ContactFormPayload,
  accidentesCotizacionSchema,
  caucionPreaprobacionSchema,
} from "@/lib/api/schemas/forms"
import {
  enforceSameOrigin,
  jsonData,
  jsonError,
  readFormData,
} from "@/lib/api/request"
import { getFormConfig } from "@/lib/forms/registry"

import { handleAccidentesCotizacion } from "./handlers/accidentes-cotizacion"
import { handleCaucionPreaprobacion } from "./handlers/caucion-preaprobacion"
import { handleContacto } from "./handlers/contacto"

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getStringArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
}

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0)
}

function toStringObject(formData: FormData) {
  const result: Record<string, string> = {}

  for (const [key, value] of Array.from(formData.entries())) {
    if (value instanceof File && value.size > 0) {
      throw new Error("Unexpected file upload.")
    }

    result[key] = typeof value === "string" ? value : ""
  }

  return result
}

function getZodMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Invalid request."
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, RATE_LIMITS.formsSubmit)
  if (!rateLimit.allowed) {
    return jsonError("Too many requests.", 429, { rateLimit })
  }

  const originError = enforceSameOrigin(request, { rateLimit })
  if (originError) {
    return originError
  }

  const parsedFormData = await readFormData(request, { rateLimit })
  if (!parsedFormData.success) {
    return parsedFormData.response
  }

  const formData = parsedFormData.data
  const formType = getString(formData, "_formType")

  if (!formType) {
    return jsonError("Tipo de formulario no reconocido.", 400, { rateLimit })
  }

  try {
    if (formType === "accidentes-cotizacion") {
      const payload = accidentesCotizacionSchema.parse({
        actividad: getString(formData, "actividad"),
        fechaDesde: getString(formData, "fechaDesde"),
        fechaHasta: getString(formData, "fechaHasta"),
        cantidad: getString(formData, "cantidad"),
      })

      await handleAccidentesCotizacion(payload)
      return jsonData({ success: true }, { rateLimit })
    }

    if (formType === "caucion-preaprobacion") {
      const payload = caucionPreaprobacionSchema.parse({
        dni: getString(formData, "dni"),
        nombre: getString(formData, "nombre"),
        apellido: getString(formData, "apellido"),
        domicilio: getString(formData, "domicilio"),
        ciudad: getString(formData, "ciudad"),
        modoContacto: getString(formData, "modoContacto"),
        contactoValor: getString(formData, "contactoValor"),
        provincia: getString(formData, "provincia"),
        alquiler: getString(formData, "alquiler"),
        duracion: getString(formData, "duracion"),
        modoPago: getString(formData, "modoPago"),
        restitucion: getString(formData, "restitucion") === "true",
        ingresosMensuales: getString(formData, "ingresosMensuales"),
        ingresoFamiliar: getString(formData, "ingresoFamiliar"),
        avalesDnis: getStringArray(formData, "avalesDnis"),
        avalesNombres: getStringArray(formData, "avalesNombres"),
        tiposDocumentacion: getStringArray(formData, "tiposDocumentacion"),
        inmobiliaria: getString(formData, "inmobiliaria"),
        idProductor: getString(formData, "idProductor"),
        archivos: getFiles(formData, "archivos"),
      })

      await handleCaucionPreaprobacion(payload)
      return jsonData({ success: true }, { rateLimit })
    }

    if (formType === "contacto") {
      const formId = getString(formData, "_formId")
      const config = getFormConfig(formId)

      if (!config) {
        return jsonError(`Formulario "${formId}" no encontrado.`, 400, {
          rateLimit,
        })
      }

      const stringEntries = toStringObject(formData)
      delete stringEntries._formType
      const payload = buildContactFormSchema(config).parse(
        stringEntries
      ) as ContactFormPayload

      const values = Object.entries(payload).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (key !== "_formId") {
            acc[key] = typeof value === "string" ? value : String(value ?? "")
          }

          return acc
        },
        {}
      )

      await handleContacto(config, values)
      return jsonData({ success: true }, { rateLimit })
    }

    return jsonError("Tipo de formulario no reconocido.", 400, { rateLimit })
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError(getZodMessage(error), 400, { rateLimit })
    }

    if (error instanceof Error && error.message === "Unexpected file upload.") {
      return jsonError(error.message, 400, { rateLimit })
    }

    const message =
      error instanceof Error ? error.message : "Error al enviar el formulario."
    return jsonError(message, 500, { rateLimit })
  }
}
