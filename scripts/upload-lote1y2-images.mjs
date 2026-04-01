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
    nombre: "Caución de Alquiler",
    segmento: "personas",
    slug: "caucion-alquiler",
    heroFile: "hero-caucion-alquiler.png",
    cardFile: "card-caucion-alquiler.png",
  },
  {
    nombre: "Accidentes Personales",
    segmento: "personas",
    slug: "accidentes-personales",
    heroFile: "hero-ap-oficio.png",
    cardFile: "card-ap-oficio.png",
  },
  {
    nombre: "Seguro de Hogar",
    segmento: "personas",
    slug: "seguro-de-hogar",
    heroFile: "hero-seguro-hogar.png",
    cardFile: "card-seguro-hogar.png",
  },
  {
    nombre: "Caución Turismo Estudiantil",
    segmento: "personas",
    slug: "caucion-turismo-estudiantil",
    heroFile: "hero-turismo-estudiantil.png",
    cardFile: "card-turismo-estudiantil.png",
  },
  {
    nombre: "Incendio",
    segmento: "personas",
    slug: "incendio",
    heroFile: "hero-incendio.png",
    cardFile: "card-incendio.png",
  },
  {
    nombre: "Robo de Bici",
    segmento: "personas",
    slug: "robo-bici",
    heroFile: "hero-robo-bici.png",
    cardFile: "card-robo-bici.png",
  },
  {
    nombre: "Robo de Monopatín",
    segmento: "personas",
    slug: "robo-monopatin",
    heroFile: "hero-robo-monopatin.png",
    cardFile: "card-robo-monopatin.png",
  },
  {
    nombre: "Robo de Celular",
    segmento: "personas",
    slug: "robo-celular",
    heroFile: "hero-robo-celular.png",
    cardFile: "card-robo-celular.png",
  },
  {
    nombre: "Robo de Notebook",
    segmento: "personas",
    slug: "robo-notebook",
    heroFile: "hero-robo-notebook.png",
    cardFile: null, // no card yet
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

  console.log(`\nUploading Lote 1+2 images to Sanity (${projectId}/${dataset})`)
  console.log(`Source: ${EXPORTS_DIR}`)
  console.log(`Dry run: ${dryRun}\n`)

  for (const product of PRODUCTS) {
    const heroPath = path.join(EXPORTS_DIR, product.heroFile)
    const cardPath = product.cardFile ? path.join(EXPORTS_DIR, product.cardFile) : null
    const docId = `producto-${product.segmento}-${product.slug}`

    console.log(`\n${product.nombre}`)
    console.log(`  Doc: ${docId}`)

    if (!existsSync(heroPath)) { console.log(`  ⚠ Hero not found: ${heroPath}`); continue }
    if (cardPath && !existsSync(cardPath)) { console.log(`  ⚠ Card not found: ${cardPath}`); continue }

    if (dryRun) {
      console.log(`  [dry-run] hero: ${product.heroFile}`)
      if (cardPath) console.log(`  [dry-run] card: ${product.cardFile}`)
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

    if (cardPath) {
      const cardAssetId = await uploadImage(client, cardPath, product.cardFile)
      await client.patch(docId).set({ cardImage: imageRef(cardAssetId) }).commit()
      console.log(`  ✓ Set cardImage on ${docId}`)
    }
  }

  console.log("\n✅ Upload complete!\n")
}

main().catch((err) => { console.error(err); process.exit(1) })
