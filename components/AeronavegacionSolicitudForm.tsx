"use client"

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react"

import { BreadcrumbStepper } from "@/components/ui/breadcrumb-stepper"
import { CiudadSearch } from "@/components/ui/georef-search"
import { Input } from "@/components/ui/input"
import { buildProductPath } from "@/lib/product-paths"
import { cn } from "@/lib/utils"

// ── Constants ───────────────────────────────────────────────────────

const STEPS = [
  { id: "asegurado", title: "Datos del asegurado" },
  { id: "aeronave", title: "Aeronave" },
  { id: "operacion", title: "Operación y coberturas" },
  { id: "adicionales", title: "Datos adicionales" },
  { id: "envio", title: "Archivos y envío" },
]

const CONDICIONES_FISCALES = [
  "Responsable inscripto",
  "Monotributista",
  "Consumidor final",
  "Exento",
  "No alcanzado",
]

const MARCAS_AERONAVE = [
  "ACJ", "Airbus", "Beechcraft", "Bell", "Boeing", "Bombardier", "Cessna",
  "Cirrus", "Dassault", "De Havilland", "Diamond", "Eclipse", "Embraer",
  "Eurocopter", "Grob", "Gulfstream", "Hawker", "Let", "Lockheed",
  "McDonnell Douglas", "Mooney", "Pilatus", "Piaggio", "Piper", "Robinson",
  "Saab", "Sikorsky", "Otros",
]

const TIPOS_AERONAVE = [
  "Monomotor a pistón",
  "Multimotor a pistón",
  "Monomotor turbohélice",
  "Multimotor turbohélice",
  "Turbina monomotor",
  "Turbina multimotor",
]

const ACTIVIDADES = [
  "Taxi aéreo", "Privado", "Ayuda industrial", "Aviación deportiva",
  "Aeroaplicador", "Combate contra incendios", "Rescate", "Carga",
  "Vuelos sanitarios", "Investigación", "Fotografía y filmación",
  "Propaganda", "Inspección y vigilancia", "Defensa y protección de la fauna",
  "Instrucción", "Turismo", "Otros",
]

const COBERTURAS = [
  "Casco — todo riesgo en vuelo",
  "Casco — todo riesgo en tierra",
  "Casco — riesgos de hangar",
  "Responsabilidad Civil — transportados",
  "Responsabilidad Civil — no transportados",
  "Accidentes personales — pasajeros",
  "Accidentes personales — tripulantes",
  "Repuestos",
  "Otros",
]

const ICAO_TYPE_MAP: Record<string, string> = {
  L1P: "Monomotor a pistón",
  L2P: "Multimotor a pistón",
  L1T: "Monomotor turbohélice",
  L2T: "Multimotor turbohélice",
  L1J: "Turbina monomotor",
  L2J: "Turbina multimotor",
  H1P: "Monomotor a pistón",
  H1T: "Monomotor turbohélice",
  H2T: "Multimotor turbohélice",
}

type ContactMode = "email" | "llamada" | "whatsapp" | ""

type PilotData = {
  nombre: string
  edad: string
  dni: string
  licencia: string
  vencimientoCMA: string
  horasTotal: string
  horasTipo: string
  horasMarcaModelo: string
  horasOtros: string
  siniestralidad: string
}

type CoberturaEntry = {
  tipo: string
  suma: string
}

// ── Sub-components ──────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600">{message}</p>
}

function OptionCard({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-field px-5 py-4 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "border-2 border-woranz-ink bg-white text-woranz-ink"
          : "border border-woranz-border bg-woranz-warm-2 text-woranz-slate hover:border-woranz-muted"
      )}
    >
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          active ? "border-woranz-ink bg-woranz-ink" : "border-woranz-warm-4"
        )}
      >
        {active && <Check className="h-3 w-3 text-white" />}
      </div>
      {children}
    </button>
  )
}

function CheckboxCard({
  checked,
  children,
  onClick,
}: {
  checked: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-field px-5 py-3.5 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked
          ? "border-2 border-woranz-ink bg-white text-woranz-ink"
          : "border border-woranz-border bg-woranz-warm-2 text-woranz-slate hover:border-woranz-muted"
      )}
    >
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all",
          checked ? "border-woranz-ink bg-woranz-ink" : "border-woranz-warm-4"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
      {children}
    </button>
  )
}

