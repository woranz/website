"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ComboboxOption } from "@/components/ui/combobox"

// ── Province data ────────────────────────────────────────────────────

export const PROVINCIAS: Array<ComboboxOption & { impuesto: number }> = [
  { value: "caba", label: "CABA", impuesto: 0.03 },
  { value: "buenos-aires", label: "Buenos Aires", impuesto: 0.035 },
  { value: "cordoba", label: "Córdoba", impuesto: 0.04 },
  { value: "santa-fe", label: "Santa Fe", impuesto: 0.038 },
  { value: "mendoza", label: "Mendoza", impuesto: 0.035 },
  { value: "tucuman", label: "Tucumán", impuesto: 0.04 },
  { value: "entre-rios", label: "Entre Ríos", impuesto: 0.035 },
  { value: "salta", label: "Salta", impuesto: 0.035 },
  { value: "misiones", label: "Misiones", impuesto: 0.04 },
  { value: "chaco", label: "Chaco", impuesto: 0.035 },
  { value: "corrientes", label: "Corrientes", impuesto: 0.035 },
  { value: "santiago-del-estero", label: "Santiago del Estero", impuesto: 0.04 },
  { value: "san-juan", label: "San Juan", impuesto: 0.035 },
  { value: "jujuy", label: "Jujuy", impuesto: 0.035 },
  { value: "rio-negro", label: "Río Negro", impuesto: 0.03 },
  { value: "neuquen", label: "Neuquén", impuesto: 0.03 },
  { value: "formosa", label: "Formosa", impuesto: 0.035 },
  { value: "chubut", label: "Chubut", impuesto: 0.03 },
  { value: "san-luis", label: "San Luis", impuesto: 0.035 },
  { value: "catamarca", label: "Catamarca", impuesto: 0.035 },
  { value: "la-rioja", label: "La Rioja", impuesto: 0.035 },
  { value: "la-pampa", label: "La Pampa", impuesto: 0.03 },
  { value: "santa-cruz", label: "Santa Cruz", impuesto: 0.03 },
  { value: "tierra-del-fuego", label: "Tierra del Fuego", impuesto: 0.03 },
]

function matchProvinciaSlug(nombre: string): string | undefined {
  const normalized = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return PROVINCIAS.find((p) => {
    const pNorm = p.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return pNorm === normalized
  })?.value
}

// ── Georef search result ─────────────────────────────────────────────

type GeorefOption = {
  id: string
  nombre: string
  /** Only present for localidades mode */
  provincia?: string
}

// ── Mode configs ─────────────────────────────────────────────────────

type ModeConfig = {
  endpoint: string
  fields: string
  responseKey: string
  placeholder: string
  // biome-ignore lint/suspicious/noExplicitAny: georef response shape varies per endpoint
  mapResults: (raw: any[]) => GeorefOption[]
  resolveValue: (opt: GeorefOption) => { display: string; value: string } | null
}

const MODE_CONFIGS: Record<string, ModeConfig> = {
  provincias: {
    endpoint: "provincias",
    fields: "id,nombre",
    responseKey: "provincias",
    placeholder: "Buscá tu provincia...",
    mapResults: (raw) => raw.map((r) => ({ id: r.id, nombre: r.nombre })),
    resolveValue: (opt) => {
      const slug = matchProvinciaSlug(opt.nombre)
      return slug ? { display: opt.nombre, value: slug } : null
    },
  },
  localidades: {
    endpoint: "localidades",
    fields: "id,nombre,provincia.nombre",
    responseKey: "localidades",
    placeholder: "Buscá tu ciudad...",
    mapResults: (raw) =>
      raw.map((r: { id: string; nombre: string; provincia: { nombre: string } }) => ({
        id: r.id,
        nombre: r.nombre,
        provincia: r.provincia.nombre,
      })),
    resolveValue: (opt) => {
      const label = opt.provincia ? `${opt.nombre}, ${opt.provincia}` : opt.nombre
      return { display: label, value: label }
    },
  },
}

// ── Base component ───────────────────────────────────────────────────

type GeorefSearchProps = {
  mode: "provincias" | "localidades"
  value: string
  onChange: (value: string) => void
  className?: string
  /** Custom placeholder — overrides mode default */
  placeholder?: string
  /** Visual variant: "filled" uses bg-woranz-warm-2 wrapper, "outline" uses standard input */
  variant?: "filled" | "outline"
}

export function GeorefSearch({
  mode,
  value,
  onChange,
  className,
  placeholder,
  variant = "filled",
}: GeorefSearchProps) {
  const config = MODE_CONFIGS[mode]

  // For provincias mode, resolve the initial display from the slug
  const initialDisplay =
    mode === "provincias"
      ? (PROVINCIAS.find((p) => p.value === value)?.label ?? "")
      : value

  const [query, setQuery] = useState(initialDisplay)
  const [options, setOptions] = useState<GeorefOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setOptions([])
        return
      }
      setLoading(true)
      try {
        const res = await fetch(
          `/api/georef?endpoint=${config.endpoint}&nombre=${encodeURIComponent(q)}&campos=${config.fields}`
        )
        const data = await res.json()
        setOptions(config.mapResults(data[config.responseKey] ?? []))
      } catch {
        setOptions([])
      } finally {
        setLoading(false)
      }
    },
    [config]
  )

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 500)
    return () => clearTimeout(debounceRef.current)
  }, [query, search])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const inputEl = (
    <Input
      type="text"
      placeholder={placeholder ?? config.placeholder}
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        setOpen(true)
        if (e.target.value !== initialDisplay) onChange(mode === "provincias" ? "buenos-aires" : "")
      }}
      onFocus={() => {
        if (mode === "provincias") {
          setQuery("")
          setOpen(true)
          search("")
        } else if (query.length >= 2) {
          setOpen(true)
        }
      }}
      className={variant === "filled" ? "border-0 bg-transparent shadow-none" : undefined}
    />
  )

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {variant === "filled" ? (
        <div className="flex items-center rounded-field bg-woranz-warm-2">
          {inputEl}
          {loading && (
            <Loader2 className="mr-3 h-4 w-4 shrink-0 animate-spin text-woranz-muted" />
          )}
        </div>
      ) : (
        <div className="relative">
          {inputEl}
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-woranz-muted" />
          )}
        </div>
      )}

      {open && (options.length > 0 || loading) && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-woranz-border bg-white shadow-panel">
          {variant === "outline" && loading && options.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-woranz-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando...
            </div>
          )}
          {options.map((opt) => {
            const resolved = config.resolveValue(opt)
            if (!resolved) return null
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setQuery(resolved.display)
                  onChange(resolved.value)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-woranz-slate transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-woranz-warm-1"
              >
                <span className="font-medium">{opt.nombre}</span>
                {opt.provincia && (
                  <span className="text-woranz-muted">{opt.provincia}</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Convenience wrappers ─────────────────────────────────────────────

export function ProvinciaSearch(props: {
  value: string
  onChange: (slug: string) => void
  className?: string
  placeholder?: string
}) {
  return <GeorefSearch mode="provincias" variant="filled" {...props} />
}

export function CiudadSearch(props: {
  value: string
  onChange: (ciudad: string) => void
  className?: string
  placeholder?: string
}) {
  return <GeorefSearch mode="localidades" variant="outline" {...props} />
}
