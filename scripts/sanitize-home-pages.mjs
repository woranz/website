/**
 * Normaliza los documentos `paginaHome` para que respeten el schema actual.
 *
 * Uso:
 *   SANITY_WRITE_TOKEN=... node scripts/sanitize-home-pages.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'hvh56bbh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('Falta SANITY_WRITE_TOKEN en el entorno.')
  process.exit(1)
}

function sanitizeLink(link) {
  if (!link || typeof link !== 'object') return undefined

  const sanitized = {
    ...(link.label ? { label: String(link.label).trim() } : {}),
    ...(link.href ? { href: String(link.href).trim() } : {}),
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined
}

function sanitizeHeroFeature(feature, index) {
  if (!feature || typeof feature !== 'object') return null

  const icono = feature.icono ?? feature.icon
  const texto = feature.texto ?? feature.label

  if (!icono && !texto) return null

  return {
    _key: feature._key ?? `hero-feature-${index}`,
    ...(icono ? { icono: String(icono).trim() } : {}),
    ...(texto ? { texto: String(texto).trim() } : {}),
  }
}

function sanitizeReference(ref, index) {
  if (!ref?._ref) return null

  return {
    _key: ref._key ?? `ref-${index}`,
    _ref: ref._ref,
    _type: 'reference',
  }
}

function sanitizeStep(step, index) {
  if (!step || typeof step !== 'object') return null

  return {
    _key: step._key ?? `step-${index}`,
    ...(step.numero ? { numero: String(step.numero).trim() } : {}),
    ...(step.titulo ? { titulo: String(step.titulo).trim() } : {}),
    ...(step.descripcion ? { descripcion: String(step.descripcion).trim() } : {}),
  }
}

function sanitizeFeatureItem(item, index) {
  if (!item || typeof item !== 'object') return null

  const texto = item.texto ?? item.label
  const textoMobile = item.textoMobile ?? item.labelMobile

  if (!item.imagen && !texto && !textoMobile) return null

  return {
    _key: item._key ?? `feature-item-${index}`,
    ...(item.imagen ? { imagen: item.imagen } : {}),
    ...(texto ? { texto: String(texto).trim() } : {}),
    ...(textoMobile ? { textoMobile: String(textoMobile).trim() } : {}),
  }
}

function sanitizeSection(section, index) {
  if (!section || typeof section !== 'object' || !section._type) return null

  const base = {
    _key: section._key ?? `section-${index}`,
    _type: section._type,
    ...(section.titulo ? { titulo: String(section.titulo).trim() } : {}),
  }

  switch (section._type) {
    case 'seccionPasos': {
      const pasos = (section.pasos ?? [])
        .map(sanitizeStep)
        .filter(Boolean)

      return { ...base, ...(pasos.length > 0 ? { pasos } : {}) }
    }

    case 'seccionCarouselProductos':
    case 'seccionGridProductos': {
      const productos = (section.productos ?? [])
        .map(sanitizeReference)
        .filter(Boolean)

      return { ...base, ...(productos.length > 0 ? { productos } : {}) }
    }

    case 'seccionCarouselFeatures': {
      const items = (section.items ?? [])
        .map(sanitizeFeatureItem)
        .filter(Boolean)

      return { ...base, ...(items.length > 0 ? { items } : {}) }
    }

    case 'seccionCta':
      return {
        ...base,
        ...(section.tituloMobile
          ? { tituloMobile: String(section.tituloMobile).trim() }
          : {}),
        ...(section.descripcion
          ? { descripcion: String(section.descripcion).trim() }
          : {}),
        ...(section.teamCount ? { teamCount: String(section.teamCount).trim() } : {}),
        ...(section.teamLabel ? { teamLabel: String(section.teamLabel).trim() } : {}),
        ...(sanitizeLink(section.ctaPrimario)
          ? { ctaPrimario: sanitizeLink(section.ctaPrimario) }
          : {}),
        ...(sanitizeLink(section.ctaSecundario)
          ? { ctaSecundario: sanitizeLink(section.ctaSecundario) }
          : {}),
      }

    default:
      return null
  }
}

function sanitizeHomeDocument(doc) {
  const heroFeatures = (doc.heroFeatures ?? [])
    .map(sanitizeHeroFeature)
    .filter(Boolean)

  const secciones = (doc.secciones ?? [])
    .map(sanitizeSection)
    .filter(Boolean)

  return {
    _id: doc._id,
    _type: 'paginaHome',
    segmento: doc.segmento,
    ...(doc.heroTitulo ? { heroTitulo: String(doc.heroTitulo).trim() } : {}),
    ...(doc.heroSubtitulo ? { heroSubtitulo: String(doc.heroSubtitulo).trim() } : {}),
    ...(doc.heroSubtituloMobile
      ? { heroSubtituloMobile: String(doc.heroSubtituloMobile).trim() }
      : {}),
    ...(heroFeatures.length > 0 ? { heroFeatures } : {}),
    ...(doc.heroImagen ? { heroImagen: doc.heroImagen } : {}),
    ...(sanitizeLink(doc.ctaPrimario)
      ? { ctaPrimario: sanitizeLink(doc.ctaPrimario) }
      : {}),
    ...(sanitizeLink(doc.ctaSecundario)
      ? { ctaSecundario: sanitizeLink(doc.ctaSecundario) }
      : {}),
    ...(secciones.length > 0 ? { secciones } : {}),
    ...(doc.metaTitulo ? { metaTitulo: String(doc.metaTitulo).trim() } : {}),
    ...(doc.metaDescripcion
      ? { metaDescripcion: String(doc.metaDescripcion).trim() }
      : {}),
  }
}

async function main() {
  const docs = await client.fetch(
    '*[_type == "paginaHome" || (_id in path("drafts.**") && _type == "paginaHome")]'
  )

  console.log(`Se encontraron ${docs.length} documentos paginaHome.`)

  for (const doc of docs) {
    const sanitized = sanitizeHomeDocument(doc)
    await client.createOrReplace(sanitized)
    console.log(`Normalizado ${doc._id}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
