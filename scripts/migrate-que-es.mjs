import { readFileSync } from "node:fs"
import { createClient } from "@sanity/client"

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

const dryRun = process.argv.includes("--dry-run")

// Source inventory from QES-001-source-inventory.md
// Each entry: [segmento/slug, body text]
const queEsContent = new Map([
  ["personas/caucion-alquiler", "El seguro de caución de alquiler es la forma más directa de resolver una garantía sin depender de terceros. Reemplaza al garante tradicional con una póliza emitida por una compañía de seguros, que respalda al propietario durante todo el contrato.\n\nHoy es una de las soluciones más utilizadas en Argentina para alquilar vivienda o locales, porque combina respaldo legal, aceptación del mercado y un proceso mucho más previsible para el inquilino."],
  ["personas/seguro-de-hogar", "El seguro de hogar cubre los riesgos más importantes que pueden afectar tu vivienda y tus bienes. Desde un incendio hasta un robo o un daño por agua, es la forma de proteger lo que construiste con tiempo y esfuerzo.\n\nHoy podés cotizarlo en el momento, ajustar coberturas según tu necesidad y tener una póliza activa sin procesos largos ni inspecciones."],
  ["personas/incendio", "El seguro de incendio protege el valor de tu vivienda o bienes frente a daños causados por fuego, explosión o eventos asociados. Es una cobertura esencial para quienes buscan resguardar su patrimonio ante eventos de alto impacto.\n\nPuede contratarse de forma independiente o como parte de un seguro integral, según el nivel de protección que necesites."],
  ["personas/accidentes-personales", "El seguro de accidentes personales te protege frente a situaciones inesperadas que pueden afectar tu salud o tu capacidad de generar ingresos. Funciona dentro y fuera del trabajo, y se adapta a tu actividad.\n\nEs una de las coberturas más directas y necesarias, especialmente para quienes no tienen respaldo ante imprevistos o trabajan de forma independiente."],
  ["personas/caucion-turismo-estudiantil", "El seguro de caución de turismo estudiantil garantiza que la agencia cumpla con el viaje contratado. Es una cobertura obligatoria que protege a los estudiantes y sus familias frente a incumplimientos.\n\nNo es un seguro de viaje, es una garantía concreta: si la agencia no cumple, hay una póliza que responde."],
  ["personas/robo-bici", "El seguro de bicicleta cubre uno de los bienes más expuestos en la vida urbana. Es una solución pensada para quienes usan la bici todos los días y no pueden quedarse sin ella.\n\nLa cobertura se adapta al valor del rodado y al uso que le das."],
  ["personas/robo-celular", "El seguro de celular protege frente al robo del dispositivo, uno de los riesgos más frecuentes en el uso cotidiano. Permite reponer el equipo o recuperar su valor económico.\n\nEs una cobertura simple, pensada para resolver rápido un problema muy común."],
  ["personas/robo-notebook", "El seguro de notebook cubre la pérdida económica ante el robo de equipos portátiles. Es especialmente relevante para quienes trabajan, estudian o generan ingresos con su computadora.\n\nPermite seguir operando sin tener que absorber un costo alto de reposición."],
  ["empresas/seguro-de-vida-empresas", "El seguro de vida colectivo permite cubrir a todo tu equipo bajo una única póliza, adaptada tanto a obligaciones legales como a decisiones estratégicas de la empresa.\n\nNo es un producto único: es una estructura que combina distintas coberturas según el tipo de empleado, convenio y nivel de protección que quieras ofrecer. Bien armado, no solo cumple con la ley, sino que se convierte en una herramienta concreta de gestión de personas."],
  ["empresas/vida-saldo-deudor", "El seguro de vida saldo deudor cubre el saldo pendiente de una deuda en caso de fallecimiento o incapacidad del titular. Es utilizado por entidades financieras, empresas y organizaciones que otorgan crédito.\n\nPermite asegurar la continuidad del sistema de financiamiento, evitando que una deuda se transforme en un problema para la familia o para la empresa."],
  ["empresas/accidentes-personales", "El seguro de accidentes personales para empresas amplía la protección de tu equipo más allá de la ART, cubriendo accidentes tanto laborales como fuera del trabajo.\n\nEs una solución flexible que permite definir capitales por empleado y cubrir situaciones que impactan directamente en la continuidad operativa."],
  ["empresas/seguro-de-sepelio", "El seguro de sepelio colectivo brinda cobertura y asistencia ante el fallecimiento de un empleado o miembro del grupo asegurado, resolviendo la gestión del servicio o reintegrando los gastos.\n\nEs un complemento natural del seguro de vida, que simplifica un proceso sensible para la familia y la organización."],
  ["empresas/cauciones-tradicionales", "El seguro de caución es la herramienta que permite garantizar obligaciones frente a terceros sin inmovilizar fondos ni depender de avales bancarios.\n\nNo es un producto único, sino una familia completa de garantías que acompañan todo el ciclo de un contrato: desde la licitación hasta su ejecución y cierre."],
  ["empresas/garantias-aduaneras", "Las cauciones aduaneras permiten garantizar obligaciones frente a la Aduana sin afectar la capacidad financiera de la empresa. Son clave para importadores, exportadores y operadores logísticos.\n\nReemplazan garantías tradicionales y agilizan la operatoria en comercio exterior."],
  ["empresas/caucion-judicial", "El seguro de caución judicial permite cumplir con las garantías exigidas en procesos judiciales sin afectar el capital de la empresa.\n\nEs utilizado en embargos, apelaciones y contracautelas, facilitando la continuidad operativa mientras el proceso sigue su curso."],
  ["empresas/caucion-turismo-estudiantil-agencias", "El seguro de caución de turismo estudiantil es obligatorio para agencias y garantiza el cumplimiento de los viajes contratados por los estudiantes.\n\nEs un diferencial clave frente al cliente final y un requisito regulatorio que debe cumplirse para operar."],
  ["empresas/caucion-alquiler-comercial", "El seguro de caución de alquiler comercial reemplaza el depósito en garantía y permite a las empresas alquilar espacios sin afectar su capital de trabajo.\n\nEs una solución cada vez más utilizada en oficinas, locales y depósitos."],
  ["empresas/integral-de-comercio", "El seguro integral de comercio combina distintas coberturas para proteger el local, la mercadería y la actividad frente a los principales riesgos.\n\nEs una solución pensada para simplificar la gestión y evitar múltiples pólizas separadas."],
  ["empresas/integral-de-consorcio", "El seguro integral de consorcio protege edificios y espacios comunes frente a daños materiales y responsabilidad civil.\n\nEs una cobertura clave para administradores y consorcios que buscan ordenar riesgos en un solo contrato."],
  ["empresas/responsabilidad-civil", "El seguro de responsabilidad civil cubre los daños que una empresa puede ocasionar a terceros en el desarrollo de su actividad.\n\nEs una de las coberturas más relevantes para cualquier operación, ya que protege el patrimonio ante reclamos."],
  ["empresas/incendio", "El seguro de incendio para empresas protege inmuebles, instalaciones y bienes frente a daños por fuego y eventos asociados.\n\nEs una cobertura base para industrias, depósitos y comercios que buscan resguardar su capital."],
  ["empresas/aeronavegacion", "El seguro de aeronavegación cubre los riesgos asociados a la operación de aeronaves, incluyendo daños al equipo, responsabilidad civil y pasajeros.\n\nEs una cobertura especializada que requiere conocimiento técnico y capacidad de suscripción."],
  ["empresas/hecho-por-humanos", "Hecho por humanos es una caución que asegura que un contenido, proceso o interacción fue realizado, validado o supervisado por una persona.\n\nEn un contexto donde muchas tareas pueden automatizarse, este producto permite garantizar intervención humana real cuando el criterio, la responsabilidad o la autoría importan."],
  ["empresas/responsabilidad-civil-uso-ia", "La Responsabilidad Civil por uso de IA es un seguro pensado para empresas y profesionales que incorporan inteligencia artificial en su operación diaria.\n\nProtege frente a reclamos de terceros cuando el uso de herramientas automatizadas genera errores, información incorrecta o decisiones que producen un perjuicio."],
])

