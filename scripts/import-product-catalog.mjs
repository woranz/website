import { createReadStream, existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@sanity/client"
import { buildProductSectionsFromLegacy } from "./lib/product-sections.mjs"

const API_VERSION = "2024-01-01"
const BATCH_SIZE = 20
const dryRun = process.argv.includes("--dry-run")
const productCatalog = JSON.parse(
  readFileSync(new URL("../data/product-catalog.json", import.meta.url), "utf8")
)

function readEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }

  return readFileSync(filePath, "utf8")
    .split("\n")
    .reduce((env, line) => {
      const trimmedLine = line.trim()

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        return env
      }

      const separatorIndex = trimmedLine.indexOf("=")

      if (separatorIndex === -1) {
        return env
      }

      const key = trimmedLine.slice(0, separatorIndex).trim()
      const value = trimmedLine.slice(separatorIndex + 1).trim()

      env[key] = value.replace(/^['"]|['"]$/g, "")
      return env
    }, {})
}

function getSanityConfig() {
  const envFromFile = readEnvFile(new URL("../.env.local", import.meta.url))

  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? envFromFile.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? envFromFile.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity project configuration. Define NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET."
    )
  }

  return { projectId, dataset }
}

function getCliAuthToken() {
  const configPath = path.join(os.homedir(), ".config", "sanity", "config.json")

  if (!existsSync(configPath)) {
    return undefined
  }

  try {
    const config = JSON.parse(readFileSync(configPath, "utf8"))
    return config.authToken
  } catch {
    return undefined
  }
}

function getWriteToken() {
  return (
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_AUTH_TOKEN ??
    getCliAuthToken()
  )
}

function createDocId(segmento, slug) {
  return `producto-${segmento}-${slug}`
}

function mapReference(key) {
  const [segmento, slug] = key.split("/")

  return {
    _type: "reference",
    _ref: createDocId(segmento, slug),
  }
}

function resolveLocalHeroImagePath(heroImageSrc) {
  if (!heroImageSrc || !heroImageSrc.startsWith("/images/")) {
    return undefined
  }

  const relativePath = heroImageSrc.replace(/^\//, "")
  const filePath = fileURLToPath(new URL(`../public/${relativePath}`, import.meta.url))

  return existsSync(filePath) ? filePath : undefined
}

async function resolveHeroImageField(client, product, assetCache, shouldUploadAssets) {
  const localPath = resolveLocalHeroImagePath(product.heroImageSrc)

  if (!localPath || !shouldUploadAssets) {
    return undefined
  }

  const cachedAsset = assetCache.get(localPath)

  if (cachedAsset) {
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: cachedAsset,
      },
    }
  }

  const asset = await client.assets.upload("image", createReadStream(localPath), {
    filename: path.basename(localPath),
  })

  assetCache.set(localPath, asset._id)

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  }
}

async function mapProduct(client, product, assetCache, shouldUploadAssets) {
  const heroImage = await resolveHeroImageField(
    client,
    product,
    assetCache,
    shouldUploadAssets
  )

  return {
    _id: createDocId(product.segmento, product.slug),
    _type: "producto",
    nombre: product.nombre,
    segmento: product.segmento,
    destacado: product.destacado ?? false,
    orden: product.orden ?? 999,
    slug: {
      _type: "slug",
      current: product.slug,
    },
    badge: product.badge,
    headline: product.headline,
    subtitulo: product.subtitulo,
    heroImage,
    ...(heroImage ? { cardImage: heroImage } : {}),
    ctaPrimario: product.ctaPrimario,
    ctaSecundario: product.ctaSecundario,
    secciones: buildProductSectionsFromLegacy({
      ...product,
      productosRelacionados: (product.productosRelacionados ?? []).map(mapReference),
    }),
    pendientesValidacion: product.pendientesValidacion ?? [],
  }
}

async function commitBatch(client, docs) {
  let transaction = client.transaction()

  for (const doc of docs) {
    transaction = transaction.createOrReplace(doc)
  }

  return transaction.commit()
}

async function main() {
  const { projectId, dataset } = getSanityConfig()
  const token = dryRun ? undefined : getWriteToken()

  if (!dryRun && !token) {
    throw new Error(
      "Missing Sanity credentials. Set SANITY_API_WRITE_TOKEN or run `sanity login` first."
    )
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    token,
  })
  const assetCache = new Map()
  const publishedDocs = await Promise.all(
    productCatalog.map((product) =>
      mapProduct(client, product, assetCache, !dryRun)
    )
  )
  const draftDocs = publishedDocs
    .filter((doc) => (doc.pendientesValidacion?.length ?? 0) > 0)
    .map((doc) => ({
      ...doc,
      _id: `drafts.${doc._id}`,
    }))

  const docsToUpsert = [...publishedDocs, ...draftDocs]

  console.log(
    `Prepared ${publishedDocs.length} published docs and ${draftDocs.length} draft docs.`
  )

  if (dryRun) {
    for (const doc of docsToUpsert) {
      console.log(`- ${doc._id}`)
    }
    return
  }

  for (let index = 0; index < docsToUpsert.length; index += BATCH_SIZE) {
    const batch = docsToUpsert.slice(index, index + BATCH_SIZE)
    await commitBatch(client, batch)
    console.log(
      `Committed ${Math.min(index + BATCH_SIZE, docsToUpsert.length)}/${docsToUpsert.length}`
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
