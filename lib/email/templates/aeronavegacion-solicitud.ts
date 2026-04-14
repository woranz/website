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
  ultimoOverhaul: string
  vencimientoPoliza: string
  siniestraliadAeronave: string

  // Operación
  usoAnualHoras: string
  actividades: string
  baseOperaciones: string
  limiteGeografico: string

  // Coberturas
  coberturas: string

  // Ferry
  hasFerryFlight: boolean
  ferryRuta: string
  ferrySalida: string
  ferryArribo: string
  comandante: string
  copiloto: string

  // RC ARIEL
  hasAirportPresence: boolean
  edificiosHangares: string
  ocupacion: string
  vehiculosEquipos: string
  actividadesPrincipales: string
  siniestraliadRC: string

  // Hangarista
  isHangarista: boolean
  valorPromedioCustodia: string
  valorMaximoCustodia: string
  nroPromedioAeronaves: string

  // Envío
  siniestraliadAsegurado: string
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

function parsePiloto(json: string): Record<string, string> | null {
  try {
    const data = JSON.parse(json)
    return data && typeof data === "object" ? data : null
  } catch {
    return null
  }
}

function pilotoRows(label: string, json: string): string {
  const data = parsePiloto(json)
  if (!data) return ""

  return `
    ${emailSectionTitle(label)}
    ${emailTable(
      emailRow("Nombre", data.nombre || "") +
      emailRow("Edad", data.edad || "") +
      emailRow("DNI", data.dni || "") +
      emailRow("Licencia", data.licencia || "") +
      emailRow("Vencimiento CMA", data.vencimientoCMA || "") +
      emailRow("Horas totales", data.horasTotal || "") +
      emailRow("Horas en tipo", data.horasTipo || "") +
      emailRow("Horas en marca/modelo", data.horasMarcaModelo || "") +
      emailRow("Horas otros", data.horasOtros || "") +
      emailRow("Siniestralidad", data.siniestralidad || "")
    )}
  `
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
      emailRow("Último overhaul", data.ultimoOverhaul) +
      emailRow("Vencimiento póliza vigente", data.vencimientoPoliza) +
      emailRow("Siniestralidad aeronave (5 años)", data.siniestraliadAeronave)
    )}

    ${emailSectionTitle("Operación")}
    ${emailTable(
      emailRow("Uso anual (horas)", data.usoAnualHoras) +
      emailRow("Actividades", data.actividades) +
      emailRow("Base de operaciones", data.baseOperaciones) +
      emailRow("Límite geográfico", data.limiteGeografico)
    )}

    ${coberturas.length > 0 ? `
      ${emailSectionTitle("Coberturas solicitadas")}
      ${emailTable(
        coberturas.map((c) => emailRow(c.tipo, c.suma ? `$ ${c.suma}` : "—")).join("")
      )}
    ` : ""}

    ${data.hasFerryFlight ? `
      ${emailSectionTitle("Vuelo Ferry")}
      ${emailTable(
        emailRow("Ruta", data.ferryRuta) +
        emailRow("Fecha salida", data.ferrySalida) +
        emailRow("Fecha arribo", data.ferryArribo)
      )}
      ${pilotoRows("Comandante", data.comandante)}
      ${pilotoRows("Copiloto", data.copiloto)}
    ` : ""}

    ${data.hasAirportPresence ? `
      ${emailSectionTitle("Ubicación en aeropuerto")}
      ${emailTable(
        emailRow("Edificios/hangares", data.edificiosHangares) +
        emailRow("Ocupación", data.ocupacion) +
        emailRow("Vehículos y equipos", data.vehiculosEquipos) +
        emailRow("Actividades principales", data.actividadesPrincipales) +
        emailRow("Siniestralidad RC (5 años)", data.siniestraliadRC)
      )}
    ` : ""}

    ${data.isHangarista ? `
      ${emailSectionTitle("Hangarista")}
      ${emailTable(
        emailRow("Valor promedio custodia", data.valorPromedioCustodia) +
        emailRow("Valor máximo custodia", data.valorMaximoCustodia) +
        emailRow("Nro. promedio aeronaves", data.nroPromedioAeronaves)
      )}
    ` : ""}

    ${data.siniestraliadAsegurado ? `
      ${emailSectionTitle("Siniestralidad del asegurado")}
      <p style="margin:8px 0;font-size:14px;color:#1A1A2E;">${data.siniestraliadAsegurado}</p>
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
