"use client"

import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { type Dispatch, type SetStateAction, useState } from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const ACTIVIDADES: ComboboxOption[] = [
  { value: "albanil", label: "Albañil" },
  { value: "carpintero", label: "Carpintero" },
  { value: "electricista", label: "Electricista" },
  { value: "plomero", label: "Plomero" },
  { value: "pintor", label: "Pintor" },
  { value: "techista", label: "Techista" },
  { value: "soldador", label: "Soldador" },
  { value: "herrero", label: "Herrero" },
  { value: "jardinero", label: "Jardinero" },
  { value: "limpieza", label: "Limpieza" },
  { value: "mudanza", label: "Mudanza" },
  { value: "delivery", label: "Delivery" },
  { value: "seguridad", label: "Seguridad" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "construccion", label: "Construcción general" },
  { value: "mecanico", label: "Mecánico" },
  { value: "chofer", label: "Chofer" },
  { value: "gasista", label: "Gasista" },
  { value: "vidriero", label: "Vidriero" },
  { value: "otro", label: "Otra actividad" },
]

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

function QuoterMobile() {
  const [actividad, setActividad] = useState("albanil")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })
  const [cantidad, setCantidad] = useState(2)

  return (
    <div className="flex flex-col md:hidden">
      <div className="flex flex-col gap-1.5 px-6 pt-5">
        <label className="field-label">Actividad</label>
        <Combobox
          className="w-full"
          emptyText="No se encontró."
          options={ACTIVIDADES}
          searchPlaceholder="Buscar actividad..."
          value={actividad}
          onChange={setActividad}
        />
      </div>

      <div className="flex flex-col gap-1.5 px-6 pt-5">
        <label className="field-label">Vigencia</label>
        <DateField dateRange={dateRange} onSelect={setDateRange} />
      </div>

      <div className="flex flex-col gap-3 px-6 pt-5">
        <label className="field-label">Cantidad de personas</label>
        <div className="grid grid-cols-2 gap-2">
          {CANTIDAD_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setCantidad(preset.value)}
              className={cn(
                "segmented-option w-full rounded-lg py-2 text-xs",
                cantidad === preset.value ? "segmented-option-active" : "bg-woranz-warm-2"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={700}
            value={cantidad}
            onChange={(event) => handleCantidadInput(event.target.value, setCantidad)}
            className="h-12 rounded-field border-woranz-line bg-woranz-warm-2 px-4 text-sm font-medium text-woranz-ink shadow-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <span className="shrink-0 text-sm text-woranz-text">
            {cantidad === 1 ? "persona" : "personas"}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 pt-5">
        <button type="button" className="btn-primary-form flex w-full justify-center">
          Cotizar ahora →
        </button>
      </div>
    </div>
  )
}

function QuoterDesktop() {
  const [actividad, setActividad] = useState("albanil")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })
  const [cantidad, setCantidad] = useState(2)

  return (
    <div className="hidden w-full flex-col p-8 md:flex">
      <div className="flex items-end gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-label text-woranz-text">Actividad</label>
          <Combobox
            className="w-full"
            emptyText="No se encontró."
            options={ACTIVIDADES}
            searchPlaceholder="Buscar actividad..."
            value={actividad}
            onChange={setActividad}
          />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-label text-woranz-text">Vigencia</label>
          <DateField dateRange={dateRange} desktop onSelect={setDateRange} />
        </div>

        <div className="flex w-44 flex-col gap-1.5">
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

        <button type="button" className="btn-primary-form flex h-12 flex-1 justify-center px-8 text-lg">
          Cotizá ahora →
        </button>
      </div>
    </div>
  )
}

export { QuoterMobile, QuoterDesktop }
