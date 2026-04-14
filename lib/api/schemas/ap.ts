import { z } from "zod"

import {
  cuitSchema,
  emailSchema,
  internalPathSchema,
  isoDateSchema,
  jsonValueSchema,
  lookupDocumentSchema,
  numericIdSchema,
  optionalTrimmedStringSchema,
  phoneAreaSchema,
  phoneNumberSchema,
  trimmedStringSchema,
} from "@/lib/api/schemas/common"

const finiteNumberSchema = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value)
  }

  return value
}, z.number().finite("Número inválido."))

const nonNegativeNumberSchema = finiteNumberSchema.refine(
  (value) => value >= 0,
  "Número inválido."
)

const coverageSchema = z
  .object({
    idCobertura: numericIdSchema,
    nombre: trimmedStringSchema("Cobertura inválida.", 160),
    sumaAsegurada: nonNegativeNumberSchema,
    sumaAseguradaMaxima: nonNegativeNumberSchema.optional(),
    sumaAseguradaMinima: nonNegativeNumberSchema.optional(),
    isEditable: z.boolean().optional(),
  })
  .strict()

const quoteItemSchema = z
  .object({
    idOcupacion: numericIdSchema,
    cantidad: numericIdSchema
      .refine((value) => value >= 1 && value <= 700, "Cantidad inválida."),
  })
  .strict()

const emailEntrySchema = z
  .object({
    idTipoEmail: numericIdSchema,
    email: emailSchema,
  })
  .strict()

const domicilioSchema = z
  .record(z.string(), jsonValueSchema)
  .refine((value) => Object.keys(value).length <= 30, "Domicilio inválido.")

const physicalTomadorSchema = z
  .object({
    numeroDocumento: numericIdSchema.refine(
      (value) => String(value).length >= 7 && String(value).length <= 8,
      "Documento inválido."
    ),
    nombre: trimmedStringSchema("Nombre inválido.", 120),
    apellido: trimmedStringSchema("Apellido inválido.", 120),
    domicilio: domicilioSchema.optional(),
    emails: z.array(emailEntrySchema).max(5).optional(),
    sexo: optionalTrimmedStringSchema(16),
    fechaNacimiento: optionalTrimmedStringSchema(32),
    nacionalidad: optionalTrimmedStringSchema(32),
  })
  .strict()

const juridicalTomadorSchema = z
  .object({
    idTipoPersona: z.literal(2),
    cuit: cuitSchema,
    razonSocial: trimmedStringSchema("Razón social inválida.", 160),
    domicilio: domicilioSchema.optional(),
    emails: z.array(emailEntrySchema).max(5).optional(),
  })
  .strict()

const physicalAseguradoSchema = z
  .object({
    numeroDocumento: numericIdSchema.refine(
      (value) => String(value).length >= 7 && String(value).length <= 8,
      "Documento inválido."
    ),
    nombre: trimmedStringSchema("Nombre inválido.", 120),
    apellido: trimmedStringSchema("Apellido inválido.", 120),
    idOcupacion: numericIdSchema,
    sexo: optionalTrimmedStringSchema(16),
    fechaNacimiento: optionalTrimmedStringSchema(32),
    nacionalidad: optionalTrimmedStringSchema(32),
  })
  .strict()

const juridicalAseguradoSchema = z
  .object({
    idTipoPersona: z.literal(2),
    cuit: cuitSchema,
    razonSocial: trimmedStringSchema("Razón social inválida.", 160),
    idOcupacion: numericIdSchema,
  })
  .strict()

export const propuestaTomadorSchema = z.union([
  physicalTomadorSchema,
  juridicalTomadorSchema,
])

export const propuestaAseguradoSchema = z.union([
  physicalAseguradoSchema,
  juridicalAseguradoSchema,
])

export const nominaItemSchema = z
  .object({
    cuit: cuitSchema,
    nombre: trimmedStringSchema("Nombre inválido.", 160),
  })
  .strict()

const baseContactSchema = z
  .object({
    solicitante: trimmedStringSchema("Solicitante inválido.", 160),
    mail: emailSchema,
    telefonoArea: phoneAreaSchema,
    telefonoNumero: phoneNumberSchema,
  })
  .strict()

const baseQuoteSchema = z
  .object({
    idProvinciaRiesgo: numericIdSchema,
    vigenciaDesde: isoDateSchema,
    vigenciaHasta: isoDateSchema,
    items: z.array(quoteItemSchema).min(1).max(700),
  })
  .strict()
  .refine(
    (value) => new Date(value.vigenciaHasta).getTime() >= new Date(value.vigenciaDesde).getTime(),
    {
      message: "La vigencia es inválida.",
      path: ["vigenciaHasta"],
    }
  )

export const personaLookupSchema = z
  .object({
    dni: lookupDocumentSchema,
  })
  .strict()

