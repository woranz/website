import type { BreadcrumbStepperStep } from "@/components/ui/breadcrumb-stepper"

// ── Steps ──────────────────────────────────────────────────────────

export const AERO_STEPS: BreadcrumbStepperStep[] = [
  { id: "upload", title: "Documentación" },
  { id: "review", title: "Datos de la solicitud" },
  { id: "contacto", title: "Contacto y envío" },
]

// ── Asegurado ──────────────────────────────────────────────────────

export const CONDICIONES_FISCALES = [
  "Responsable inscripto",
  "Monotributista",
  "Consumidor final",
  "Exento",
  "No alcanzado",
] as const

// ── Aeronave ───────────────────────────────────────────────────────

export const MARCAS_AERONAVE = [
  "ACJ", "Airbus", "Beechcraft", "Bell", "Boeing", "Bombardier", "Cessna",
  "Cirrus", "Dassault", "De Havilland", "Diamond", "Eclipse", "Embraer",
  "Eurocopter", "Grob", "Gulfstream", "Hawker", "Let", "Lockheed",
  "McDonnell Douglas", "Mooney", "Pilatus", "Piaggio", "Piper", "Robinson",
  "Saab", "Sikorsky", "Otros",
] as const

export const TIPOS_AERONAVE = [
  "Monomotor a pistón",
  "Multimotor a pistón",
  "Monomotor turbohélice",
  "Multimotor turbohélice",
  "Turbina monomotor",
  "Turbina multimotor",
] as const

export const ICAO_TYPE_MAP: Record<string, (typeof TIPOS_AERONAVE)[number]> = {
  L1P: "Monomotor a pistón",
  L2P: "Multimotor a pistón",
  L1T: "Monomotor turbohélice",
  L2T: "Multimotor turbohélice",
  L1J: "Turbina monomotor",
  L2J: "Turbina multimotor",
  H1P: "Monomotor a pistón",
  H1T: "Monomotor turbohélice",
  H2T: "Multimotor turbohélice",
}

// ── Operación ──────────────────────────────────────────────────────

export const ACTIVIDADES = [
  "Taxi aéreo", "Privado", "Ayuda industrial", "Aviación deportiva",
  "Aeroaplicador", "Combate contra incendios", "Rescate", "Carga",
  "Vuelos sanitarios", "Investigación", "Fotografía y filmación",
  "Propaganda", "Inspección y vigilancia", "Defensa y protección de la fauna",
  "Instrucción", "Turismo", "Otros",
] as const

// ── Coberturas ─────────────────────────────────────────────────────

export const COBERTURAS = [
  "Casco — todo riesgo en vuelo",
  "Casco — todo riesgo en tierra",
  "Casco — riesgos de hangar",
  "Responsabilidad Civil — transportados",
  "Responsabilidad Civil — no transportados",
  "Accidentes personales — pasajeros",
  "Accidentes personales — tripulantes",
  "Repuestos",
  "Otros",
] as const

// ── Contact modes ──────────────────────────────────────────────────

export const MODOS_CONTACTO = ["email", "llamada", "whatsapp"] as const
export type ContactMode = (typeof MODOS_CONTACTO)[number]

export const MODO_CONTACTO_LABELS: Record<ContactMode, string> = {
  email: "Email",
  llamada: "Llamada telefónica",
  whatsapp: "WhatsApp",
}
