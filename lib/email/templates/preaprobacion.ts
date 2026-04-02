import { emailRow, emailSectionTitle, emailTable, wrapInEmailLayout } from "./base"

export type PreaprobacionEmailData = {
  // Personal
  dni: string
  nombre: string
  apellido: string
  domicilio: string
  ciudad: string

  // Contact
  modoContacto: string
  contactoValor: string

  // Cotización
  provincia: string
  alquiler: string
  duracion: string
  modoPago: string

  // Ingresos
  ingresosMensuales: string
  ingresoFamiliar: string

  // Avales
  avalesDnis: string[]

  // Documentación
  tiposDocumentacion: string[]

  // Meta
  inmobiliaria: string
  idProductor: string
}

export function buildPreaprobacionEmail(data: PreaprobacionEmailData): string {
  const modoContactoLabel: Record<string, string> = {
    email: "Email",
    llamada: "Llamada telefónica",
    whatsapp: "WhatsApp",
  }

  const totalIngresos =
    (Number.parseFloat(data.ingresosMensuales) || 0) +
    (Number.parseFloat(data.ingresoFamiliar) || 0)

  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A1A2E;">
      Nueva solicitud de pre-aprobación
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
      Caución de Alquiler — ${data.nombre} ${data.apellido}
    </p>

    ${emailSectionTitle("Datos personales")}
    ${emailTable(
      emailRow("Documento", data.dni) +
      emailRow("Nombre", data.nombre) +
      emailRow("Apellido", data.apellido) +
      emailRow("Domicilio", data.domicilio) +
      emailRow("Ciudad", data.ciudad)
    )}

    ${emailSectionTitle("Contacto")}
    ${emailTable(
      emailRow("Modo de contacto", modoContactoLabel[data.modoContacto] ?? data.modoContacto) +
      emailRow(modoContactoLabel[data.modoContacto] ?? "Dato", data.contactoValor)
    )}

    ${emailSectionTitle("Cotización")}
    ${emailTable(
      emailRow("Provincia", data.provincia) +
      emailRow("Valor del alquiler", `$${data.alquiler}`) +
      emailRow("Duración del contrato", `${data.duracion} meses`) +
      emailRow("Modo de pago", data.modoPago === "cuotas" ? "6 cuotas sin interés" : "Contado (10% off)")
    )}

    ${emailSectionTitle("Ingresos")}
    ${emailTable(
      emailRow("Ingresos mensuales", `$${data.ingresosMensuales}`) +
      (data.ingresoFamiliar && data.ingresoFamiliar !== "0"
        ? emailRow("Ingreso familiar", `$${data.ingresoFamiliar}`)
        : "") +
      emailRow("Total ingresos", `$${totalIngresos.toLocaleString("es-AR")}`)
    )}

    ${data.avalesDnis.length > 0 ? `
      ${emailSectionTitle("Avales")}
      ${emailTable(
        data.avalesDnis.map((dni, i) => emailRow(`Aval ${i + 1}`, `DNI ${dni}`)).join("")
      )}
    ` : ""}

    ${data.tiposDocumentacion.length > 0 ? `
      ${emailSectionTitle("Documentación adjunta")}
      <ul style="margin:8px 0;padding-left:20px;font-size:14px;color:#1A1A2E;">
        ${data.tiposDocumentacion.map((t) => `<li style="margin-bottom:4px;">${t}</li>`).join("")}
      </ul>
    ` : ""}

    ${emailSectionTitle("Información adicional")}
    ${emailTable(
      (data.inmobiliaria ? emailRow("Inmobiliaria", data.inmobiliaria) : "") +
      (data.idProductor ? emailRow("ID Productor", data.idProductor) : "")
    )}
  `

  return wrapInEmailLayout(body, { title: "Pre-aprobación Caución - Woranz" })
}
