import type { Metadata } from 'next'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Woranz - Accidentes Personales | Seguro 100% Online',
  description: 'Protección real para tu día a día. Seguro de accidentes personales 100% online. Individual, familiar, deportiva o escolar.',
  keywords: ['seguro', 'accidentes personales', 'woranz', 'seguro online', 'argentina'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="bg-white">
        {children}
      </body>
    </html>
  )
}
