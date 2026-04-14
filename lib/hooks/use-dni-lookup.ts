"use client"

import { useCallback, useRef, useState } from "react"

type DniLookupResult = {
  nombreCompleto?: string
  cuit?: string
  localidad?: string
  provincia?: string
  email?: string
}

export function useDniLookup() {
  const [loading, setLoading] = useState(false)
  const lookedUpRef = useRef<string | null>(null)

  const lookup = useCallback(async (dni: string): Promise<DniLookupResult | null> => {
    const cleaned = dni.replace(/\D/g, "")
    if (cleaned.length < 7 || cleaned.length > 8) return null
    if (lookedUpRef.current === cleaned) return null

    setLoading(true)
    try {
      const res = await fetch("/api/aeronavegacion/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: cleaned }),
      })
      const json = await res.json()
      lookedUpRef.current = cleaned
      return json.data ?? null
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
