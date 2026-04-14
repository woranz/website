"use client"

import { type ChangeEvent, useState } from "react"
import { Loader2, Sparkles, Trash2, Upload } from "lucide-react"

export type ExtractionStatus = "idle" | "extracting" | "done" | "error"

type StepUploadProps = {
  archivos: File[]
  onArchivosChange: (files: File[]) => void
  extractionStatus: ExtractionStatus
  onExtract: (files: File[]) => void
  onSkip: () => void
}

export function StepUpload({
  archivos,
  onArchivosChange,
  extractionStatus,
  onExtract,
  onSkip,
}: StepUploadProps) {
  const [fileError, setFileError] = useState("")

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    const combined = [...archivos, ...newFiles].slice(0, 5)
    const totalSize = combined.reduce((sum, f) => sum + f.size, 0)
    if (totalSize > 10 * 1024 * 1024) {
      setFileError("Los archivos no pueden superar 10MB en total.")
      return
    }
    setFileError("")
    onArchivosChange(combined)
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    onArchivosChange(archivos.filter((_, i) => i !== index))
  }

  const isExtracting = extractionStatus === "extracting"

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-woranz-line bg-woranz-warm-1 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-woranz-yellow" />
          <div>
            <p className="text-sm font-semibold text-woranz-ink">
              Subí tus documentos, nosotros leemos
            </p>
            <p className="mt-1 text-sm text-woranz-text">
              Póliza vigente, certificado de aeronavegabilidad o matrícula.
              Extraemos los datos y vos solo revisás.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-woranz-ink">
          Documentación
        </label>
        <p className="text-xs text-woranz-muted">
          Póliza vigente, certificado de aeronavegabilidad, certificado de
          matrícula, licencias de tripulación. PDF, JPG o PNG — máx 10MB total.
        </p>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-field border border-dashed border-woranz-border bg-woranz-warm-2 px-5 py-8 text-center transition-colors hover:border-woranz-muted">
          <Upload className="h-5 w-5 text-woranz-muted" />
          <span className="text-sm text-woranz-text">
            Hacé click para subir archivos
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {fileError && <p className="text-sm text-red-600">{fileError}</p>}

        {archivos.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {archivos.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg bg-woranz-warm-1 px-4 py-2.5"
              >
                <span className="truncate text-sm text-woranz-slate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 rounded text-woranz-muted transition-colors hover:text-woranz-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {extractionStatus === "error" && (
        <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
          No pudimos analizar los documentos automáticamente. Podés completar el
          formulario manualmente.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {archivos.length > 0 && (
          <button
            type="button"
            disabled={isExtracting}
            onClick={() => onExtract(archivos)}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-bold disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analizando documentos...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analizar y completar datos
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-woranz-text transition-colors hover:text-woranz-ink"
        >
          Completar manualmente sin documentos
        </button>
      </div>
    </div>
  )
}
