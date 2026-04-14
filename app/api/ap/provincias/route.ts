import { NextResponse } from "next/server"

import { woranzFetch } from "@/lib/woranz-api"

export async function GET() {
  try {
    const res = await woranzFetch("/personas/provincias")
    const json = await res.json()

    if (json.error) {
      return NextResponse.json(
        { error: json.error.message ?? "Error al obtener provincias" },
        { status: 422 }
      )
    }

    return NextResponse.json({ data: json.data ?? [] })
  } catch {
    return NextResponse.json(
      { error: "Error al obtener provincias" },
      { status: 500 }
    )
  }
}
