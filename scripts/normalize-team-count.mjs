/**
 * Normaliza teamCount a "+20" en todos los documentos de Sanity
 * que tengan secciones CTA con valores distintos.
 *
 * Uso:
 *   SANITY_API_WRITE_TOKEN=... node scripts/normalize-team-count.mjs
 */

import { createClient } from '@sanity/client'

const CANONICAL_TEAM_COUNT = '+20'

const client = createClient({
  projectId: 'hvh56bbh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('Falta SANITY_API_WRITE_TOKEN en el entorno.')
  process.exit(1)
}

async function run() {
  // Find all home pages and product pages with CTA sections containing teamCount
  const homes = await client.fetch(
    `*[_type == "paginaHome" && defined(secciones)]{_id, segmento, secciones}`
  )
  const products = await client.fetch(
    `*[_type == "producto" && defined(secciones)]{_id, nombre, secciones}`
  )

  let patchCount = 0

  for (const doc of [...homes, ...products]) {
    const secciones = doc.secciones ?? []
    let needsPatch = false

    const updated = secciones.map((section) => {
      if (
        section._type === 'seccionCta' &&
        section.teamCount &&
        section.teamCount.trim() !== CANONICAL_TEAM_COUNT
      ) {
        needsPatch = true
        return { ...section, teamCount: CANONICAL_TEAM_COUNT }
      }
      return section
    })

    if (needsPatch) {
      const label = doc.nombre || doc.segmento || doc._id
      console.log(`Patching ${doc._id} (${label}): normalizing teamCount → ${CANONICAL_TEAM_COUNT}`)
      await client.patch(doc._id).set({ secciones: updated }).commit()
      patchCount++
    }
  }

  console.log(`Done. Patched ${patchCount} document(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
