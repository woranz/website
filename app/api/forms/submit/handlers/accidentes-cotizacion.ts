import { sendEmail } from "@/lib/email/send"
import {
  buildAccidentesCotizacionEmail,
  type AccidentesCotizacionEmailData,
} from "@/lib/email/templates/accidentes-cotizacion"

export async function handleAccidentesCotizacion(formData: FormData) {
  const getString = (key: string) => (formData.get(key) as string) ?? ""

  const data: AccidentesCotizacionEmailData = {
    actividad: getString("actividad"),
    fechaDesde: getString("fechaDesde"),
    fechaHasta: getString("fechaHasta"),
    cantidad: getString("cantidad"),
  }

  const html = buildAccidentesCotizacionEmail(data)

  await sendEmail({
    to: "alquileres@woranz.com",
    subject: `Cotización Accidentes Personales — ${data.actividad} (${data.cantidad} persona${data.cantidad === "1" ? "" : "s"})`,
    html,
  })
}
