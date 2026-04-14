import { readFileSync } from "node:fs"
import { createClient } from "next-sanity"

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=")
      return [line.slice(0, index), line.slice(index + 1).replace(/^['"]|['"]$/g, "")]
    })
)

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN ?? env.SANITY_API_WRITE_TOKEN,
})

const dryRun = process.argv.includes("--dry-run")

const product = await client.fetch(
  `*[_type == "producto" && slug.current == "caucion-alquiler" && segmento == "personas"][0]{
    _id, secciones
  }`
)

if (!product) {
  console.log("Product not found")
  process.exit(1)
}

const needle = "woranz.com/alquileres"
let found = false

const updated = product.secciones.map((s) => {
  // Check all string fields for the needle
  const patched = { ...s }
  for (const [key, value] of Object.entries(patched)) {
    if (typeof value === "string" && value.includes(needle)) {
      found = true
      const before = value
      // Remove "en woranz.com/alquileres" or "en woranz.com/alquileres."
      patched[key] = value.replace(/\s*en woranz\.com\/alquileres/gi, "")
      console.log(`Field: ${s._type}.${key}`)
      console.log(`  Before: ${before}`)
      console.log(`  After:  ${patched[key]}`)
    }
  }
  // Also check nested pasos array
  if (Array.isArray(patched.pasos)) {
    patched.pasos = patched.pasos.map((paso) => {
      const p = { ...paso }
      for (const [key, value] of Object.entries(p)) {
        if (typeof value === "string" && value.includes(needle)) {
          found = true
          const before = value
          p[key] = value.replace(/\s*en woranz\.com\/alquileres/gi, "")
          console.log(`Field: ${s._type}.pasos[].${key}`)
          console.log(`  Before: ${before}`)
          console.log(`  After:  ${p[key]}`)
        }
      }
      return p
    })
  }
  return patched
})

if (!found) {
  console.log(`"${needle}" not found in any section field`)
  process.exit(0)
}

if (dryRun) {
  console.log("\nDRY RUN: would patch", product._id)
} else {
  await client.patch(product._id).set({ secciones: updated }).commit()
  console.log("\nPatched", product._id)
}
