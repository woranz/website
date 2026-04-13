import { existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "next-sanity"

const API_VERSION = "2024-01-01"
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

function getEnvFromFile() {
  return readEnvFile(new URL("../.env.local", import.meta.url))
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
  const envFromFile = getEnvFromFile()

  return (
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_AUTH_TOKEN ??
    envFromFile.SANITY_API_WRITE_TOKEN ??
    envFromFile.SANITY_AUTH_TOKEN ??
    getCliAuthToken()
  )
}

function createDocId(segmento, slug) {
  return `producto-${segmento}-${slug}`
}

function normalizeFaqs(faqs = []) {
  return faqs
    .filter((faq) => faq?.pregunta || faq?.respuesta)
    .map((faq, index) => ({
      _key: faq._key ?? `faq-${index}`,
      _type: "object",
      ...(faq.pregunta ? { pregunta: faq.pregunta.trim() } : {}),
      ...(faq.respuesta ? { respuesta: faq.respuesta.trim() } : {}),
    }))
}

function upsertFaqSection(secciones = [], faqs = []) {
  const faqSection = {
    _key: "legacy-faqs",
    _type: "seccionFaq",
    titulo: "Preguntas frecuentes",
    items: normalizeFaqs(faqs),
  }

  let replaced = false
  const nextSections = (secciones ?? []).flatMap((section) => {
    if (section?._type !== "seccionFaq") {
      return section
    }

    if (replaced) {
      return []
    }

    replaced = true
    return {
      ...section,
      _key: section._key ?? "legacy-faqs",
      titulo: section.titulo?.trim() || "Preguntas frecuentes",
      items: faqSection.items,
    }
  })

  if (!replaced) {
    const ctaIndex = nextSections.findIndex((section) => section?._type === "seccionCta")

    if (ctaIndex === -1) {
      nextSections.push(faqSection)
    } else {
      nextSections.splice(ctaIndex, 0, faqSection)
    }
  }

  return nextSections
}

async function main() {
  const { projectId, dataset } = getSanityConfig()
  const token = getWriteToken()

  if (!token) {
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

  const ids = productCatalog.flatMap((product) => {
    const publishedId = createDocId(product.segmento, product.slug)
    return [publishedId, `drafts.${publishedId}`]
  })

  const existingDocs = await client.fetch(
    `*[_type == "producto" && _id in $ids]{_id, secciones}`,
    { ids }
  )

  const docsById = new Map(existingDocs.map((doc) => [doc._id, doc]))
  const missingIds = []
  const mutations = []

  for (const product of productCatalog) {
    const publishedId = createDocId(product.segmento, product.slug)
    const candidateIds = [publishedId, `drafts.${publishedId}`]

    for (const docId of candidateIds) {
      const existingDoc = docsById.get(docId)

      if (!existingDoc) {
        missingIds.push(docId)
        continue
      }

      mutations.push({
        id: docId,
        secciones: upsertFaqSection(existingDoc.secciones, product.faqs ?? []),
      })
    }
  }

  console.log(
    `Found ${existingDocs.length} existing producto docs. Prepared ${mutations.length} FAQ patches.`
  )

  if (missingIds.length > 0) {
    console.log(`Missing docs (${missingIds.length}):`)
    for (const docId of missingIds) {
      console.log(`- ${docId}`)
    }
  }

  if (dryRun) {
    for (const mutation of mutations) {
      console.log(`- patch ${mutation.id}`)
    }
    return
  }

  let transaction = client.transaction()

  for (const mutation of mutations) {
    transaction = transaction.patch(mutation.id, {
      set: {
        secciones: mutation.secciones,
      },
    })
  }

  await transaction.commit()
  console.log("FAQ sync committed to Sanity.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
