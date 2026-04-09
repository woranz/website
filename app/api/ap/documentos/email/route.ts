import { type NextRequest, NextResponse } from "next/server"

import { woranzFetch } from "@/lib/woranz-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const idEmision = searchParams.get("idEmision")
    const email = searchParams.get("email")
    const idImpresion = searchParams.get("idImpresion") ?? "361"

    if (!idEmision || !email) {
      return NextResponse.json(
        { error: "ID de emisión y email son requeridos" },
        { status: 400 }
      )
    }

    const res = await woranzFetch(
      `/polizas/documentos/email?idEmision=${idEmision}&itemNro=0&idImpresion=${idImpresion}&email=${encodeURIComponent(email)}`
    )

    const json = await res.json()

    if (json.error) {
      return NextResponse.json(
        { error: json.error.message ?? "Error al enviar documentos" },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: json.data })
  } catch {
    return NextResponse.json(
      { error: "Error al enviar documentos por email" },
      { status: 500 }
    )
  }
}
