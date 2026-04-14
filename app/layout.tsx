import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { VisualEditing } from 'next-sanity'
import { draftMode } from 'next/headers'
import { AgentationDevtools } from '@/components/agentation-devtools'
import { buildRootMetadata } from '@/lib/metadata'
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

export const metadata: Metadata = buildRootMetadata()

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
        <AgentationDevtools />
        {(dm.isEnabled || isVercelPreview) && <VisualEditing />}
      </body>
    </html>
  )
}
