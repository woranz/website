"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

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
          : "border-2 border-woranz-border bg-woranz-warm-2 text-woranz-slate hover:border-woranz-muted"
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
          : "border-2 border-woranz-border bg-woranz-warm-2 text-woranz-slate hover:border-woranz-muted"
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

export { OptionCard, CheckboxCard }
