"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type ComboboxOption = {
  label: string
  value: string
}

type ComboboxProps = {
  className?: string
  contentClassName?: string
  emptyText?: string
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  value: string
  onChange: (value: string) => void
}

function Combobox({
  className,
  contentClassName,
  emptyText = "No se encontró.",
  options,
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar...",
  value,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "field-control inline-flex h-12 items-center justify-between border-woranz-border bg-woranz-warm-2 px-4 py-3 text-sm font-normal text-woranz-slate shadow-none",
            className
          )}
        >
          <span className="truncate">
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-woranz-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "min-w-full rounded-xl border-woranz-border bg-white p-0 shadow-elevated",
          contentClassName
        )}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command className="rounded-xl">
          <CommandInput
            placeholder={searchPlaceholder}
            className="text-sm placeholder:text-woranz-muted"
          />
          <CommandList className="max-h-52">
            <CommandEmpty className="text-sm text-woranz-text">
              {emptyText}
            </CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className="gap-2 rounded-lg px-3 py-2 text-sm text-woranz-slate aria-selected:bg-woranz-warm-1 aria-selected:text-woranz-ink"
              >
                <Check
                  className={cn(
                    "h-4 w-4 text-woranz-ink",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>{option.label}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
