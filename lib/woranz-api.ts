/**
 * Server-only utilities for Woranz API authentication and persona lookup.
 * Token is cached in memory with a 50-minute TTL.
 */

const AUTH_URL = "https://api.woranz.com/api/V1/Seguridad/authenticate"
const PERSONAS_URL = "https://frontapi.woranz.com/api/personas/all"

let cachedToken: { token: string; expiresAt: number } | null = null

export async function authenticate(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuarioName: process.env.WORANZ_API_USER,
      password: process.env.WORANZ_API_PASSWORD,
    }),
  })

  if (!res.ok) {
    throw new Error(`Woranz auth failed: ${res.status}`)
  }

  const data = await res.json()

  if (data.error) {
    throw new Error(`Woranz auth error: ${data.error.message}`)
  }

  const token = data.payload.session_token as string
  cachedToken = { token, expiresAt: Date.now() + 50 * 60 * 1000 }
  return token
}

export type PersonaData = {
  nombre: string
  apellido: string
  domicilio: string
}

/**
 * Look up a person by DNI using the frontapi personas endpoint.
 * Returns parsed name and locality from the first result.
 */
export async function lookupPersona(dni: string): Promise<PersonaData | null> {
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
  const d = json.data

  if (!d) {
    return null
  }

  // Response can be a single object or an array
  const persona = Array.isArray(d) ? d[0] : d

  if (!persona) {
    return null
  }

  const nombre = persona.nombre ?? ""
  const apellido = persona.apellido ?? ""
  const localidad = persona.domicilio?.localidad ?? persona.localidad ?? ""

  return {
    nombre,
    apellido,
    domicilio: localidad,
  }
}
