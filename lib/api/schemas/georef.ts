import { z } from "zod"

export const GEOREF_ENDPOINT_CONFIG = {
  provincias: {
    fields: "id,nombre",
    responseKey: "provincias",
  },
  localidades: {
    fields: "id,nombre,provincia.nombre",
    responseKey: "localidades",
  },
} as const

export const georefQuerySchema = z.object({
  endpoint: z.enum(["provincias", "localidades"], {
    message: "Endpoint inválido.",
  }),
  nombre: z
    .string()
    .trim()
    .min(1, "Nombre inválido.")
    .max(80, "Nombre inválido."),
})

export type GeorefQuery = z.infer<typeof georefQuerySchema>
