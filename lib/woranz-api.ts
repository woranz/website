/**
 * Server-only utilities for Woranz API authentication and persona lookup.
 * Token is cached in memory with a 50-minute TTL.
 */

import { woranzPersonaSchema, type WoranzPersona } from "@/lib/api/schemas/ap"

const FRONTAPI_URL = "https://frontapi.woranz.com/api"
const LOGIN_URL = `${FRONTAPI_URL}/usuario/login`
const PERSONAS_URL = `${FRONTAPI_URL}/personas/all`

let cachedAuth: {
  token: string
  idPlanComercial: number
  expiresAt: number
} | null = null

async function login(): Promise<{
  token: string
  idPlanComercial: number
}> {
  if (cachedAuth && Date.now() < cachedAuth.expiresAt) {
    return { token: cachedAuth.token, idPlanComercial: cachedAuth.idPlanComercial }
  }

  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioName: process.env.WORANZ_API_USER,
      password: process.env.WORANZ_API_PASSWORD,
    }),
  })

  if (!res.ok) {
    throw new Error(`Woranz login failed: ${res.status}`)
  }

  const json = await res.json()

  if (json.error) {
    throw new Error(`Woranz login error: ${json.error.message ?? json.error}`)
  }

  const data = json.data
  const token = data.session_token as string
  const idPlanComercial = data.idPlanComercial as number

  cachedAuth = { token, idPlanComercial, expiresAt: Date.now() + 50 * 60 * 1000 }
  return { token, idPlanComercial }
}

export async function authenticate(): Promise<string> {
  const { token } = await login()
  return token
}

export async function getIdPlanComercial(): Promise<number> {
  const { idPlanComercial } = await login()
  return idPlanComercial
}

export function getWoranzErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string" && error.trim()) {
    return error
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message
  }

  return fallback
}

export type PersonaData = {
  nombre: string
  apellido: string
  domicilio: string
}

async function fetchPersonaRecord(dni: string): Promise<WoranzPersona | null> {
  const token = await authenticate()

  const res = await fetch(PERSONAS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: dni, type: "tomador" }),
  })

  if (!res.ok) {
    return null
  }

  const json = await res.json()
  const data = json.data

  if (!data) {
    return null
  }

  const persona = Array.isArray(data) ? data[0] : data
  if (!persona) {
    return null
  }

  const parsed = woranzPersonaSchema.safeParse(persona)
  if (!parsed.success) {
    return null
  }

  return parsed.data
}

/**
 * Look up a person by DNI using the frontapi personas endpoint.
 * Returns parsed name and locality from the first result.
 */
export async function lookupPersona(dni: string): Promise<PersonaData | null> {
  const persona = await fetchPersonaRecord(dni)
  if (!persona) {
    return null
  }

  const domicilio =
    persona.domicilio && typeof persona.domicilio === "object"
      ? (persona.domicilio.localidad as string | undefined) ?? ""
      : ""

  return {
    nombre: persona.nombre,
    apellido: persona.apellido,
    domicilio,
  }
}

/**
 * Generic authenticated fetch to the frontapi.
 */
export async function woranzFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const token = await authenticate()
  return fetch(`${FRONTAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
}

/**
 * Look up a person by DNI returning the full raw object from the API.
 * Includes domicilio, CUIT, sexo, fechaNacimiento, emails, etc.
 */
export async function lookupPersonaFull(
  dni: string
): Promise<WoranzPersona | null> {
  return fetchPersonaRecord(dni)
}
