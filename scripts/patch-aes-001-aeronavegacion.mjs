import { existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "@sanity/client"

const API_VERSION = "2024-01-01"
const dryRun = process.argv.includes("--dry-run")

const DOC_ID = "producto-empresas-aeronavegacion"
const BADGE = "Aeronavegación"
const PRIMARY_CTA_LABEL = "Hablá con un especialista"
const QUOTE_SECTION_TITLE = "Hablá con un especialista"
const QUOTE_SECTION_DESCRIPTION = "Completá el formulario y te contactamos en menos de 24hs."
const QUOTE_SECTION_FORM_ID = "aeronavegacion"
const RELATED_PRODUCTS_TITLE = "Más opciones para tu empresa"

function readEnvFile(filePath) {
  if (!existsSync(filePath)) return {}

  return readFileSync(filePath, "utf8")
    .split("\n")
    .reduce((env, line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) return env

      const separatorIndex = trimmed.indexOf("=")
      if (separatorIndex === -1) return env

      env[trimmed.slice(0, separatorIndex).trim()] = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "")

      return env
    }, {})
}

function getSanityConfig() {
  const envFromFile = readEnvFile(new URL("../.env.local", import.meta.url))
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
    envFromFile.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ??
    envFromFile.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    throw new Error("Missing Sanity project config")
  }

  return { dataset, projectId }
}

function getWriteToken() {
  const configPath = path.join(os.homedir(), ".config", "sanity", "config.json")

  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, "utf8")).authToken
    } catch {}
  }

  return process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN
}

function toReference(productId, index) {
  return {
    _key: `producto-relacionado-${index}`,
    _ref: productId,
    _type: "reference",
  }
}

function reorderExplicacionBeforeCobertura(secciones) {
  const explicacionIndex = secciones.findIndex(
    (section) => section._type === "seccionExplicacion"
  )
  const coberturaIndex = secciones.findIndex(
    (section) => section._type === "seccionCobertura"
  )

  if (
    explicacionIndex === -1 ||
    coberturaIndex === -1 ||
    explicacionIndex < coberturaIndex
  ) {
    return secciones
  }

  const updated = [...secciones]
  const [explicacionSection] = updated.splice(explicacionIndex, 1)
  const nextCoberturaIndex = updated.findIndex(
    (section) => section._type === "seccionCobertura"
  )

  updated.splice(nextCoberturaIndex, 0, explicacionSection)
  return updated
}

function ensureQuoteSection(secciones) {
  const quoteIndex = secciones.findIndex(
    (section) => section._type === "seccionCotizador"
  )
  const quoteSection = {
    _key: "aeronavegacion-contacto",
    _type: "seccionCotizador",
    titulo: QUOTE_SECTION_TITLE,
    descripcion: QUOTE_SECTION_DESCRIPTION,
    modo: "contacto",
    formConfigId: QUOTE_SECTION_FORM_ID,
    maxWidth: "default",
    mostrarPasosMobile: false,
    pasos: [],
  }

  const updated = [...secciones]

  if (quoteIndex >= 0) {
    updated[quoteIndex] = {
      ...updated[quoteIndex],
      ...quoteSection,
      _key: updated[quoteIndex]._key || quoteSection._key,
    }
    return updated
  }

  updated.unshift(quoteSection)
  return updated
}

function ensureCanonicalOrder(secciones) {
  const order = [
    "seccionCotizador",
    "seccionExplicacion",
    "seccionCobertura",
    "seccionFaq",
    "seccionCarouselProductos",
    "seccionCta",
  ]

  const buckets = new Map(order.map((type) => [type, []]))
  const extras = []

  for (const section of secciones) {
    if (buckets.has(section._type)) {
      buckets.get(section._type).push(section)
    } else {
      extras.push(section)
    }
  }

  return [
    ...order.flatMap((type) => buckets.get(type) ?? []),
    ...extras,
  ]
}

function ensureRelatedProductsSection(secciones, productRefs) {
  const relatedIndex = secciones.findIndex(
    (section) => section._type === "seccionCarouselProductos"
  )
  const relatedSection = {
    _key: "legacy-relacionados",
    _type: "seccionCarouselProductos",
    titulo: RELATED_PRODUCTS_TITLE,
    productos: productRefs,
  }

  const updated = [...secciones]

  if (relatedIndex >= 0) {
    updated[relatedIndex] = {
      ...updated[relatedIndex],
      titulo: RELATED_PRODUCTS_TITLE,
      productos: productRefs,
    }
    return updated
  }

  const faqIndex = updated.findIndex((section) => section._type === "seccionFaq")
  const ctaIndex = updated.findIndex((section) => section._type === "seccionCta")

  if (faqIndex >= 0) {
    updated.splice(faqIndex, 0, relatedSection)
    return updated
  }

  if (ctaIndex >= 0) {
    updated.splice(ctaIndex, 0, relatedSection)
    return updated
  }

  updated.push(relatedSection)
  return updated
}

async function main() {
  const { projectId, dataset } = getSanityConfig()
  const token = dryRun ? undefined : getWriteToken()

  if (!dryRun && !token) {
    throw new Error("Missing Sanity credentials")
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    token,
  })

  const [doc, empresaProducts] = await Promise.all([
    client.getDocument(DOC_ID),
    client.fetch(
      `*[
        _type == "producto" &&
        segmento == "empresas" &&
        count(coalesce(pendientesValidacion, [])) == 0
      ] | order(coalesce(orden, 999) asc, nombre asc) {
        _id
      }`
    ),
  ])

  if (!doc) {
    throw new Error(`Document ${DOC_ID} not found`)
  }

  const relatedRefs = empresaProducts
    .filter((product) => product._id !== DOC_ID)
    .map((product, index) => toReference(product._id, index))

  const currentSections = doc.secciones ?? []
  const quoteReadySections = ensureQuoteSection(currentSections)
  const reorderedSections = reorderExplicacionBeforeCobertura(quoteReadySections)
  const relatedReadySections = ensureRelatedProductsSection(
    reorderedSections,
    relatedRefs
  ).map((section) => {
    if (section._type !== "seccionCta") {
      return section
    }

    return {
      ...section,
      ctaPrimario: {
        ...(section.ctaPrimario ?? {}),
        label: PRIMARY_CTA_LABEL,
        href: "#cotizador",
      },
      ocultarCtaSecundario: true,
    }
  })
  const nextSections = ensureCanonicalOrder(relatedReadySections)

  const beforeOrder = currentSections.map((section) => section._type)
  const afterOrder = nextSections.map((section) => section._type)

  console.log(`Document: ${DOC_ID}`)
  console.log(`Section order before: ${beforeOrder.join(" -> ")}`)
  console.log(`Section order after:  ${afterOrder.join(" -> ")}`)
  console.log(`Related products count before: ${
    currentSections.find((section) => section._type === "seccionCarouselProductos")
      ?.productos?.length ?? 0
  }`)
  console.log(`Related products count after:  ${relatedRefs.length}`)

  if (dryRun) {
    console.log(`Badge after: ${BADGE}`)
    console.log(`Hero primary CTA after: ${PRIMARY_CTA_LABEL} -> #cotizador`)
    console.log("Hero secondary CTA after: hidden")
    console.log("\n(dry run — no changes written)")
    return
  }

  await client.patch(DOC_ID).set({
    badge: BADGE,
    ctaPrimario: {
      ...(doc.ctaPrimario ?? {}),
      label: PRIMARY_CTA_LABEL,
      href: "#cotizador",
    },
    ocultarCtaSecundario: true,
    secciones: nextSections,
  }).commit()
  console.log("\nPatch applied.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
