/**
 * CAT bundle for empresas/cauciones-tradicionales.
 *
 * Applies:
 * - CAT-001: hero headline copy update
 * - CAT-002: variantes -> coberturas, shared CTA hrefs, icon metadata
 * - CAT-004: secondary CTAs scroll to coberturas, shared contact path
 * - CAT-005: ensure FAQ section exists
 * - CAT-006: populate related empresa products (excluding current product)
 *
 * Usage:
 *   node scripts/patch-cat-cauciones-tradicionales.mjs --dry-run
 *   node scripts/patch-cat-cauciones-tradicionales.mjs
 */

import { existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "@sanity/client"

const API_VERSION = "2024-01-01"
const dryRun = process.argv.includes("--dry-run")

const DOC_ID = "producto-empresas-cauciones-tradicionales"
const CONTACT_HREF = "/empresas/coberturas/cauciones-tradicionales/contacto"
const COVERAGES_HREF = "#coberturas"
const HERO_HEADLINE = "Todas las garantías que tu operación necesita."

const FAQ_ITEMS = [
  {
    _key: "faq-0",
    _type: "object",
    pregunta: "¿Qué entra dentro de cauciones tradicionales?",
    respuesta:
      "Entran garantías como mantenimiento de oferta, cumplimiento de contrato, anticipo financiero, fondo de reparo y otras cauciones ligadas a contratos y licitaciones.",
  },
  {
    _key: "faq-1",
    _type: "object",
    pregunta: "¿Sirven solo para obra pública?",
    respuesta:
      "No. También aplican a contratos privados, servicios, suministros y otras operatorias donde una parte exige garantía formal a la otra.",
  },
  {
    _key: "faq-2",
    _type: "object",
    pregunta: "¿Qué define si una caución es viable?",
    respuesta:
      "La calidad de la documentación, el tipo de obligación garantizada, el monto, el plazo y el respaldo técnico-financiero del solicitante.",
  },
  {
    _key: "faq-3",
    _type: "object",
    pregunta: "¿Qué documentación suelen pedir para analizarla?",
    respuesta:
      "Depende del tipo de caución, pero normalmente se revisan datos societarios, contrato o pliego, situación económica y antecedentes de la empresa.",
  },
  {
    _key: "faq-4",
    _type: "object",
    pregunta: "¿Qué gana la empresa frente a inmovilizar fondos?",
    respuesta:
      "Gana aire financiero y más capacidad para seguir licitando, contratar y operar sin bloquear capital en cada garantía.",
  },
]

const VARIANT_QUERY_VALUES = new Map([
  ["Garantía de mantenimiento de oferta", "mantenimiento-oferta"],
  ["Garantía de cumplimiento de contrato", "cumplimiento-contrato"],
  ["Garantía de anticipo financiero", "anticipo-financiero"],
  ["Garantía de fondo de reparo", "fondo-reparo"],
  ["Caución de suministro", "suministro"],
  ["Caución de servicios", "servicios"],
  ["Caución de actividad o profesión", "actividad-profesion"],
  ["Caución judicial", "judicial"],
])

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

function patchVariantSection(section) {
  if (section._type !== "seccionVariantes") {
    return section
  }

  return {
    ...section,
    titulo: "Coberturas",
    items: (section.items ?? []).map((item) => {
      const value = VARIANT_QUERY_VALUES.get(item.titulo) ?? ""
      const href = value
        ? `${CONTACT_HREF}?tipoCaucion=${encodeURIComponent(value)}`
        : CONTACT_HREF

      return {
        ...item,
        href,
        icono: value || item.icono || "servicios",
      }
    }),
  }
}

function ensureFaqSection(secciones) {
  const existingIndex = secciones.findIndex((section) => section._type === "seccionFaq")

  if (existingIndex >= 0) {
    return secciones
  }

  const faqSection = {
    _key: "legacy-faqs",
    _type: "seccionFaq",
    titulo: "Preguntas frecuentes",
    items: FAQ_ITEMS,
  }

  const ctaIndex = secciones.findIndex((section) => section._type === "seccionCta")
  const updated = [...secciones]

  if (ctaIndex >= 0) {
    updated.splice(ctaIndex, 0, faqSection)
    return updated
  }

  updated.push(faqSection)
  return updated
}

function ensureRelatedProductsSection(secciones, productRefs) {
  const existingIndex = secciones.findIndex(
    (section) => section._type === "seccionCarouselProductos"
  )

  const relatedSection = {
    _key: "legacy-relacionados",
    _type: "seccionCarouselProductos",
    titulo: "Más opciones para tu empresa",
    productos: productRefs,
  }

  const updated = [...secciones]

  if (existingIndex >= 0) {
    updated[existingIndex] = {
      ...updated[existingIndex],
      titulo: relatedSection.titulo,
      productos: relatedSection.productos,
    }
    return updated
  }

  const ctaIndex = updated.findIndex((section) => section._type === "seccionCta")
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
        _id,
        slug
      }`
    ),
  ])

  if (!doc) {
    throw new Error(`Document ${DOC_ID} not found`)
  }

  const relatedRefs = empresaProducts
    .filter((product) => product._id !== DOC_ID)
    .map((product, index) => toReference(product._id, index))

  let nextSections = (doc.secciones ?? []).map((section) => {
    if (section._type === "seccionCta") {
      return {
        ...section,
        ctaPrimario: {
          ...(section.ctaPrimario ?? {}),
          href: CONTACT_HREF,
          label: section.ctaPrimario?.label ?? "Solicitá tu caución",
        },
        ctaSecundario: {
          ...(section.ctaSecundario ?? {}),
          href: COVERAGES_HREF,
          label: section.ctaSecundario?.label ?? "Ver todas las garantías →",
        },
      }
    }

    return patchVariantSection(section)
  })

  nextSections = ensureFaqSection(nextSections)
  nextSections = ensureRelatedProductsSection(nextSections, relatedRefs)

  const patch = {
    headline: HERO_HEADLINE,
    ctaPrimario: {
      ...(doc.ctaPrimario ?? {}),
      href: CONTACT_HREF,
      label: doc.ctaPrimario?.label ?? "Solicitá tu caución",
    },
    ctaSecundario: {
      ...(doc.ctaSecundario ?? {}),
      href: COVERAGES_HREF,
      label: doc.ctaSecundario?.label ?? "Ver todas las garantías →",
    },
    secciones: nextSections,
  }

  console.log(`\n${dryRun ? "DRY RUN" : "APPLYING"} CAT patch for ${DOC_ID}\n`)
  console.log(`  headline: ${doc.headline ?? "(empty)"} -> ${patch.headline}`)
  console.log(`  related products: ${relatedRefs.length}`)

  if (dryRun) {
    console.log("\n  Preview:\n")
    console.log(JSON.stringify(patch, null, 2))
    return
  }

  await client.patch(DOC_ID).set(patch).commit()

  console.log("\n  ✅ Patch applied successfully\n")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
