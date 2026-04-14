import { NextResponse } from "next/server"

import { woranzFetch } from "@/lib/woranz-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { idEmision } = body

    if (!idEmision) {
      return NextResponse.json(
        { error: "ID de emisión requerido" },
        { status: 400 }
      )
    }

    const res = await woranzFetch(`/ap/propuesta/confirmar/${idEmision}`, {
      method: "POST",
    })

    const json = await res.json()

    if (json.error) {
      // "La propuesta ya fue confirmada" is not a real error
      if (
        typeof json.error.message === "string" &&
        json.error.message.includes("ya fue confirmada")
      ) {
        return NextResponse.json({ data: { alreadyConfirmed: true } })
      }
      return NextResponse.json(
        { error: json.error.message ?? "Error al confirmar propuesta" },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: json.data })
  } catch {
    return NextResponse.json(
      { error: "Error al confirmar propuesta" },
      { status: 500 }
    )
  }
}
