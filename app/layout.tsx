import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { VisualEditing } from 'next-sanity'
import { draftMode } from 'next/headers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const noeDisplay = localFont({
  src: '../public/fonts/fonnts.com-NoeDisplay-Bold.ttf',
  variable: '--font-noe',
  weight: '700',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Woranz - Accidentes Personales | Seguro 100% Online',
  description: 'Protección real para tu día a día. Seguro de accidentes personales 100% online. Individual, familiar, deportiva o escolar.',
  keywords: ['seguro', 'accidentes personales', 'woranz', 'seguro online', 'argentina'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dm = await draftMode()
  const isVercelPreview = process.env.VERCEL_ENV === 'preview'

  return (
    <html lang="es">
      <body className={`${inter.variable} ${noeDisplay.variable} bg-background`}>
        {children}
        {(dm.isEnabled || isVercelPreview) && <VisualEditing />}
      </body>
    </html>
  )
}
