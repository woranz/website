/**
 * Targeted Sanity patches for page-improvement backlog tasks.
 * Only modifies specific fields — does NOT replace full documents,
 * so existing Sanity-only data (e.g. Qué es sections) is preserved.
 *
 * Tasks applied:
 *   ICE-003  – badge on integral-de-comercio
 *   RCE-002  – remove variantes from responsabilidad-civil + update badge
 *   HGF-002  – remove variantes from seguro-de-hogar
 *   RBP-004  – normalize "Daños accidentales" label on robo-bici & robo-notebook
 *   RBP-005, RCP-004, RNP-004, CTP-002, APP-005, APE-004, ICE-002, INE-002
 *            – expand related products
 *   (bonus)  – add related products to incendio personas (had none)
 */

import { existsSync, readFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { createClient } from "@sanity/client"

const API_VERSION = "2024-01-01"
const dryRun = process.argv.includes("--dry-run")

/* ── Env / Auth ──────────────────────────────────────────────── */

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
  const envFromFile = readEnvFile(new URL("../.env.local", import.meta.url))
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? envFromFile.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? envFromFile.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) throw new Error("Missing Sanity project config")
  return { projectId, dataset }
}

function getWriteToken() {
  const configPath = path.join(os.homedir(), ".config", "sanity", "config.json")
  if (existsSync(configPath)) {
    try { return JSON.parse(readFileSync(configPath, "utf8")).authToken } catch {}
  }
  return process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN
}

/* ── Helpers ─────────────────────────────────────────────────── */

function docId(segmento, slug) {
  return `producto-${segmento}-${slug}`
}

function ref(segmento, slug) {
  return { _type: "reference", _ref: docId(segmento, slug) }
}

function buildRelatedSection(segmento, relatedRefs) {
  return {
    _key: "legacy-relacionados",
    _type: "seccionCarouselProductos",
    titulo: segmento === "empresas" ? "Más opciones para tu empresa" : "Más opciones para vos",
    productos: relatedRefs.map((r, i) => ({ ...r, _key: `producto-relacionado-${i}` })),
  }
}

/* ── Patch definitions ───────────────────────────────────────── */

async function patchBadge(client, segmento, slug, newBadge) {
  const id = docId(segmento, slug)
  console.log(`  [badge] ${id} → "${newBadge}"`)
  if (dryRun) return
  await client.patch(id).set({ badge: newBadge }).commit()
}

async function removeVariantes(client, segmento, slug) {
  const id = docId(segmento, slug)
  const doc = await client.getDocument(id)
  if (!doc?.secciones) { console.log(`  [skip] ${id} – no secciones`); return }

  const filtered = doc.secciones.filter((s) => s._type !== "seccionVariantes")
  if (filtered.length === doc.secciones.length) {
    console.log(`  [skip] ${id} – no variantes section found`)
    return
  }

  console.log(`  [variantes] ${id} – removing seccionVariantes`)
  if (dryRun) return
  await client.patch(id).set({ secciones: filtered }).commit()
}

async function patchRelatedProducts(client, segmento, slug, relatedRefs) {
  const id = docId(segmento, slug)
  const doc = await client.getDocument(id)
  if (!doc?.secciones) { console.log(`  [skip] ${id} – no secciones`); return }

  const newSection = buildRelatedSection(segmento, relatedRefs)
  const idx = doc.secciones.findIndex((s) => s._type === "seccionCarouselProductos")

  let updated
  if (idx >= 0) {
    updated = [...doc.secciones]
    updated[idx] = { ...updated[idx], productos: newSection.productos }
  } else {
    // Insert before CTA if exists, else append
    const ctaIdx = doc.secciones.findIndex((s) => s._type === "seccionCta")
    updated = [...doc.secciones]
    if (ctaIdx >= 0) {
      updated.splice(ctaIdx, 0, newSection)
    } else {
      updated.push(newSection)
    }
  }

  console.log(`  [related] ${id} – ${relatedRefs.length} products`)
  if (dryRun) return
  await client.patch(id).set({ secciones: updated }).commit()
}

async function patchCoberturaLabel(client, segmento, slug, oldTitle, newTitle) {
  const id = docId(segmento, slug)
  const doc = await client.getDocument(id)
  if (!doc?.secciones) { console.log(`  [skip] ${id} – no secciones`); return }

  let changed = false
  const updated = doc.secciones.map((section) => {
    if (section._type !== "seccionCobertura" || !section.items) return section
    return {
      ...section,
      items: section.items.map((item) => {
        if (item.titulo?.trim() === oldTitle) {
          changed = true
          return { ...item, titulo: newTitle }
        }
        return item
      }),
    }
  })

  if (!changed) {
    console.log(`  [skip] ${id} – "${oldTitle}" not found in coberturas`)
    return
  }

  console.log(`  [cobertura] ${id} – "${oldTitle}" → "${newTitle}"`)
  if (dryRun) return
  await client.patch(id).set({ secciones: updated }).commit()
}

