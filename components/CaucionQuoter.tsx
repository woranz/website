"use client"

import Link from "next/link"
import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { PROVINCIAS, ProvinciaSearch } from "@/components/ui/georef-search"

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
const RESTITUCION_SURCHARGE = 0.3
function buildPreapprovalHref(params: {
  provincia: string
  alquiler: number
  duracion: string
  modoPago: string
  restitucion: boolean
}) {
  const search = new URLSearchParams({
    provincia: params.provincia,
    alquiler: params.alquiler.toString(),
    duracion: params.duracion,
    modoPago: params.modoPago,
    restitucion: params.restitucion ? "true" : "false",
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
  restitucion,
}: {
  alquiler: number
  duracion: number
  modoPago: string
  provincia: string
  restitucion: boolean
}) {
  const selectedProvincia = PROVINCIAS.find((item) => item.value === provincia)
  const selectedModoPago = MODOS_PAGO.find((item) => item.value === modoPago)

  const cobertura = alquiler * duracion
  const primaBase = cobertura * TASA_BASE
  const impuestos = primaBase * (selectedProvincia?.impuesto ?? 0.03)
  const subtotal = primaBase + impuestos
  const descuento = subtotal * (selectedModoPago?.descuento ?? 0)
  const totalBase = subtotal - descuento
  const total = restitucion
    ? totalBase * (1 + RESTITUCION_SURCHARGE)
    : totalBase

  return modoPago === "cuotas" ? Math.round(total / 6) : Math.round(total)
}

function RestitucionToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-woranz-ink" : "bg-woranz-warm-4"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
      <span className="sr-only">Activar restitución de la propiedad</span>
    </button>
  )
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
  const [restitucion, setRestitucion] = useState(false)

  const price = calculatePrice({
    alquiler,
    duracion: Number.parseInt(duracion, 10),
    modoPago,
    provincia,
    restitucion,
  })

  const preapprovalHref = buildPreapprovalHref({
    provincia,
    alquiler,
    duracion,
    modoPago,
    restitucion,
  })

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

      <div className="flex items-center justify-between gap-4 border-b border-woranz-warm-4 p-5">
        <RowLabel
          title="Restitución de la propiedad"
          description="Cubre daños si devolvés la propiedad en mal estado."
        />
        <RestitucionToggle checked={restitucion} onChange={setRestitucion} />
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
  const [restitucion, setRestitucion] = useState(false)

  const price = calculatePrice({
    alquiler,
    duracion: Number.parseInt(duracion, 10),
    modoPago,
    provincia,
    restitucion,
  })

  const preapprovalHref = buildPreapprovalHref({
    provincia,
    alquiler,
    duracion,
    modoPago,
    restitucion,
  })

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

      <div className="flex items-center justify-between gap-6 border-b border-woranz-warm-4 px-6 py-5">
        <RowLabel
          title="Restitución de la propiedad"
          description="Cubre daños si devolvés la propiedad en mal estado."
        />
        <RestitucionToggle checked={restitucion} onChange={setRestitucion} />
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
