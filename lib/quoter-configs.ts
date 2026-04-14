import { PROVINCIAS } from "@/components/ui/georef-search"

// ── Field types ─────────────────────────────────────────────────────

export type QuoterFieldType =
  | "select"
  | "searchable-select"
  | "money"
  | "number"
  | "provincia-select"

export type QuoterFieldConfig = {
  defaultValue: string | number
  description: string
  label: string
  max?: number
  min?: number
  name: string
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  prefix?: string
  suffix?: string
  type: QuoterFieldType
}

export type QuoterConfig = {
  calculatePrice: (values: Record<string, string | number>) => number
  ctaLabel: string
  fields: QuoterFieldConfig[]
  id: string
  priceLabel: string
}

// ── Shared helpers ──────────────────────────────────────────────────

function getProvinceTaxRate(provincia: string): number {
  return PROVINCIAS.find((p) => p.value === provincia)?.impuesto ?? 0.035
}

// ── Seguro de Hogar ─────────────────────────────────────────────────

const HOGAR_BASE_PER_M2 = 250

const HOGAR_TIPO_FACTOR: Record<string, number> = {
  casa: 1.0,
  departamento: 0.85,
  ph: 1.1,
}

const HOGAR_CONDICION_FACTOR: Record<string, number> = {
  propietario: 1.0,
  inquilino: 0.7,
}

export const hogarQuoter: QuoterConfig = {
  id: "seguro-de-hogar",
  ctaLabel: "Contratar",
  priceLabel: "por mes",
  fields: [
    {
      name: "tipo",
      label: "Tipo de vivienda",
      description: "El tipo influye en la cobertura",
      type: "select",
      options: [
        { value: "casa", label: "Casa" },
        { value: "departamento", label: "Departamento" },
        { value: "ph", label: "PH" },
      ],
      defaultValue: "departamento",
    },
    {
      name: "condicion",
      label: "Condición",
      description: "¿Sos propietario o inquilino?",
      type: "select",
      options: [
        { value: "propietario", label: "Propietario" },
        { value: "inquilino", label: "Inquilino" },
      ],
      defaultValue: "inquilino",
    },
    {
      name: "m2",
      label: "Metros cuadrados",
      description: "Superficie cubierta de tu vivienda",
      type: "number",
      min: 20,
      max: 500,
      suffix: "m²",
      defaultValue: 60,
    },
    {
      name: "provincia",
      label: "Provincia",
      description: "Los impuestos varían según tu provincia",
      type: "provincia-select",
      defaultValue: "buenos-aires",
    },
  ],
  calculatePrice(values) {
    const m2 = Number(values.m2) || 60
    const tipo = String(values.tipo || "departamento")
    const condicion = String(values.condicion || "inquilino")
    const provincia = String(values.provincia || "buenos-aires")

    const base = m2 * HOGAR_BASE_PER_M2
    const tipoFactor = HOGAR_TIPO_FACTOR[tipo] ?? 1.0
    const condicionFactor = HOGAR_CONDICION_FACTOR[condicion] ?? 1.0
    const impuesto = getProvinceTaxRate(provincia)

    const subtotal = base * tipoFactor * condicionFactor
    return Math.round(subtotal * (1 + impuesto))
  },
}

// ── Robo de Bici ────────────────────────────────────────────────────

const BICI_TASA_BASE = 0.02

const BICI_TIPO_FACTOR: Record<string, number> = {
  mountain: 1.0,
  playera: 0.9,
  plegable: 0.85,
  electrica: 1.3,
  monopatin: 1.15,
}

export const roboBiciQuoter: QuoterConfig = {
  id: "robo-bici",
  ctaLabel: "Contratar",
  priceLabel: "por mes",
  fields: [
    {
      name: "tipoBici",
      label: "Tipo de bicicleta",
      description: "El tipo afecta el precio de la cobertura",
      type: "select",
      options: [
        { value: "mountain", label: "Mountain bike" },
        { value: "playera", label: "Playera" },
        { value: "plegable", label: "Plegable" },
        { value: "electrica", label: "Eléctrica" },
        { value: "monopatin", label: "Monopatín" },
      ],
      defaultValue: "mountain",
    },
    {
      name: "valor",
      label: "Valor aproximado",
      description: "¿Cuánto vale tu bici hoy?",
      type: "money",
      min: 50000,
      max: 5000000,
      prefix: "$",
      placeholder: "Ej: 500.000",
      defaultValue: 500000,
    },
  ],
  calculatePrice(values) {
    const valor = Number(values.valor) || 500000
    const tipo = String(values.tipoBici || "mountain")
    const tipoFactor = BICI_TIPO_FACTOR[tipo] ?? 1.0
    return Math.round(valor * BICI_TASA_BASE * tipoFactor)
  },
}

// ── Robo de Celular ─────────────────────────────────────────────────

const CELULAR_TASA_BASE = 0.018

const CELULAR_MARCA_FACTOR: Record<string, number> = {
  apple: 1.2,
  samsung: 1.0,
  motorola: 0.9,
  xiaomi: 0.85,
  otro: 1.0,
}

