"use client"

import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowRight, CalendarIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { type Dispatch, type SetStateAction, useEffect, useState } from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { buildProductSubpath } from "@/lib/product-paths"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

function inferCotizacionPath(pathname: string) {
  const segment = pathname.startsWith("/empresas") ? "empresas" : "personas"
  return buildProductSubpath(segment, "accidentes-personales", "cotizacion")
}

const CANTIDAD_PRESETS = [
  { value: 1, label: "Solo yo" },
  { value: 4, label: "Familia" },
  { value: 10, label: "Equipo" },
  { value: 25, label: "Grupo" },
]

function formatDateRange(dateRange: DateRange | undefined, mobile = false) {
  if (!dateRange?.from) {
    return mobile ? "Seleccionar" : "Seleccionar fechas"
  }

  if (!dateRange.to) {
    return format(dateRange.from, mobile ? "d MMM" : "d MMM yyyy", {
      locale: es,
    })
  }

  return `${format(dateRange.from, "d MMM", { locale: es })} - ${format(
    dateRange.to,
    mobile ? "d MMM" : "d MMM yyyy",
    { locale: es }
  )}`
}

function handleCantidadInput(
  value: string,
  setCantidad: Dispatch<SetStateAction<number>>
) {
  const numberValue = Number.parseInt(value, 10)

  if (Number.isNaN(numberValue)) {
    setCantidad(1)
    return
  }

  setCantidad(Math.min(Math.max(numberValue, 1), 700))
}

function DateField({
  dateRange,
  desktop = false,
  onSelect,
}: {
  dateRange: DateRange | undefined
  desktop?: boolean
  onSelect: (date: DateRange | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="field-control">
          <span className="truncate text-sm font-medium text-woranz-ink">
            {formatDateRange(dateRange, !desktop)}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-woranz-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onSelect}
          locale={es as never}
          numberOfMonths={desktop ? 2 : 1}
          disabled={{ before: new Date() }}
        />
      </PopoverContent>
    </Popover>
  )
}

function useQuoterState() {
  const router = useRouter()
  const pathname = usePathname()
  const [actividad, setActividad] = useState("")
  const [provincia, setProvincia] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })
  const [cantidad, setCantidad] = useState(2)

  const [ocupaciones, setOcupaciones] = useState<ComboboxOption[]>([])
  const [provincias, setProvincias] = useState<ComboboxOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/ap/profesiones").then((r) => r.json()),
      fetch("/api/ap/provincias").then((r) => r.json()),
    ])
      .then(([ocup, prov]) => {
        if (ocup.data) {
          const opts = ocup.data.map(
            (o: { idOcupacion: number; descripcion: string }) => ({
              value: String(o.idOcupacion),
              label: o.descripcion,
            })
          )
          setOcupaciones(opts)
          if (opts.length > 0) setActividad(opts[0].value)
        }
        if (prov.data) {
          const opts = prov.data.map(
            (p: Record<string, unknown>) => ({
              value: String(p.idProvincia ?? p.IdProvincia),
              label: String(p.descripcion ?? p.Descripcion ?? ""),
            })
          )
          setProvincias(opts)
          if (opts.length > 0) setProvincia(opts[0].value)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = () => {
    if (!actividad || !dateRange?.from || !dateRange?.to || !provincia || provincia === "undefined") return

    const params = new URLSearchParams({
      actividad,
      desde: format(dateRange.from, "yyyy-MM-dd"),
      hasta: format(dateRange.to, "yyyy-MM-dd"),
      cantidad: String(cantidad),
      provincia,
    })

    router.push(
      `${inferCotizacionPath(pathname)}?${params.toString()}`
    )
  }

  return {
    actividad,
    setActividad,
    provincia,
    setProvincia,
    dateRange,
    setDateRange,
    cantidad,
    setCantidad,
    ocupaciones,
    provincias,
    loading,
    handleSubmit,
  }
}

function QuoterMobile() {
  const {
    actividad,
    setActividad,
    provincia,
    setProvincia,
    dateRange,
    setDateRange,
    cantidad,
    setCantidad,
    ocupaciones,
    provincias,
    loading,
    handleSubmit,
  } = useQuoterState()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 md:hidden">
        <Loader2 className="h-6 w-6 animate-spin text-woranz-muted" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-5 md:hidden">
      <div className="flex flex-col gap-1.5">
        <label className="field-label">Actividad</label>
        <Combobox
          className="w-full"
          emptyText="No se encontró."
          options={ocupaciones}
          searchPlaceholder="Buscar actividad..."
          value={actividad}
          onChange={(v) => setActividad(v ?? "")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label">Provincia</label>
        <Combobox
          className="w-full"
          emptyText="No se encontró."
          options={provincias}
          searchPlaceholder="Buscar provincia..."
          value={provincia}
          onChange={(v) => setProvincia(v ?? "")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="field-label">Vigencia</label>
          <DateField dateRange={dateRange} onSelect={setDateRange} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="field-label">Personas</label>
          <div className="relative">
            <Input
              type="number"
              min={1}
              max={700}
              value={cantidad}
              onChange={(event) => handleCantidadInput(event.target.value, setCantidad)}
              className="h-12 rounded-field border-woranz-line bg-woranz-warm-2 px-4 pr-20 text-sm font-medium text-woranz-ink shadow-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-woranz-muted">
              {cantidad === 1 ? "persona" : "personas"}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="btn-primary-form flex w-full justify-center"
      >
        Cotizá ahora <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  )
}

function QuoterDesktop() {
  const {
    actividad,
    setActividad,
    provincia,
    setProvincia,
    dateRange,
    setDateRange,
    cantidad,
    setCantidad,
    ocupaciones,
    provincias,
    loading,
    handleSubmit,
  } = useQuoterState()

  if (loading) {
    return (
      <div className="hidden items-center justify-center py-12 md:flex">
        <Loader2 className="h-6 w-6 animate-spin text-woranz-muted" />
      </div>
    )
  }

  return (
    <div className="hidden w-full flex-col p-8 md:flex">
      <div className="grid grid-cols-2 items-end gap-4 lg:flex">
        <div className="flex flex-col gap-1.5 lg:flex-1">
          <label className="text-label text-woranz-text">Actividad</label>
          <Combobox
            className="w-full"
            emptyText="No se encontró."
            options={ocupaciones}
            searchPlaceholder="Buscar actividad..."
            value={actividad}
            onChange={(v) => setActividad(v ?? "")}
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:flex-1">
          <label className="text-label text-woranz-text">Provincia</label>
          <Combobox
            className="w-full"
            emptyText="No se encontró."
            options={provincias}
            searchPlaceholder="Buscar provincia..."
            value={provincia}
            onChange={(v) => setProvincia(v ?? "")}
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:flex-1">
          <label className="text-label text-woranz-text">Vigencia</label>
          <DateField dateRange={dateRange} desktop onSelect={setDateRange} />
        </div>

        <div className="flex flex-col gap-1.5 lg:w-44">
          <label className="text-label text-woranz-text">Personas</label>
          <div className="relative">
            <Input
              type="number"
              min={1}
              max={700}
              value={cantidad}
              onChange={(event) => handleCantidadInput(event.target.value, setCantidad)}
              className="h-12 rounded-field border-woranz-line bg-woranz-warm-2 px-4 pr-20 text-sm text-woranz-slate shadow-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-woranz-muted">
              {cantidad === 1 ? "persona" : "personas"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary-form col-span-2 flex justify-center px-6 lg:col-span-1"
        >
          Cotizá ahora <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export { QuoterMobile, QuoterDesktop }
