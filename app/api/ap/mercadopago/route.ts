import { NextResponse } from "next/server"

import { woranzFetch } from "@/lib/woranz-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await woranzFetch("/mercadopago/preference-ap", {
      method: "POST",
      body: JSON.stringify(body),
    })

    const json = await res.json()

    if (json.error) {
      return NextResponse.json(
        { error: json.error.message ?? json.error ?? "Error al crear preferencia de pago" },
        { status: 422 }
      )
    }

    return NextResponse.json(json)
  } catch {
    return NextResponse.json(
      { error: "Error al crear preferencia de pago" },
      { status: 500 }
    )
  }
}
