import { z } from "zod"

import type { FormConfig, FormFieldConfig } from "@/lib/forms/types"
import { dniSchema, emailSchema, isoDateSchema, numericIdSchema } from "@/lib/api/schemas/common"

const PHONE_REGEX = /^\d{6,15}$/
const DEFAULT_MAX_LENGTH = 1000
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILE_COUNT = 5

export const CAUCION_DOCUMENT_TYPES = [
  "Recibo de sueldo",
  "Constancia de monotributo",
  "Últimas facturas emitidas",
  "Certificación de ingresos",
  "Último balance (empresas)",
] as const

export const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const

function buildFieldSchema(field: FormFieldConfig) {
  const maxLength = field.validation?.maxLength ?? DEFAULT_MAX_LENGTH
  let schema = z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().max(maxLength, `Máximo ${maxLength} caracteres.`))

  if (field.required) {
    schema = schema.refine((value) => value.length > 0, {
      message: `Ingresá ${field.label.toLowerCase()}`,
    })
  }

  if (field.validation?.minLength) {
    const minLength = field.validation.minLength
    schema = schema.refine(
      (value) => value.length === 0 || value.length >= minLength,
      { message: `Mínimo ${minLength} caracteres.` }
    )
  }

  if (field.validation?.pattern) {
    const pattern = new RegExp(field.validation.pattern.regex)
    schema = schema.refine(
      (value) => value.length === 0 || pattern.test(value),
      {
        message: field.validation.pattern.message,
      }
    )
  }

  if (field.type === "email") {
    schema = schema.refine(
      (value) => value.length === 0 || emailSchema.safeParse(value).success,
      {
        message: "Ingresá un email válido",
      }
    )
  }

  if (field.type === "tel") {
    schema = schema.refine(
      (value) =>
        value.length === 0 || PHONE_REGEX.test(value.replace(/[^\d]/g, "")),
      {
        message: "Ingresá un teléfono válido",
      }
    )
  }

  if (field.type === "select" && field.options?.length) {
    const allowed = new Set(field.options.map((option) => option.value))
    schema = schema.refine(
      (value) => value.length === 0 || allowed.has(value),
      { message: `Seleccioná ${field.label.toLowerCase()}` }
    )
  }

  return schema
}

export function buildContactFormSchema(config: FormConfig) {
  const shape: Record<string, z.ZodTypeAny> = {
    _formId: z.literal(config.id),
  }

  for (const field of config.campos) {
    shape[field.name] = buildFieldSchema(field)
  }

  return z.object(shape).strict()
}

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Adjunto inválido.")
  .refine((file) => ALLOWED_ATTACHMENT_TYPES.includes(file.type as never), {
    message: "Tipo de archivo inválido.",
  })

export const accidentesCotizacionSchema = z.object({
  actividad: z.string().trim().min(1, "Actividad inválida.").max(160),
  fechaDesde: isoDateSchema,
  fechaHasta: isoDateSchema,
  cantidad: numericIdSchema
    .refine((value) => value >= 1 && value <= 700, "Cantidad inválida."),
}).refine(
  (value) =>
    new Date(value.fechaHasta).getTime() >= new Date(value.fechaDesde).getTime(),
  {
    message: "La vigencia es inválida.",
    path: ["fechaHasta"],
  }
)

export const caucionPreaprobacionSchema = z.object({
  dni: dniSchema,
  nombre: z.string().trim().min(1, "El campo \"nombre\" es obligatorio.").max(120),
  apellido: z
    .string()
    .trim()
    .min(1, "El campo \"apellido\" es obligatorio.")
    .max(120),
  domicilio: z.string().trim().max(255).default(""),
  ciudad: z.string().trim().min(1, "El campo \"ciudad\" es obligatorio.").max(120),
  modoContacto: z.enum(["email", "llamada", "whatsapp"], {
    message: "El campo \"modoContacto\" es obligatorio.",
  }),
  contactoValor: z.string().trim().min(1, "El campo \"contactoValor\" es obligatorio.").max(160),
  provincia: z.string().trim().max(120).default(""),
  alquiler: numericIdSchema,
  duracion: numericIdSchema,
  modoPago: z.enum(["contado", "cuotas"], {
    message: "Modo de pago inválido.",
  }),
  restitucion: z.boolean(),
  ingresosMensuales: numericIdSchema,
  ingresoFamiliar: numericIdSchema,
  avalesDnis: z.array(dniSchema).max(10).default([]),
  avalesNombres: z.array(z.string().trim().max(160)).max(10).default([]),
  tiposDocumentacion: z
    .array(z.enum(CAUCION_DOCUMENT_TYPES))
    .max(CAUCION_DOCUMENT_TYPES.length)
    .default([]),
  inmobiliaria: z.string().trim().max(160).default(""),
  idProductor: z.string().trim().max(64).default(""),
  archivos: z
    .array(fileSchema)
    .max(MAX_FILE_COUNT, `Podés adjuntar hasta ${MAX_FILE_COUNT} archivos.`)
    .refine(
      (files) => files.reduce((total, file) => total + file.size, 0) <= MAX_FILE_SIZE,
      "Los archivos adjuntos superan el límite de 10MB."
    )
    .default([]),
}).refine(
  (value) =>
    value.modoContacto === "email"
      ? emailSchema.safeParse(value.contactoValor).success
      : PHONE_REGEX.test(value.contactoValor.replace(/[^\d]/g, "")),
  {
    message: "Dato de contacto inválido.",
    path: ["contactoValor"],
  }
)

