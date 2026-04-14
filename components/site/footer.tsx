import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin } from "lucide-react"

import { buildProductPath } from "@/lib/product-paths"
import { Logo } from "@/components/site/logo"
import { Separator } from "@/components/ui/separator"
const MOBILE_COLUMNS = [
  {
    title: "Productos",
    links: [
      { href: buildProductPath("personas", "caucion-alquiler"), label: "Caución Alquiler" },
      { href: buildProductPath("personas", "accidentes-personales"), label: "Accidentes Personales" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
]

const DESKTOP_COLUMNS = [
  {
    title: "Productos",
    links: [
      { href: buildProductPath("personas", "accidentes-personales"), label: "Accidentes Personales" },
      { href: buildProductPath("personas", "caucion-alquiler"), label: "Cauciones" },
      { href: buildProductPath("empresas", "seguro-de-vida-empresas"), label: "Seguro de Vida" },
      { href: buildProductPath("empresas", "seguro-de-sepelio"), label: "Seguro de Sepelio" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/blog", label: "Blog" },
      { href: "/trabaja-con-nosotros", label: "Trabajá con nosotros" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { href: "/centro-de-ayuda", label: "Centro de ayuda" },
      { href: "/contacto", label: "Contacto" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terminos", label: "Términos" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "https://www.argentina.gob.ar/ssn", label: "SSN" },
    ],
  },
]

type FooterColumnProps = {
  title: string
  links: Array<{ href: string; label: string }>
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="footer-heading">{title}</span>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="footer-link">
          {link.label}
        </Link>
      ))}
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="w-full bg-woranz-warm-1">
      <div className="page-shell gap-8 px-page-mobile py-10 md:gap-10 md:px-page-wide !bg-transparent">
        <div className="md:hidden">
          <Logo size="small" />
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex gap-8 md:hidden">
            {MOBILE_COLUMNS.map((column) => (
              <div key={column.title} className="flex-1">
                <FooterColumn {...column} />
              </div>
            ))}
          </div>

          <div className="hidden gap-12 md:flex">
            {DESKTOP_COLUMNS.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </div>
        </div>

        <Separator className="bg-woranz-line" />

        <div className="flex items-start justify-between gap-4 md:gap-8">
          <p className="flex-1 text-micro text-woranz-muted md:text-legal">
            <span className="md:hidden">
              La entidad aseguradora dispone de un Servicio de Atención al
              Asegurado que atenderá las consultas y reclamos que presenten los
              tomadores de seguros, asegurados, beneficiarios y/o
              derechohabientes.
            </span>
            <span className="hidden md:inline">
              La entidad aseguradora dispone de un Servicio de Atención al
              Asegurado que atenderá las consultas y reclamos que presenten los
              tomadores de seguros, asegurados, beneficiarios y/o
              derechohabientes. El Servicio de Atención al Asegurado está
              integrado por: RESPONSABLE: Gonzalo Oyarzabal – Tel.:
              0800-266-4240 SUPLENTE: Anabella Calderan – Tel.: 0800-266-4240.
              En caso de que el reclamo no haya sido resuelto o haya sido
              desestimado, total o parcialmente, o que haya sido denegada su
              admisión, podrá comunicarse con la Superintendencia de Seguros de
              la Nación por teléfono al 0800-666-8400, correo electrónico a
              denuncias@ssn.gob.ar o formulario web a través de
              www.argentina.gob.ar/ssn
            </span>
          </p>
          <Image
            src="/images/ssn-qr.png"
            alt="SSN QR"
            width={39}
            height={53}
            className="h-auto w-qr-mobile shrink-0 md:w-qr"
          />
        </div>

        <Separator className="bg-woranz-line" />

        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <span className="text-fine text-woranz-light md:text-xs">
            © 2026 Woranz. Todos los derechos reservados.
          </span>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="https://www.facebook.com/woranz" className="text-woranz-muted transition-opacity hover:opacity-70">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://www.instagram.com/woranz" className="text-woranz-muted transition-opacity hover:opacity-70">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="https://www.linkedin.com/company/woranz/" className="text-woranz-muted transition-opacity hover:opacity-70">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
