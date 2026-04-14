import { NextResponse } from "next/server"

import { getIdPlanComercial, woranzFetch } from "@/lib/woranz-api"

const POLICY_DEFAULTS = {
  referencia: "Pago desde MercadoPago",
  detalleRiesgo: "",
  observaciones: "",
  formaCobro: {
    idFormaCobro: 1,
    idTarjetaEmpresa: 0,
    idTipoCuentaBancaria: 0,
    cbu: 0,
    numeroTarjeta: "",
    fechaVTOTarjeta: "2022-12-31",
  },
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const idPlanComercial = await getIdPlanComercial()

    const payload = {
      ...POLICY_DEFAULTS,
      ...body,
      idPlanComercial,
    }

    const res = await woranzFetch("/ap/propuesta", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (json.error) {
      const msg =
        typeof json.error === "string"
          ? json.error
          : json.error?.message ?? JSON.stringify(json.error)
      return NextResponse.json({ error: msg || "Error al crear propuesta" }, { status: 422 })
    }

    return NextResponse.json({ data: json.data })
  } catch {
    return NextResponse.json(
      { error: "Error al crear propuesta" },
      { status: 500 }
    )
  }
}
