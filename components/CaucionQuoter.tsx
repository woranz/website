"use client"

import Link from "next/link"
import { type Dispatch, type ReactNode, type SetStateAction, useCallback, useEffect, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const PROVINCIAS: Array<ComboboxOption & { impuesto: number }> = [
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

const DURACIONES = [
  { value: 12, label: "12 meses" },
  { value: 24, label: "24 meses" },
  { value: 36, label: "36 meses" },
]

const MODOS_PAGO = [
  { value: "contado", label: "Contado", descuento: 0.1 },
  { value: "cuotas", label: "6 cuotas", descuento: 0 },
]

const TASA_BASE = 0.045
function buildPreapprovalHref(params: {
  provincia: string
  alquiler: number
  duracion: string
  modoPago: string
}) {
  const search = new URLSearchParams({
    provincia: params.provincia,
    alquiler: params.alquiler.toString(),
    duracion: params.duracion,
    modoPago: params.modoPago,
  })
  return `/personas/coberturas/caucion-alquiler/preaprobacion?${search.toString()}`
}

function AnimatedPrice({
  className,
  value,
}: {
  className?: string
  value: number
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)

  useEffect(() => {
    if (previousValue.current === value) {
      return
    }

    const startValue = previousValue.current
    const endValue = value
    const duration = 300
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easedProgress
      )

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
    previousValue.current = value
  }, [value])

  return (
    <span className={className}>
      {new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(displayValue)}
    </span>
  )
}

function calculatePrice({
  alquiler,
  modoPago,
  provincia,
  duracion,
}: {
  alquiler: number
  duracion: number
  modoPago: string
  provincia: string
}) {
  const selectedProvincia = PROVINCIAS.find((item) => item.value === provincia)
  const selectedModoPago = MODOS_PAGO.find((item) => item.value === modoPago)

  const cobertura = alquiler * duracion
  const primaBase = cobertura * TASA_BASE
  const impuestos = primaBase * (selectedProvincia?.impuesto ?? 0.03)
  const subtotal = primaBase + impuestos
  const descuento = subtotal * (selectedModoPago?.descuento ?? 0)
  const total = subtotal - descuento

  return modoPago === "cuotas" ? Math.round(total / 6) : Math.round(total)
}

function handleMoneyInput(
  value: string,
  setValue: Dispatch<SetStateAction<number>>
) {
  const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10)

  if (Number.isNaN(numericValue)) {
    setValue(0)
    return
  }

  setValue(numericValue)
}

function RowLabel({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-base font-semibold text-woranz-ink">{title}</span>
      <span className="text-label text-woranz-muted normal-case tracking-normal">
        {description}
      </span>
    </div>
  )
}

