import type { RateLimitConfig } from "@/lib/api/rate-limit"

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  georef: { key: "georef", limit: 60, windowMs: 60_000 },
  apProfesiones: { key: "ap-profesiones", limit: 60, windowMs: 60_000 },
  apProvincias: { key: "ap-provincias", limit: 60, windowMs: 60_000 },
  apPersona: { key: "ap-persona", limit: 20, windowMs: 60_000 },
  caucionLookup: { key: "caucion-lookup", limit: 20, windowMs: 60_000 },
  apCotizacionOpciones: {
    key: "ap-cotizacion-opciones",
    limit: 15,
    windowMs: 60_000,
  },
  apCotizacionTrigger: {
    key: "ap-cotizacion-trigger",
    limit: 5,
    windowMs: 10 * 60_000,
  },
  apPropuesta: { key: "ap-propuesta", limit: 5, windowMs: 10 * 60_000 },
  apPropuestaConfirmar: {
    key: "ap-propuesta-confirmar",
    limit: 5,
    windowMs: 10 * 60_000,
  },
  apMercadoPago: {
    key: "ap-mercadopago",
    limit: 5,
    windowMs: 10 * 60_000,
  },
  apDocumentos: { key: "ap-documentos", limit: 20, windowMs: 10 * 60_000 },
  apDocumentosEmail: {
    key: "ap-documentos-email",
    limit: 5,
    windowMs: 10 * 60_000,
  },
  formsSubmit: { key: "forms-submit", limit: 5, windowMs: 10 * 60_000 },
}
