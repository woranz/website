"use client"

import { useFormContext, Controller } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OptionCard } from "@/components/ui/option-card"
import { Textarea } from "@/components/ui/textarea"

import type { AeronavegacionSolicitudData } from "@/lib/api/schemas/aeronavegacion-solicitud"

export function StepContacto() {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<AeronavegacionSolicitudData>()

  const modoContacto = watch("modoContacto")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label className="text-woranz-ink">Comentarios adicionales</Label>
        <Textarea
          rows={3}
          placeholder="Cualquier información relevante para la cotización..."
          {...register("comentarios")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-woranz-ink">
          ¿Cómo preferís que te contactemos?
        </Label>
        <Controller
          name="modoContacto"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <OptionCard
                active={field.value === "email"}
                onClick={() => field.onChange("email")}
              >
                Email
              </OptionCard>
              <OptionCard
                active={field.value === "llamada"}
                onClick={() => field.onChange("llamada")}
              >
                Llamada telefónica
              </OptionCard>
              <OptionCard
                active={field.value === "whatsapp"}
                onClick={() => field.onChange("whatsapp")}
              >
                WhatsApp
              </OptionCard>
            </div>
          )}
        />
        {errors.modoContacto && (
          <p className="text-sm text-red-600">{errors.modoContacto.message}</p>
        )}
      </div>

      {modoContacto && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">
            {modoContacto === "email" ? "Tu email" : "Tu número de teléfono"}
          </Label>
          <Input
            type={modoContacto === "email" ? "email" : "tel"}
            placeholder={
              modoContacto === "email" ? "tu@email.com" : "Ej: 11 2345 6789"
            }
            autoFocus
            {...register("contactoValor")}
          />
          {errors.contactoValor && (
            <p className="text-sm text-red-600">{errors.contactoValor.message}</p>
          )}
        </div>
      )}
    </div>
  )
}
