import { NextResponse } from "next/server"

import { getIdPlanComercial, woranzFetch } from "@/lib/woranz-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const idPlanComercial = await getIdPlanComercial()

    const payload = {
      idVigencia: 17,
      idPlanComercial,
      idCoberturaPaquete: 498,
      idPersonaTipo: 1,
      idCondicionFiscal: 1,
      idFormaCobro: 1,
      ...body,
      idSeccion: 12,
    }

    const res = await woranzFetch("/ap/cotizacion/opciones", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (json.error) {
      return NextResponse.json(
        { error: json.error.message ?? "Error al obtener opciones de cotización" },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: json.data ?? [] })
  } catch {
    return NextResponse.json(
      { error: "Error al obtener opciones de cotización" },
      { status: 500 }
    )
  }
}
