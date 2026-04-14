"use client"

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react"

import { BreadcrumbStepper } from "@/components/ui/breadcrumb-stepper"
import { EntityListItem } from "@/components/ui/entity-list"
import { CiudadSearch } from "@/components/ui/georef-search"
import { Input } from "@/components/ui/input"
import { buildProductPath } from "@/lib/product-paths"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────

type ContactMode = "email" | "llamada" | "whatsapp" | ""

type AvalEntry = {
  dni: string
  nombre: string
  apellido: string
  loading: boolean
  lookupDone: boolean
  lookupFailed: boolean
}

type QuoterData = {
  provincia: string
  alquiler: number
  duracion: number
  modoPago: string
  restitucion: boolean
  idProductor: string
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function handleMoneyInput(value: string, setValue: (v: number) => void) {
  const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10)
  setValue(Number.isNaN(numericValue) ? 0 : numericValue)
}

const PROVINCIAS_MAP: Record<string, string> = {
  "buenos-aires": "Buenos Aires",
  caba: "CABA",
  cordoba: "Córdoba",
  "santa-fe": "Santa Fe",
  mendoza: "Mendoza",
  tucuman: "Tucumán",
  "entre-rios": "Entre Ríos",
  salta: "Salta",
  misiones: "Misiones",
  chaco: "Chaco",
  corrientes: "Corrientes",
  "santiago-del-estero": "Santiago del Estero",
  "san-juan": "San Juan",
  jujuy: "Jujuy",
  "rio-negro": "Río Negro",
  neuquen: "Neuquén",
  formosa: "Formosa",
  chubut: "Chubut",
  "san-luis": "San Luis",
  catamarca: "Catamarca",
  "la-rioja": "La Rioja",
  "la-pampa": "La Pampa",
  "santa-cruz": "Santa Cruz",
  "tierra-del-fuego": "Tierra del Fuego",
}

const DOC_TYPES = [
  "Recibo de sueldo",
  "Constancia de monotributo",
  "Últimas facturas emitidas",
  "Certificación de ingresos",
  "Último balance (empresas)",
]

const STEPS = [
  { id: "datos", title: "Datos personales" },
  { id: "ingresos", title: "Tus ingresos" },
  { id: "docs", title: "Documentación" },
  { id: "contacto", title: "Contacto" },
]

// ── Sub-components ───────────────────────────────────────────────────

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

// ── Main Form ────────────────────────────────────────────────────────

