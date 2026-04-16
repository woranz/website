import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Shield,
  Zap,
  Users,
  HeartHandshake,
  TrendingUp,
  Award,
} from "lucide-react"

import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { SUPPORT_NAVIGATION_LINKS } from "@/lib/site-links"
import { buildPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Nosotros — Woranz",
  description:
    "Conocé a Woranz: una aseguradora digital que combina tecnología con atención humana real para ofrecerte seguros claros, rápidos y al mejor precio.",
  canonicalPath: "/nosotros",
})

const TEAM_MEMBERS = [
  { name: "Gonzalo", role: "CEO", src: "/images/team/gonzalo.webp" },
  { name: "Carolina", role: "Operaciones", src: "/images/team/carolina.webp" },
  { name: "Charlie", role: "Tecnología", src: "/images/team/charlie.webp" },
  { name: "Martina", role: "Comercial", src: "/images/team/martina.webp" },
  { name: "Ariel", role: "Siniestros", src: "/images/team/ariel.webp" },
  { name: "Eliana", role: "Administración", src: "/images/team/eliana.webp" },
  { name: "Marcelo", role: "Producción", src: "/images/team/marcelo.webp" },
  { name: "Josefina", role: "Atención", src: "/images/team/josefina.webp" },
  { name: "Sebastián", role: "Desarrollo", src: "/images/team/sebas.webp" },
  { name: "Valentina", role: "Marketing", src: "/images/team/valentina.webp" },
  { name: "Micaela", role: "Soporte", src: "/images/team/micaela.webp" },
  { name: "Priscilla", role: "Legales", src: "/images/team/priscilla.webp" },
]

const VALUES = [
  {
    icon: Zap,
    title: "Velocidad real",
    description:
      "Cotizás en minutos, contratás online y recibís tu póliza al instante. Sin papeles, sin esperas.",
  },
  {
    icon: Shield,
    title: "Transparencia",
    description:
      "Coberturas claras, precios visibles y sin letra chica. Sabés exactamente qué estás contratando.",
  },
  {
    icon: HeartHandshake,
    title: "Atención humana",
    description:
      "Detrás de cada póliza hay personas reales. Te acompañamos antes, durante y después de contratar.",
  },
  {
    icon: TrendingUp,
    title: "Tecnología",
    description:
      "Automatizamos lo repetitivo para enfocarnos en lo que importa: que tengas la mejor experiencia.",
  },
  {
    icon: Users,
    title: "Cercanía",
    description:
      "Hablamos tu idioma. Sin jerga de seguros, sin burocracia. Directo y simple.",
  },
  {
    icon: Award,
    title: "Respaldo",
    description:
      "Operamos con autorización de la SSN y el respaldo de aseguradoras de primera línea.",
  },
]

const STATS = [
  { value: "20+", label: "Coberturas" },
  { value: "10K+", label: "Asegurados" },
  { value: "24hs", label: "Emisión promedio" },
  { value: "98%", label: "Satisfacción" },
]

export default function NosotrosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex-1">
        {/* Hero */}
        <section className="page-shell section-padding px-page-mobile md:px-page-wide">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <span className="eyebrow-badge">Nosotros</span>
            <h1 className="display-title max-w-3xl">
              Seguros pensados para cómo vivís hoy
            </h1>
            <p className="section-copy mx-auto max-w-2xl">
              Somos una aseguradora digital argentina que combina tecnología con
              atención humana real. Creemos que contratar un seguro tiene que ser
              tan simple como todo lo demás que hacés online.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="page-shell px-page-mobile md:px-page-wide">
          <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-woranz-warm-1 px-4 py-6 md:py-8"
              >
                <span className="font-display text-3xl text-woranz-ink md:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm text-woranz-text">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Misión */}
        <section className="page-shell section-padding px-page-mobile md:px-page-wide">
          <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center md:gap-16">
            <div className="flex flex-1 flex-col gap-5">
              <span className="eyebrow-badge w-fit">Nuestra misión</span>
              <h2 className="section-title">
                Hacemos que los seguros sean accesibles para todos
              </h2>
              <p className="section-copy">
                Nacimos con una premisa simple: los seguros no tienen por qué
                ser complicados. Desde Buenos Aires construimos una plataforma
                que te permite cotizar, contratar y gestionar tus coberturas sin
                intermediarios innecesarios, con precios competitivos y soporte
                de verdad.
              </p>
              <p className="section-copy">
                Trabajamos con las aseguradoras más sólidas del mercado
                argentino para ofrecerte productos confiables, respaldados y
                adaptados a lo que realmente necesitás.
              </p>
            </div>
            <div className="relative flex-1">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-woranz-warm-2">
                <Image
                  src="/images/team/personas-1-online.webp"
                  alt="Equipo Woranz trabajando"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="bg-woranz-warm-1">
          <div className="page-shell section-padding px-page-mobile md:px-page-wide !bg-transparent">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
              <div className="flex flex-col gap-4">
                <span className="eyebrow-badge mx-auto w-fit bg-white">
                  Lo que nos mueve
                </span>
                <h2 className="section-title">
                  Nuestros valores
                </h2>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {VALUES.map((value) => {
                  const Icon = value.icon
                  return (
                    <div
                      key={value.title}
                      className="flex flex-col gap-4 rounded-2xl bg-white px-6 py-7 text-left md:px-7 md:py-8"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-woranz-warm-2">
                        <Icon className="h-5 w-5 text-woranz-slate" />
                      </div>
                      <h3 className="text-lg font-semibold text-woranz-ink">
                        {value.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-woranz-text">
                        {value.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="page-shell section-padding px-page-mobile md:px-page-wide">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
            <div className="flex flex-col gap-4">
              <span className="eyebrow-badge mx-auto w-fit">Equipo</span>
              <h2 className="section-title">Las personas detrás de Woranz</h2>
              <p className="section-copy mx-auto max-w-2xl">
                Un equipo multidisciplinario que combina experiencia en seguros
                con talento en tecnología, diseño y atención al cliente.
              </p>
            </div>
            <div className="grid w-full grid-cols-3 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.name} className="flex flex-col items-center gap-3">
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-woranz-warm-2">
                    <Image
                      src={member.src}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-woranz-ink">
                      {member.name}
                    </span>
                    <span className="text-xs text-woranz-text">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-shell px-page-mobile pb-section-mobile md:px-page-wide md:pb-section">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl bg-woranz-warm-1 px-6 py-10 text-center md:px-12 md:py-14">
            <h2 className="section-title">
              ¿Querés saber más?
            </h2>
            <p className="section-copy max-w-xl">
              Estamos acá para ayudarte a encontrar la cobertura que necesitás.
              Hablemos.
            </p>
            <div className="flex flex-col gap-3 md:flex-row">
              <Link href="/contacto" className="btn-primary-hero">
                Contactanos
              </Link>
              <Link
                href="/personas/coberturas/caucion-alquiler"
                className="btn-secondary-outline"
              >
                Ver coberturas
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
