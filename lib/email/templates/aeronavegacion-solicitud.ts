import { emailRow, emailSectionTitle, emailTable, wrapInEmailLayout } from "./base"

export type AeronavegacionEmailData = {
  // Asegurado
  dni: string
  cuit: string
  nombreCompleto: string
  email: string
  telefono: string
  condicionFiscal: string
  localidad: string
  provincia: string

  // Aeronave
  matricula: string
  marca: string
  modelo: string
  anio: string
  nroSerie: string
  tipoAeronave: string
  asientosTripulantes: string
  asientosPasajeros: string
  vencimientoPoliza: string

  // Operación
  actividades: string
  coberturas: string

  // Contacto
  comentarios: string
  modoContacto: string
  contactoValor: string
}

function parseCoberturas(json: string): Array<{ tipo: string; suma: string }> {
  try {
    return JSON.parse(json)
  } catch {
    return []
  }
}

export function buildAeronavegacionEmail(data: AeronavegacionEmailData): string {
  const modoContactoLabel: Record<string, string> = {
    email: "Email",
    llamada: "Llamada telefónica",
    whatsapp: "WhatsApp",
  }

  const coberturas = parseCoberturas(data.coberturas)

  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A1A2E;">
      Nueva solicitud de Aeronavegación
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
      ${data.nombreCompleto} — Matrícula ${data.matricula}
    </p>

    ${emailSectionTitle("Datos del asegurado")}
    ${emailTable(
      emailRow("DNI", data.dni) +
      emailRow("CUIT", data.cuit) +
      emailRow("Nombre", data.nombreCompleto) +
      emailRow("Email", data.email) +
      emailRow("Teléfono", data.telefono) +
      emailRow("Condición fiscal", data.condicionFiscal) +
      emailRow("Localidad", data.localidad) +
      emailRow("Provincia", data.provincia)
    )}

    ${emailSectionTitle("Aeronave")}
    ${emailTable(
      emailRow("Matrícula", data.matricula) +
      emailRow("Marca", data.marca) +
      emailRow("Modelo", data.modelo) +
      emailRow("Año", data.anio) +
      emailRow("Nro. serie", data.nroSerie) +
      emailRow("Tipo", data.tipoAeronave) +
      emailRow("Asientos tripulantes", data.asientosTripulantes) +
      emailRow("Asientos pasajeros", data.asientosPasajeros) +
      emailRow("Vencimiento póliza vigente", data.vencimientoPoliza)
    )}

    ${data.actividades ? `
      ${emailSectionTitle("Actividades")}
      <p style="margin:8px 0;font-size:14px;color:#1A1A2E;">${data.actividades}</p>
    ` : ""}

    ${coberturas.length > 0 ? `
      ${emailSectionTitle("Coberturas solicitadas")}
      ${emailTable(
        coberturas.map((c) => emailRow(c.tipo, c.suma ? `$ ${c.suma}` : "—")).join("")
      )}
    ` : ""}

    ${data.comentarios ? `
      ${emailSectionTitle("Comentarios")}
      <p style="margin:8px 0;font-size:14px;color:#1A1A2E;">${data.comentarios}</p>
    ` : ""}

    ${emailSectionTitle("Contacto preferido")}
    ${emailTable(
      emailRow("Modo", modoContactoLabel[data.modoContacto] ?? data.modoContacto) +
      emailRow(modoContactoLabel[data.modoContacto] ?? "Dato", data.contactoValor)
    )}
  `

  return wrapInEmailLayout(body, { title: "Solicitud Aeronavegación - Woranz" })
}