export function PreaprobacionForm({ quoter }: { quoter: QuoterData }) {
  // Step
  const [step, setStep] = useState(1)

  // DNI + persona
  const [dni, setDni] = useState("")
  const [dniLoading, setDniLoading] = useState(false)
  const [dniLookupDone, setDniLookupDone] = useState(false)
  const [dniLookupFailed, setDniLookupFailed] = useState(false)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [domicilio, setDomicilio] = useState("")

  // Ciudad
  const [ciudad, setCiudad] = useState("")

  // Contacto
  const [modoContacto, setModoContacto] = useState<ContactMode>("")
  const [contactoValor, setContactoValor] = useState("")

  // Ingresos
  const [ingresosMensuales, setIngresosMensuales] = useState(0)
  const [ingresoFamiliar, setIngresoFamiliar] = useState(0)
  const [showIngresoFamiliar, setShowIngresoFamiliar] = useState(false)

  // Avales
  const [avales, setAvales] = useState<AvalEntry[]>([])

  const newAvalEntry = (): AvalEntry => ({
    dni: "",
    nombre: "",
    apellido: "",
    loading: false,
    lookupDone: false,
    lookupFailed: false,
  })

  const updateAval = (index: number, patch: Partial<AvalEntry>) =>
    setAvales((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a))
    )

  const lookupAvalDni = async (index: number) => {
    const aval = avales[index]
    if (!aval) return
    const cleaned = aval.dni.replace(/\D/g, "")
    if (cleaned.length < 7 || cleaned.length > 8) return
    if (aval.lookupDone) return

    updateAval(index, { loading: true })

    try {
      const res = await fetch("/api/caucion/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: cleaned }),
      })
      const json = await res.json()

      if (json.data) {
        updateAval(index, {
          nombre: json.data.nombre || "",
          apellido: json.data.apellido || "",
          loading: false,
          lookupDone: true,
          lookupFailed: false,
        })
      } else {
        updateAval(index, {
          loading: false,
          lookupDone: true,
          lookupFailed: true,
        })
      }
    } catch {
      updateAval(index, {
        loading: false,
        lookupDone: true,
        lookupFailed: true,
      })
    }
  }

  // Documentación
  const [tiposDoc, setTiposDoc] = useState<string[]>([])
  const [archivos, setArchivos] = useState<File[]>([])

  // Inmobiliaria
  const [inmobiliaria, setInmobiliaria] = useState("")

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Touched state
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  // Computed
  const totalIngresos = ingresosMensuales + ingresoFamiliar
  const needsAval =
    quoter.alquiler > 0 &&
    ingresosMensuales > 0 &&
    quoter.alquiler > totalIngresos * 0.4

  // Validation
  const errors = {
    dni: (() => {
      const cleaned = dni.replace(/\D/g, "")
      if (!cleaned) return "Ingresá tu DNI"
      if (cleaned.length < 7 || cleaned.length > 8)
        return "El DNI debe tener 7 u 8 dígitos"
      return undefined
    })(),
    nombre:
      dniLookupFailed && !nombre.trim() ? "Ingresá tu nombre" : undefined,
    apellido:
      dniLookupFailed && !apellido.trim() ? "Ingresá tu apellido" : undefined,
    ciudad: !ciudad ? "Seleccioná una ciudad" : undefined,
    modoContacto: !modoContacto
      ? "Elegí cómo querés que te contactemos"
      : undefined,
    contactoValor: (() => {
      if (!modoContacto) return undefined
      if (!contactoValor.trim())
        return modoContacto === "email"
          ? "Ingresá tu email"
          : "Ingresá tu teléfono"
      if (
        modoContacto === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactoValor)
      )
        return "Ingresá un email válido"
      return undefined
    })(),
    ingresos:
      ingresosMensuales <= 0 ? "Ingresá tus ingresos mensuales" : undefined,
  }

  const errorFor = (field: keyof typeof errors) =>
    touched[field] ? errors[field] : undefined

  const stepFields: Record<number, (keyof typeof errors)[]> = {
    1: [
      "dni",
      "ciudad",
      ...(dniLookupFailed
        ? (["nombre", "apellido"] as const)
        : []),
    ],
    2: ["ingresos"],
    3: [],
    4: ["modoContacto", "contactoValor"],
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

  // DNI auto-lookup on blur
  const lookupDni = async () => {
    const cleaned = dni.replace(/\D/g, "")
    if (cleaned.length < 7 || cleaned.length > 8) return
    if (dniLookupDone) return

    setDniLoading(true)

    try {
      const res = await fetch("/api/caucion/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: cleaned }),
      })
      const json = await res.json()

      if (json.data) {
        setNombre(json.data.nombre || "")
        setApellido(json.data.apellido || "")
        setDomicilio(json.data.domicilio || "")
        setDniLookupFailed(false)
      } else {
        setDniLookupFailed(true)
      }
    } catch {
      setDniLookupFailed(true)
    } finally {
      setDniLoading(false)
      setDniLookupDone(true)
    }
  }

  // File handling
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    const totalSize = [...archivos, ...newFiles].reduce(
      (sum, f) => sum + f.size,
      0
    )
    if (totalSize > 10 * 1024 * 1024) {
      setSubmitError("Los archivos no pueden superar 10MB en total.")
      return
    }
    setArchivos((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit
  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!validateStep(step)) return

    setSubmitError("")
    setSubmitting(true)

    try {
      const fd = new FormData()
      fd.set("_formType", "caucion-preaprobacion")
      fd.set("dni", dni.replace(/\D/g, ""))
      fd.set("nombre", nombre)
      fd.set("apellido", apellido)
      fd.set("domicilio", domicilio)
      fd.set("ciudad", ciudad)
      fd.set("modoContacto", modoContacto)
      fd.set("contactoValor", contactoValor)
      fd.set(
        "provincia",
        PROVINCIAS_MAP[quoter.provincia] ?? quoter.provincia
      )
      fd.set("alquiler", quoter.alquiler.toString())
      fd.set("duracion", quoter.duracion.toString())
      fd.set("modoPago", quoter.modoPago)
      fd.set("restitucion", quoter.restitucion ? "true" : "false")
      fd.set("ingresosMensuales", ingresosMensuales.toString())
      fd.set("ingresoFamiliar", ingresoFamiliar.toString())
      fd.set("inmobiliaria", inmobiliaria)
      fd.set("idProductor", quoter.idProductor)

      for (const a of avales) {
        if (a.dni.replace(/\D/g, "").length >= 7) {
          fd.append("avalesDnis", a.dni.replace(/\D/g, ""))
          fd.append("avalesNombres", `${a.nombre} ${a.apellido}`.trim())
        }
      }
      for (const t of tiposDoc) fd.append("tiposDocumentacion", t)
      for (const file of archivos) fd.append("archivos", file)

      const res = await fetch("/api/forms/submit", {
        method: "POST",
        body: fd,
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Error al enviar.")
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al enviar el formulario."
      )
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
          Recibimos tus datos. Te contactamos por{" "}
          {modoContacto === "email"
            ? "email"
            : modoContacto === "llamada"
              ? "teléfono"
              : "WhatsApp"}{" "}
          en menos de 24hs.
        </p>
        <a
          href={buildProductPath("personas", "caucion-alquiler")}
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
      {/* Stepper — breadcrumb style */}
      <div className="mx-auto max-w-xl pt-6 md:pt-8">
        <BreadcrumbStepper
          steps={STEPS}
          currentStep={step}
          onStepClick={setStep}
        />
      </div>

      {/* Main content — centered single column */}
      <div className="mx-auto w-full max-w-xl pb-32 pt-8 md:pt-10">

          {/* Step title */}
          <h1 className="text-center font-display text-[2rem] font-bold leading-tight tracking-tight text-woranz-ink lg:text-[2.25rem]">
            {STEPS[step - 1].title}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-6">
            {/* ── Step 1: Datos personales ── */}
            {step === 1 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">
                    DNI
                  </label>
                  <div className="relative">
                    <Input
                      inputMode="numeric"
                      placeholder="Ej: 35123456"
                      value={dni}
                      onChange={(e) => {
                        setDni(e.target.value.replace(/\D/g, ""))
                        setDniLookupDone(false)
                        setDniLookupFailed(false)
                      }}
                      onBlur={() => {
                        touch("dni")
                        lookupDni()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          lookupDni()
                        }
                      }}
                      maxLength={8}
                      autoFocus
                      className="h-12 pr-24"
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
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                  <FieldError message={errorFor("dni")} />
                  {dniLookupDone && !dniLookupFailed && (
                    <EntityListItem
                      tone="success"
                      title={`${nombre} ${apellido}`.trim()}
                      subtitle={dni}
                    />
                  )}
                </div>

                {dniLookupFailed && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-woranz-ink">
                          Nombre
                        </label>
                        <Input
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          onBlur={() => touch("nombre")}
                          placeholder="Tu nombre"
                        />
                        <FieldError message={errorFor("nombre")} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-woranz-ink">
                          Apellido
                        </label>
                        <Input
                          type="text"
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value)}
                          onBlur={() => touch("apellido")}
                          placeholder="Tu apellido"
                        />
                        <FieldError message={errorFor("apellido")} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-woranz-ink">
                        Domicilio
                      </label>
                      <Input
                        type="text"
                        value={domicilio}
                        onChange={(e) => setDomicilio(e.target.value)}
                        placeholder="Tu dirección"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">
                    Ciudad donde vas a alquilar
                  </label>
                  <CiudadSearch
                    value={ciudad}
                    onChange={(v) => {
                      setCiudad(v)
                      touch("ciudad")
                    }}
                  />
                  <FieldError message={errorFor("ciudad")} />
                </div>
              </>
            )}

            {/* ── Step 2: Ingresos ── */}
            {step === 2 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">
                    Ingresos mensuales
                  </label>
                  <div className="flex items-center gap-1 rounded-field bg-woranz-warm-2 px-4">
                    <span className="text-woranz-muted">$</span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={
                        ingresosMensuales === 0
                          ? ""
                          : ingresosMensuales.toLocaleString("es-AR")
                      }
                      onChange={(e) =>
                        handleMoneyInput(e.target.value, setIngresosMensuales)
                      }
                      onBlur={() => touch("ingresos")}
                      placeholder="0"
                      className="h-10 border-0 bg-transparent px-0 text-right text-sm text-woranz-slate shadow-none focus-visible:ring-0"
                      autoFocus
                    />
                  </div>
                  <FieldError message={errorFor("ingresos")} />

                  {!showIngresoFamiliar ? (
                    <button
                      type="button"
                      onClick={() => setShowIngresoFamiliar(true)}
                      className="mt-1 inline-flex items-center gap-1.5 self-start text-sm font-medium text-woranz-ink transition-colors hover:text-woranz-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                      Sumar ingreso familiar
                    </button>
                  ) : (
                    <div className="mt-1">
                      <label className="mb-1.5 block text-sm text-woranz-muted">
                        Ingreso familiar
                      </label>
                      <div className="flex items-center gap-1 rounded-field bg-woranz-warm-2 px-4">
                        <span className="text-woranz-muted">$</span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={
                            ingresoFamiliar === 0
                              ? ""
                              : ingresoFamiliar.toLocaleString("es-AR")
                          }
                          onChange={(e) =>
                            handleMoneyInput(
                              e.target.value,
                              setIngresoFamiliar
                            )
                          }
                          placeholder="0"
                          className="h-10 border-0 bg-transparent px-0 text-right text-sm text-woranz-slate shadow-none focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {needsAval && (
                  <div className="flex flex-col gap-3 rounded-xl border border-woranz-line bg-woranz-warm-1 px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-woranz-ink">
                        Necesitás sumar un aval
                      </p>
                      <p className="text-sm text-woranz-slate">
                        Tu alquiler ({formatMoney(quoter.alquiler)}) supera el
                        40% de tus ingresos ({formatMoney(totalIngresos)}). Un
                        aval es una persona que respalda tu solicitud con sus
                        propios ingresos — puede ser un familiar o amigo. Solo
                        necesitamos su DNI.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {avales.map((aval, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder={`DNI del aval ${index + 1}`}
                                value={aval.dni}
                                onChange={(e) => {
                                  updateAval(index, {
                                    dni: e.target.value.replace(/\D/g, ""),
                                    lookupDone: false,
                                    lookupFailed: false,
                                    nombre: "",
                                    apellido: "",
                                  })
                                }}
                                onBlur={() => lookupAvalDni(index)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    lookupAvalDni(index)
                                  }
                                }}
                                maxLength={8}
                              />
                              {aval.loading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <Loader2 className="h-4 w-4 animate-spin text-woranz-muted" />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setAvales((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              className="rounded-lg p-2.5 text-woranz-muted transition-colors hover:bg-amber-100 hover:text-woranz-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {aval.lookupFailed && (
                            <div className="grid gap-2 sm:grid-cols-2">
                              <Input
                                type="text"
                                placeholder="Nombre del aval"
                                value={aval.nombre}
                                onChange={(e) =>
                                  updateAval(index, { nombre: e.target.value })
                                }
                              />
                              <Input
                                type="text"
                                placeholder="Apellido del aval"
                                value={aval.apellido}
                                onChange={(e) =>
                                  updateAval(index, { apellido: e.target.value })
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setAvales((prev) => [...prev, newAvalEntry()])
                        }
                        className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-woranz-slate transition-colors hover:text-woranz-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar aval
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-woranz-ink">
                    Inmobiliaria
                  </label>
                  <Input
                    type="text"
                    value={inmobiliaria}
                    onChange={(e) => setInmobiliaria(e.target.value)}
                    placeholder="Nombre de la inmobiliaria (opcional)"
                  />
                </div>
              </>
            )}

            {/* ── Step 3: Documentación ── */}
            {step === 3 && (
              <>
                <p className="text-sm text-woranz-text">
                  Necesitamos verificar tus ingresos para avanzar con la
                  pre-aprobación.
                </p>
                <div className="flex flex-col gap-2">
                  {DOC_TYPES.map((type) => {
                    const isSelected = tiposDoc.includes(type)
                    return (
                      <OptionCard
                        key={type}
                        active={isSelected}
                        onClick={() => {
                          setTiposDoc((prev) =>
                            isSelected
                              ? prev.filter((t) => t !== type)
                              : [...prev, type]
                          )
                        }}
                      >
                        {type}
                      </OptionCard>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-woranz-ink">
                    Adjuntá tus archivos
                  </label>
                  <p className="text-xs text-woranz-muted">
                    PDF, JPG o PNG — máx 10MB total. Opcional.
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
                          <span className="truncate text-sm text-woranz-slate">
                            {file.name}
                          </span>
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
              </>
            )}

            {/* ── Step 4: Contacto ── */}
            {step === 4 && (
              <>
                <p className="text-sm text-woranz-text">
                  Elegí cómo preferís que te contactemos.
                </p>
                <div className="flex flex-col gap-2">
                  <OptionCard
                    active={modoContacto === "email"}
                    onClick={() => {
                      setModoContacto("email")
                      setContactoValor("")
                      touch("modoContacto")
                    }}
                  >
                    Email
                  </OptionCard>
                  <OptionCard
                    active={modoContacto === "llamada"}
                    onClick={() => {
                      setModoContacto("llamada")
                      setContactoValor("")
                      touch("modoContacto")
                    }}
                  >
                    Llamada telefónica
                  </OptionCard>
                  <OptionCard
                    active={modoContacto === "whatsapp"}
                    onClick={() => {
                      setModoContacto("whatsapp")
                      setContactoValor("")
                      touch("modoContacto")
                    }}
                  >
                    WhatsApp
                  </OptionCard>
                </div>
                <FieldError message={errorFor("modoContacto")} />

                {modoContacto !== "" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-woranz-ink">
                      {modoContacto === "email"
                        ? "Tu email"
                        : "Tu número de teléfono"}
                    </label>
                    <Input
                      type={modoContacto === "email" ? "email" : "tel"}
                      placeholder={
                        modoContacto === "email"
                          ? "tu@email.com"
                          : "Ej: 11 2345 6789"
                      }
                      value={contactoValor}
                      onChange={(e) => setContactoValor(e.target.value)}
                      onBlur={() => touch("contactoValor")}
                      autoFocus
                    />
                    <FieldError message={errorFor("contactoValor")} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Error */}
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
          {/* Left — summary */}
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <span className="font-semibold text-woranz-ink">Caución de alquiler</span>
            <span className="text-woranz-muted">·</span>
            <span className="text-woranz-text">{formatMoney(quoter.alquiler)}/mes</span>
            <span className="text-woranz-muted">·</span>
            <span className="text-woranz-text">{quoter.duracion} meses</span>
          </div>

          {/* Right — nav buttons */}
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
              <button type="button"
                onClick={goNext}
                className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold sm:flex-none"
              >
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
