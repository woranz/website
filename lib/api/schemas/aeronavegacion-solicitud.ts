import { z } from "zod"

import { emailSchema } from "@/lib/api/schemas/common"
import {
  ACTIVIDADES,
  COBERTURAS,
  CONDICIONES_FISCALES,
  MARCAS_AERONAVE,
  MODOS_CONTACTO,
  TIPOS_AERONAVE,
} from "@/lib/forms/constants/aeronavegacion"

const PHONE_REGEX = /^\d{6,15}$/
const MATRICULA_REGEX = /^L[VQ]-[A-Z]{3}$/i

// ── Sub-schemas ────────────────────────────────────────────────────

const coberturaEntrySchema = z.object({
  tipo: z.string(),
  suma: z.string(),
})

// ── Base schema (used by react-hook-form) ──────────────────────────

export const aeronavegacionBaseSchema = z.object({
  // Asegurado
  dni: z.string().min(1, "Ingresá tu DNI").regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
  cuit: z.string(),
  nombreCompleto: z.string().min(1, "Ingresá el nombre"),
  email: z.string().min(1, "Ingresá un email").email("Email inválido"),
  telefono: z.string().min(1, "Ingresá un teléfono"),
  condicionFiscal: z.enum(CONDICIONES_FISCALES, {
    message: "Seleccioná la condición fiscal",
  }),
  localidad: z.string(),
  provincia: z.string(),

  // Aeronave
  matricula: z.string().min(1, "Ingresá la matrícula").regex(MATRICULA_REGEX, "Formato: LV-XXX"),
  marca: z.enum(MARCAS_AERONAVE, { message: "Seleccioná la marca" }),
  modelo: z.string().min(1, "Ingresá el modelo"),
  anio: z.string(),
  nroSerie: z.string(),
  tipoAeronave: z.enum(TIPOS_AERONAVE, { message: "Seleccioná el tipo" }),
  asientosTripulantes: z.string(),
  asientosPasajeros: z.string(),
  vencimientoPoliza: z.string(),

  // Coberturas
  actividades: z.array(z.string()),
  coberturas: z.array(coberturaEntrySchema),

  // Contacto
  comentarios: z.string(),
  modoContacto: z.enum(MODOS_CONTACTO, {
    message: "Elegí cómo querés que te contactemos",
  }),
  contactoValor: z.string().min(1, "Ingresá tu dato de contacto"),
})

// Form type matches what useForm works with
export type AeronavegacionSolicitudData = z.infer<typeof aeronavegacionBaseSchema>

// ── Server-side schema (with refinement) ───────────────────────────

export const aeronavegacionSolicitudSchema = aeronavegacionBaseSchema.refine(
  (data) =>
    data.modoContacto === "email"
      ? emailSchema.safeParse(data.contactoValor).success
      : PHONE_REGEX.test(data.contactoValor.replace(/[^\d]/g, "")),
  {
    message: "Dato de contacto inválido.",
    path: ["contactoValor"],
  }
)

// ── Step validation groups ─────────────────────────────────────────

export const STEP_FIELDS = {
  1: [] as const, // Upload step — no field validation
  2: [
    "dni", "nombreCompleto", "email", "telefono", "condicionFiscal",
    "matricula", "marca", "modelo", "tipoAeronave",
  ] as const,
  3: ["modoContacto", "contactoValor"] as const,
} as const

// ── AI extraction partial schema ───────────────────────────────────

export const aeronavegacionExtractionSchema = z.object({
  dni: z.string().optional(),
  cuit: z.string().optional(),
  nombreCompleto: z.string().optional(),
  email: z.string().optional(),
  telefono: z.string().optional(),
  condicionFiscal: z.string().optional(),
  localidad: z.string().optional(),
  provincia: z.string().optional(),
  matricula: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anio: z.string().optional(),
  nroSerie: z.string().optional(),
  tipoAeronave: z.string().optional(),
  asientosTripulantes: z.string().optional(),
  asientosPasajeros: z.string().optional(),
  vencimientoPoliza: z.string().optional(),
  actividades: z.array(z.string()).optional(),
  coberturas: z.array(z.object({
    tipo: z.string(),
    suma: z.string().default(""),
  })).optional(),
})

export type AeronavegacionExtractionData = z.infer<typeof aeronavegacionExtractionSchema>