export const roboCelularQuoter: QuoterConfig = {
  id: "robo-celular",
  ctaLabel: "Contratar",
  priceLabel: "por mes",
  fields: [
    {
      name: "marca",
      label: "Marca",
      description: "La marca afecta el precio de la cobertura",
      type: "searchable-select",
      options: [
        { value: "apple", label: "Apple" },
        { value: "samsung", label: "Samsung" },
        { value: "motorola", label: "Motorola" },
        { value: "xiaomi", label: "Xiaomi" },
        { value: "otro", label: "Otra marca" },
      ],
      defaultValue: "samsung",
    },
    {
      name: "valor",
      label: "Valor aproximado",
      description: "¿Cuánto vale tu celular hoy?",
      type: "money",
      min: 50000,
      max: 3000000,
      prefix: "$",
      placeholder: "Ej: 800.000",
      defaultValue: 800000,
    },
  ],
  calculatePrice(values) {
    const valor = Number(values.valor) || 800000
    const marca = String(values.marca || "samsung")
    const marcaFactor = CELULAR_MARCA_FACTOR[marca] ?? 1.0
    return Math.round(valor * CELULAR_TASA_BASE * marcaFactor)
  },
}

// ── Robo de Notebook ────────────────────────────────────────────────

const NOTEBOOK_TASA_BASE = 0.025

const NOTEBOOK_MARCA_FACTOR: Record<string, number> = {
  apple: 1.15,
  lenovo: 1.0,
  hp: 1.0,
  dell: 1.0,
  asus: 0.95,
  otro: 1.0,
}

export const roboNotebookQuoter: QuoterConfig = {
  id: "robo-notebook",
  ctaLabel: "Contratar",
  priceLabel: "por mes",
  fields: [
    {
      name: "marca",
      label: "Marca",
      description: "La marca afecta el precio de la cobertura",
      type: "searchable-select",
      options: [
        { value: "apple", label: "Apple" },
        { value: "lenovo", label: "Lenovo" },
        { value: "hp", label: "HP" },
        { value: "dell", label: "Dell" },
        { value: "asus", label: "ASUS" },
        { value: "otro", label: "Otra marca" },
      ],
      defaultValue: "lenovo",
    },
    {
      name: "valor",
      label: "Valor aproximado",
      description: "¿Cuánto vale tu notebook hoy?",
      type: "money",
      min: 100000,
      max: 5000000,
      prefix: "$",
      placeholder: "Ej: 1.200.000",
      defaultValue: 1200000,
    },
  ],
  calculatePrice(values) {
    const valor = Number(values.valor) || 1200000
    const marca = String(values.marca || "lenovo")
    const marcaFactor = NOTEBOOK_MARCA_FACTOR[marca] ?? 1.0
    return Math.round(valor * NOTEBOOK_TASA_BASE * marcaFactor)
  },
}

// ── Incendio ────────────────────────────────────────────────────────

const INCENDIO_BASE_PER_M2 = 100

const INCENDIO_TIPO_FACTOR: Record<string, number> = {
  casa: 1.0,
  departamento: 0.8,
  ph: 1.1,
  local_comercial: 1.3,
}

const INCENDIO_CONDICION_FACTOR: Record<string, number> = {
  propietario: 1.0,
  inquilino: 0.6,
}

export const incendioQuoter: QuoterConfig = {
  id: "incendio",
  ctaLabel: "Contratar",
  priceLabel: "por mes",
  fields: [
    {
      name: "condicion",
      label: "Condición",
      description: "¿Sos propietario o inquilino?",
      type: "select",
      options: [
        { value: "propietario", label: "Propietario" },
        { value: "inquilino", label: "Inquilino" },
      ],
      defaultValue: "inquilino",
    },
    {
      name: "tipo",
      label: "Tipo de inmueble",
      description: "El tipo afecta el precio de la cobertura",
      type: "select",
      options: [
        { value: "casa", label: "Casa" },
        { value: "departamento", label: "Departamento" },
        { value: "ph", label: "PH" },
        { value: "local_comercial", label: "Local comercial" },
      ],
      defaultValue: "departamento",
    },
    {
      name: "m2",
      label: "Metros cuadrados",
      description: "Superficie cubierta del inmueble",
      type: "number",
      min: 15,
      max: 1000,
      suffix: "m²",
      defaultValue: 60,
    },
    {
      name: "provincia",
      label: "Provincia",
      description: "Los impuestos varían según tu provincia",
      type: "provincia-select",
      defaultValue: "buenos-aires",
    },
  ],
  calculatePrice(values) {
    const m2 = Number(values.m2) || 60
    const tipo = String(values.tipo || "departamento")
    const condicion = String(values.condicion || "inquilino")
    const provincia = String(values.provincia || "buenos-aires")

    const base = m2 * INCENDIO_BASE_PER_M2
    const tipoFactor = INCENDIO_TIPO_FACTOR[tipo] ?? 1.0
    const condicionFactor = INCENDIO_CONDICION_FACTOR[condicion] ?? 1.0
    const impuesto = getProvinceTaxRate(provincia)

    const subtotal = base * tipoFactor * condicionFactor
    return Math.round(subtotal * (1 + impuesto))
  },
}

// ── Registry ────────────────────────────────────────────────────────

const quoterConfigs: Record<string, QuoterConfig> = {
  [hogarQuoter.id]: hogarQuoter,
  [roboBiciQuoter.id]: roboBiciQuoter,
  [roboCelularQuoter.id]: roboCelularQuoter,
  [roboNotebookQuoter.id]: roboNotebookQuoter,
  [incendioQuoter.id]: incendioQuoter,
}

export function getQuoterConfig(id: string): QuoterConfig | undefined {
  return quoterConfigs[id]
}
