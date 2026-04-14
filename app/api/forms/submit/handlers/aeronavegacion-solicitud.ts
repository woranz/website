import type { AeronavegacionSolicitudPayload } from "@/lib/api/schemas/forms"
import { sendEmail, type EmailAttachment } from "@/lib/email/send"
import { sanitizeEmailHeaderValue } from "@/lib/email/sanitize"
import {
  buildAeronavegacionEmail,
  type AeronavegacionEmailData,
} from "@/lib/email/templates/aeronavegacion-solicitud"

export async function handleAeronavegacionSolicitud(
  payload: AeronavegacionSolicitudPayload
) {
  const data: AeronavegacionEmailData = {
    dni: payload.dni,
    cuit: payload.cuit,
    nombreCompleto: payload.nombreCompleto,
    email: payload.email,
    telefono: payload.telefono,
    condicionFiscal: payload.condicionFiscal,
    localidad: payload.localidad,
    provincia: payload.provincia,
    matricula: payload.matricula,
    marca: payload.marca,
    modelo: payload.modelo,
    anio: payload.anio,
    nroSerie: payload.nroSerie,
    tipoAeronave: payload.tipoAeronave,
    asientosTripulantes: payload.asientosTripulantes,
    asientosPasajeros: payload.asientosPasajeros,
    ultimoOverhaul: payload.ultimoOverhaul,
    vencimientoPoliza: payload.vencimientoPoliza,
    siniestraliadAeronave: payload.siniestraliadAeronave,
    usoAnualHoras: payload.usoAnualHoras,
    actividades: payload.actividades,
    baseOperaciones: payload.baseOperaciones,
    limiteGeografico: payload.limiteGeografico,
    coberturas: payload.coberturas,
    hasFerryFlight: payload.hasFerryFlight,
    ferryRuta: payload.ferryRuta,
    ferrySalida: payload.ferrySalida,
    ferryArribo: payload.ferryArribo,
    comandante: payload.comandante,
    copiloto: payload.copiloto,
    hasAirportPresence: payload.hasAirportPresence,
    edificiosHangares: payload.edificiosHangares,
    ocupacion: payload.ocupacion,
    vehiculosEquipos: payload.vehiculosEquipos,
    actividadesPrincipales: payload.actividadesPrincipales,
    siniestraliadRC: payload.siniestraliadRC,
    isHangarista: payload.isHangarista,
    valorPromedioCustodia: payload.valorPromedioCustodia,
    valorMaximoCustodia: payload.valorMaximoCustodia,
    nroPromedioAeronaves: payload.nroPromedioAeronaves,
    siniestraliadAsegurado: payload.siniestraliadAsegurado,
    comentarios: payload.comentarios,
    modoContacto: payload.modoContacto,
    contactoValor: payload.contactoValor,
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

  const html = buildAeronavegacionEmail(data)

  await sendEmail({
    to:
      process.env.NODE_ENV === "development"
        ? "live@woranz.com"
        : "patrimoniales@woranz.com",
    subject: sanitizeEmailHeaderValue(
      `Solicitud Aeronavegación — ${data.nombreCompleto} — ${data.matricula}`
    ),
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  })
}
