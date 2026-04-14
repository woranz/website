import type { AccidentesCotizacionPayload } from "@/lib/api/schemas/forms"
import { sendEmail } from "@/lib/email/send"
import { sanitizeEmailHeaderValue } from "@/lib/email/sanitize"
import { DEV_EMAIL, isNonProductionEnv } from "@/lib/email/dev-override"
import {
  buildAccidentesCotizacionEmail,
  type AccidentesCotizacionEmailData,
} from "@/lib/email/templates/accidentes-cotizacion"

export async function handleAccidentesCotizacion(
  payload: AccidentesCotizacionPayload
) {
  const data: AccidentesCotizacionEmailData = {
    actividad: payload.actividad,
    fechaDesde: payload.fechaDesde,
    fechaHasta: payload.fechaHasta,
    cantidad: String(payload.cantidad),
  }

  const html = buildAccidentesCotizacionEmail(data)

  await sendEmail({
    to: isNonProductionEnv() ? DEV_EMAIL : "alquileres@woranz.com",
    subject: sanitizeEmailHeaderValue(
      `Cotización Accidentes Personales — ${data.actividad} (${data.cantidad} persona${data.cantidad === "1" ? "" : "s"})`
    ),
    html,
  })
}
