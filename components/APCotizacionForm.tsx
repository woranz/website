"use client"

import { format } from "date-fns"
import { differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { BreadcrumbStepper } from "@/components/ui/breadcrumb-stepper"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EntityListItem, LookupSection } from "@/components/ui/entity-list"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────

type QuoterData = {
  actividad: string
  desde: string
  hasta: string
  cantidad: number
  provincia: string
}

type Cobertura = {
  idCobertura: number
  nombre: string
  sumaAsegurada: number
  sumaAseguradaMaxima?: number
  sumaAseguradaMinima?: number
  isEditable: boolean
}

type PlanOption = {
  nombre: string
  premio: number
  prima: number
  cantidad: number
  vigenciaDesde: string
  vigenciaHasta: string
  coberturas: Cobertura[]
  [key: string]: unknown
}

type PersonaEntry = {
  dni: string
  nombre: string
  apellido: string
  loading: boolean
  lookupDone: boolean
  lookupFailed: boolean
  raw: Record<string, unknown> | null
}

type AseguradoItem = {
  dni: string
  nombre: string
  apellido: string
  documentType: "DNI" | "PASAPORTE"
  valid: boolean
  invalid: boolean
  repeated: boolean
  notCoverable: boolean
  manual: boolean
  raw: Record<string, unknown> | null
}

type NominaEntry = {
  cuit: string
  nombre: string
  loading: boolean
  valid: boolean
  invalid: boolean
  manual?: boolean
  raw?: Record<string, unknown> | null
}

type ParsedLookupValue = {
  cleaned: string
  raw: string
}

type ParsedAseguradoValue = ParsedLookupValue & {
  isPassport: boolean
}

type ManualAseguradoDraft = {
  documentType: "DNI" | "PASAPORTE"
  dni: string
  nombre: string
  apellido: string
}

type ManualNominaDraft = {
  razonSocial: string
  cuit: string
  numeroDocumento: string
}

// ── Helpers ──────────────────────────────────────────────────────────

function cleanDni(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "")
}