function SectionToggle({
  label,
  description,
  active,
  onToggle,
  children,
}: {
  label: string
  description?: string
  active: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-woranz-line">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-woranz-ink">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-woranz-muted">{description}</p>
          )}
        </div>
        {active ? (
          <ChevronUp className="h-4 w-4 text-woranz-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-woranz-muted" />
        )}
      </button>
      {active && (
        <div className="flex flex-col gap-4 border-t border-woranz-line px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

function PilotFields({
  label,
  data,
  onChange,
}: {
  label: string
  data: PilotData
  onChange: (patch: Partial<PilotData>) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-woranz-ink">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <LabeledInput label="Nombre y apellido" value={data.nombre} onChange={(v) => onChange({ nombre: v })} />
        <LabeledInput label="Edad" value={data.edad} onChange={(v) => onChange({ edad: v })} inputMode="numeric" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <LabeledInput label="DNI" value={data.dni} onChange={(v) => onChange({ dni: v })} inputMode="numeric" />
        <LabeledInput label="Tipo y Nro. licencia" value={data.licencia} onChange={(v) => onChange({ licencia: v })} />
      </div>
      <LabeledInput label="Vencimiento CMA" type="date" value={data.vencimientoCMA} onChange={(v) => onChange({ vencimientoCMA: v })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <LabeledInput label="Horas totales de vuelo" value={data.horasTotal} onChange={(v) => onChange({ horasTotal: v })} inputMode="numeric" />
        <LabeledInput label="Horas en tipo de avión" value={data.horasTipo} onChange={(v) => onChange({ horasTipo: v })} inputMode="numeric" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <LabeledInput label="Horas en marca/modelo" value={data.horasMarcaModelo} onChange={(v) => onChange({ horasMarcaModelo: v })} inputMode="numeric" />
        <LabeledInput label="Horas otros tipos" value={data.horasOtros} onChange={(v) => onChange({ horasOtros: v })} inputMode="numeric" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-woranz-ink">Siniestralidad últimos 5 años</label>
        <textarea
          value={data.siniestralidad}
          onChange={(e) => onChange({ siniestralidad: e.target.value })}
          rows={2}
          className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  inputMode?: "numeric" | "text" | "email" | "tel"
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-woranz-ink">{label}</label>
      <Input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={disabled ? "opacity-60" : ""}
      />
    </div>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────

function emptyPilot(): PilotData {
  return {
    nombre: "", edad: "", dni: "", licencia: "", vencimientoCMA: "",
    horasTotal: "", horasTipo: "", horasMarcaModelo: "", horasOtros: "",
    siniestralidad: "",
  }
}

// ── Main Form ───────────────────────────────────────────────────────

export function AeronavegacionSolicitudForm() {
  // Step
  const [step, setStep] = useState(1)

  // ── Step 1: Asegurado ──
  const [dni, setDni] = useState("")
  const [dniLoading, setDniLoading] = useState(false)
  const [dniLookupDone, setDniLookupDone] = useState(false)
  const [cuit, setCuit] = useState("")
  const [nombreCompleto, setNombreCompleto] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [condicionFiscal, setCondicionFiscal] = useState("")
  const [localidad, setLocalidad] = useState("")
  const [provincia, setProvincia] = useState("")

  // ── Step 2: Aeronave ──
  const [matricula, setMatricula] = useState("")
  const [matriculaLoading, setMatriculaLoading] = useState(false)
  const [matriculaLookupDone, setMatriculaLookupDone] = useState(false)
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [anio, setAnio] = useState("")
  const [nroSerie, setNroSerie] = useState("")
  const [tipoAeronave, setTipoAeronave] = useState("")
  const [asientosTripulantes, setAsientosTripulantes] = useState("")
  const [asientosPasajeros, setAsientosPasajeros] = useState("")
  const [ultimoOverhaul, setUltimoOverhaul] = useState("")
  const [vencimientoPoliza, setVencimientoPoliza] = useState("")
  const [siniestraliadAeronave, setSiniestraliadAeronave] = useState("")

  // ── Step 3: Operación + Coberturas ──
  const [usoAnualHoras, setUsoAnualHoras] = useState("")
  const [actividades, setActividades] = useState<string[]>([])
  const [baseOperaciones, setBaseOperaciones] = useState("")
  const [limiteGeografico, setLimiteGeografico] = useState("")
  const [coberturas, setCoberturas] = useState<CoberturaEntry[]>([])

  // ── Step 4: Datos adicionales ──
  const [hasFerryFlight, setHasFerryFlight] = useState(false)
  const [ferryRuta, setFerryRuta] = useState("")
  const [ferrySalida, setFerrySalida] = useState("")
  const [ferryArribo, setFerryArribo] = useState("")
  const [comandante, setComandante] = useState<PilotData>(emptyPilot())
  const [showCopiloto, setShowCopiloto] = useState(false)
  const [copiloto, setCopiloto] = useState<PilotData>(emptyPilot())

  const [hasAirportPresence, setHasAirportPresence] = useState(false)
  const [edificiosHangares, setEdificiosHangares] = useState("")
  const [ocupacion, setOcupacion] = useState("")
  const [vehiculosEquipos, setVehiculosEquipos] = useState("")
  const [actividadesPrincipales, setActividadesPrincipales] = useState("")
  const [siniestraliadRC, setSiniestraliadRC] = useState("")

  const [isHangarista, setIsHangarista] = useState(false)
  const [valorPromedioCustodia, setValorPromedioCustodia] = useState("")
  const [valorMaximoCustodia, setValorMaximoCustodia] = useState("")
  const [nroPromedioAeronaves, setNroPromedioAeronaves] = useState("")

  // ── Step 5: Archivos y envío ──
  const [siniestraliadAsegurado, setSiniestraliadAsegurado] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [modoContacto, setModoContacto] = useState<ContactMode>("")
  const [contactoValor, setContactoValor] = useState("")
  const [archivos, setArchivos] = useState<File[]>([])

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Touched state
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  // ── Lookups ──

  const lookupDni = async () => {
    const cleaned = dni.replace(/\D/g, "")
    if (cleaned.length < 7 || cleaned.length > 8) return
    if (dniLookupDone) return

    setDniLoading(true)

    try {
      const res = await fetch("/api/aeronavegacion/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: cleaned }),
      })
      const json = await res.json()

      if (json.data) {
        setNombreCompleto(json.data.nombreCompleto || "")
        setCuit(json.data.cuit || "")
        setLocalidad(json.data.localidad || "")
        setProvincia(json.data.provincia || "")
        if (json.data.email) setEmail(json.data.email)
      }
    } catch {
      // Silent fail — user can fill manually
    } finally {
      setDniLoading(false)
      setDniLookupDone(true)
    }
  }

  const lookupMatricula = async () => {
    const cleaned = matricula.trim().toUpperCase()
    if (!/^L[VQ]-[A-Z]{3}$/.test(cleaned)) return
    if (matriculaLookupDone) return

    setMatriculaLoading(true)

    try {
      const res = await fetch("/api/aeronavegacion/aircraft-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula: cleaned }),
      })
      const json = await res.json()

      if (json.data) {
        if (json.data.marca) setMarca(json.data.marca)
        if (json.data.modelo) setModelo(json.data.modelo)
        if (json.data.nroSerie) setNroSerie(json.data.nroSerie)
        if (json.data.icaoType && ICAO_TYPE_MAP[json.data.icaoType]) {
          setTipoAeronave(ICAO_TYPE_MAP[json.data.icaoType])
        }
      }
    } catch {
      // Silent fail
    } finally {
      setMatriculaLoading(false)
      setMatriculaLookupDone(true)
    }
  }

  // ── Validation ──

  const errors: Record<string, string | undefined> = {
    dni: (() => {
      const cleaned = dni.replace(/\D/g, "")
      if (!cleaned) return "Ingresá tu DNI"
      if (cleaned.length < 7 || cleaned.length > 8) return "El DNI debe tener 7 u 8 dígitos"
      return undefined
    })(),
    nombreCompleto: !nombreCompleto.trim() ? "Ingresá el nombre" : undefined,
    email: (() => {
      if (!email.trim()) return "Ingresá un email"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido"
      return undefined
    })(),
    telefono: !telefono.trim() ? "Ingresá un teléfono" : undefined,
    condicionFiscal: !condicionFiscal ? "Seleccioná la condición fiscal" : undefined,

    matricula: (() => {
      if (!matricula.trim()) return "Ingresá la matrícula"
      if (!/^L[VQ]-[A-Z]{3}$/i.test(matricula.trim())) return "Formato: LV-XXX"
      return undefined
    })(),
    marca: !marca ? "Seleccioná la marca" : undefined,
    modelo: !modelo.trim() ? "Ingresá el modelo" : undefined,
    tipoAeronave: !tipoAeronave ? "Seleccioná el tipo" : undefined,

    modoContacto: !modoContacto ? "Elegí cómo querés que te contactemos" : undefined,
    contactoValor: (() => {
      if (!modoContacto) return undefined
      if (!contactoValor.trim())
        return modoContacto === "email" ? "Ingresá tu email" : "Ingresá tu teléfono"
      if (modoContacto === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoValor))
        return "Email inválido"
      return undefined
    })(),
  }

  const errorFor = (field: string) => (touched[field] ? errors[field] : undefined)

  const stepFields: Record<number, string[]> = {
    1: ["dni", "nombreCompleto", "email", "telefono", "condicionFiscal"],
    2: ["matricula", "marca", "modelo", "tipoAeronave"],
    3: [],
    4: [],
    5: ["modoContacto", "contactoValor"],
  }

  const validateStep = (s: number): boolean => {
    const fields = stepFields[s] ?? []
    const allTouched: Record<string, boolean> = {}
    for (const f of fields) allTouched[f] = true
    setTouched((prev) => ({ ...prev, ...allTouched }))
    return !fields.some((f) => errors[f])
  }

  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── File handling ──

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    const totalSize = [...archivos, ...newFiles].reduce((sum, f) => sum + f.size, 0)
    if (totalSize > 10 * 1024 * 1024) {
      setSubmitError("Los archivos no pueden superar 10MB en total.")
      return
    }
    setArchivos((prev) => [...prev, ...newFiles].slice(0, 5))
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Cobertura helpers ──

  const toggleCobertura = (tipo: string) => {
    setCoberturas((prev) => {
      const exists = prev.find((c) => c.tipo === tipo)
      if (exists) return prev.filter((c) => c.tipo !== tipo)
      return [...prev, { tipo, suma: "" }]
    })
  }

  const updateCoberturaSuma = (tipo: string, suma: string) => {
    setCoberturas((prev) =>
      prev.map((c) => (c.tipo === tipo ? { ...c, suma } : c))
    )
  }

  // ── Submit ──

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!validateStep(step)) return

    setSubmitError("")
    setSubmitting(true)

    try {
      const fd = new FormData()
      fd.set("_formType", "aeronavegacion-solicitud")

      // Asegurado
      fd.set("dni", dni.replace(/\D/g, ""))
      fd.set("cuit", cuit)
      fd.set("nombreCompleto", nombreCompleto)
      fd.set("email", email)
      fd.set("telefono", telefono)
      fd.set("condicionFiscal", condicionFiscal)
      fd.set("localidad", localidad)
      fd.set("provincia", provincia)

      // Aeronave
      fd.set("matricula", matricula.trim().toUpperCase())
      fd.set("marca", marca)
      fd.set("modelo", modelo)
      fd.set("anio", anio)
      fd.set("nroSerie", nroSerie)
      fd.set("tipoAeronave", tipoAeronave)
      fd.set("asientosTripulantes", asientosTripulantes)
      fd.set("asientosPasajeros", asientosPasajeros)
      fd.set("ultimoOverhaul", ultimoOverhaul)
      fd.set("vencimientoPoliza", vencimientoPoliza)
      fd.set("siniestraliadAeronave", siniestraliadAeronave)

      // Operación
      fd.set("usoAnualHoras", usoAnualHoras)
      fd.set("actividades", actividades.join(", "))
      fd.set("baseOperaciones", baseOperaciones)
      fd.set("limiteGeografico", limiteGeografico)

      // Coberturas
      fd.set("coberturas", JSON.stringify(coberturas))

      // Ferry
      fd.set("hasFerryFlight", hasFerryFlight ? "true" : "false")
      fd.set("ferryRuta", ferryRuta)
      fd.set("ferrySalida", ferrySalida)
      fd.set("ferryArribo", ferryArribo)
      fd.set("comandante", hasFerryFlight ? JSON.stringify(comandante) : "")
      fd.set("copiloto", hasFerryFlight && showCopiloto ? JSON.stringify(copiloto) : "")

      // RC ARIEL
      fd.set("hasAirportPresence", hasAirportPresence ? "true" : "false")
      fd.set("edificiosHangares", edificiosHangares)
      fd.set("ocupacion", ocupacion)
      fd.set("vehiculosEquipos", vehiculosEquipos)
      fd.set("actividadesPrincipales", actividadesPrincipales)
      fd.set("siniestraliadRC", siniestraliadRC)

      // Hangarista
      fd.set("isHangarista", isHangarista ? "true" : "false")
      fd.set("valorPromedioCustodia", valorPromedioCustodia)
      fd.set("valorMaximoCustodia", valorMaximoCustodia)
      fd.set("nroPromedioAeronaves", nroPromedioAeronaves)

      // Envío
      fd.set("siniestraliadAsegurado", siniestraliadAsegurado)
      fd.set("comentarios", comentarios)
      fd.set("modoContacto", modoContacto)
      fd.set("contactoValor", contactoValor)

      for (const file of archivos) fd.append("archivos", file)

      const res = await fetch("/api/forms/submit", { method: "POST", body: fd })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Error al enviar.")
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al enviar el formulario.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-6 font-display text-section-mobile text-woranz-ink md:text-section">
          ¡Solicitud enviada!
        </h2>
        <p className="mt-3 max-w-sm text-body text-woranz-text md:text-lead">
          Recibimos tus datos. Un especialista en aeronavegación te contacta por{" "}
          {modoContacto === "email"
            ? "email"
            : modoContacto === "llamada"
              ? "teléfono"
              : "WhatsApp"}{" "}
          en menos de 24hs.
        </p>
        <a
          href={buildProductPath("empresas", "aeronavegacion")}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-woranz-yellow px-6 py-3 text-sm font-semibold text-woranz-ink transition-colors hover:bg-woranz-yellow/80"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  // ── Render ──

  const isLastStep = step === STEPS.length

  return (
    <div className="mx-auto w-full max-w-page px-page-mobile md:px-page">
      <div className="mx-auto max-w-xl pt-6 md:pt-8">
        <BreadcrumbStepper steps={STEPS} currentStep={step} onStepClick={setStep} />
      </div>

      <div className="mx-auto w-full max-w-xl pb-32 pt-8 md:pt-10">
        <h1 className="text-center font-display text-[2rem] font-bold leading-tight tracking-tight text-woranz-ink lg:text-[2.25rem]">
          {STEPS[step - 1].title}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col gap-6">

            {/* ── Step 1: Datos del asegurado ── */}
            {step === 1 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">DNI</label>
                  <div className="relative">
                    <Input
                      inputMode="numeric"
                      placeholder="Ej: 35123456"
                      value={dni}
                      onChange={(e) => {
                        setDni(e.target.value.replace(/\D/g, ""))
                        setDniLookupDone(false)
                      }}
                      onBlur={() => { touch("dni"); lookupDni() }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lookupDni() } }}
                      maxLength={8}
                      autoFocus
                      className="h-12 pr-20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {dniLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-woranz-muted" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => lookupDni()}
                          disabled={!dni || dni.replace(/\D/g, "").length < 7}
                          className="text-sm font-medium text-woranz-ink disabled:opacity-30"
                        >
                          Buscar
                        </button>
                      )}
                    </div>
                  </div>
                  <FieldError message={errorFor("dni")} />
                </div>

                {dniLookupDone && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <LabeledInput label="Nombre completo" value={nombreCompleto} onChange={setNombreCompleto} placeholder="Nombre o Razón Social" />
                      <LabeledInput label="CUIT" value={cuit} onChange={setCuit} placeholder="XX-XXXXXXXX-X" />
                    </div>
                    <FieldError message={errorFor("nombreCompleto")} />
                  </>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => touch("email")}
                      placeholder="tu@email.com"
                    />
                    <FieldError message={errorFor("email")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Teléfono</label>
                    <Input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      onBlur={() => touch("telefono")}
                      placeholder="11 2345 6789"
                    />
                    <FieldError message={errorFor("telefono")} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Condición fiscal</label>
                  <select
                    value={condicionFiscal}
                    onChange={(e) => { setCondicionFiscal(e.target.value); touch("condicionFiscal") }}
                    className="flex h-10 w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-2 text-sm text-woranz-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleccionar...</option>
                    {CONDICIONES_FISCALES.map((cf) => (
                      <option key={cf} value={cf}>{cf}</option>
                    ))}
                  </select>
                  <FieldError message={errorFor("condicionFiscal")} />
                </div>

                {dniLookupDone && (localidad || provincia) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <LabeledInput label="Localidad" value={localidad} onChange={setLocalidad} />
                    <LabeledInput label="Provincia" value={provincia} onChange={setProvincia} />
                  </div>
                )}
              </>
            )}

            {/* ── Step 2: Aeronave ── */}
            {step === 2 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Matrícula</label>
                  <div className="relative">
                    <Input
                      placeholder="LV-XXX"
                      value={matricula}
                      onChange={(e) => {
                        setMatricula(e.target.value.toUpperCase())
                        setMatriculaLookupDone(false)
                      }}
                      onBlur={() => { touch("matricula"); lookupMatricula() }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lookupMatricula() } }}
                      maxLength={6}
                      autoFocus
                      className="h-12 pr-20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {matriculaLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-woranz-muted" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => lookupMatricula()}
                          disabled={!/^L[VQ]-[A-Z]{3}$/i.test(matricula.trim())}
                          className="text-sm font-medium text-woranz-ink disabled:opacity-30"
                        >
                          Buscar
                        </button>
                      )}
                    </div>
                  </div>
                  <FieldError message={errorFor("matricula")} />
                  {matriculaLookupDone && marca && (
                    <p className="text-xs text-green-600">
                      Datos completados automáticamente desde base de aeronaves
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Marca</label>
                  <select
                    value={marca}
                    onChange={(e) => { setMarca(e.target.value); touch("marca") }}
                    className="flex h-10 w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-2 text-sm text-woranz-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleccionar...</option>
                    {MARCAS_AERONAVE.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    {marca && !MARCAS_AERONAVE.includes(marca) && (
                      <option value={marca}>{marca}</option>
                    )}
                  </select>
                  <FieldError message={errorFor("marca")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Modelo</label>
                    <Input value={modelo} onChange={(e) => setModelo(e.target.value)} onBlur={() => touch("modelo")} placeholder="Ej: Learjet 60" />
                    <FieldError message={errorFor("modelo")} />
                  </div>
                  <LabeledInput label="Año" value={anio} onChange={setAnio} inputMode="numeric" placeholder="Ej: 2018" />
                  <LabeledInput label="Nro. serie" value={nroSerie} onChange={setNroSerie} placeholder="Nro. serie" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Tipo de aeronave</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TIPOS_AERONAVE.map((tipo) => (
                      <OptionCard key={tipo} active={tipoAeronave === tipo} onClick={() => { setTipoAeronave(tipo); touch("tipoAeronave") }}>
                        {tipo}
                      </OptionCard>
                    ))}
                  </div>
                  <FieldError message={errorFor("tipoAeronave")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledInput label="Asientos tripulantes" value={asientosTripulantes} onChange={setAsientosTripulantes} inputMode="numeric" />
                  <LabeledInput label="Asientos pasajeros" value={asientosPasajeros} onChange={setAsientosPasajeros} inputMode="numeric" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledInput label="Último overhaul" type="date" value={ultimoOverhaul} onChange={setUltimoOverhaul} />
                  <LabeledInput label="Vencimiento póliza vigente" type="date" value={vencimientoPoliza} onChange={setVencimientoPoliza} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Siniestralidad de la aeronave (últimos 5 años)</label>
                  <textarea
                    value={siniestraliadAeronave}
                    onChange={(e) => setSiniestraliadAeronave(e.target.value)}
                    rows={3}
                    placeholder="Detallar siniestros de la aeronave..."
                    className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </>
            )}

            {/* ── Step 3: Operación y coberturas ── */}
            {step === 3 && (
              <>
                <p className="text-sm font-semibold text-woranz-ink">Operación</p>

                <LabeledInput label="Uso anual estimado (horas)" value={usoAnualHoras} onChange={setUsoAnualHoras} inputMode="numeric" placeholder="Ej: 500" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Actividades de la aeronave</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ACTIVIDADES.map((act) => (
                      <CheckboxCard
                        key={act}
                        checked={actividades.includes(act)}
                        onClick={() =>
                          setActividades((prev) =>
                            prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
                          )
                        }
                      >
                        {act}
                      </CheckboxCard>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Base de operaciones</label>
                  <CiudadSearch value={baseOperaciones} onChange={setBaseOperaciones} />
                </div>

                <LabeledInput label="Límite geográfico" value={limiteGeografico} onChange={setLimiteGeografico} placeholder="Ej: República Argentina" />

                <div className="mt-4 border-t border-woranz-line pt-6">
                  <p className="text-sm font-semibold text-woranz-ink">Coberturas deseadas</p>
                  <p className="mt-1 text-xs text-woranz-muted">
                    Seleccioná las coberturas e indicá la suma asegurada para cada una. Aclará la moneda.
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    {COBERTURAS.map((cob) => {
                      const entry = coberturas.find((c) => c.tipo === cob)
                      const isSelected = !!entry
                      return (
                        <div key={cob}>
                          <CheckboxCard checked={isSelected} onClick={() => toggleCobertura(cob)}>
                            {cob}
                          </CheckboxCard>
                          {isSelected && (
                            <div className="mt-2 pl-8">
                              <Input
                                placeholder="Suma asegurada (ej: USD 500.000)"
                                value={entry.suma}
                                onChange={(e) => updateCoberturaSuma(cob, e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 4: Datos adicionales ── */}
            {step === 4 && (
              <>
                <p className="text-sm text-woranz-text">
                  Completá solo las secciones que apliquen a tu operación.
                </p>

                <SectionToggle
                  label="Vuelo Ferry"
                  description="¿Necesitás cobertura para un vuelo de traslado?"
                  active={hasFerryFlight}
                  onToggle={() => setHasFerryFlight(!hasFerryFlight)}
                >
                  <LabeledInput label="Ruta" value={ferryRuta} onChange={setFerryRuta} placeholder="Aeropuerto origen → escalas → destino" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <LabeledInput label="Fecha estimada de salida" type="date" value={ferrySalida} onChange={setFerrySalida} />
                    <LabeledInput label="Fecha estimada de arribo" type="date" value={ferryArribo} onChange={setFerryArribo} />
                  </div>
                  <PilotFields label="Comandante" data={comandante} onChange={(patch) => setComandante((prev) => ({ ...prev, ...patch }))} />
                  <div className="border-t border-woranz-line pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCopiloto(!showCopiloto)}
                      className="text-sm font-medium text-woranz-ink"
                    >
                      {showCopiloto ? "Quitar copiloto" : "+ Agregar copiloto"}
                    </button>
                  </div>
                  {showCopiloto && (
                    <PilotFields label="Copiloto" data={copiloto} onChange={(patch) => setCopiloto((prev) => ({ ...prev, ...patch }))} />
                  )}
                </SectionToggle>

                <SectionToggle
                  label="Ubicación en aeropuerto"
                  description="¿Sos dueño u ocupás una ubicación en un aeropuerto?"
                  active={hasAirportPresence}
                  onToggle={() => setHasAirportPresence(!hasAirportPresence)}
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Edificios, hangares, rampas y ubicaciones a asegurar</label>
                    <textarea
                      value={edificiosHangares}
                      onChange={(e) => setEdificiosHangares(e.target.value)}
                      rows={3}
                      placeholder="Listá todas las ubicaciones..."
                      className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Tipo de ocupación</label>
                    <div className="flex flex-col gap-2">
                      {[
                        "Espacio completo — dueño",
                        "Espacio completo — arrendatario",
                        "Parte de las ubicaciones — dueño",
                        "Parte de las ubicaciones — arrendatario",
                      ].map((opt) => (
                        <OptionCard key={opt} active={ocupacion === opt} onClick={() => setOcupacion(opt)}>
                          {opt}
                        </OptionCard>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Vehículos y equipos móviles</label>
                    <textarea
                      value={vehiculosEquipos}
                      onChange={(e) => setVehiculosEquipos(e.target.value)}
                      rows={2}
                      placeholder="Listá vehículos y equipos..."
                      className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Actividades principales</label>
                    <textarea
                      value={actividadesPrincipales}
                      onChange={(e) => setActividadesPrincipales(e.target.value)}
                      rows={2}
                      placeholder="Describí tus actividades..."
                      className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">Siniestralidad RC (últimos 5 años)</label>
                    <textarea
                      value={siniestraliadRC}
                      onChange={(e) => setSiniestraliadRC(e.target.value)}
                      rows={2}
                      className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </SectionToggle>

                <SectionToggle
                  label="Hangarista"
                  description="¿Tenés aeronaves de terceros en custodia?"
                  active={isHangarista}
                  onToggle={() => setIsHangarista(!isHangarista)}
                >
                  <LabeledInput label="Valor promedio de aeronave en custodia" value={valorPromedioCustodia} onChange={setValorPromedioCustodia} placeholder="Ej: USD 200.000" />
                  <LabeledInput label="Valor máximo de aeronave en custodia" value={valorMaximoCustodia} onChange={setValorMaximoCustodia} placeholder="Ej: USD 500.000" />
                  <LabeledInput label="Número promedio de aeronaves en custodia" value={nroPromedioAeronaves} onChange={setNroPromedioAeronaves} inputMode="numeric" />
                </SectionToggle>
              </>
            )}

            {/* ── Step 5: Archivos y envío ── */}
            {step === 5 && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-woranz-ink">Documentación</label>
                  <p className="text-xs text-woranz-muted">
                    Póliza vigente, certificado de aeronavegabilidad, certificado de matrícula, licencias de tripulación. PDF, JPG o PNG — máx 10MB total.
                  </p>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-field border border-dashed border-woranz-border bg-woranz-warm-2 px-5 py-8 text-center transition-colors hover:border-woranz-muted">
                    <Upload className="h-5 w-5 text-woranz-muted" />
                    <span className="text-sm text-woranz-text">
                      Hacé click para subir archivos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {archivos.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {archivos.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between rounded-lg bg-woranz-warm-1 px-4 py-2.5"
                        >
                          <span className="truncate text-sm text-woranz-slate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-2 rounded text-woranz-muted transition-colors hover:text-woranz-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Siniestralidad del asegurado (últimos 5 años)</label>
                  <textarea
                    value={siniestraliadAsegurado}
                    onChange={(e) => setSiniestraliadAsegurado(e.target.value)}
                    rows={3}
                    placeholder="Detallar siniestros del asegurado..."
                    className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">Comentarios adicionales</label>
                  <textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    rows={3}
                    placeholder="Cualquier información relevante..."
                    className="flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate placeholder:text-woranz-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-woranz-ink">
                    ¿Cómo preferís que te contactemos?
                  </p>
                  <div className="flex flex-col gap-2">
                    <OptionCard active={modoContacto === "email"} onClick={() => { setModoContacto("email"); setContactoValor(""); touch("modoContacto") }}>
                      Email
                    </OptionCard>
                    <OptionCard active={modoContacto === "llamada"} onClick={() => { setModoContacto("llamada"); setContactoValor(""); touch("modoContacto") }}>
                      Llamada telefónica
                    </OptionCard>
                    <OptionCard active={modoContacto === "whatsapp"} onClick={() => { setModoContacto("whatsapp"); setContactoValor(""); touch("modoContacto") }}>
                      WhatsApp
                    </OptionCard>
                  </div>
                  <FieldError message={errorFor("modoContacto")} />

                  {modoContacto !== "" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-woranz-ink">
                        {modoContacto === "email" ? "Tu email" : "Tu número de teléfono"}
                      </label>
                      <Input
                        type={modoContacto === "email" ? "email" : "tel"}
                        placeholder={modoContacto === "email" ? "tu@email.com" : "Ej: 11 2345 6789"}
                        value={contactoValor}
                        onChange={(e) => setContactoValor(e.target.value)}
                        onBlur={() => touch("contactoValor")}
                        autoFocus
                      />
                      <FieldError message={errorFor("contactoValor")} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {submitError && (
            <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
        </form>
      </div>

      {/* ── Bottom sticky bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-woranz-line bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-page items-center justify-between px-page-mobile py-3 md:px-page">
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <span className="font-semibold text-woranz-ink">Aeronavegación</span>
            {matricula && (
              <>
                <span className="text-woranz-muted">·</span>
                <span className="text-woranz-text">{matricula.toUpperCase()}</span>
              </>
            )}
            {marca && modelo && (
              <>
                <span className="text-woranz-muted">·</span>
                <span className="text-woranz-text">{marca} {modelo}</span>
              </>
            )}
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            {step > 1 && (
              <button type="button" onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-woranz-text transition-colors hover:bg-woranz-warm-2 hover:text-woranz-ink">
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
            )}
            {isLastStep ? (
              <button type="button" disabled={submitting} onClick={handleSubmit}
                className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold disabled:opacity-50 sm:flex-none">
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />Enviando...
                  </span>
                ) : <>Enviar solicitud <ArrowRight className="ml-2 h-4 w-4" /></>}
              </button>
            ) : (
              <button type="button" onClick={goNext}
                className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold sm:flex-none">
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