async function main() {
  const products = await client.fetch(
    '*[_type == "producto" && !(_id in path("drafts.**"))]{ _id, segmento, slug, secciones }'
  )

  console.log(`Found ${products.length} published products.`)

  let added = 0
  let skipped = 0
  let notMapped = 0

  for (const doc of products) {
    const slug = doc.slug?.current
    const segmento = doc.segmento
    if (!slug || !segmento) continue

    const key = `${segmento}/${slug}`
    const body = queEsContent.get(key)

    if (!body) {
      notMapped++
      continue
    }

    // Check if seccionExplicacion already exists
    const hasExplicacion = (doc.secciones ?? []).some(
      (s) => s._type === "seccionExplicacion"
    )

    if (hasExplicacion) {
      console.log(`  SKIP ${key} — already has seccionExplicacion`)
      skipped++
      continue
    }

    const queEsBlock = {
      _key: "que-es",
      _type: "seccionExplicacion",
      titulo: "Qué es",
      cuerpo: body,
    }

    // Insert after the first section (usually cotizador), or at the start
    const secciones = doc.secciones ?? []

    if (dryRun) {
      const pos = secciones.length > 0 ? "after first section" : "as first section"
      console.log(`  DRY ${key} — would insert ${pos}`)
      added++
      continue
    }

    const patch = client.patch(doc._id)
    if (secciones.length > 0) {
      patch.insert("after", "secciones[0]", [queEsBlock])
    } else {
      patch.set({ secciones: [queEsBlock] })
    }
    await patch.commit()

    console.log(`  ADD ${key}`)
    added++
  }

  console.log(`\nDone. Added: ${added}, Skipped: ${skipped}, Not mapped: ${notMapped}`)
  if (dryRun) console.log("(dry run — no changes written)")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
