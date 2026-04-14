import { sendEmail, type EmailAttachment } from "@/lib/email/send"
import { DEV_EMAIL, isNonProductionEnv } from "@/lib/email/dev-override"
import {
  buildAeronavegacionEmail,
  type AeronavegacionEmailData,
} from "@/lib/email/templates/aeronavegacion-solicitud"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB total

export async function handleAeronavegacionSolicitud(formData: FormData) {
  const getString = (key: string) => (formData.get(key) as string) ?? ""

  const data: AeronavegacionEmailData = {
    // Asegurado
    dni: getString("dni"),
    cuit: getString("cuit"),
    nombreCompleto: getString("nombreCompleto"),
    email: getString("email"),
    telefono: getString("telefono"),
    condicionFiscal: getString("condicionFiscal"),
    localidad: getString("localidad"),
    provincia: getString("provincia"),

    // Aeronave
    matricula: getString("matricula"),
    marca: getString("marca"),
    modelo: getString("modelo"),
    anio: getString("anio"),
    nroSerie: getString("nroSerie"),
    tipoAeronave: getString("tipoAeronave"),
    asientosTripulantes: getString("asientosTripulantes"),
    asientosPasajeros: getString("asientosPasajeros"),
    vencimientoPoliza: getString("vencimientoPoliza"),

    // Operación
    actividades: getString("actividades"),
    coberturas: getString("coberturas"),

    // Contacto
    comentarios: getString("comentarios"),
    modoContacto: getString("modoContacto"),
    contactoValor: getString("contactoValor"),
  }

  // Validate required fields
  const required = [
    "dni", "nombreCompleto", "email", "telefono",
    "matricula", "marca", "modelo", "tipoAeronave",
    "modoContacto", "contactoValor",
  ] as const
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

  const html = buildAeronavegacionEmail(data)

  await sendEmail({
    to: isNonProductionEnv() ? DEV_EMAIL : "patrimoniales@woranz.com",
    subject: `Solicitud Aeronavegación — ${data.nombreCompleto} — ${data.matricula}`,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  })
}
