import { createReadStream, existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "@sanity/client"

const API_VERSION = "2024-01-01"
const EXPORTS_DIR = path.resolve(
  new URL("./export-3c", import.meta.url).pathname
)

// === LOTE 3C: 8 empresas products ===
const PRODUCTS = [
  {
    nombre: "Integral de Consorcio",
    docId: "producto-empresas-integral-de-consorcio",
    slug: "integral-de-consorcio",
    heroFile: "hero-integral-de-consorcio.png",
    cardFile: "card-integral-de-consorcio.png",
  },
  {
    nombre: "Integral de Comercio",
    docId: "producto-empresas-integral-de-comercio",
    slug: "integral-de-comercio",
    heroFile: "hero-integral-de-comercio.png",
    cardFile: "card-integral-de-comercio.png",
  },
  {
    nombre: "Responsabilidad Civil",
    docId: "producto-empresas-responsabilidad-civil",
    slug: "responsabilidad-civil",
    heroFile: "hero-responsabilidad-civil.png",
    cardFile: "card-responsabilidad-civil.png",
  },
  {
    nombre: "Incendio",
    docId: "producto-empresas-incendio",
    slug: "incendio",
    heroFile: "hero-incendio.png",
    cardFile: "card-incendio.png",
  },
  {
    nombre: "Aeronavegación",
    docId: "producto-empresas-aeronavegacion",
    slug: "aeronavegacion",
    heroFile: "hero-aeronavegacion.png",
    cardFile: "card-aeronavegacion.png",
  },
  {
    nombre: "Hecho por Humanos",
    docId: "producto-empresas-hecho-por-humanos",
    slug: "hecho-por-humanos",
    heroFile: "hero-hecho-por-humanos.png",
    cardFile: "card-hecho-por-humanos.png",
  },
  {
    nombre: "RC por uso de IA",
    docId: "producto-empresas-responsabilidad-civil-uso-ia",
    slug: "responsabilidad-civil-uso-ia",
    heroFile: "hero-responsabilidad-civil-uso-ia.png",
    cardFile: "card-responsabilidad-civil-uso-ia.png",
  },
  {
    nombre: "Vida Saldo Deudor",
    docId: "producto-empresas-vida-saldo-deudor",
    slug: "vida-saldo-deudor",
    heroFile: "hero-vida-saldo-deudor.png",
    cardFile: "card-vida-saldo-deudor.png",
  },
]

// === HOME PAGES ===
const HOMES = [
  {
    nombre: "Home Personas",
    docId: "paginaHome-personas",
    heroFile: "hero-home-personas.png",
  },
  {
    nombre: "Home Empresas",
    docId: "paginaHome-empresas",
    heroFile: "hero-home-empresas.png",
  },
  {
    nombre: "Home Productores",
    docId: "paginaHome-productores",
    heroFile: "hero-home-productores.png",
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

  console.log(`\n🚀 Lote 3C + Homes upload (${projectId}/${dataset})`)
  console.log(`Source: ${EXPORTS_DIR}`)
  console.log(`Dry run: ${dryRun}\n`)

  let successCount = 0
  let skipCount = 0

  // === PRODUCTS ===
  console.log("=== PRODUCTOS (Lote 3C) ===\n")

  for (const product of PRODUCTS) {
    const heroPath = path.join(EXPORTS_DIR, product.heroFile)

    console.log(`\n${product.nombre}`)
    console.log(`  Doc: ${product.docId}`)

    if (!existsSync(heroPath)) {
      console.log(`  ⚠ Hero not found: ${heroPath}`)
      skipCount++
      continue
    }

    if (dryRun) {
      console.log(`  [dry-run] hero: ${product.heroFile}`)
      if (product.cardFile) console.log(`  [dry-run] card: ${product.cardFile}`)
      continue
    }

    // Upload hero and patch EXISTING doc
    const heroAssetId = await uploadImage(client, heroPath, product.heroFile)
    await client.patch(product.docId).set({ heroImage: imageRef(heroAssetId) }).commit()
    console.log(`  ✓ Set heroImage on ${product.docId}`)

    // Upload card
    if (product.cardFile) {
      const cardPath = path.join(EXPORTS_DIR, product.cardFile)
      if (!existsSync(cardPath)) {
        console.log(`  ⚠ Card not found: ${cardPath}`)
        continue
      }
      const cardAssetId = await uploadImage(client, cardPath, product.cardFile)
      await client.patch(product.docId).set({ cardImage: imageRef(cardAssetId) }).commit()
      console.log(`  ✓ Set cardImage on ${product.docId}`)
    }

    successCount++
  }

  // === HOME PAGES ===
  console.log("\n\n=== HOME PAGES ===\n")

  for (const home of HOMES) {
    const heroPath = path.join(EXPORTS_DIR, home.heroFile)

    console.log(`\n${home.nombre}`)
    console.log(`  Doc: ${home.docId}`)

    if (!existsSync(heroPath)) {
      console.log(`  ⚠ Hero not found: ${heroPath}`)
      skipCount++
      continue
    }

    if (dryRun) {
      console.log(`  [dry-run] hero: ${home.heroFile}`)
      continue
    }

    const heroAssetId = await uploadImage(client, heroPath, home.heroFile)
    await client.patch(home.docId).set({ heroImagen: imageRef(heroAssetId) }).commit()
    console.log(`  ✓ Set heroImagen on ${home.docId}`)

    successCount++
  }

  console.log(`\n✅ Upload complete! ${successCount} items updated, ${skipCount} skipped.\n`)
}

main().catch((err) => { console.error(err); process.exit(1) })
