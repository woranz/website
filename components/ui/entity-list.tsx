"use client"

import * as React from "react"
import { AlertCircle, Check, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type EntityListItemProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  description?: React.ReactNode
  tone?: "success" | "error" | "neutral"
  trailing?: React.ReactNode
  className?: string
}

const toneStyles = {
  success: {
    icon: <Check className="h-4 w-4" />,
    iconClassName: "text-woranz-ink",
    descriptionClassName: "text-emerald-700",
  },
  error: {
    icon: <AlertCircle className="h-4 w-4" />,
    iconClassName: "text-red-500",
    descriptionClassName: "text-red-500",
  },
  neutral: {
    icon: <Check className="h-4 w-4" />,
    iconClassName: "text-woranz-muted",
    descriptionClassName: "text-woranz-muted",
  },
} as const

export function EntityListItem({
  title,
  subtitle,
  description,
  tone = "neutral",
  trailing,
  className,
}: EntityListItemProps) {
  const toneStyle = toneStyles[tone]

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-woranz-line bg-white px-3 py-2.5",
        className
      )}
    >
      <div
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center",
          toneStyle.iconClassName
        )}
      >
        {toneStyle.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="min-w-0 flex-1 truncate text-sm font-medium leading-none text-woranz-ink">
            {title}
          </p>
          {subtitle ? (
            <p className="shrink-0 text-right text-sm leading-none tabular-nums text-woranz-muted">
              {subtitle}
            </p>
          ) : null}
        </div>
        {description ? (
          <p className={cn("mt-1 text-xs leading-none", toneStyle.descriptionClassName)}>
            {description}
          </p>
        ) : null}
      </div>

      {trailing ? <div className="flex shrink-0 items-center gap-0.5">{trailing}</div> : null}
    </div>
  )
}

type LookupSectionProps = {
  description?: React.ReactNode
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  submitDisabled?: boolean
  submitting?: boolean
  className?: string
  inputClassName?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  children?: React.ReactNode
}

export function LookupSection({
  description,
  placeholder,
  value,
  onChange,
  onSubmit,
  disabled,
  submitDisabled,
  submitting,
  className,
  inputClassName,
  inputMode,
  children,
}: LookupSectionProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {description ? (
        <p className="text-sm text-woranz-text">{description}</p>
      ) : null}

      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onSubmit()
            }
          }}
          disabled={disabled}
          className={cn("h-12 pr-24", inputClassName)}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitDisabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-woranz-ink disabled:opacity-30"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agregar"}
        </button>
      </div>

      {children ? <div className="flex flex-col gap-2">{children}</div> : null}
    </div>
  )
}
