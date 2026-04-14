"use client"

import { type FormEvent, useState } from "react"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"

import { CiudadSearch, ProvinciaSearch } from "@/components/ui/georef-search"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormConfig, FormFieldConfig } from "@/lib/forms/types"
import { cn } from "@/lib/utils"

// ── Validation helpers ──────────────────────────────────────────────

const VALIDATORS: Record<string, (value: string) => string | undefined> = {
  email: (v) =>
    v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? "Ingresá un email válido"
      : undefined,
  tel: (v) =>
    v && !/^\d{6,15}$/.test(v.replace(/[\s\-()]/g, ""))
      ? "Ingresá un teléfono válido"
      : undefined,
}

function validateField(field: FormFieldConfig, value: string): string | undefined {
  const trimmed = value.trim()

  if (field.required && !trimmed) {
    return `Ingresá ${field.label.toLowerCase()}`
  }

  if (field.validation?.minLength && trimmed.length < field.validation.minLength) {
    return `Mínimo ${field.validation.minLength} caracteres`
  }

  if (field.validation?.maxLength && trimmed.length > field.validation.maxLength) {
    return `Máximo ${field.validation.maxLength} caracteres`
  }

  if (field.validation?.pattern) {
    const regex = new RegExp(field.validation.pattern.regex)
    if (trimmed && !regex.test(trimmed)) {
      return field.validation.pattern.message
    }
  }

  const typeValidator = VALIDATORS[field.type]
  if (typeValidator && trimmed) {
    return typeValidator(trimmed)
  }

  return undefined
}

// ── Sub-components ──────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600">{message}</p>
}

// ── Main Form ───────────────────────────────────────────────────────

export function ContactForm({
  config,
  embedded = false,
  productName,
  returnHref,
  returnLabel,
  searchParams,
}: {
  config: FormConfig
  embedded?: boolean
  productName?: string
  returnHref?: string
  returnLabel?: string
  searchParams?: Record<string, string | undefined>
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const field of config.campos) {
      const initialValue = searchParams?.[field.name]
      if (
        initialValue &&
        (!field.options || field.options.some((option) => option.value === initialValue))
      ) {
        initial[field.name] = initialValue
        continue
      }

      initial[field.name] = ""
    }
    return initial
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const touch = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }))

  const setValue = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  const errors: Record<string, string | undefined> = {}
  for (const field of config.campos) {
    errors[field.name] = validateField(field, values[field.name] ?? "")
  }

  const errorFor = (name: string) => (touched[name] ? errors[name] : undefined)

  const validate = (): boolean => {
    const allTouched: Record<string, boolean> = {}
    for (const field of config.campos) {
      allTouched[field.name] = true
    }
    setTouched((prev) => ({ ...prev, ...allTouched }))
    return !config.campos.some((f) => errors[f.name])
  }

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!validate()) return

    setSubmitError("")
    setSubmitting(true)

    try {
      const fd = new FormData()
      fd.set("_formType", "contacto")
      fd.set("_formId", config.id)

      for (const field of config.campos) {
        fd.set(field.name, values[field.name]?.trim() ?? "")
      }

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
      <div className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        embedded ? "min-h-[28rem] py-8" : "min-h-[70vh]"
      )}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-6 font-display text-section-mobile text-woranz-ink md:text-section">
          {config.tituloExito ?? "¡Solicitud enviada!"}
        </h2>
        <p className="mt-3 max-w-sm text-body text-woranz-text md:text-lead">
          {config.descripcionExito ??
            "Recibimos tus datos. Te contactamos en menos de 24hs."}
        </p>
        {returnHref && (
          <a
            href={returnHref}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-woranz-yellow px-6 py-3 text-sm font-semibold text-woranz-ink transition-colors hover:bg-woranz-yellow/80"
          >
            {returnLabel ?? "Volver al inicio"}
          </a>
        )}
      </div>
    )
  }

  // ── Render ──

  return (
    <div className="mx-auto w-full max-w-page px-page-mobile md:px-page">
      <div className={cn("mx-auto w-full max-w-xl pb-16", embedded ? "pt-0" : "pt-8 md:pt-10")}>
        {!embedded ? (
          <h1 className="text-center font-display text-[2rem] font-bold leading-tight tracking-tight text-woranz-ink lg:text-[2.25rem]">
            {config.titulo}
          </h1>
        ) : null}

        <form onSubmit={handleSubmit} className={cn(embedded ? "mt-0" : "mt-8")}>
          <div className="flex flex-col gap-6">
            {config.campos.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                error={errorFor(field.name)}
                onChange={(v) => setValue(field.name, v)}
                onBlur={() => touch(field.name)}
              />
            ))}
          </div>

          {submitError && (
            <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-8 w-full justify-center px-8 py-3 text-sm font-bold disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </span>
            ) : (
              <>
                Enviar solicitud
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Field renderer ──────────────────────────────────────────────────

function FormField({
  field,
  value,
  error,
  onChange,
  onBlur,
}: {
  error?: string
  field: FormFieldConfig
  onBlur: () => void
  onChange: (value: string) => void
  value: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-woranz-ink">
        {field.label}
        {!field.required && (
          <span className="ml-1 text-woranz-muted font-normal">(opcional)</span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          rows={4}
          className={cn(
            "flex w-full rounded-field border border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm text-woranz-slate transition-colors",
            "placeholder:text-woranz-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "resize-none"
          )}
        />
      ) : field.type === "select" ? (
        <Select value={value} onValueChange={(v) => { onChange(v); onBlur() }}>
          <SelectTrigger className="h-12 bg-woranz-warm-2">
            <SelectValue placeholder={field.placeholder ?? "Seleccioná una opción"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === "provincia-select" ? (
        <ProvinciaSearch
          value={value}
          onChange={(v) => { onChange(v); onBlur() }}
        />
      ) : field.type === "ciudad-search" ? (
        <CiudadSearch
          value={value}
          onChange={(v) => { onChange(v); onBlur() }}
        />
      ) : (
        <Input
          type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
          inputMode={field.type === "tel" ? "tel" : undefined}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          maxLength={field.validation?.maxLength}
          className="h-12"
        />
      )}

      <FieldError message={error} />
    </div>
  )
}