function splitLookupInput(input: string): ParsedLookupValue[] {
  return input
    .split(/[\n,;\s]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((raw) => ({ raw, cleaned: cleanDni(raw) }))
    .filter((item) => item.cleaned.length > 0)
}

function parseDniInput(input: string): string[] {
  return splitLookupInput(input)
    .map((item) => item.cleaned)
    .filter((d) => d.length >= 7 && d.length <= 13)
}

function parseAseguradosInput(input: string): ParsedAseguradoValue[] {
  return splitLookupInput(input)
    .map((item) => ({
      ...item,
      isPassport: /[a-zA-Z]/.test(item.raw),
    }))
    .filter((item) => item.isPassport || (item.cleaned.length >= 7 && item.cleaned.length <= 13))
}

function parseNominaInput(input: string): ParsedLookupValue[] {
  return splitLookupInput(input).map((item) => ({
    ...item,
    cleaned: item.cleaned.replace(/\D/g, ""),
  }))
}

function isValidCuit(value: string): boolean {
  return value.replace(/\D/g, "").length === 11
}

function getAge(fechaNacimiento: string | undefined): number | null {
  if (!fechaNacimiento) return null
  const birth = new Date(fechaNacimiento)
  if (isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const MIN_AGE = 3
const MAX_AGE = 75

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "d 'de' MMMM yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

function getDayCount(desde: string, hasta: string): number {
  try {
    return differenceInDays(new Date(hasta), new Date(desde))
  } catch {
    return 0
  }
}

function formatPhone(area: string, numero: string): string {
  return `(${area}) ${numero}`
}

const emptyPersona = (): PersonaEntry => ({
  dni: "",
  nombre: "",
  apellido: "",
  loading: false,
  lookupDone: false,
  lookupFailed: false,
  raw: null,
})

const emptyManualAsegurado = (): ManualAseguradoDraft => ({
  documentType: "DNI",
  dni: "",
  nombre: "",
  apellido: "",
})

const emptyManualNomina = (): ManualNominaDraft => ({
  razonSocial: "",
  cuit: "",
  numeroDocumento: "",
})

// ── Shared sub-components ────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500">{message}</p>
}

function FormField({
  children,
  error,
  label,
}: {
  children: React.ReactNode
  error?: string
  label: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-woranz-ink">{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-woranz-slate">
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
          checked ? "border-woranz-ink bg-woranz-ink" : "border-woranz-warm-4"
        )}
      >
        {checked && <Check className="h-2.5 w-2.5 text-white" />}
      </button>
      <span className="text-left">{label}</span>
    </label>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-woranz-muted">{label}</dt>
      <dd className="text-right text-woranz-ink">{value}</dd>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────

export function APCotizacionForm({ quoter }: { quoter: QuoterData }) {
  const isMulti = quoter.cantidad > 1

  const STEPS = isMulti
    ? [
        { id: "plan", title: "Elegí tu plan" },
        { id: "datos", title: "Tus datos" },
        { id: "asegurados", title: "Personas a asegurar" },
        { id: "pago", title: "Confirmá y pagá" },
      ]
    : [
        { id: "plan", title: "Elegí tu plan" },
        { id: "datos", title: "Tus datos" },
        { id: "pago", title: "Confirmá y pagá" },
      ]

  const stepId = (s: number) => STEPS[s - 1]?.id ?? ""

  // ── State ──
  const [step, setStep] = useState(1)
  const formRef = useRef<HTMLDivElement>(null)
  const [cantidadActual, setCantidadActual] = useState(quoter.cantidad)
  const [desde, setDesde] = useState(quoter.desde)
  const [hasta, setHasta] = useState(quoter.hasta)
  const [editingBar, setEditingBar] = useState(false)

  const [plans, setPlans] = useState<PlanOption[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState("")
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number | null>(null)

  const [esTomador, setEsTomador] = useState(quoter.cantidad === 1)
  const [tomador, setTomador] = useState<PersonaEntry>(emptyPersona())
  const [asegurado, setAsegurado] = useState<PersonaEntry>(emptyPersona())
  const [email, setEmail] = useState("")
  const [telefonoArea, setTelefonoArea] = useState("")
  const [telefonoNumero, setTelefonoNumero] = useState("")
  const [clausulaSubrogacion, setClausulaSubrogacion] = useState(false)
  const [clausulaNoRepeticion, setClausulaNoRepeticion] = useState(false)
  const [nomina, setNomina] = useState<NominaEntry[]>([])
  const [nominaInput, setNominaInput] = useState("")
  const [resolvingNomina, setResolvingNomina] = useState(false)
  const [clausulasOpen, setClausulasOpen] = useState(false)

  const [aseguradosInput, setAseguradosInput] = useState("")
  const [aseguradosList, setAseguradosList] = useState<AseguradoItem[]>([])
  const [resolvingAsegurados, setResolvingAsegurados] = useState(false)
  const [manualAseguradoIdx, setManualAseguradoIdx] = useState<number | null>(null)
  const [manualAsegurado, setManualAsegurado] = useState<ManualAseguradoDraft>(emptyManualAsegurado())
  const [manualNominaIdx, setManualNominaIdx] = useState<number | null>(null)
  const [manualNomina, setManualNomina] = useState<ManualNominaDraft>(emptyManualNomina())
  const [mismatchCount, setMismatchCount] = useState<number | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitStep, setSubmitStep] = useState("")

  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const selectedPlan = selectedPlanIdx !== null ? plans[selectedPlanIdx] : null
  const dayCount = getDayCount(desde, hasta)

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step])

  // ── Fetch plans ──
  useEffect(() => {
    setPlansLoading(true)
    setPlansError("")
    fetch("/api/ap/cotizacion/opciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCoberturaPaquete: 498,
        idProvinciaRiesgo: Number(quoter.provincia) || 1,
        vigenciaDesde: desde,
        vigenciaHasta: hasta,
        items: [{ idOcupacion: Number(quoter.actividad) || 1, cantidad: cantidadActual }],
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.error) { setPlansError(json.error); return }
        const valid = (json.data ?? []).filter((p: PlanOption) => p.premio && !p.error)
        setPlans(valid)
        if (valid.length > 0) setSelectedPlanIdx(0)
      })
      .catch(() => setPlansError("Error al cargar los planes."))
      .finally(() => setPlansLoading(false))
  }, [quoter.actividad, quoter.provincia, desde, hasta, cantidadActual])

  // ── DNI lookup ──
  const lookupDni = useCallback(
    async (persona: PersonaEntry, setPersona: (p: PersonaEntry) => void) => {
      const cleaned = cleanDni(persona.dni)
      if (cleaned.length < 7 || cleaned.length > 13) return
      setPersona({ ...persona, dni: cleaned, loading: true })
      try {
        const res = await fetch("/api/ap/persona", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dni: cleaned }),
        })
        const json = await res.json()
        if (json.data) {
          setPersona({ ...persona, dni: cleaned, nombre: json.data.nombre ?? "", apellido: json.data.apellido ?? "", loading: false, lookupDone: true, lookupFailed: false, raw: json.data })
        } else {
          setPersona({ ...persona, dni: cleaned, loading: false, lookupDone: true, lookupFailed: true, raw: null })
        }
      } catch {
        setPersona({ ...persona, dni: cleaned, loading: false, lookupDone: true, lookupFailed: true, raw: null })
      }
    },
    []
  )

  const openManualAsegurado = useCallback((idx: number) => {
    const item = aseguradosList[idx]
    if (!item) return
    setManualAseguradoIdx(idx)
    setManualAsegurado({
      documentType: item.documentType,
      dni: item.dni,
      nombre: item.nombre,
      apellido: item.apellido,
    })
  }, [aseguradosList])

  const closeManualAsegurado = useCallback(() => {
    setManualAseguradoIdx(null)
    setManualAsegurado(emptyManualAsegurado())
  }, [])

  const openManualNomina = useCallback((idx: number) => {
    const item = nomina[idx]
    if (!item) return
    setManualNominaIdx(idx)
    setManualNomina({
      razonSocial: item.nombre,
      cuit: item.cuit,
      numeroDocumento: "",
    })
  }, [nomina])

  const closeManualNomina = useCallback(() => {
    setManualNominaIdx(null)
    setManualNomina(emptyManualNomina())
  }, [])

  // ── Add asegurados ──
  const addAsegurados = useCallback(async () => {
    const entries = parseAseguradosInput(aseguradosInput)
    if (entries.length === 0) return
    setResolvingAsegurados(true)
    const seen = new Set<string>()
    for (const a of aseguradosList) seen.add(a.dni)
    const newItems: AseguradoItem[] = []
    for (let i = 0; i < entries.length; i += 10) {
      const batch = entries.slice(i, i + 10)
      const results = await Promise.all(
        batch.map(async ({ cleaned, isPassport }) => {
          if (seen.has(cleaned)) return { dni: cleaned, nombre: "", apellido: "", documentType: (isPassport ? "PASAPORTE" : "DNI") as "DNI" | "PASAPORTE", valid: false, invalid: false, repeated: true, notCoverable: false, manual: false, raw: null }
          seen.add(cleaned)
          if (isPassport) {
            return {
              dni: cleaned,
              nombre: "",
              apellido: "",
              documentType: "PASAPORTE" as const,
              valid: false,
              invalid: true,
              repeated: false,
              notCoverable: false,
              manual: false,
              raw: null,
            }
          }
          try {
            const res = await fetch("/api/ap/persona", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dni: cleaned }) })
            const json = await res.json()
            if (json.data) {
              const p = Array.isArray(json.data) ? json.data[0] : json.data
              const age = getAge(p.fechaNacimiento)
              if (age !== null && (age < MIN_AGE || age > MAX_AGE)) return { dni: cleaned, nombre: p.nombre ?? "", apellido: p.apellido ?? "", documentType: "DNI" as const, valid: false, invalid: false, repeated: false, notCoverable: true, manual: false, raw: null }
              return { dni: cleaned, nombre: p.nombre ?? "", apellido: p.apellido ?? "", documentType: "DNI" as const, valid: true, invalid: false, repeated: false, notCoverable: false, manual: false, raw: p as Record<string, unknown> }
            }
            return { dni: cleaned, nombre: "", apellido: "", documentType: "DNI" as const, valid: false, invalid: true, repeated: false, notCoverable: false, manual: false, raw: null }
          } catch {
            return { dni: cleaned, nombre: "", apellido: "", documentType: "DNI" as const, valid: false, invalid: true, repeated: false, notCoverable: false, manual: false, raw: null }
          }
        })
      )
      newItems.push(...results)
    }
    const updatedList = [...aseguradosList, ...newItems]
    setAseguradosList(updatedList)
    setAseguradosInput("")
    setResolvingAsegurados(false)
    const firstManualIdx = updatedList.findIndex(
      (item, idx) =>
        idx >= aseguradosList.length &&
        item.invalid &&
        !item.repeated &&
        !item.notCoverable
    )
    if (firstManualIdx >= 0) openManualAsegurado(firstManualIdx)
  }, [aseguradosInput, aseguradosList, openManualAsegurado])


  // ── Validation ──
  const errors: Record<string, string> = {}
  if (selectedPlanIdx === null) errors.plan = "Seleccioná un plan"
  if (!tomador.dni || cleanDni(tomador.dni).length < 7) errors.tomadorDni = "Ingresá un DNI válido"
  if (tomador.lookupFailed && !tomador.nombre) errors.tomadorNombre = "Ingresá el nombre"
  if (tomador.lookupFailed && !tomador.apellido) errors.tomadorApellido = "Ingresá el apellido"
  if (!isMulti && !esTomador) {
    if (!asegurado.dni || cleanDni(asegurado.dni).length < 7) errors.aseguradoDni = "Ingresá un DNI válido"
    if (asegurado.lookupFailed && !asegurado.nombre) errors.aseguradoNombre = "Ingresá el nombre"
    if (asegurado.lookupFailed && !asegurado.apellido) errors.aseguradoApellido = "Ingresá el apellido"
  }
  if ((clausulaSubrogacion || clausulaNoRepeticion) && (nomina.length === 0 || !nomina[0]?.cuit || nomina.some((n) => n.invalid)))
    errors.nomina = nomina.some((n) => n.invalid) ? "Hay CUITs inválidos" : "Agregá al menos una empresa"
  if (!email || !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) errors.email = "Ingresá un email válido"
  if (!telefonoArea || !/^\d{2,4}$/.test(telefonoArea)) errors.telefonoArea = "Ingresá entre 2 y 4 dígitos"
  if (!telefonoNumero || !/^\d{6,8}$/.test(telefonoNumero)) errors.telefonoNumero = "Ingresá entre 6 y 8 dígitos"

  const validAsegurados = aseguradosList.filter((a) => a.valid || a.manual)
  const invalidAsegurados = aseguradosList.filter((a) => a.invalid || a.repeated || a.notCoverable)

  // (#2, #10) Asegurados step is not blocking — allow proceeding with at least 1
  const canAdvance = (s: number) => {
    const id = stepId(s)
    if (id === "plan") return selectedPlanIdx !== null
    if (id === "datos") {
      const tomadorOk = tomador.dni.length >= 7 && tomador.lookupDone && (!tomador.lookupFailed || (!!tomador.nombre && !!tomador.apellido))
      if (!tomadorOk) return false
      if (!isMulti && !esTomador) {
        const aseguradoOk = asegurado.dni.length >= 7 && asegurado.lookupDone && (!asegurado.lookupFailed || (!!asegurado.nombre && !!asegurado.apellido))
        if (!aseguradoOk) return false
      }
      if ((clausulaSubrogacion || clausulaNoRepeticion) && (nomina.length === 0 || !nomina.every((n) => n.valid && isValidCuit(n.cuit)))) return false
      if (!email || !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) return false
      if (!/^\d{2,4}$/.test(telefonoArea)) return false
      if (!/^\d{6,8}$/.test(telefonoNumero)) return false
      return true
    }
    if (id === "asegurados") return invalidAsegurados.length === 0 && validAsegurados.length >= 1
    return true
  }

  const goNext = () => { if (canAdvance(step)) setStep((s) => Math.min(s + 1, STEPS.length)) }
  const goBack = () => setStep((s) => Math.max(s - 1, 1))
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }))
  const handleNextStep = () => {
    if (stepId(step) === "datos") {
      touch("tomadorDni")
      if (!isMulti && !esTomador) touch("aseguradoDni")
      if (clausulaSubrogacion || clausulaNoRepeticion) touch("nomina")
      touch("email")
      touch("telefonoArea")
      touch("telefonoNumero")
    }

    if (stepId(step) === "asegurados") {
      if (!canAdvance(step)) return
      const validCount = validAsegurados.length
      if (validCount !== cantidadActual) {
        setMismatchCount(validCount)
        return
      }
    }

    goNext()
  }
  const addNominas = useCallback(async () => {
    const cuits = parseNominaInput(nominaInput)
    if (cuits.length === 0) return
    setResolvingNomina(true)
    const seen = new Set(nomina.map((n) => n.cuit))
    const newItems: NominaEntry[] = []
    for (let i = 0; i < cuits.length; i += 10) {
      const batch = cuits.slice(i, i + 10)
      const results = await Promise.all(
        batch.map(async ({ cleaned }) => {
          if (seen.has(cleaned)) return null
          seen.add(cleaned)
          if (!isValidCuit(cleaned)) {
            return { cuit: cleaned, nombre: "", loading: false, valid: false, invalid: true, raw: null }
          }
          try {
            const res = await fetch("/api/ap/persona", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dni: cleaned }) })
            const json = await res.json()
            if (json.data) {
              const nombre = json.data.razonSocial ? json.data.razonSocial : `${json.data.nombre ?? ""} ${json.data.apellido ?? ""}`.trim()
              return { cuit: cleaned, nombre, loading: false, valid: true, invalid: false, raw: json.data as Record<string, unknown> }
            }
            return { cuit: cleaned, nombre: "", loading: false, valid: false, invalid: true, raw: null }
          } catch {
            return { cuit: cleaned, nombre: "", loading: false, valid: false, invalid: true, raw: null }
          }
        })
      )
      newItems.push(...results.filter((r): r is NonNullable<typeof r> => r !== null))
    }
    const updatedNomina = [...nomina, ...newItems]
    setNomina(updatedNomina)
    setNominaInput("")
    setResolvingNomina(false)
    const firstManualIdx = updatedNomina.findIndex(
      (item, idx) => idx >= nomina.length && item.invalid
    )
    if (firstManualIdx >= 0) openManualNomina(firstManualIdx)
  }, [nominaInput, nomina, openManualNomina])
  const removeNomina = (idx: number) => setNomina((prev) => prev.filter((_, i) => i !== idx))

  const submitManualAsegurado = () => {
    if (manualAseguradoIdx === null) return
    const cleanedDocument = cleanDni(manualAsegurado.dni)
    if (!cleanedDocument || !manualAsegurado.nombre || !manualAsegurado.apellido) return
    setAseguradosList((prev) =>
      prev.map((item, idx) =>
        idx === manualAseguradoIdx
          ? {
              ...item,
              dni: cleanedDocument,
              nombre: manualAsegurado.nombre.trim(),
              apellido: manualAsegurado.apellido.trim(),
              documentType: manualAsegurado.documentType,
              valid: true,
              invalid: false,
              manual: true,
              raw: {
                idTipoDocumento: manualAsegurado.documentType === "PASAPORTE" ? 5 : 1,
                numeroDocumento:
                  manualAsegurado.documentType === "DNI"
                    ? parseInt(cleanedDocument, 10)
                    : cleanedDocument,
                nombre: manualAsegurado.nombre.trim(),
                apellido: manualAsegurado.apellido.trim(),
              },
            }
          : item
      )
    )
    closeManualAsegurado()
  }

  const submitManualNomina = () => {
    if (manualNominaIdx === null) return
    const cleanedCuit = manualNomina.cuit.replace(/\D/g, "")
    if (!manualNomina.razonSocial || !isValidCuit(cleanedCuit)) return
    setNomina((prev) =>
      prev.map((item, idx) =>
        idx === manualNominaIdx
          ? {
              ...item,
              cuit: cleanedCuit,
              nombre: manualNomina.razonSocial.trim(),
              valid: true,
              invalid: false,
              manual: true,
              raw: {
                idTipoPersona: 2,
                razonSocial: manualNomina.razonSocial.trim(),
                numeroDocumento: manualNomina.numeroDocumento.trim(),
                cuit: cleanedCuit,
              },
            }
          : item
      )
    )
    closeManualNomina()
  }

  // ── Submit ──
  const handleSubmit = async () => {
    if (!selectedPlan) return
    setSubmitting(true)
    setSubmitError("")
    const solicitante = `${tomador.nombre} ${tomador.apellido}`.trim()
    try {
      setSubmitStep("Generando cotización...")
      const triggerRes = await fetch("/api/ap/cotizacion/trigger", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCoberturaPaquete: 498, idProvinciaRiesgo: Number(quoter.provincia) || 1,
          vigenciaDesde: desde, vigenciaHasta: hasta,
          items: [{ idOcupacion: Number(quoter.actividad) || 1, cantidad: cantidadActual }],
          coberturas: selectedPlan.coberturas, solicitante, mail: email,
          telefonoArea: parseInt(telefonoArea, 10) || 0, telefonoNumero: parseInt(telefonoNumero, 10) || 0,
        }),
      }).then((r) => r.json())
      if (triggerRes.error) throw new Error(triggerRes.error)
      const { idCotizacion } = triggerRes.data

      const tomadorPayload = tomador.raw ?? { numeroDocumento: parseInt(tomador.dni, 10), nombre: tomador.nombre, apellido: tomador.apellido }
      const idOcupacion = Number(quoter.actividad) || 1
      let allAsegurados: Record<string, unknown>[]
      if (isMulti) {
        allAsegurados = aseguradosList.filter((a) => a.valid || a.manual).map((a) => ({ ...(a.raw ?? { numeroDocumento: parseInt(a.dni, 10), nombre: a.nombre, apellido: a.apellido }), idOcupacion }))
      } else if (esTomador) {
        allAsegurados = [{ ...tomadorPayload, idOcupacion }]
      } else {
        const aseguradoPayload = asegurado.raw ?? { numeroDocumento: parseInt(asegurado.dni, 10), nombre: asegurado.nombre, apellido: asegurado.apellido }
        allAsegurados = [{ ...aseguradoPayload, idOcupacion }]
      }
      const nominaPayload = (clausulaSubrogacion || clausulaNoRepeticion) ? nomina.filter((n) => n.valid).map((n) => ({ cuit: n.cuit, nombre: n.nombre })) : []

      setSubmitStep("Creando propuesta...")
      const propuestaRes = await fetch("/api/ap/propuesta", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idSeccion: 12,
          idCotizacion,
          idCoberturaPaquete: 498,
          idProvinciaRiesgo: Number(quoter.provincia) || 1,
          vigenciaDesde: desde,
          vigenciaHasta: hasta,
          cantidad: cantidadActual,
          items: [{ idOcupacion, cantidad: cantidadActual }],
          coberturas: selectedPlan.coberturas,
          tomador: { ...tomadorPayload, emails: [{ idTipoEmail: 3, email }] },
          asegurados: allAsegurados,
          domicilioRiesgo: (tomadorPayload as Record<string, unknown>).domicilio ?? {},
          clausulaSubrogacion, clausulaNoRepeticion, nomina: nominaPayload, solicitante, mail: email,
          telefonoArea: parseInt(telefonoArea, 10) || 0, telefonoNumero: parseInt(telefonoNumero, 10) || 0,
        }),
      }).then((r) => r.json())
      if (propuestaRes.error) throw new Error(propuestaRes.error)
      const { idEmision, premio } = propuestaRes.data

      setSubmitStep("Conectando con MercadoPago...")
      const baseUrl = window.location.origin
      const mpRes = await fetch("/api/ap/mercadopago", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { idEmision, premio: premio ?? selectedPlan.premio, cantidad: cantidadActual, email, tomador: { ...tomadorPayload, tipo: "persona", emails: [{ idTipoEmail: 3, email }] } },
          base_url: baseUrl, source_url: `${baseUrl}/personas/coberturas/accidentes-personales/cotizacion`,
        }),
      }).then((r) => r.json())
      if (mpRes.error) throw new Error(mpRes.error)
      const initPoint = mpRes.data?.init_point
      if (!initPoint) throw new Error("No se pudo obtener el link de pago")
      window.location.href = initPoint
    } catch {
      setSubmitError("Hubo un error al procesar tu solicitud. Por favor intentá de nuevo.")
      setSubmitting(false)
      setSubmitStep("")
    }
  }

  // ── Persona fields ──
  const renderDniField = (
    persona: PersonaEntry,
    setPersona: (p: PersonaEntry) => void,
    prefix: string,
    placeholder = "DNI o CUIT",
    label?: string
  ) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-woranz-ink">{label}</label>}
      <div className="relative">
        <Input
          inputMode="numeric"
          placeholder={placeholder}
          value={persona.dni}
          onChange={(e) => setPersona({ ...emptyPersona(), dni: e.target.value })}
          onBlur={() => { touch(`${prefix}Dni`); lookupDni(persona, setPersona) }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lookupDni(persona, setPersona) } }}
          className="h-12 pr-24"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {persona.loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-woranz-muted" />
          ) : (
            <button
              type="button"
              onClick={() => lookupDni(persona, setPersona)}
              disabled={!persona.dni || persona.dni.length < 7}
              className="text-sm font-medium text-woranz-ink disabled:opacity-30"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
      {touched[`${prefix}Dni`] && errors[`${prefix}Dni`] && (
        <FieldError message={errors[`${prefix}Dni`]} />
      )}
      {persona.lookupDone && !persona.lookupFailed && (
        <EntityListItem
          tone="success"
          title={`${persona.nombre} ${persona.apellido}`.trim()}
          subtitle={persona.dni}
        />
      )}
      {persona.lookupDone && persona.lookupFailed && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nombre" error={touched[`${prefix}Nombre`] ? errors[`${prefix}Nombre`] : undefined}>
            <Input
              placeholder="Nombre"
              value={persona.nombre}
              onChange={(e) => setPersona({ ...persona, nombre: e.target.value })}
              onBlur={() => touch(`${prefix}Nombre`)}
              className="h-12"
            />
          </FormField>
          <FormField label="Apellido" error={touched[`${prefix}Apellido`] ? errors[`${prefix}Apellido`] : undefined}>
            <Input
              placeholder="Apellido"
              value={persona.apellido}
              onChange={(e) => setPersona({ ...persona, apellido: e.target.value })}
              onBlur={() => touch(`${prefix}Apellido`)}
              className="h-12"
            />
          </FormField>
        </div>
      )}
    </div>
  )

  return (
    <div ref={formRef} className="mx-auto w-full max-w-page px-page-mobile md:px-page">
      {/* (#16) Stepper — breadcrumb style */}
      <div className="mx-auto max-w-xl pt-6 md:pt-8">
        <BreadcrumbStepper
          steps={STEPS}
          currentStep={step}
          onStepClick={setStep}
        />
      </div>

      {/* Main content — centered single column */}
      <div className={cn("mx-auto w-full pb-32 pt-8 md:pt-10", stepId(step) !== "plan" && "max-w-xl")}>

      {/* Title */}
      <h1 className="text-center font-display text-[2rem] font-bold leading-tight tracking-tight text-woranz-ink lg:text-[2.25rem]">
        {stepId(step) === "plan" ? "Elegí tu plan de Accidentes Personales" : STEPS[step - 1].title}
      </h1>

      {/* ── Plan ── */}
      {stepId(step) === "plan" && (
        <div className="mt-8">
          {plansLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-woranz-muted" />
            </div>
          )}
          {plansError && <p className="text-sm text-red-500">{plansError}</p>}
          {!plansLoading && !plansError && plans.length === 0 && (
            <p className="text-sm text-woranz-text">No encontramos planes para esta actividad.</p>
          )}

          <div className={cn("grid gap-4", plans.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
            {plans.map((plan, idx) => (
              <button
                key={plan.nombre}
                type="button"
                onClick={() => setSelectedPlanIdx(idx)}
                className={cn(
                  "flex flex-col rounded-2xl border-2 p-6 text-left shadow-elevated transition-all",
                  selectedPlanIdx === idx
                    ? "border-woranz-ink bg-white"
                    : "border-transparent bg-woranz-warm-1 hover:bg-woranz-warm-2"
                )}
              >
                <span className="text-base font-semibold text-woranz-ink">{plan.nombre}</span>
                <span className="mt-1 text-2xl font-bold text-woranz-ink">{formatMoney(plan.premio)}</span>
                <div className="mt-4 flex flex-col gap-1.5">
                  {plan.coberturas.map((c) => (
                    <div key={c.idCobertura} className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-woranz-muted">{c.nombre}</span>
                      <span className="shrink-0 tabular-nums text-woranz-slate">{formatMoney(c.sumaAsegurada)}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Datos ── */}
      {stepId(step) === "datos" && (
        <div className="mt-8 flex flex-col gap-6">
          {renderDniField(tomador, setTomador, "tomador", "Ej: 35123456", "Titular")}

          {!isMulti && (
            <>
              <Checkbox
                checked={esTomador}
                label="Yo soy el asegurado"
                onChange={() => setEsTomador(!esTomador)}
              />
              {!esTomador && renderDniField(asegurado, setAsegurado, "asegurado", "DNI del asegurado", "Asegurado")}
            </>
          )}

          {/* Contact */}
          <FormField label="Email" error={touched.email ? errors.email : undefined}>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => touch("email")}
              className="h-12"
            />
          </FormField>

          {/* (#5, #6) Phone — consistent h-12 inputs, validated as digits-only */}
          <FormField
            label="Teléfono"
            error={
              (touched.telefonoArea && errors.telefonoArea) ||
              (touched.telefonoNumero && errors.telefonoNumero) ||
              undefined
            }
          >
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                placeholder="Cód. área"
                maxLength={4}
                value={telefonoArea}
                onChange={(e) => setTelefonoArea(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onBlur={() => touch("telefonoArea")}
                className="h-12 w-28"
              />
              <Input
                inputMode="numeric"
                placeholder="Ej: 2345 6789"
                maxLength={8}
                value={telefonoNumero}
                onChange={(e) => setTelefonoNumero(e.target.value.replace(/\D/g, "").slice(0, 8))}
                onBlur={() => touch("telefonoNumero")}
                className="h-12"
              />
            </div>
          </FormField>

          {/* (#1) Cláusulas — more prominent, with info tooltip */}
          <div className="rounded-xl border border-woranz-warm-4 bg-woranz-warm-1 p-4">
            <button
              type="button"
              onClick={() => setClausulasOpen(!clausulasOpen)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-woranz-ink">Cláusulas especiales</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full p-0.5 text-woranz-muted transition-colors hover:text-woranz-ink"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-xs text-sm" side="top">
                    Las cláusulas especiales permiten extender la cobertura para incluir subrogación o no repetición a favor de terceros (por ejemplo, la empresa contratante).
                  </PopoverContent>
                </Popover>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-woranz-muted transition-transform", clausulasOpen && "rotate-180")} />
            </button>

            {clausulasOpen && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Checkbox
                    checked={clausulaSubrogacion}
                    label="Subrogación"
                    onChange={() => setClausulaSubrogacion(!clausulaSubrogacion)}
                  />
                  <Checkbox
                    checked={clausulaNoRepeticion}
                    label="No repetición"
                    onChange={() => setClausulaNoRepeticion(!clausulaNoRepeticion)}
                  />
                </div>

                {(clausulaSubrogacion || clausulaNoRepeticion) && (
                  <>
                    <div className="border-t border-woranz-warm-4" />
                    <LookupSection
                      placeholder="CUIT de la empresa"
                      inputMode="numeric"
                      value={nominaInput}
                      onChange={setNominaInput}
                      onSubmit={addNominas}
                      disabled={resolvingNomina}
                      submitDisabled={resolvingNomina || parseNominaInput(nominaInput).length === 0}
                      submitting={resolvingNomina}
                      inputClassName="bg-white"
                    >
                      {nomina.map((entry, idx) => (
                        <EntityListItem
                          key={`${entry.cuit}-${idx}`}
                          tone={entry.valid ? "success" : "error"}
                          title={entry.valid && entry.nombre ? entry.nombre : entry.cuit}
                          subtitle={entry.valid && entry.nombre ? entry.cuit : undefined}
                          description={
                            entry.invalid
                              ? isValidCuit(entry.cuit)
                                ? "No encontrado"
                                : "El CUIT debe tener 11 dígitos"
                              : undefined
                          }
                          trailing={
                            <>
                              {entry.invalid ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => openManualNomina(idx)}
                                  className="text-woranz-ink"
                                >
                                  Completar
                                </Button>
                              ) : null}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => removeNomina(idx)}
                                className="text-woranz-muted hover:text-woranz-ink"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          }
                        />
                      ))}
                    </LookupSection>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Asegurados ── */}
      {stepId(step) === "asegurados" && (
        <div className="mt-8 flex flex-col gap-4">
          <LookupSection
            description="Podés agregar DNI, CUIT o pasaporte. Pegá una lista separada por espacios o comas."
            placeholder="DNI, CUIT o pasaporte"
            value={aseguradosInput}
            onChange={setAseguradosInput}
            onSubmit={addAsegurados}
            disabled={resolvingAsegurados}
            submitDisabled={resolvingAsegurados || parseAseguradosInput(aseguradosInput).length === 0}
            submitting={resolvingAsegurados}
          >
            {aseguradosList.length > 0 && (
              <p className="text-xs font-medium text-woranz-ink">
                Asegurados ({validAsegurados.length} de {cantidadActual})
                {invalidAsegurados.length > 0 ? (
                  <span className="text-red-500"> · {invalidAsegurados.length} con errores</span>
                ) : null}
              </p>
            )}

            {[...aseguradosList]
              .map((a, i) => ({ ...a, _idx: i }))
              .sort((a, b) => {
                const aErr = a.invalid || a.repeated || a.notCoverable ? 0 : 1
                const bErr = b.invalid || b.repeated || b.notCoverable ? 0 : 1
                return aErr - bErr
              })
              .map((a) => {
                const i = a._idx
                const isValid = a.valid || a.manual
                const isRecoverable = a.invalid && !a.repeated && !a.notCoverable
                const title = isValid
                  ? `${a.nombre} ${a.apellido}`.trim()
                  : a.notCoverable && (a.nombre || a.apellido)
                    ? `${a.nombre} ${a.apellido}`.trim()
                    : a.dni
                const subtitle = isValid || a.notCoverable ? a.dni : undefined
                const description = a.repeated
                  ? "Duplicado"
                  : a.notCoverable
                    ? `Fuera de rango (${MIN_AGE}-${MAX_AGE} años)`
                    : a.invalid
                      ? a.documentType === "PASAPORTE"
                        ? "Pasaporte: completá los datos manualmente"
                        : "No encontrado"
                      : undefined

                return (
                  <div key={i} className="flex flex-col gap-2">
                    <EntityListItem
                      tone={isValid ? "success" : "error"}
                      title={title}
                      subtitle={subtitle}
                      description={description}
                      trailing={
                        <>
                          {isRecoverable ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() => openManualAsegurado(i)}
                              className="text-woranz-ink"
                            >
                              Completar
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              setAseguradosList((prev) => prev.filter((_, idx) => idx !== i))
                              if (manualAseguradoIdx === i) closeManualAsegurado()
                            }}
                            className="text-woranz-muted hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      }
                    />

                  </div>
                )
              })}
          </LookupSection>
        </div>
      )}

      {/* ── Pago ── */}
      {stepId(step) === "pago" && selectedPlan && (
        <div className="mt-8 flex flex-col gap-6">
          {/* Price hero — warm bg, not black */}
          <div className="rounded-2xl border border-woranz-warm-4 bg-woranz-warm-1 px-6 py-8 text-center">
            <p className="text-sm font-medium text-woranz-muted">Total a pagar</p>
            <p className="mt-1 font-display text-4xl font-bold text-woranz-ink">{formatMoney(selectedPlan.premio)}</p>
            <p className="mt-2 text-sm text-woranz-text">
              {selectedPlan.nombre} · {cantidadActual} {cantidadActual === 1 ? "persona" : "personas"}
            </p>
          </div>

          <div className="rounded-xl border border-woranz-warm-3">
            <div className="border-b border-woranz-warm-3 px-5 py-4">
              <h2 className="text-sm font-medium text-woranz-ink">Detalle de la cotización</h2>
            </div>
            <dl className="flex flex-col gap-3 px-5 py-4 text-sm">
              <SummaryRow
                label="Duración"
                value={
                  <span className="font-medium">
                    {dayCount > 0 ? `${dayCount} ${dayCount === 1 ? "día" : "días"}` : "—"}
                    <span className="ml-1.5 font-normal text-woranz-muted">
                      {formatDate(desde)} — {formatDate(hasta)}
                    </span>
                  </span>
                }
              />
              <SummaryRow
                label="Titular"
                value={`${tomador.nombre} ${tomador.apellido}`.trim()}
              />
              <SummaryRow
                label="Contacto"
                value={`${email} · ${formatPhone(telefonoArea, telefonoNumero)}`}
              />
              {!isMulti && !esTomador ? (
                <SummaryRow
                  label="Asegurado"
                  value={`${asegurado.nombre} ${asegurado.apellido}`.trim()}
                />
              ) : null}
              {isMulti && validAsegurados.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <SummaryRow label="Asegurados" value={`${validAsegurados.length}`} />
                  <div className="max-h-64 overflow-y-auto rounded-lg bg-woranz-warm-1 p-2">
                    <div className="flex flex-col gap-1.5">
                      {validAsegurados.map((a) => (
                        <div key={`${a.documentType}-${a.dni}`} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs">
                          <span className="font-medium text-woranz-ink">{a.nombre} {a.apellido}</span>
                          <span className="tabular-nums text-woranz-muted">{a.dni}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {(clausulaSubrogacion || clausulaNoRepeticion) ? (
                <div className="flex flex-col gap-2">
                  <SummaryRow
                    label="Cláusulas"
                    value={[clausulaSubrogacion ? "Subrogación" : null, clausulaNoRepeticion ? "No repetición" : null].filter(Boolean).join(" · ")}
                  />
                  {nomina.filter((n) => n.valid).length > 0 ? (
                    <div className="rounded-lg bg-woranz-warm-1 p-2">
                      <div className="flex flex-col gap-1 text-xs text-woranz-muted">
                        {nomina.filter((n) => n.valid).map((n, i) => (
                          <p key={i}>
                            {n.nombre} ({n.cuit})
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </dl>
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
        </div>
      )}

      </div>{/* end main content */}

      {/* ── Bottom sticky bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-woranz-line bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-page items-center justify-between px-page-mobile py-3 md:px-page">
          {/* Left — summary or edit mode */}
          {editingBar ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-woranz-text">Personas</label>
                <input
                  type="number"
                  min={1}
                  value={cantidadActual}
                  onChange={(e) => setCantidadActual(Math.max(1, Number(e.target.value) || 1))}
                  className="h-8 w-16 rounded-md border border-woranz-line bg-woranz-warm-1 px-2 text-center text-sm tabular-nums text-woranz-ink focus:outline-none focus:ring-2 focus:ring-woranz-ink"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-woranz-text">Desde</label>
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="h-8 rounded-md border border-woranz-line bg-woranz-warm-1 px-2 text-sm text-woranz-ink focus:outline-none focus:ring-2 focus:ring-woranz-ink"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-medium text-woranz-text">Hasta</label>
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="h-8 rounded-md border border-woranz-line bg-woranz-warm-1 px-2 text-sm text-woranz-ink focus:outline-none focus:ring-2 focus:ring-woranz-ink"
                />
              </div>
              <button
                type="button"
                onClick={() => setEditingBar(false)}
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-woranz-ink transition-colors hover:bg-woranz-warm-2"
              >
                Listo
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="font-semibold text-woranz-ink">Accidentes Personales</span>
              <span className="text-woranz-muted">·</span>
              <span className="text-woranz-text">{cantidadActual} {cantidadActual === 1 ? "persona" : "personas"}</span>
              <span className="text-woranz-muted">·</span>
              <span className="text-woranz-text">{dayCount > 0 ? `${dayCount} ${dayCount === 1 ? "día" : "días"}` : formatDate(desde)}</span>
              {selectedPlan && (
                <>
                  <span className="text-woranz-muted">·</span>
                  <span className="font-semibold text-woranz-ink">{formatMoney(selectedPlan.premio)}</span>
                </>
              )}
              <button
                type="button"
                onClick={() => setEditingBar(true)}
                className="ml-1 rounded-md p-1 text-woranz-muted transition-colors hover:bg-woranz-warm-3 hover:text-woranz-ink"
                title="Modificar cotización"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Right — nav buttons */}
          <div className="flex w-full items-center gap-3 sm:w-auto">
            {step > 1 && (
              <button type="button" onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-woranz-text transition-colors hover:bg-woranz-warm-2 hover:text-woranz-ink">
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
            )}
            {stepId(step) === "pago" ? (
              <button type="button" disabled={submitting} onClick={handleSubmit}
                className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold disabled:opacity-50 sm:flex-none">
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />{submitStep}
                  </span>
                ) : <>Pagar con MercadoPago <ArrowRight className="ml-2 h-4 w-4" /></>}
              </button>
            ) : (
              <button type="button"
                onClick={handleNextStep}
                disabled={!canAdvance(step)}
                className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold disabled:opacity-40 sm:flex-none"
              >
                {stepId(step) === "asegurados" && resolvingAsegurados
                  ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Verificando...</span>
                  : <>Siguiente <ArrowRight className="ml-2 h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={manualAseguradoIdx !== null} onOpenChange={(open) => { if (!open) closeManualAsegurado() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Datos del asegurado</DialogTitle>
            <DialogDescription>
              Completá los datos para continuar con la cotización.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4">
            <FormField label="Tipo de documento">
              <Select
                value={manualAsegurado.documentType}
                onValueChange={(value) =>
                  setManualAsegurado((prev) => ({
                    ...prev,
                    documentType: value as "DNI" | "PASAPORTE",
                  }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              label={manualAsegurado.documentType === "PASAPORTE" ? "Número de pasaporte" : "Número de documento"}
            >
              <Input
                value={manualAsegurado.dni}
                onChange={(e) =>
                  setManualAsegurado((prev) => ({
                    ...prev,
                    dni:
                      prev.documentType === "DNI"
                        ? e.target.value.replace(/\D/g, "").slice(0, 8)
                        : cleanDni(e.target.value).slice(0, 20),
                  }))
                }
                className="h-12"
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nombre">
                <Input
                  value={manualAsegurado.nombre}
                  onChange={(e) => setManualAsegurado((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="h-12"
                />
              </FormField>
              <FormField label="Apellido">
                <Input
                  value={manualAsegurado.apellido}
                  onChange={(e) => setManualAsegurado((prev) => ({ ...prev, apellido: e.target.value }))}
                  className="h-12"
                />
              </FormField>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={closeManualAsegurado}>Cerrar</Button>
            <Button
              type="button"
              onClick={submitManualAsegurado}
              disabled={!manualAsegurado.dni || !manualAsegurado.nombre || !manualAsegurado.apellido}
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={manualNominaIdx !== null} onOpenChange={(open) => { if (!open) closeManualNomina() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Datos de la empresa</DialogTitle>
            <DialogDescription>
              Cargá los datos manualmente si el CUIT no se encuentra en la base.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4">
            <FormField label="Tipo de persona">
              <Select value="Juridico" onValueChange={() => undefined}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Jurídico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Juridico">Jurídico</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Razón social">
              <Input
                value={manualNomina.razonSocial}
                onChange={(e) => setManualNomina((prev) => ({ ...prev, razonSocial: e.target.value }))}
                className="h-12"
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tipo de documento">
                <Select value="DNI" onValueChange={() => undefined}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="DNI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Número de documento">
                <Input
                  value={manualNomina.numeroDocumento}
                  onChange={(e) =>
                    setManualNomina((prev) => ({
                      ...prev,
                      numeroDocumento: cleanDni(e.target.value).slice(0, 20),
                    }))
                  }
                  className="h-12"
                />
              </FormField>
            </div>
            <FormField label="CUIT/CUIL">
              <Input
                value={manualNomina.cuit}
                onChange={(e) =>
                  setManualNomina((prev) => ({
                    ...prev,
                    cuit: e.target.value.replace(/\D/g, "").slice(0, 11),
                  }))
                }
                className="h-12"
              />
            </FormField>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={closeManualNomina}>Cerrar</Button>
            <Button
              type="button"
              onClick={submitManualNomina}
              disabled={!manualNomina.razonSocial || !isValidCuit(manualNomina.cuit)}
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mismatchCount !== null} onOpenChange={(open) => { if (!open) setMismatchCount(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar cantidad de personas</DialogTitle>
            <DialogDescription>
              Agregaste {mismatchCount ?? 0} asegurados y la cotización actual está calculada para {cantidadActual}. Si seguís, vamos a recalcular el precio y actualizar el footer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setMismatchCount(null)}>Cancelar</Button>
            <Button
              type="button"
              onClick={() => {
                if (mismatchCount) setCantidadActual(mismatchCount)
                setMismatchCount(null)
                goNext()
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
