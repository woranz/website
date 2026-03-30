import type { Metadata } from "next"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { getHomePageData } from "@/lib/home-page-source"
import type { ProductPageData } from "@/lib/product-pages"
import { buildProductPath } from "@/lib/product-paths"

export const metadata: Metadata = {
  title: "Woranz — Seguros para Empresas",
  description:
    "Tu operación no se puede frenar. Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.",
}

const FALLBACK: ProductPageData = {
  segment: "empresas",
  slug: "empresas",
  path: "/empresas",
  isHome: true,
  metadata: {
    title: "Woranz — Seguros para Empresas",
    description:
      "Tu operación no se puede frenar. Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.",
  },
  hero: {
    badge: "",
    title: "Tu operación no se puede frenar.",
    description:
      "Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.",
    descriptionMobile:
      "Nos ocupamos de las coberturas para que vos sigas avanzando.",
    features: [
      { icon: "building", label: "Coberturas corporativas" },
      { icon: "zap", label: "Emisión en 24hs" },
      { icon: "users", label: "Equipo dedicado" },
    ],
    primaryCta: "Hablar con un especialista",
    secondaryCta: "Ver coberturas →",
    imageSrc: "/images/hero.png",
    imageAlt: "Equipo de trabajo en oficina",
  },
  sections: [
    {
      type: "product-grid",
      title: "Nuestras coberturas",
      items: [
        {
          title: "Accidentes Personales",
          imageSrc: "/images/caucion/QU0zo.png",
          href: buildProductPath("empresas", "accidentes-personales"),
        },
        {
          title: "Caución Turismo Estudiantil",
          imageSrc: "/images/caucion/N9GXE.png",
          href: buildProductPath("empresas", "caucion-turismo-estudiantil-agencias"),
        },
        {
          title: "Cauciones Tradicionales",
          imageSrc: "/images/caucion/32Qlr.png",
          href: buildProductPath("empresas", "cauciones-tradicionales"),
        },
        {
          title: "Caución Alquiler Comercial",
          imageSrc: "/images/caucion/NX5mq.png",
          href: buildProductPath("empresas", "caucion-alquiler-comercial"),
        },
        {
          title: "Seguro de Salud",
          imageSrc: "/images/feature-2.png",
          href: buildProductPath("empresas", "seguro-de-salud"),
        },
        {
          title: "Vida Colectivo",
          imageSrc: "/images/feature-1.png",
          href: buildProductPath("empresas", "seguro-de-vida-empresas"),
        },
        {
          title: "Sepelio Colectivo",
          imageSrc: "/images/caucion/Ms5QP.png",
          href: buildProductPath("empresas", "seguro-de-sepelio"),
        },
        {
          title: "Integral de Consorcio",
          imageSrc: "/images/feature-3.png",
          href: buildProductPath("empresas", "integral-de-consorcio"),
        },
        {
          title: "Integral de Comercio",
          imageSrc: "/images/feature-4.png",
          href: buildProductPath("empresas", "integral-de-comercio"),
        },
        {
          title: "Responsabilidad Civil",
          imageSrc: "/images/caucion/QU0zo.png",
          href: buildProductPath("empresas", "responsabilidad-civil"),
        },
        {
          title: "Incendio",
          imageSrc: "/images/caucion/32Qlr.png",
          href: buildProductPath("empresas", "incendio"),
        },
        {
          title: "Aeronavegación",
          imageSrc: "/images/caucion/N9GXE.png",
          href: buildProductPath("empresas", "aeronavegacion"),
        },
      ],
    },
    {
      type: "cta",
      title: "Tu empresa crece. Su cobertura también.",
      titleMobile: "Tu empresa crece. Su cobertura también.",
      description:
        "Empresas de todos los tamaños eligen Woranz para operar tranquilas.",
      teamCount: "+9",
      teamLabel: "personas para ayudarte",
      primaryCta: "Pedí tu propuesta",
      secondaryCta: "Agendá una llamada →",
    },
  ],
}

export default async function EmpresasPage() {
  const page = (await getHomePageData("empresas")) ?? FALLBACK
  return <ProductPageTemplate page={page} />
}
