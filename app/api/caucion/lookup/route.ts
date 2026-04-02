import { NextResponse } from "next/server"

import { lookupPersona } from "@/lib/woranz-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const dni = body.dni as string

    if (!dni || dni.length < 7 || dni.length > 8) {
      return NextResponse.json(
        { error: "DNI inválido. Debe tener 7 u 8 dígitos." },
        { status: 400 }
      )
    }

    const persona = await lookupPersona(dni)

    if (!persona) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data: persona })
  } catch {
    return NextResponse.json(
      { error: "Error al buscar los datos. Intentá de nuevo." },
      { status: 500 }
    )
  }
}
