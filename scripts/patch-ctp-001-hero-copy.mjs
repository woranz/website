/**
 * CTP-001 — Update hero copy for caucion-turismo-estudiantil (personas).
 *
 * Patches headline and subtitulo in Sanity to align with woranz-copy
 * and woranz-productos tone guidance (speak to parent, clarify this
 * is agency-compliance backing, not personal travel coverage).
 *
 * Usage:
 *   node scripts/patch-ctp-001-hero-copy.mjs --dry-run   # preview
 *   node scripts/patch-ctp-001-hero-copy.mjs              # apply
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

/* ── Patch ───────────────────────────────────────────────────── */

async function main() {
  const { projectId, dataset } = getSanityConfig()
  const token = dryRun ? undefined : getWriteToken()
  if (!dryRun && !token) throw new Error("Missing Sanity credentials")

  const client = createClient({ projectId, dataset, apiVersion: API_VERSION, useCdn: false, token })

  const id = "producto-personas-caucion-turismo-estudiantil"

  console.log(`\n${dryRun ? "DRY RUN" : "APPLYING"} CTP-001 hero copy patch\n`)

  // Fetch current values for logging
  const doc = await client.getDocument(id)
  if (!doc) {
    console.error(`Document ${id} not found in Sanity`)
    process.exit(1)
  }

  console.log(`  Current headline:  "${doc.headline ?? "(empty)"}"`)
  console.log(`  Current subtitulo: "${doc.subtitulo ?? "(empty)"}"`)

  const newHeadline = "El viaje que tu hijo espera, con respaldo real."
  const newSubtitulo = "Antes de pagar, podés verificar que la agencia tenga nuestro seguro para que, si algo no se cumple, tengas un respaldo."

  console.log(`  New headline:      "${newHeadline}"`)
  console.log(`  New subtitulo:     "${newSubtitulo}"`)

  if (dryRun) {
    console.log("\n  (dry run — no changes applied)\n")
    return
  }

  await client.patch(id).set({
    headline: newHeadline,
    subtitulo: newSubtitulo,
  }).commit()

  console.log("\n  ✅ Patch applied successfully\n")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
