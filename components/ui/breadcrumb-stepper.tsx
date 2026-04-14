"use client"

import { Check, ChevronRight } from "lucide-react"
import { Fragment } from "react"

import { cn } from "@/lib/utils"

export type BreadcrumbStepperStep = {
  id: string
  title: string
}

type BreadcrumbStepperProps = {
  steps: BreadcrumbStepperStep[]
  currentStep: number
  onStepClick?: (step: number) => void
  title?: string
  className?: string
}

export function BreadcrumbStepper({
  steps,
  currentStep,
  onStepClick,
  title,
  className,
}: BreadcrumbStepperProps) {
  return (
    <nav className={cn("flex items-center justify-center gap-1.5 overflow-x-auto", className)}>
      {title && (
        <>
          <span className="shrink-0 text-sm font-semibold text-woranz-ink">{title}</span>
          <ChevronRight className="h-3 w-3 shrink-0 text-woranz-light" />
        </>
      )}
      {steps.map((s, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const isFuture = stepNum > currentStep

        return (
          <Fragment key={s.id}>
            {i > 0 && (
              <ChevronRight className="h-3 w-3 shrink-0 text-woranz-light" />
            )}
            <button
              type="button"
              onClick={() => isCompleted && onStepClick?.(stepNum)}
              disabled={!isCompleted}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full py-1 text-sm transition-colors",
                isCompleted && "text-woranz-text hover:text-woranz-ink cursor-pointer",
                isCurrent && "font-semibold text-woranz-ink",
                isFuture && "text-woranz-muted cursor-default"
              )}
            >
              {isCompleted && (
                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
              )}
              <span>{s.title}</span>
            </button>
          </Fragment>
        )
      })}
    </nav>
  )
}
