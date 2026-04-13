"use client"

import Link from "next/link"
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { ProvinciaSearch } from "@/components/ui/georef-search"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getQuoterConfig, type QuoterConfig, type QuoterFieldConfig } from "@/lib/quoter-configs"

// ── AnimatedPrice (reused from CaucionQuoter pattern) ───────────────

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
    if (previousValue.current === value) return

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
      if (progress < 1) requestAnimationFrame(animate)
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

// ── Shared sub-components ───────────────────────────────────────────

function RowLabel({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-base font-semibold text-woranz-ink">{title}</span>
      <span className="text-label text-woranz-muted normal-case tracking-normal">
        {description}
      </span>
    </div>
  )
}

function handleMoneyInput(
  value: string,
  setValue: Dispatch<SetStateAction<Record<string, string | number>>>,
  name: string
) {
  const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10)
  setValue((prev) => ({ ...prev, [name]: Number.isNaN(numericValue) ? 0 : numericValue }))
}

// ── Field renderer ──────────────────────────────────────────────────

function QuoterField({
  field,
  value,
  onChange,
  variant,
}: {
  field: QuoterFieldConfig
  onChange: (value: string | number) => void
  value: string | number
  variant: "mobile" | "desktop"
}) {
  const widthClass = variant === "desktop" ? "w-full max-w-field-lg" : "min-w-field"

  if (field.type === "provincia-select") {
    return (
      <ProvinciaSearch
        className={widthClass}
        value={String(value)}
        onChange={(v) => onChange(v)}
      />
    )
  }

  if (field.type === "select") {
    return (
      <Select value={String(value)} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className={cn("h-10 bg-woranz-warm-2", widthClass)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (field.type === "searchable-select") {
    return (
      <Combobox
        className={widthClass}
        options={field.options ?? []}
        value={String(value)}
        onChange={(v) => onChange(v)}
        placeholder="Seleccionar"
        searchPlaceholder="Buscar..."
      />
    )
  }

  if (field.type === "money") {
    const numValue = Number(value) || 0
    return (
      <div className={cn("flex items-center gap-1 rounded-field bg-woranz-warm-2 px-4", widthClass)}>
        <span className="text-woranz-muted">{field.prefix || "$"}</span>
        <Input
          type="text"
          inputMode="numeric"
          value={numValue === 0 ? "" : numValue.toLocaleString("es-AR")}
          onChange={(e) => {
            const raw = Number.parseInt(e.target.value.replace(/\D/g, ""), 10)
            onChange(Number.isNaN(raw) ? 0 : raw)
          }}
          placeholder={field.placeholder}
          className="h-10 border-0 bg-transparent px-0 text-right text-sm text-woranz-slate shadow-none focus-visible:ring-0"
        />
      </div>
    )
  }

  // number
  return (
    <div className={cn("flex items-center gap-2 rounded-field bg-woranz-warm-2 px-4", widthClass)}>
      <Input
        type="text"
        inputMode="numeric"
        value={Number(value) === 0 ? "" : String(value)}
        onChange={(e) => {
          const raw = Number.parseInt(e.target.value.replace(/\D/g, ""), 10)
          onChange(Number.isNaN(raw) ? 0 : raw)
        }}
        min={field.min}
        max={field.max}
        placeholder={field.placeholder ?? String(field.defaultValue)}
        className="h-10 border-0 bg-transparent px-0 text-right text-sm text-woranz-slate shadow-none focus-visible:ring-0"
      />
      {field.suffix && (
        <span className="shrink-0 text-sm text-woranz-muted">{field.suffix}</span>
      )}
    </div>
  )
}

// ── Price + CTA row ─────────────────────────────────────────────────

function PriceAction({
  buttonLabel,
  href,
  priceLabel,
  value,
}: {
  buttonLabel: string
  href: string
  priceLabel: string
  value: number
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-6 md:py-6">
      <div className="flex items-end gap-3">
        <AnimatedPrice
          value={value}
          className="font-display text-quote-price font-bold leading-none text-woranz-ink md:text-5xl"
        />
        <span className="pb-1 text-base text-woranz-text">{priceLabel}</span>
      </div>
      <Link href={href} className="btn-primary-form hidden px-6 md:inline-flex">
        {buttonLabel} <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  )
}

// ── Build contratación href ─────────────────────────────────────────

function buildContratacionHref(
  basePath: string,
  values: Record<string, string | number>,
  price: number
) {
  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(values)) {
    params.set(key, String(val))
  }
  params.set("precio", String(price))
  return `${basePath}/contratacion?${params.toString()}`
}

// ── Mobile variant ──────────────────────────────────────────────────

function GenericQuoterMobile({
  configId,
  basePath,
}: {
  configId: string
  basePath: string
}) {
  const config = getQuoterConfig(configId)
  if (!config) return null

  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {}
    for (const field of config.fields) {
      initial[field.name] = field.defaultValue
    }
    return initial
  })

  const price = useMemo(() => config.calculatePrice(values), [config, values])
  const href = buildContratacionHref(basePath, values, price)

  const setField = (name: string, value: string | number) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  return (
    <div className="flex flex-col md:hidden">
      {config.fields.map((field) => (
        <div
          key={field.name}
          className="flex items-center justify-between gap-4 border-b border-woranz-warm-4 p-5"
        >
          <RowLabel title={field.label} description={field.description} />
          <QuoterField
            field={field}
            value={values[field.name] ?? field.defaultValue}
            onChange={(v) => setField(field.name, v)}
            variant="mobile"
          />
        </div>
      ))}

      <PriceAction
        buttonLabel={config.ctaLabel}
        href={href}
        priceLabel={config.priceLabel}
        value={price}
      />

      <div className="px-5 pb-5">
        <Link href={href} className="btn-primary-form flex w-full justify-center">
          {config.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// ── Desktop variant ─────────────────────────────────────────────────

function GenericQuoterDesktop({
  configId,
  basePath,
}: {
  configId: string
  basePath: string
}) {
  const config = getQuoterConfig(configId)
  if (!config) return null

  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {}
    for (const field of config.fields) {
      initial[field.name] = field.defaultValue
    }
    return initial
  })

  const price = useMemo(() => config.calculatePrice(values), [config, values])
  const href = buildContratacionHref(basePath, values, price)

  const setField = (name: string, value: string | number) =>
    setValues((prev) => ({ ...prev, [name]: value }))

  return (
    <div className="hidden w-full flex-col md:flex">
      {config.fields.map((field) => (
        <div
          key={field.name}
          className="flex items-center justify-between gap-6 border-b border-woranz-warm-4 px-6 py-5"
        >
          <RowLabel title={field.label} description={field.description} />
          <QuoterField
            field={field}
            value={values[field.name] ?? field.defaultValue}
            onChange={(v) => setField(field.name, v)}
            variant="desktop"
          />
        </div>
      ))}

      <PriceAction
        buttonLabel={config.ctaLabel}
        href={href}
        priceLabel={config.priceLabel}
        value={price}
      />
    </div>
  )
}

export { GenericQuoterMobile, GenericQuoterDesktop }
