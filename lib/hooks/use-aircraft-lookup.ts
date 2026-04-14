"use client"

import { useCallback, useRef, useState } from "react"

import { ICAO_TYPE_MAP } from "@/lib/forms/constants/aeronavegacion"

type AircraftLookupResult = {
  marca?: string
  modelo?: string
  nroSerie?: string
  tipoAeronave?: string
}

export function useAircraftLookup() {
  const [loading, setLoading] = useState(false)
  const lookedUpRef = useRef<string | null>(null)

  const lookup = useCallback(async (matricula: string): Promise<AircraftLookupResult | null> => {
    const cleaned = matricula.trim().toUpperCase()
    if (!/^L[VQ]-[A-Z]{3}$/.test(cleaned)) return null
    if (lookedUpRef.current === cleaned) return null

    setLoading(true)
    try {
      const res = await fetch("/api/aeronavegacion/aircraft-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula: cleaned }),
      })
      const json = await res.json()
      lookedUpRef.current = cleaned

      if (!json.data) return null

      const result: AircraftLookupResult = {}
      if (json.data.marca) result.marca = json.data.marca
      if (json.data.modelo) result.modelo = json.data.modelo
      if (json.data.nroSerie) result.nroSerie = json.data.nroSerie
      if (json.data.icaoType && ICAO_TYPE_MAP[json.data.icaoType]) {
        result.tipoAeronave = ICAO_TYPE_MAP[json.data.icaoType]
      }

      return result
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    lookedUpRef.current = null
  }, [])

  return { lookup, loading, reset }
}