/* ── Main ────────────────────────────────────────────────────── */

async function main() {
  const { projectId, dataset } = getSanityConfig()
  const token = dryRun ? undefined : getWriteToken()
  if (!dryRun && !token) throw new Error("Missing Sanity credentials")

  const client = createClient({ projectId, dataset, apiVersion: API_VERSION, useCdn: false, token })

  console.log(`\n${dryRun ? "DRY RUN" : "APPLYING"} page-improvement patches\n`)

  // ── ICE-003: badge ──
  console.log("ICE-003: integral-de-comercio badge")
  await patchBadge(client, "empresas", "integral-de-comercio", "Integral de Comercio")

  // ── RCE-002: remove variantes + badge ──
  console.log("RCE-002: responsabilidad-civil remove variantes + badge")
  await removeVariantes(client, "empresas", "responsabilidad-civil")
  await patchBadge(client, "empresas", "responsabilidad-civil", "Responsabilidad Civil")

  // ── HGF-002: remove variantes ──
  console.log("HGF-002: seguro-de-hogar remove variantes")
  await removeVariantes(client, "personas", "seguro-de-hogar")

  // ── RBP-004: cobertura label ──
  console.log("RBP-004: robo-bici daños accidentales label")
  await patchCoberturaLabel(client, "personas", "robo-bici", "Daños accidentales", "Daños accidentales (según plan)")
  await patchCoberturaLabel(client, "personas", "robo-notebook", "Daños accidentales", "Daños accidentales (según plan)")

  // ── Related products ──
  console.log("RBP-005: robo-bici related products")
  await patchRelatedProducts(client, "personas", "robo-bici", [
    ref("personas", "robo-celular"),
    ref("personas", "robo-notebook"),
    ref("personas", "robo-monopatin"),
    ref("personas", "seguro-de-hogar"),
    ref("personas", "incendio"),
  ])

  console.log("RCP-004: robo-celular related products")
  await patchRelatedProducts(client, "personas", "robo-celular", [
    ref("personas", "robo-bici"),
    ref("personas", "robo-notebook"),
    ref("personas", "robo-monopatin"),
    ref("personas", "seguro-de-hogar"),
    ref("personas", "incendio"),
  ])

  console.log("RNP-004: robo-notebook related products")
  await patchRelatedProducts(client, "personas", "robo-notebook", [
    ref("personas", "robo-bici"),
    ref("personas", "robo-celular"),
    ref("personas", "robo-monopatin"),
    ref("personas", "seguro-de-hogar"),
    ref("personas", "incendio"),
  ])

  console.log("CTP-002: caucion-turismo related products")
  await patchRelatedProducts(client, "personas", "caucion-turismo-estudiantil", [
    ref("personas", "accidentes-personales"),
    ref("empresas", "caucion-turismo-estudiantil-agencias"),
    ref("personas", "robo-bici"),
    ref("personas", "robo-celular"),
    ref("personas", "robo-notebook"),
  ])

  console.log("APP-005: accidentes-personales personas related products")
  await patchRelatedProducts(client, "personas", "accidentes-personales", [
    ref("empresas", "seguro-de-vida-empresas"),
    ref("personas", "caucion-alquiler"),
    ref("personas", "seguro-de-hogar"),
    ref("personas", "incendio"),
    ref("personas", "robo-bici"),
    ref("personas", "robo-celular"),
    ref("personas", "robo-notebook"),
  ])

  console.log("APE-004: accidentes-personales empresas related products")
  await patchRelatedProducts(client, "empresas", "accidentes-personales", [
    ref("empresas", "seguro-de-vida-empresas"),
    ref("empresas", "seguro-de-sepelio"),
    ref("empresas", "responsabilidad-civil"),
    ref("empresas", "integral-de-comercio"),
    ref("empresas", "incendio"),
  ])

  console.log("ICE-002: integral-de-comercio related products")
  await patchRelatedProducts(client, "empresas", "integral-de-comercio", [
    ref("empresas", "caucion-alquiler-comercial"),
    ref("empresas", "responsabilidad-civil"),
    ref("empresas", "incendio"),
    ref("empresas", "integral-de-consorcio"),
  ])

  console.log("INE-002: incendio empresas related products")
  await patchRelatedProducts(client, "empresas", "incendio", [
    ref("empresas", "integral-de-comercio"),
    ref("empresas", "integral-de-consorcio"),
    ref("empresas", "responsabilidad-civil"),
    ref("empresas", "aeronavegacion"),
  ])

  console.log("(bonus) incendio personas related products")
  await patchRelatedProducts(client, "personas", "incendio", [
    ref("personas", "seguro-de-hogar"),
    ref("personas", "caucion-alquiler"),
    ref("empresas", "incendio"),
  ])

  console.log("\nDone.\n")
}

main().catch((err) => { console.error(err); process.exit(1) })