export const aeronavegacionSolicitudSchema = z.object({
  // Asegurado
  dni: dniSchema,
  cuit: z.string().trim().max(20).default(""),
  nombreCompleto: z.string().trim().min(1, "Nombre obligatorio.").max(200),
  email: emailSchema,
  telefono: z.string().trim().min(1, "Teléfono obligatorio.").max(30),
  condicionFiscal: z.string().trim().min(1, "Condición fiscal obligatoria.").max(60),
  localidad: z.string().trim().max(200).default(""),
  provincia: z.string().trim().max(120).default(""),

  // Aeronave
  matricula: z.string().trim().min(1, "Matrícula obligatoria.").max(20),
  marca: z.string().trim().min(1, "Marca obligatoria.").max(120),
  modelo: z.string().trim().min(1, "Modelo obligatorio.").max(120),
  anio: z.string().trim().max(4).default(""),
  nroSerie: z.string().trim().max(60).default(""),
  tipoAeronave: z.string().trim().min(1, "Tipo de aeronave obligatorio.").max(60),
  asientosTripulantes: z.string().trim().max(10).default(""),
  asientosPasajeros: z.string().trim().max(10).default(""),
  ultimoOverhaul: z.string().trim().max(30).default(""),
  vencimientoPoliza: z.string().trim().max(30).default(""),
  siniestraliadAeronave: z.string().trim().max(2000).default(""),

  // Operación
  usoAnualHoras: z.string().trim().max(10).default(""),
  actividades: z.string().trim().max(2000).default(""),
  baseOperaciones: z.string().trim().max(200).default(""),
  limiteGeografico: z.string().trim().max(200).default(""),

  // Coberturas (JSON string)
  coberturas: z.string().trim().max(4000).default(""),

  // Ferry
  hasFerryFlight: z.boolean().default(false),
  ferryRuta: z.string().trim().max(500).default(""),
  ferrySalida: z.string().trim().max(30).default(""),
  ferryArribo: z.string().trim().max(30).default(""),
  comandante: z.string().trim().max(4000).default(""),
  copiloto: z.string().trim().max(4000).default(""),

  // RC ARIEL
  hasAirportPresence: z.boolean().default(false),
  edificiosHangares: z.string().trim().max(2000).default(""),
  ocupacion: z.string().trim().max(200).default(""),
  vehiculosEquipos: z.string().trim().max(2000).default(""),
  actividadesPrincipales: z.string().trim().max(2000).default(""),
  siniestraliadRC: z.string().trim().max(2000).default(""),

  // Hangarista
  isHangarista: z.boolean().default(false),
  valorPromedioCustodia: z.string().trim().max(30).default(""),
  valorMaximoCustodia: z.string().trim().max(30).default(""),
  nroPromedioAeronaves: z.string().trim().max(10).default(""),

  // Envío
  siniestraliadAsegurado: z.string().trim().max(2000).default(""),
  comentarios: z.string().trim().max(5000).default(""),
  modoContacto: z.enum(["email", "llamada", "whatsapp"], {
    message: "Modo de contacto obligatorio.",
  }),
  contactoValor: z.string().trim().min(1, "Dato de contacto obligatorio.").max(160),

  // Archivos
  archivos: z
    .array(fileSchema)
    .max(MAX_FILE_COUNT, `Podés adjuntar hasta ${MAX_FILE_COUNT} archivos.`)
    .refine(
      (files) => files.reduce((total, file) => total + file.size, 0) <= MAX_FILE_SIZE,
      "Los archivos adjuntos superan el límite de 10MB."
    )
    .default([]),
}).refine(
  (value) =>
    value.modoContacto === "email"
      ? emailSchema.safeParse(value.contactoValor).success
      : PHONE_REGEX.test(value.contactoValor.replace(/[^\d]/g, "")),
  {
    message: "Dato de contacto inválido.",
    path: ["contactoValor"],
  }
)

export type ContactFormPayload = z.infer<ReturnType<typeof buildContactFormSchema>>
export type AccidentesCotizacionPayload = z.infer<typeof accidentesCotizacionSchema>
export type CaucionPreaprobacionPayload = z.infer<
  typeof caucionPreaprobacionSchema
>
export type AeronavegacionSolicitudPayload = z.infer<
  typeof aeronavegacionSolicitudSchema
>
