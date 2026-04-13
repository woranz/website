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
    _id, titulo, secciones
  }`
)

if (!product) {
  console.log("Product not found")
  process.exit(1)
}

const before = product.secciones.length
const updated = product.secciones.filter((s) => s._type !== "seccionRequisitos")
const removed = before - updated.length

if (removed === 0) {
  console.log("No seccionRequisitos found in caucion-alquiler")
  process.exit(0)
}

console.log(`Found ${removed} seccionRequisitos to remove`)

if (dryRun) {
  console.log("DRY RUN: would patch", product._id)
} else {
  await client.patch(product._id).set({ secciones: updated }).commit()
  console.log("Patched", product._id)
}
