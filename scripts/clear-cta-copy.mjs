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

// Fetch all productos that have seccionCta in their secciones array
const products = await client.fetch(
  `*[_type == "producto" && defined(secciones)]{
    _id,
    titulo,
    segmento,
    "slug": slug.current,
    secciones
  }`
)

console.log(`Found ${products.length} products\n`)

let patchCount = 0

for (const product of products) {
  const secciones = product.secciones ?? []
  let changed = false

  const updated = secciones.map((s) => {
    if (s._type !== "seccionCta") return s

    const hadTitle = Boolean(s.titulo || s.tituloMobile || s.descripcion)
    if (!hadTitle) return s

    changed = true
    const { titulo, tituloMobile, descripcion, ...rest } = s
    console.log(
      `  [${product.segmento}/${product.slug}] Clearing: titulo="${titulo || ""}", tituloMobile="${tituloMobile || ""}", descripcion="${descripcion || ""}"`
    )
    return rest
  })

  if (!changed) continue

  patchCount++
  if (dryRun) {
    console.log(`  → DRY RUN: would patch ${product._id}\n`)
    continue
  }

  await client
    .patch(product._id)
    .set({ secciones: updated })
    .commit()
  console.log(`  → Patched ${product._id}\n`)
}

console.log(`\nDone. ${patchCount} product(s) ${dryRun ? "would be " : ""}patched.`)
