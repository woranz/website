import { readFileSync } from "node:fs"
import { createClient } from "@sanity/client"
import { buildProductSectionsFromLegacy } from "./lib/product-sections.mjs"

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

const catalog = JSON.parse(
  readFileSync(new URL("../data/product-catalog.json", import.meta.url), "utf8")
)

function buildCatalogMap() {
  return new Map(
    catalog.map((product) => [`${product.segmento}/${product.slug}`, product])
  )
}

function parseProductRoute(link = "") {
  const parts = link.split("/").filter(Boolean)
  if (parts.length >= 3 && parts[1] === "coberturas") {
    return { segmento: parts[0], slug: parts[2] }
  }
  if (parts.length >= 2) {
    return { segmento: parts[0], slug: parts[parts.length - 1] }
  }
  return null
}

function buildCardImageMap(cards) {
  const map = new Map()
  for (const card of cards) {
    const route = parseProductRoute(card.link)
    if (!route || !card.imagen) continue
    map.set(`${route.segmento}/${route.slug}`, card.imagen)
  }
  return map
}

function buildLegacySource(doc, catalogEntry) {
  return {
    cotizador: doc.cotizador ?? catalogEntry?.cotizador,
    variantes: doc.variantes ?? catalogEntry?.variantes,
    requisitos: doc.requisitos ?? catalogEntry?.requisitos,
    coberturas: doc.coberturas ?? catalogEntry?.coberturas,
    pasos: doc.pasos ?? catalogEntry?.pasos,
    faqs: doc.faqs ?? catalogEntry?.faqs,
    ctaTitulo: doc.ctaTitulo ?? catalogEntry?.ctaTitulo,
    ctaSubtitulo: doc.ctaSubtitulo ?? catalogEntry?.ctaSubtitulo,
    ctaPrimario: doc.ctaPrimario ?? catalogEntry?.ctaPrimario,
    ctaSecundario: doc.ctaSecundario ?? catalogEntry?.ctaSecundario,
    productosRelacionados:
      doc.productosRelacionados ??
      (catalogEntry?.productosRelacionados ?? []).map((key, index) => ({
        _key: `producto-relacionado-${index}`,
        _type: "reference",
        _ref: `producto-${key.replace("/", "-")}`,
      })),
  }
}

function createNormalizedProduct(doc, catalogEntry, cardImage) {
  const slug = doc.slug?.current ?? catalogEntry?.slug
  const segmento = doc.segmento ?? catalogEntry?.segmento

  return {
    _id: doc._id,
    _type: "producto",
    nombre: doc.nombre ?? catalogEntry?.nombre,
    segmento,
    destacado: doc.destacado ?? catalogEntry?.destacado ?? false,
    orden: doc.orden ?? catalogEntry?.orden ?? 999,
    slug: { _type: "slug", current: slug },
    ...(doc.badge ?? catalogEntry?.badge ? { badge: doc.badge ?? catalogEntry.badge } : {}),
    ...(doc.navIcon ? { navIcon: doc.navIcon } : {}),
    headline: doc.headline ?? catalogEntry?.headline,
    ...(doc.subtitulo ?? catalogEntry?.subtitulo
      ? { subtitulo: doc.subtitulo ?? catalogEntry.subtitulo }
      : {}),
    ...(doc.heroImage ? { heroImage: doc.heroImage } : {}),
    ...(cardImage ?? doc.cardImage ?? doc.heroImage
      ? { cardImage: cardImage ?? doc.cardImage ?? doc.heroImage }
      : {}),
    ...(doc.ctaPrimario ?? catalogEntry?.ctaPrimario
      ? { ctaPrimario: doc.ctaPrimario ?? catalogEntry.ctaPrimario }
      : {}),
    ...(doc.ctaSecundario ?? catalogEntry?.ctaSecundario
      ? { ctaSecundario: doc.ctaSecundario ?? catalogEntry.ctaSecundario }
      : {}),
    secciones:
      doc.secciones && doc.secciones.length > 0
        ? doc.secciones
        : buildProductSectionsFromLegacy(buildLegacySource(doc, catalogEntry)),
    ...(doc.pendientesValidacion ? { pendientesValidacion: doc.pendientesValidacion } : {}),
  }
}

async function main() {
  const [products, cards] = await Promise.all([
    client.fetch('*[_type == "producto" || (_id in path("drafts.**") && _type == "producto")]'),
    client.fetch('*[_type == "productoCard"]'),
  ])

  const catalogMap = buildCatalogMap()
  const cardImageMap = buildCardImageMap(cards)

  console.log(`Migrating ${products.length} product docs with ${cards.length} productoCard docs.`)

  for (const doc of products) {
    const slug = doc.slug?.current
    const segmento = doc.segmento
    const key = slug && segmento ? `${segmento}/${slug}` : null
    const catalogEntry = key ? catalogMap.get(key) : undefined
    const cardImage = key ? cardImageMap.get(key) : undefined
    const normalized = createNormalizedProduct(doc, catalogEntry, cardImage)
    await client.createOrReplace(normalized)
    console.log(`Updated ${doc._id}`)
  }

  for (const card of cards) {
    await client.delete(card._id)
    console.log(`Deleted legacy card ${card._id}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
