import { createReadStream, existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "@sanity/client"

const API_VERSION = "2024-01-01"
const EXPORTS_DIR = path.resolve(
  new URL("../../design/figma-exports", import.meta.url).pathname
)

const PRODUCTS = [
  {
    nombre: "Caución de Obra",
    segmento: "empresas",
    slug: "caucion-obra",
    heroFile: "hero-caucion-obra.png",
    cardFile: "card-caucion-obra.png",
  },
  {
    nombre: "Caución de Servicios",
    segmento: "empresas",
    slug: "caucion-servicios",
    heroFile: "hero-caucion-servicios.png",
    cardFile: "card-caucion-servicios.png",
  },
  {
    nombre: "Caución de Suministro",
    segmento: "empresas",
    slug: "caucion-suministro",
    heroFile: "hero-caucion-suministro.png",
    cardFile: "card-caucion-suministro.png",
  },
  {
    nombre: "Caución Actividad o Profesión",
    segmento: "empresas",
    slug: "caucion-actividad-o-profesion",
    heroFile: "hero-caucion-actividad-profesion.png",
    cardFile: "card-caucion-actividad-profesion.png",
  },
  {
    nombre: "Caución Alquiler Comercial",
    segmento: "empresas",
    slug: "caucion-alquiler-comercial",
    heroFile: "hero-caucion-alquiler-comercial.png",
    cardFile: "card-caucion-alquiler-comercial.png",
  },
  {
    nombre: "Caución Judicial",
    segmento: "empresas",
    slug: "caucion-judicial",
    heroFile: "hero-caucion-judicial.png",
    cardFile: "card-caucion-judicial.png",
  },
  {
    nombre: "Garantías Aduaneras",
    segmento: "empresas",
    slug: "garantias-aduaneras",
    heroFile: "hero-garantias-aduaneras.png",
    cardFile: "card-garantias-aduaneras.png",
  },
  {
    nombre: "Caución Turismo Estudiantil y Agencias",
    segmento: "empresas",
    slug: "caucion-turismo-estudiantil-agencias",
    heroFile: "hero-caucion-turismo-agencias.png",
    cardFile: "card-caucion-turismo-agencias.png",
  },
  {
    nombre: "Cauciones Tradicionales",
    segmento: "empresas",
    slug: "cauciones-tradicionales",
    heroFile: "hero-cauciones-tradicionales.png",
    cardFile: "card-cauciones-tradicionales.png",
  },
]

function readEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  return readFileSync(filePath, "utf8")
    .split("\n")
    .reduce((env, line) => {
      const t = line.trim()
      if (!t || t.startsWith("#")) return env
      const i = t.indexOf("=")
      if (i === -1) return env
      env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, "")
      return env
    }, {})
}

function getSanityConfig() {
  const envFromFile = readEnvFile(
    new URL("../.env.local", import.meta.url).pathname
  )
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? envFromFile.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? envFromFile.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) throw new Error("Missing Sanity config")
  return { projectId, dataset }
}

function getWriteToken() {
  const cliConfig = path.join(os.homedir(), ".config", "sanity", "config.json")
  return (
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_AUTH_TOKEN ??
    (existsSync(cliConfig) ? JSON.parse(readFileSync(cliConfig, "utf8")).authToken : undefined)
  )
}

function imageRef(assetId) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } }
}

async function uploadImage(client, filePath, filename) {
  console.log(`  Uploading ${filename}...`)
  const asset = await client.assets.upload("image", createReadStream(filePath), { filename })
  console.log(`  → ${asset._id}`)
  return asset._id
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const { projectId, dataset } = getSanityConfig()
  const token = dryRun ? undefined : getWriteToken()
  if (!dryRun && !token) throw new Error("No Sanity auth token")

  const client = createClient({ projectId, dataset, apiVersion: API_VERSION, useCdn: false, token })

  console.log(`\nUploading Lote 3B images to Sanity (${projectId}/${dataset})`)
  console.log(`Source: ${EXPORTS_DIR}`)
  console.log(`Dry run: ${dryRun}\n`)

  for (const product of PRODUCTS) {
    const heroPath = path.join(EXPORTS_DIR, product.heroFile)
    const docId = `producto-${product.segmento}-${product.slug}`

    console.log(`\n${product.nombre}`)
    console.log(`  Doc: ${docId}`)

    if (!existsSync(heroPath)) { console.log(`  ⚠ Hero not found: ${heroPath}`); continue }

    if (dryRun) {
      console.log(`  [dry-run] hero: ${product.heroFile}`)
      if (product.cardFile) console.log(`  [dry-run] card: ${product.cardFile}`)
      continue
    }

    const heroAssetId = await uploadImage(client, heroPath, product.heroFile)

    await client.createIfNotExists({
      _id: docId, _type: "producto",
      nombre: product.nombre, segmento: product.segmento,
      slug: { _type: "slug", current: product.slug },
    })
    await client.patch(docId).set({ heroImage: imageRef(heroAssetId) }).commit()
    console.log(`  ✓ Set heroImage on ${docId}`)

    if (product.cardFile) {
      const cardPath = path.join(EXPORTS_DIR, product.cardFile)
      if (!existsSync(cardPath)) { console.log(`  ⚠ Card not found: ${cardPath}`); continue }
      const cardAssetId = await uploadImage(client, cardPath, product.cardFile)
      await client.patch(docId).set({ cardImage: imageRef(cardAssetId) }).commit()
      console.log(`  ✓ Set cardImage on ${docId}`)
    }
  }

  console.log("\n✅ Lote 3B upload complete!\n")
}

main().catch((err) => { console.error(err); process.exit(1) })
