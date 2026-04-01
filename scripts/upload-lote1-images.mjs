import { createReadStream, existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "@sanity/client"

const API_VERSION = "2024-01-01"
const EXPORTS_DIR = path.resolve(
  new URL("../../design/exports", import.meta.url).pathname
)

// ── Image mapping ──────────────────────────────────────────────
// Each product maps to: hero export (nodeId.png) and card export (nodeId.png)
// producto doc ID format: producto-{segmento}-{slug}

const LOTE_1 = [
  {
    nombre: "Caución de Alquiler",
    segmento: "personas",
    slug: "caucion-alquiler",
    heroFile: "xPKJJ.png",
    cardFile: "EWog5.png",
  },
  {
    nombre: "Accidentes Personales (Oficio)",
    segmento: "personas",
    slug: "accidentes-personales",
    heroFile: "Pjgqz.png",
    cardFile: "DcONW.png",
  },
  {
    nombre: "Accidentes Personales (Delivery)",
    segmento: "personas",
    slug: "accidentes-personales",
    heroFile: "ap6ls.png",
    cardFile: "KSNns.png",
    variant: "delivery",
  },
  {
    nombre: "Seguro de Hogar",
    segmento: "personas",
    slug: "seguro-de-hogar",
    heroFile: "rwcaG.png",
    cardFile: "1nEK5.png",
  },
  {
    nombre: "Caución Turismo Estudiantil",
    segmento: "personas",
    slug: "caucion-turismo-estudiantil",
    heroFile: "vAv99.png",
    cardFile: "R5x1R.png",
  },
]

// ── Env / Auth helpers (reused from import-product-catalog) ────

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
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
    envFromFile.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ??
    envFromFile.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / DATASET")
  }
  return { projectId, dataset }
}

function getWriteToken() {
  const cliConfig = path.join(os.homedir(), ".config", "sanity", "config.json")
  return (
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_AUTH_TOKEN ??
    (existsSync(cliConfig)
      ? JSON.parse(readFileSync(cliConfig, "utf8")).authToken
      : undefined)
  )
}

// ── Upload logic ───────────────────────────────────────────────

async function uploadImage(client, filePath, filename) {
  console.log(`  Uploading ${filename}...`)
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename,
  })
  console.log(`  → ${asset._id}`)
  return asset._id
}

function imageRef(assetId) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const { projectId, dataset } = getSanityConfig()
  const token = dryRun ? undefined : getWriteToken()

  if (!dryRun && !token) {
    throw new Error(
      "No Sanity auth token found. Set SANITY_API_WRITE_TOKEN or run `sanity login`."
    )
  }

  const client = createClient({ projectId, dataset, apiVersion: API_VERSION, useCdn: false, token })

  console.log(`\nLote 1 — Uploading images to Sanity (${projectId}/${dataset})`)
  console.log(`Dry run: ${dryRun}\n`)

  for (const product of LOTE_1) {
    const heroPath = path.join(EXPORTS_DIR, product.heroFile)
    const cardPath = path.join(EXPORTS_DIR, product.cardFile)
    const docId = `producto-${product.segmento}-${product.slug}`
    const label = product.variant
      ? `${product.nombre} [${product.variant}]`
      : product.nombre

    console.log(`\n${label}`)
    console.log(`  Doc: ${docId}`)

    if (!existsSync(heroPath)) {
      console.log(`  ⚠ Hero not found: ${heroPath}`)
      continue
    }
    if (!existsSync(cardPath)) {
      console.log(`  ⚠ Card not found: ${cardPath}`)
      continue
    }

    if (dryRun) {
      console.log(`  [dry-run] Would upload hero: ${product.heroFile}`)
      console.log(`  [dry-run] Would upload card: ${product.cardFile}`)
      continue
    }

    // Upload assets
    const heroAssetId = await uploadImage(client, heroPath, `hero-${product.slug}.png`)
    const cardAssetId = await uploadImage(client, cardPath, `card-${product.slug}.png`)

    // Set heroImage on producto document (createIfNotExists + patch)
    // For AP we have 2 variants sharing the same doc — only patch hero with "oficio" (primary)
    if (!product.variant) {
      await client.createIfNotExists({
        _id: docId,
        _type: "producto",
        nombre: product.nombre,
        segmento: product.segmento,
        slug: { _type: "slug", current: product.slug },
      })
      await client
        .patch(docId)
        .set({ heroImage: imageRef(heroAssetId) })
        .commit()
      console.log(`  ✓ Set heroImage on ${docId}`)
    } else {
      console.log(`  ⏭ Skipping heroImage patch (variant: ${product.variant})`)
    }

    if (!product.variant) {
      await client.patch(docId).set({ cardImage: imageRef(cardAssetId) }).commit()
      console.log(`  ✓ Set cardImage on ${docId}`)
    } else {
      console.log(`  ⏭ Skipping cardImage patch (variant: ${product.variant})`)
    }
  }

  console.log("\n✅ Lote 1 complete!\n")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
