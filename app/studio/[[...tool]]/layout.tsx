import { buildPageMetadata } from "@/lib/metadata"

export const metadata = buildPageMetadata({
  title: "Woranz CMS",
  description: "Panel de administración de contenido",
  canonicalPath: "/studio",
  noIndex: true,
})

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      id="sanity-studio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#fff',
      }}
    >
      {children}
    </div>
  )
}