function SegmentSelector({
  onSelect,
  options,
  value,
}: {
  onSelect: (value: string) => void
  options: Array<{ label: string; value: string }>
  value: string
}) {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "segmented-option",
            value === option.value ? "segmented-option-active" : ""
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ── Provincia Search (georef API) ─────────────────────────────────────

function ProvinciaSearch({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (slug: string) => void
  className?: string
}) {
  const selected = PROVINCIAS.find((p) => p.value === value)
  const [query, setQuery] = useState(selected?.label ?? "")
  const [options, setOptions] = useState<Array<{ id: string; nombre: string }>>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setOptions([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `https://apis.datos.gob.ar/georef/api/provincias?nombre=${encodeURIComponent(q)}&max=8&campos=id,nombre`
      )
      const data = await res.json()
      setOptions(data.provincias ?? [])
    } catch {
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
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

  // Match georef name to local PROVINCIAS slug
  function matchProvincia(nombre: string): string | undefined {
    const normalized = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return PROVINCIAS.find((p) => {
      const pNorm = p.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return pNorm === normalized
    })?.value
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex items-center rounded-field bg-woranz-warm-2">
        <Input
          type="text"
          placeholder="Buscá tu provincia..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            if (e.target.value !== selected?.label) onChange("buenos-aires")
          }}
          onFocus={() => {
            setQuery("")
            setOpen(true)
            search("")
          }}
          className="border-0 bg-transparent shadow-none"
        />
        {loading && (
          <Loader2 className="mr-3 h-4 w-4 shrink-0 animate-spin text-woranz-muted" />
        )}
      </div>
      {open && (options.length > 0 || loading) && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-woranz-border bg-white shadow-panel">
          {options.map((opt) => {
            const slug = matchProvincia(opt.nombre)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setQuery(opt.nombre)
                  if (slug) onChange(slug)
                  setOpen(false)
                }}
                className="flex w-full items-center px-4 py-3 text-left text-sm text-woranz-slate transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-woranz-warm-1"
              >
                <span className="font-medium">{opt.nombre}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PriceAction({
  buttonLabel,
  href,
  mode,
  value,
}: {
  buttonLabel: ReactNode
  href: string
  mode: string
  value: number
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-6 md:py-6">
      <div className="flex items-end gap-3">
        <AnimatedPrice
          value={value}
          className="font-display text-quote-price font-bold leading-none text-woranz-ink md:text-5xl"
        />
        <span className="pb-1 text-base text-woranz-text">
          {mode === "cuotas" ? "final por mes" : "final"}
        </span>
      </div>
        <Link href={href} className="btn-primary-form hidden px-6 md:inline-flex">
          {buttonLabel}
        </Link>
    </div>
  )
}

function CaucionQuoterMobile() {
  const [provincia, setProvincia] = useState("buenos-aires")
  const [alquiler, setAlquiler] = useState(500000)
  const [duracion, setDuracion] = useState("24")
  const [modoPago, setModoPago] = useState("cuotas")

  const price = calculatePrice({
    alquiler,
    duracion: Number.parseInt(duracion, 10),
    modoPago,
    provincia,
  })

  const preapprovalHref = buildPreapprovalHref({ provincia, alquiler, duracion, modoPago })

  return (
    <div className="flex flex-col md:hidden">
      <div className="flex items-center justify-between gap-4 border-b border-woranz-warm-4 p-5">
        <RowLabel
          title="Provincia"
          description="Los impuestos varían según tu provincia"
        />
        <ProvinciaSearch
          className="min-w-field"
          value={provincia}
          onChange={setProvincia}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-woranz-warm-4 p-5">
        <RowLabel
          title="Precio del alquiler"
          description="El valor de tu primer mes de alquiler"
        />
        <div className="flex min-w-field items-center gap-1 rounded-field bg-woranz-warm-2 px-4">
          <span className="text-woranz-muted">$</span>
          <Input
            type="text"
            value={alquiler.toLocaleString("es-AR")}
            onChange={(event) => handleMoneyInput(event.target.value, setAlquiler)}
            className="h-10 border-0 bg-transparent px-0 text-right text-sm text-woranz-slate shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-woranz-warm-4 p-5">
        <RowLabel
          title="Duración del contrato"
          description="¿Por cuántos meses vas a firmar?"
        />
        <SegmentSelector
          options={DURACIONES.map((item) => ({
            label: item.label,
            value: item.value.toString(),
          }))}
          value={duracion}
          onSelect={setDuracion}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-woranz-warm-4 p-5">
        <RowLabel
          title="Modo de pago"
          description="10% off contado o 6 cuotas sin interés"
        />
        <SegmentSelector options={MODOS_PAGO} value={modoPago} onSelect={setModoPago} />
      </div>

      <PriceAction
        buttonLabel={<>Contratar ahora <ArrowRight className="ml-2 h-4 w-4" /></>}
        href={preapprovalHref}
        mode={modoPago}
        value={price}
      />

      <div className="px-5 pb-5">
        <Link href={preapprovalHref} className="btn-primary-form flex w-full justify-center">
          Contratar ahora <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function CaucionQuoterDesktop() {
  const [provincia, setProvincia] = useState("buenos-aires")
  const [alquiler, setAlquiler] = useState(500000)
  const [duracion, setDuracion] = useState("24")
  const [modoPago, setModoPago] = useState("cuotas")

  const price = calculatePrice({
    alquiler,
    duracion: Number.parseInt(duracion, 10),
    modoPago,
    provincia,
  })

  const preapprovalHref = buildPreapprovalHref({ provincia, alquiler, duracion, modoPago })

  return (
    <div className="hidden w-full flex-col md:flex">
      <div className="flex items-center justify-between gap-6 border-b border-woranz-warm-4 px-6 py-5">
        <RowLabel
          title="Provincia"
          description="Los impuestos varían según tu provincia"
        />
        <ProvinciaSearch
          className="w-full max-w-field-lg"
          value={provincia}
          onChange={setProvincia}
        />
      </div>

      <div className="flex items-center justify-between gap-6 border-b border-woranz-warm-4 px-6 py-5">
        <RowLabel
          title="Precio del alquiler"
          description="El valor de tu primer mes de alquiler"
        />
        <div className="flex w-full max-w-field-lg items-center gap-1 rounded-field bg-woranz-warm-2 px-4">
          <span className="text-woranz-muted">$</span>
          <Input
            type="text"
            value={alquiler.toLocaleString("es-AR")}
            onChange={(event) => handleMoneyInput(event.target.value, setAlquiler)}
            className="h-10 border-0 bg-transparent px-0 text-right text-sm text-woranz-slate shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 border-b border-woranz-warm-4 px-6 py-5">
        <RowLabel
          title="Duración del contrato"
          description="¿Por cuántos meses vas a firmar el contrato?"
        />
        <SegmentSelector
          options={DURACIONES.map((item) => ({
            label: item.label,
            value: item.value.toString(),
          }))}
          value={duracion}
          onSelect={setDuracion}
        />
      </div>

      <div className="flex items-center justify-between gap-6 border-b border-woranz-warm-4 px-6 py-5">
        <RowLabel
          title="Modo de pago"
          description="10% descuento al contado o con tarjeta en 6 cuotas sin interés :)"
        />
        <SegmentSelector options={MODOS_PAGO} value={modoPago} onSelect={setModoPago} />
      </div>

      <PriceAction
        buttonLabel={<>Contratar ahora <ArrowRight className="ml-2 h-4 w-4" /></>}
        href={preapprovalHref}
        mode={modoPago}
        value={price}
      />
    </div>
  )
}

export { CaucionQuoterMobile, CaucionQuoterDesktop }
