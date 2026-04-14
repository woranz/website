import type { CaucionPreaprobacionPayload } from "@/lib/api/schemas/forms"
import { sendEmail, type EmailAttachment } from "@/lib/email/send"
import { sanitizeEmailHeaderValue } from "@/lib/email/sanitize"
import { DEV_EMAIL, isNonProductionEnv } from "@/lib/email/dev-override"
import {
  buildPreaprobacionEmail,
  type PreaprobacionEmailData,
} from "@/lib/email/templates/preaprobacion"

/** Determine CC recipients based on city name */
function getCcRecipients(ciudad: string): string[] {
  const cc: string[] = []
  const lower = ciudad.toLowerCase()

  if (lower.includes("mar del plata")) {
    cc.push("mardelplata@woranz.com")
  }
  if (lower.includes("córdoba") || lower.includes("cordoba")) {
    cc.push("cordoba@woranz.com")
  }
  if (
    lower.includes("mendoza") ||
    lower.includes("san juan") ||
    lower.includes("san luis") ||
    lower.includes("cuyo")
  ) {
    cc.push("herman.axelrad@woranz.com")
  }

  return cc
}

export async function handleCaucionPreaprobacion(
  payload: CaucionPreaprobacionPayload
) {
  const data: PreaprobacionEmailData = {
    dni: payload.dni,
    nombre: payload.nombre,
    apellido: payload.apellido,
    domicilio: payload.domicilio,
    ciudad: payload.ciudad,
    modoContacto: payload.modoContacto,
    contactoValor: payload.contactoValor,
    provincia: payload.provincia,
    alquiler: String(payload.alquiler),
    duracion: String(payload.duracion),
    modoPago: payload.modoPago,
    restitucion: payload.restitucion ? "true" : "false",
    ingresosMensuales: String(payload.ingresosMensuales),
    ingresoFamiliar: String(payload.ingresoFamiliar),
    avalesDnis: payload.avalesDnis,
    tiposDocumentacion: payload.tiposDocumentacion,
    inmobiliaria: payload.inmobiliaria,
    idProductor: payload.idProductor,
  }

  const attachments: EmailAttachment[] = []

  for (const file of payload.archivos) {
    const buffer = Buffer.from(await file.arrayBuffer())
    attachments.push({
      content: buffer.toString("base64"),
      filename: file.name,
      type: file.type || "application/octet-stream",
    })
  }

  const html = buildPreaprobacionEmail(data)
  const cc = getCcRecipients(data.ciudad)

  await sendEmail({
    to: isNonProductionEnv() ? DEV_EMAIL : "alquileres@woranz.com",
    cc: isNonProductionEnv()
      ? undefined
      : cc.length > 0
        ? cc
        : undefined,
    subject: sanitizeEmailHeaderValue(
      `Pre-aprobación Caución — ${data.nombre} ${data.apellido} — DNI ${data.dni}`
    ),
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  })
}