export const caucionLookupSchema = z
  .object({
    dni: z
      .string()
      .trim()
      .regex(/^\d{7,8}$/, "DNI inválido. Debe tener 7 u 8 dígitos."),
  })
  .strict()

export const cotizacionOpcionesSchema = baseQuoteSchema
  .extend({
    idCoberturaPaquete: numericIdSchema.optional(),
  })
  .strict()

export const cotizacionTriggerSchema = baseQuoteSchema
  .merge(baseContactSchema)
  .extend({
    idCoberturaPaquete: numericIdSchema.optional(),
    coberturas: z.array(coverageSchema).min(1).max(64),
  })
  .strict()

export const propuestaSchema = baseQuoteSchema
  .merge(baseContactSchema)
  .extend({
    idCotizacion: numericIdSchema,
    idSeccion: numericIdSchema.optional(),
    idCoberturaPaquete: numericIdSchema.optional(),
    cantidad: numericIdSchema
      .refine((value) => value >= 1 && value <= 700, "Cantidad inválida."),
    coberturas: z.array(coverageSchema).min(1).max(64),
    tomador: propuestaTomadorSchema,
    asegurados: z.array(propuestaAseguradoSchema).min(1).max(700),
    domicilioRiesgo: domicilioSchema.default({}),
    clausulaSubrogacion: z.boolean().default(false),
    clausulaNoRepeticion: z.boolean().default(false),
    nomina: z.array(nominaItemSchema).max(700).default([]),
  })
  .strict()

export const propuestaConfirmarSchema = z
  .object({
    idEmision: numericIdSchema,
  })
  .strict()

const mercadoPagoTomadorFisicoSchema = z
  .object({
    tipo: z.literal("persona"),
    numeroDocumento: numericIdSchema.refine(
      (value) => String(value).length >= 7 && String(value).length <= 8,
      "Documento inválido."
    ),
    nombre: trimmedStringSchema("Nombre inválido.", 120),
    apellido: trimmedStringSchema("Apellido inválido.", 120),
    emails: z.array(emailEntrySchema).min(1).max(5),
  })
  .strict()

const mercadoPagoTomadorJuridicoSchema = z
  .object({
    tipo: z.literal("persona"),
    idTipoPersona: z.literal(2),
    cuit: cuitSchema,
    razonSocial: trimmedStringSchema("Razón social inválida.", 160),
    emails: z.array(emailEntrySchema).min(1).max(5),
  })
  .strict()

export const mercadoPagoSchema = z
  .object({
    data: z
      .object({
        idEmision: numericIdSchema,
        premio: nonNegativeNumberSchema,
        cantidad: numericIdSchema
          .refine((value) => value >= 1 && value <= 700, "Cantidad inválida."),
        email: emailSchema,
        tomador: z.union([
          mercadoPagoTomadorFisicoSchema,
          mercadoPagoTomadorJuridicoSchema,
        ]),
      })
      .strict(),
    base_url: z.string().url("URL inválida."),
    source_url: z.string().url("URL inválida."),
  })
  .strict()

export const documentosQuerySchema = z.object({
  idEmision: numericIdSchema,
  idImpresion: numericIdSchema.default(0),
})

export const documentosEmailSchema = z
  .object({
    idEmision: numericIdSchema,
    email: emailSchema,
    idImpresion: numericIdSchema.default(361),
  })
  .strict()

const woranzEmailSchema = z
  .object({
    idTipoEmail: numericIdSchema.optional(),
    email: emailSchema,
  })
  .strip()

export const woranzPersonaSchema = z
  .object({
    idTipoPersona: numericIdSchema.optional(),
    nombre: optionalTrimmedStringSchema(120),
    apellido: optionalTrimmedStringSchema(120),
    razonSocial: optionalTrimmedStringSchema(160),
    domicilio: domicilioSchema.nullable().optional(),
    fechaNacimiento: optionalTrimmedStringSchema(32),
    sexo: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .transform((value) => (value == null ? "" : String(value).trim())),
    nacionalidad: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .transform((value) => (value == null ? "" : String(value).trim())),
    emails: z.array(woranzEmailSchema).max(5).optional().default([]),
  })
  .strip()

export const internalRedirectSchema = internalPathSchema

export type CotizacionOpcionesInput = z.infer<typeof cotizacionOpcionesSchema>
export type CotizacionTriggerInput = z.infer<typeof cotizacionTriggerSchema>
export type PropuestaInput = z.infer<typeof propuestaSchema>
export type PropuestaTomadorInput = z.infer<typeof propuestaTomadorSchema>
export type PropuestaAseguradoInput = z.infer<typeof propuestaAseguradoSchema>
export type MercadoPagoInput = z.infer<typeof mercadoPagoSchema>
export type WoranzPersona = z.infer<typeof woranzPersonaSchema>
