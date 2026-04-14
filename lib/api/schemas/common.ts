import { z } from "zod"

const primitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])

export const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    primitiveSchema,
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ])
)

export const trimmedStringSchema = (message: string, max = 255) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(max, message)

export const optionalTrimmedStringSchema = (max = 255) =>
  z
    .union([z.string(), z.undefined(), z.null()])
    .transform((value) => (typeof value === "string" ? value.trim() : ""))
    .pipe(z.string().max(max, `Must be at most ${max} characters.`))

export const lookupDocumentSchema = z
  .string()
  .trim()
  .regex(/^\d{7,11}$/, "Documento inválido.")

export const dniSchema = z
  .string()
  .trim()
  .regex(/^\d{7,8}$/, "DNI inválido.")

export const cuitSchema = z
  .string()
  .trim()
  .regex(/^\d{11}$/, "CUIT inválido.")

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email inválido.")
  .max(254, "Email inválido.")
  .email("Email inválido.")

export const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida.")

export const numericIdSchema = z.preprocess((value) => {
  if (typeof value === "number") return value
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return Number(value.trim())
  }

  return value
}, z.number().int().nonnegative("ID inválido."))

export const phoneAreaSchema = z.preprocess((value) => {
  if (typeof value === "number") return String(value)
  return value
}, z.string().trim().regex(/^\d{2,4}$/, "Código de área inválido."))

export const phoneNumberSchema = z.preprocess((value) => {
  if (typeof value === "number") return String(value)
  return value
}, z.string().trim().regex(/^\d{6,8}$/, "Número de teléfono inválido."))

export const internalPathSchema = z
  .string()
  .trim()
  .refine((value) => value.startsWith("/") && !value.startsWith("//"), {
    message: "Redirect inválido.",
  })
  .transform((value) => {
    const parsed = new URL(value, "https://woranz.local")
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  })
