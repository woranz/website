"use client"

import { CheckCircle, Download, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"

const ID_IMPRESION = {
  polizaAP: 0,
  coberturaAP: 361,
}

function ExitoContent() {
  const searchParams = useSearchParams()
  const idEmision = searchParams.get("id")
  const email = searchParams.get("email") ?? ""

  const [phase, setPhase] = useState(0) // 0=confirming, 1=fetching docs, 2=done
  const [error, setError] = useState("")
  const [polizaNumber, setPolizaNumber] = useState("")
  const [polizaUrl, setPolizaUrl] = useState("")
  const [coberturaUrl, setCoberturaUrl] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const processStarted = useRef(false)

  useEffect(() => {
    if (!idEmision || processStarted.current) return
    processStarted.current = true

    const run = async () => {
      try {
        // Phase 1: Confirm propuesta
        setPhase(0)
        const confirmRes = await fetch("/api/ap/propuesta/confirmar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idEmision }),
        }).then((r) => r.json())

        if (confirmRes.error) {
          setError(confirmRes.error)
          return
        }

        if (confirmRes.data?.numeroPoliza) {
          setPolizaNumber(String(confirmRes.data.numeroPoliza))
        }

        // Phase 2: Send email + fetch documents
        setPhase(1)

        // Send email (fire and forget)
        if (email) {
          fetch(
            `/api/ap/documentos/email?idEmision=${idEmision}&email=${encodeURIComponent(email)}&idImpresion=${ID_IMPRESION.coberturaAP}`
          )
            .then((r) => r.json())
            .then(() => setEmailSent(true))
            .catch(() => {})
        }

        // Fetch document URLs
        const [polizaRes, coberturaRes] = await Promise.all([
          fetch(
            `/api/ap/documentos?idEmision=${idEmision}&idImpresion=${ID_IMPRESION.polizaAP}`
          ).then((r) => r.json()),
          fetch(
            `/api/ap/documentos?idEmision=${idEmision}&idImpresion=${ID_IMPRESION.coberturaAP}`
          ).then((r) => r.json()),
        ])

        if (polizaRes.data) setPolizaUrl(polizaRes.data)
        if (coberturaRes.data) setCoberturaUrl(coberturaRes.data)

        setPhase(2)
      } catch {
        setError("Hubo un error al procesar tu póliza. Contactanos para ayudarte.")
      }
    }

    run()
  }, [idEmision, email])

  if (!idEmision) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-20 text-center">
        <p className="text-sm text-woranz-text">
          No se encontró información del pago.
        </p>
        <Link
          href="/personas/coberturas/accidentes-personales"
          className="text-sm font-medium text-woranz-ink hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <CheckCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <h2 className="font-display text-2xl text-woranz-ink">
          Tu póliza fue emitida
        </h2>
        <p className="text-sm text-woranz-text">
          {error}
        </p>
        <Link
          href="/personas/coberturas/accidentes-personales"
          className="mt-4 text-sm font-medium text-woranz-ink hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 py-20 text-center">
      {phase === 0 && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-woranz-ink" />
          <h2 className="font-display text-2xl text-woranz-ink">
            Confirmando tu póliza...
          </h2>
          <p className="text-sm text-woranz-text">
            Dame unos segundos para aprobar tu póliza.
          </p>
        </>
      )}

      {phase === 1 && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-woranz-ink" />
          <h2 className="font-display text-2xl text-woranz-ink">
            ¡Ya estás cubierto!
          </h2>
          {polizaNumber && (
            <p className="text-sm text-woranz-text">
              Póliza #{polizaNumber}
            </p>
          )}
          <p className="text-sm text-woranz-text">
            Generando tu documentación...
          </p>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl text-woranz-ink">
            ¡Todo listo!
          </h2>
          {polizaNumber && (
            <p className="text-base font-medium text-woranz-ink">
              Póliza #{polizaNumber}
            </p>
          )}

          {emailSent && email && (
            <p className="text-sm text-woranz-text">
              Te enviamos la documentación a {email}
            </p>
          )}

          <div className="mt-2 flex w-full flex-col gap-3">
            {polizaUrl && (
              <a
                href={polizaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-form flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Descargar póliza
              </a>
            )}
            {coberturaUrl && (
              <a
                href={coberturaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-field border border-woranz-ink px-5 py-3 text-sm font-medium text-woranz-ink hover:bg-woranz-warm-1"
              >
                <ExternalLink className="h-4 w-4" /> Descargar certificado de
                cobertura
              </a>
            )}
          </div>

          {!polizaUrl && !coberturaUrl && (
            <p className="text-sm text-woranz-text">
              Tuvimos un problema al generar la documentación. Comunicate con
              nosotros para que podamos enviártela.
            </p>
          )}

          <div className="mt-4 flex flex-col items-center gap-2">
            <Link
              href="/personas/coberturas/accidentes-personales"
              className="text-sm font-medium text-woranz-ink hover:underline"
            >
              Volver al inicio
            </Link>
            <a
              href="https://woranz.com/soporte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-woranz-muted hover:underline"
            >
              ¿Necesitás ayuda? Contactanos
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default function ExitoPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-woranz-muted" />
            </div>
          }
        >
          <ExitoContent />
        </Suspense>
      </main>
    </div>
  )
}
