"use client"

import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react"

import { BreadcrumbStepper } from "@/components/ui/breadcrumb-stepper"
import { buildProductPath } from "@/lib/product-paths"
import {
  aeronavegacionBaseSchema,
  type AeronavegacionSolicitudData,
  STEP_FIELDS,
} from "@/lib/api/schemas/aeronavegacion-solicitud"
import { useAircraftLookup } from "@/lib/hooks/use-aircraft-lookup"
import { useDniLookup } from "@/lib/hooks/use-dni-lookup"
import {
  AERO_STEPS,
  MODO_CONTACTO_LABELS,
} from "@/lib/forms/constants/aeronavegacion"

import { StepUpload, type ExtractionStatus } from "./step-upload"
import { StepReview } from "./step-review"
import { StepContacto } from "./step-contacto"

export function AeronavegacionSolicitudForm() {
  const [step, setStep] = useState(1)
  const [archivos, setArchivos] = useState<File[]>([])
  const [extractionStatus, setExtractionStatus] =
    useState<ExtractionStatus>("idle")
  const [extractedFields, setExtractedFields] = useState<Set<string>>(
    new Set()
  )
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const form = useForm<AeronavegacionSolicitudData>({
    resolver: zodResolver(aeronavegacionBaseSchema),
    defaultValues: {
      dni: "",
      cuit: "",
      nombreCompleto: "",
      email: "",
      telefono: "",
      condicionFiscal: undefined,
      localidad: "",
      provincia: "",
      matricula: "",
      marca: undefined,
      modelo: "",
      anio: "",
      nroSerie: "",
      tipoAeronave: undefined,
      asientosTripulantes: "",
      asientosPasajeros: "",
      vencimientoPoliza: "",
      actividades: [],
      coberturas: [],
      comentarios: "",
      modoContacto: undefined,
      contactoValor: "",
    },
    mode: "onTouched",
  })

  const dniLookup = useDniLookup()
  const aircraftLookup = useAircraftLookup()

  // ── Lookups ──

  const handleDniBlur = async () => {
    const dni = form.getValues("dni")?.replace(/\D/g, "")
    if (!dni) return
    const result = await dniLookup.lookup(dni)
    if (result) {
      if (result.nombreCompleto) form.setValue("nombreCompleto", result.nombreCompleto)
      if (result.cuit) form.setValue("cuit", result.cuit)
      if (result.localidad) form.setValue("localidad", result.localidad)
      if (result.provincia) form.setValue("provincia", result.provincia)
      if (result.email && !form.getValues("email")) form.setValue("email", result.email)
    }
  }

  const handleMatriculaBlur = async () => {
    const matricula = form.getValues("matricula")
    if (!matricula) return
    const result = await aircraftLookup.lookup(matricula)
    if (result) {
      if (result.marca) form.setValue("marca", result.marca as never)
      if (result.modelo) form.setValue("modelo", result.modelo)
      if (result.nroSerie) form.setValue("nroSerie", result.nroSerie)
      if (result.tipoAeronave) form.setValue("tipoAeronave", result.tipoAeronave as never)
    }
  }

  // ── AI extraction ──

  const handleExtract = async (files: File[]) => {
    setExtractionStatus("extracting")
    try {
      const fd = new FormData()
      for (const file of files) fd.append("archivos", file)

      const res = await fetch("/api/aeronavegacion/extract", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        setExtractionStatus("error")
        return
      }

      const json = await res.json()
      const extracted = json.data as Record<string, unknown>

      if (!extracted) {
        setExtractionStatus("error")
        return
      }

      const fieldsSet = new Set<string>()

      for (const [key, value] of Object.entries(extracted)) {
        if (value === undefined || value === null || value === "") continue

        if (key === "actividades" && Array.isArray(value)) {
          form.setValue("actividades", value as never)
          fieldsSet.add(key)
        } else if (key === "coberturas" && Array.isArray(value)) {
          form.setValue("coberturas", value as never)
          fieldsSet.add(key)
        } else if (typeof value === "string") {
          form.setValue(key as never, value as never)
          fieldsSet.add(key)
        }
      }

      setExtractedFields(fieldsSet)
      setExtractionStatus("done")
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setExtractionStatus("error")
    }
  }

  // ── Navigation ──

  const validateStep = async (s: number): Promise<boolean> => {
    const fields = STEP_FIELDS[s as keyof typeof STEP_FIELDS] ?? []
    if (fields.length === 0) return true
    return form.trigger(fields as unknown as (keyof AeronavegacionSolicitudData)[])
  }

  const goNext = async () => {
    if (await validateStep(step)) {
      setStep((s) => Math.min(s + 1, AERO_STEPS.length))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Submit ──

  const handleSubmit = async () => {
    if (!(await validateStep(step))) return

    setSubmitError("")
    setSubmitting(true)

    try {
      const values = form.getValues()
      const fd = new FormData()
      fd.set("_formType", "aeronavegacion-solicitud")

      // Asegurado
      fd.set("dni", values.dni?.replace(/\D/g, "") ?? "")
      fd.set("cuit", values.cuit ?? "")
      fd.set("nombreCompleto", values.nombreCompleto ?? "")
      fd.set("email", values.email ?? "")
      fd.set("telefono", values.telefono ?? "")
      fd.set("condicionFiscal", values.condicionFiscal ?? "")
      fd.set("localidad", values.localidad ?? "")
      fd.set("provincia", values.provincia ?? "")

      // Aeronave
      fd.set("matricula", (values.matricula ?? "").trim().toUpperCase())
      fd.set("marca", values.marca ?? "")
      fd.set("modelo", values.modelo ?? "")
      fd.set("anio", values.anio ?? "")
      fd.set("nroSerie", values.nroSerie ?? "")
      fd.set("tipoAeronave", values.tipoAeronave ?? "")
      fd.set("asientosTripulantes", values.asientosTripulantes ?? "")
      fd.set("asientosPasajeros", values.asientosPasajeros ?? "")
      fd.set("vencimientoPoliza", values.vencimientoPoliza ?? "")

      // Actividades + coberturas
      fd.set("actividades", (values.actividades ?? []).join(", "))
      fd.set("coberturas", JSON.stringify(values.coberturas ?? []))

      // Contacto
      fd.set("comentarios", values.comentarios ?? "")
      fd.set("modoContacto", values.modoContacto ?? "")
      fd.set("contactoValor", values.contactoValor ?? "")

      // Files
      for (const file of archivos) fd.append("archivos", file)

      const res = await fetch("/api/forms/submit", { method: "POST", body: fd })
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

  // ── Success ──

  if (submitted) {
    const modoContacto = form.getValues("modoContacto")
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
          {modoContacto
            ? MODO_CONTACTO_LABELS[modoContacto]?.toLowerCase()
            : "email"}{" "}
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

  const isLastStep = step === AERO_STEPS.length

  return (
    <div className="mx-auto w-full max-w-page px-page-mobile md:px-page">
      <div className="mx-auto max-w-xl pt-6 md:pt-8">
        <BreadcrumbStepper
          steps={AERO_STEPS}
          currentStep={step}
          onStepClick={setStep}
        />
      </div>

      <div className="mx-auto w-full max-w-xl pb-32 pt-8 md:pt-10">
        <h1 className="text-center font-display text-[2rem] font-bold leading-tight tracking-tight text-woranz-ink lg:text-[2.25rem]">
          {AERO_STEPS[step - 1].title}
        </h1>

        <div className="mt-8">
          <FormProvider {...form}>
            {step === 1 && (
              <StepUpload
                archivos={archivos}
                onArchivosChange={setArchivos}
                extractionStatus={extractionStatus}
                onExtract={handleExtract}
                onSkip={() => {
                  setStep(2)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            )}

            {step === 2 && (
              <StepReview
                dniLoading={dniLookup.loading}
                matriculaLoading={aircraftLookup.loading}
                onDniBlur={handleDniBlur}
                onMatriculaBlur={handleMatriculaBlur}
                extractedFields={
                  extractedFields.size > 0 ? extractedFields : undefined
                }
              />
            )}

            {step === 3 && <StepContacto />}
          </FormProvider>

          {submitError && (
            <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom sticky bar ── */}
      {step > 1 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-woranz-line bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-page items-center justify-between px-page-mobile py-3 md:px-page">
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="font-semibold text-woranz-ink">
                Aeronavegación
              </span>
              {form.watch("matricula") && (
                <>
                  <span className="text-woranz-muted">&middot;</span>
                  <span className="text-woranz-text">
                    {form.watch("matricula")?.toUpperCase()}
                  </span>
                </>
              )}
              {form.watch("marca") && form.watch("modelo") && (
                <>
                  <span className="text-woranz-muted">&middot;</span>
                  <span className="text-woranz-text">
                    {form.watch("marca")} {form.watch("modelo")}
                  </span>
                </>
              )}
            </div>

            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-woranz-text transition-colors hover:bg-woranz-warm-2 hover:text-woranz-ink"
              >
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
              {isLastStep ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold disabled:opacity-50 sm:flex-none"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <>
                      Enviar solicitud{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-primary flex-1 justify-center px-8 py-3 text-sm font-bold sm:flex-none"
                >
                  Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
