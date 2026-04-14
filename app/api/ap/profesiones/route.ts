import { NextResponse } from "next/server"

import { woranzFetch } from "@/lib/woranz-api"

export async function GET() {
  try {
    const res = await woranzFetch("/profesiones/498")
    const json = await res.json()

    if (json.error) {
      return NextResponse.json(
        { error: json.error.message ?? "Error al obtener ocupaciones" },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: json.data ?? [] })
  } catch {
    return NextResponse.json(
      { error: "Error al obtener ocupaciones" },
      { status: 500 }
    )
  }
}
