import { type NextRequest, NextResponse } from "next/server"

import { woranzFetch } from "@/lib/woranz-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const idEmision = searchParams.get("idEmision")
    const idImpresion = searchParams.get("idImpresion") ?? "0"

    if (!idEmision) {
      return NextResponse.json(
        { error: "ID de emisión requerido" },
        { status: 400 }
      )
    }

    const res = await woranzFetch(
      `/polizas/documentos?idEmision=${idEmision}&itemNro=0&idImpresion=${idImpresion}`
    )

    const json = await res.json()

    if (json.error) {
      return NextResponse.json(
        { error: json.error.message ?? "Error al obtener documentos" },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: json.data })
  } catch {
    return NextResponse.json(
      { error: "Error al obtener documentos" },
      { status: 500 }
    )
  }
}
