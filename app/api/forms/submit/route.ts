import { NextResponse } from "next/server"

import { handleAccidentesCotizacion } from "./handlers/accidentes-cotizacion"
import { handleCaucionPreaprobacion } from "./handlers/caucion-preaprobacion"

const handlers: Record<string, (formData: FormData) => Promise<void>> = {
  "accidentes-cotizacion": handleAccidentesCotizacion,
  "caucion-preaprobacion": handleCaucionPreaprobacion,
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const formType = formData.get("_formType") as string

    if (!formType || !handlers[formType]) {
      return NextResponse.json(
        { error: "Tipo de formulario no reconocido." },
        { status: 400 }
      )
    }

    await handlers[formType](formData)

    return NextResponse.json({ success: true })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al enviar el formulario."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
