import { sendEmail, type EmailAttachment } from "@/lib/email/send"
import {
  buildPreaprobacionEmail,
  type PreaprobacionEmailData,
} from "@/lib/email/templates/preaprobacion"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB total

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

export async function handleCaucionPreaprobacion(formData: FormData) {
  // Extract text fields
  const getString = (key: string) => (formData.get(key) as string) ?? ""

  const data: PreaprobacionEmailData = {
    dni: getString("dni"),
    nombre: getString("nombre"),
    apellido: getString("apellido"),
    domicilio: getString("domicilio"),
    ciudad: getString("ciudad"),
    modoContacto: getString("modoContacto"),
    contactoValor: getString("contactoValor"),
    provincia: getString("provincia"),
    alquiler: getString("alquiler"),
    duracion: getString("duracion"),
    modoPago: getString("modoPago"),
    restitucion: getString("restitucion"),
    ingresosMensuales: getString("ingresosMensuales"),
    ingresoFamiliar: getString("ingresoFamiliar"),
    avalesDnis: formData.getAll("avalesDnis") as string[],
    tiposDocumentacion: formData.getAll("tiposDocumentacion") as string[],
    inmobiliaria: getString("inmobiliaria"),
    idProductor: getString("idProductor"),
  }

  // Validate required fields
  const required = ["dni", "nombre", "apellido", "ciudad", "modoContacto", "contactoValor", "ingresosMensuales"] as const
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`El campo "${field}" es obligatorio.`)
    }
  }

  // Process file attachments
  const files = formData.getAll("archivos") as File[]
  const attachments: EmailAttachment[] = []
  let totalSize = 0

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue
    totalSize += file.size
    if (totalSize > MAX_FILE_SIZE) {
      throw new Error("Los archivos adjuntos superan el límite de 10MB.")
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    attachments.push({
      content: buffer.toString("base64"),
      filename: file.name,
      type: file.type || "application/octet-stream",
    })
  }

  // Build email
  const html = buildPreaprobacionEmail(data)
  const cc = getCcRecipients(data.ciudad)

  await sendEmail({
    to: process.env.NODE_ENV === "development" ? "live@woranz.com" : "alquileres@woranz.com",
    cc: process.env.NODE_ENV === "development" ? undefined : cc.length > 0 ? cc : undefined,
    subject: `Pre-aprobación Caución — ${data.nombre} ${data.apellido} — DNI ${data.dni}`,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  })
}
