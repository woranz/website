'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  if (isPresentationTool) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-woranz-slate px-4 py-2 text-sm text-white shadow-lg hover:bg-woranz-slate/90 transition-colors"
    >
      Salir de preview
    </a>
  )
}
