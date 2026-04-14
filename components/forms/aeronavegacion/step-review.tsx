"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Loader2, Sparkles } from "lucide-react"

import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckboxCard, OptionCard } from "@/components/ui/option-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ACTIVIDADES,
  COBERTURAS,
  CONDICIONES_FISCALES,
  MARCAS_AERONAVE,
  TIPOS_AERONAVE,
} from "@/lib/forms/constants/aeronavegacion"

import type { AeronavegacionSolicitudData } from "@/lib/api/schemas/aeronavegacion-solicitud"

type StepReviewProps = {
  dniLoading: boolean
  matriculaLoading: boolean
  onDniBlur: () => void
  onMatriculaBlur: () => void
  extractedFields?: Set<string>
}

function ExtractedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      <Sparkles className="h-3 w-3" />
      auto
    </span>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600">{message}</p>
}

const MARCA_OPTIONS = MARCAS_AERONAVE.map((m) => ({ label: m, value: m }))

export function StepReview({
  dniLoading,
  matriculaLoading,
  onDniBlur,
  onMatriculaBlur,
  extractedFields,
}: StepReviewProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AeronavegacionSolicitudData>()

  const isExtracted = (field: string) => extractedFields?.has(field)

  return (
    <div className="flex flex-col gap-8">
      {/* ── Asegurado ── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-woranz-ink">
          Datos del asegurado
        </h3>

        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">DNI</Label>
          <div className="relative">
            <Input
              inputMode="numeric"
              placeholder="Ej: 35123456"
              maxLength={8}
              {...register("dni")}
              onBlur={onDniBlur}
              className="h-12 pr-12"
            />
            {dniLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-woranz-muted" />
              </div>
            )}
          </div>
          <FieldError message={errors.dni?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Nombre completo {isExtracted("nombreCompleto") && <ExtractedBadge />}</Label>
            <Input placeholder="Nombre o Razón Social" {...register("nombreCompleto")} />
            <FieldError message={errors.nombreCompleto?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">CUIT {isExtracted("cuit") && <ExtractedBadge />}</Label>
            <Input placeholder="XX-XXXXXXXX-X" {...register("cuit")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Email {isExtracted("email") && <ExtractedBadge />}</Label>
            <Input type="email" placeholder="tu@email.com" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Teléfono</Label>
            <Input type="tel" placeholder="11 2345 6789" {...register("telefono")} />
            <FieldError message={errors.telefono?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">Condición fiscal {isExtracted("condicionFiscal") && <ExtractedBadge />}</Label>
          <Controller
            name="condicionFiscal"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="h-10 w-full rounded-field border-woranz-border bg-woranz-warm-2 text-sm text-woranz-slate">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {CONDICIONES_FISCALES.map((cf) => (
                    <SelectItem key={cf} value={cf}>{cf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.condicionFiscal?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Localidad {isExtracted("localidad") && <ExtractedBadge />}</Label>
            <Input placeholder="Localidad" {...register("localidad")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Provincia {isExtracted("provincia") && <ExtractedBadge />}</Label>
            <Input placeholder="Provincia" {...register("provincia")} />
          </div>
        </div>
      </section>

      {/* ── Aeronave ── */}
      <section className="flex flex-col gap-4 border-t border-woranz-line pt-6">
        <h3 className="text-sm font-semibold text-woranz-ink">Aeronave</h3>

        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">Matrícula {isExtracted("matricula") && <ExtractedBadge />}</Label>
          <div className="relative">
            <Input
              placeholder="LV-XXX"
              maxLength={6}
              {...register("matricula", {
                onChange: (e) => { e.target.value = e.target.value.toUpperCase() },
              })}
              onBlur={onMatriculaBlur}
              className="h-12 pr-12"
            />
            {matriculaLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-woranz-muted" />
              </div>
            )}
          </div>
          <FieldError message={errors.matricula?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">Marca {isExtracted("marca") && <ExtractedBadge />}</Label>
          <Controller
            name="marca"
            control={control}
            render={({ field }) => (
              <Combobox
                options={MARCA_OPTIONS}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Seleccionar marca..."
                searchPlaceholder="Buscar marca..."
              />
            )}
          />
          <FieldError message={errors.marca?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Modelo {isExtracted("modelo") && <ExtractedBadge />}</Label>
            <Input placeholder="Ej: Learjet 60" {...register("modelo")} />
            <FieldError message={errors.modelo?.message} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Año {isExtracted("anio") && <ExtractedBadge />}</Label>
            <Input inputMode="numeric" placeholder="Ej: 2018" {...register("anio")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Nro. serie {isExtracted("nroSerie") && <ExtractedBadge />}</Label>
            <Input placeholder="Nro. serie" {...register("nroSerie")} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">Tipo de aeronave {isExtracted("tipoAeronave") && <ExtractedBadge />}</Label>
          <Controller
            name="tipoAeronave"
            control={control}
            render={({ field }) => (
              <div className="grid gap-2 sm:grid-cols-2">
                {TIPOS_AERONAVE.map((tipo) => (
                  <OptionCard
                    key={tipo}
                    active={field.value === tipo}
                    onClick={() => field.onChange(tipo)}
                  >
                    {tipo}
                  </OptionCard>
                ))}
              </div>
            )}
          />
          <FieldError message={errors.tipoAeronave?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Asientos tripulantes {isExtracted("asientosTripulantes") && <ExtractedBadge />}</Label>
            <Input inputMode="numeric" {...register("asientosTripulantes")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-woranz-ink">Asientos pasajeros {isExtracted("asientosPasajeros") && <ExtractedBadge />}</Label>
            <Input inputMode="numeric" {...register("asientosPasajeros")} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-woranz-ink">Vencimiento póliza vigente {isExtracted("vencimientoPoliza") && <ExtractedBadge />}</Label>
          <Input type="date" {...register("vencimientoPoliza")} />
        </div>
      </section>

      {/* ── Actividades ── */}
      <section className="flex flex-col gap-4 border-t border-woranz-line pt-6">
        <h3 className="text-sm font-semibold text-woranz-ink">
          Actividades de la aeronave
        </h3>
        <Controller
          name="actividades"
          control={control}
          render={({ field }) => (
            <div className="grid gap-2 sm:grid-cols-2">
              {ACTIVIDADES.map((act) => (
                <CheckboxCard
                  key={act}
                  checked={field.value?.includes(act) ?? false}
                  onClick={() => {
                    const current = field.value ?? []
                    field.onChange(
                      current.includes(act)
                        ? current.filter((a) => a !== act)
                        : [...current, act]
                    )
                  }}
                >
                  {act}
                </CheckboxCard>
              ))}
            </div>
          )}
        />
      </section>

      {/* ── Coberturas ── */}
      <section className="flex flex-col gap-4 border-t border-woranz-line pt-6">
        <div>
          <h3 className="text-sm font-semibold text-woranz-ink">
            Coberturas deseadas
          </h3>
          <p className="mt-1 text-xs text-woranz-muted">
            Seleccioná las coberturas e indicá la suma asegurada. Aclará la
            moneda.
          </p>
        </div>
        <Controller
          name="coberturas"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              {COBERTURAS.map((cob) => {
                const entry = (field.value ?? []).find((c) => c.tipo === cob)
                const isSelected = !!entry
                return (
                  <div key={cob}>
                    <CheckboxCard
                      checked={isSelected}
                      onClick={() => {
                        const current = field.value ?? []
                        if (isSelected) {
                          field.onChange(current.filter((c) => c.tipo !== cob))
                        } else {
                          field.onChange([...current, { tipo: cob, suma: "" }])
                        }
                      }}
                    >
                      {cob}
                    </CheckboxCard>
                    {isSelected && (
                      <div className="mt-2 pl-8">
                        <Input
                          placeholder="Suma asegurada (ej: USD 500.000)"
                          value={entry.suma}
                          onChange={(e) => {
                            const current = field.value ?? []
                            field.onChange(
                              current.map((c) =>
                                c.tipo === cob ? { ...c, suma: e.target.value } : c
                              )
                            )
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        />
      </section>
    </div>
  )
}
