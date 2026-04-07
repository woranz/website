import { emailRow, emailSectionTitle, emailTable, wrapInEmailLayout } from "./base"

export type AccidentesCotizacionEmailData = {
  actividad: string
  fechaDesde: string
  fechaHasta: string
  cantidad: string
}

export function buildAccidentesCotizacionEmail(data: AccidentesCotizacionEmailData): string {
  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A1A2E;">
      Nueva cotización de Accidentes Personales
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
      Solicitud desde el cotizador online
    </p>

    ${emailSectionTitle("Datos de la cotización")}
    ${emailTable(
      emailRow("Actividad", data.actividad) +
      emailRow("Vigencia desde", data.fechaDesde) +
      emailRow("Vigencia hasta", data.fechaHasta) +
      emailRow("Cantidad de personas", data.cantidad)
    )}
  `

  return wrapInEmailLayout(body, { title: "Cotización Accidentes Personales - Woranz" })
}
