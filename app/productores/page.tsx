import type { Metadata } from "next"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { getHomePageData } from "@/lib/home-page-source"
import type { ProductPageData } from "@/lib/product-pages"

export const metadata: Metadata = {
  title: "Woranz — Productores",
  description:
    "Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.",
}

const FALLBACK: ProductPageData = {
  segment: "productores",
  slug: "productores",
  path: "/productores",
  isHome: true,
  metadata: {
    title: "Woranz — Productores",
    description:
      "Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.",
  },
  hero: {
    badge: "",
    title: "Más clientes, más simple.",
    description:
      "Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.",
    descriptionMobile:
      "Gestioná coberturas desde un solo lugar. Sin Excel, sin drama.",
    features: [
      { icon: "briefcase", label: "Portal para productores" },
      { icon: "zap", label: "Comisiones al instante" },
      { icon: "credit-card", label: "Pagos online" },
    ],
    primaryCta: "Empezar gratis",
    secondaryCta: "Conocé el portal →",
    imageSrc: "/images/hero.png",
    imageAlt: "Productora de seguros trabajando",
  },
  sections: [
    {
      type: "cta",
      title: "Tu cartera, en un solo lugar.",
      titleMobile: "Tu cartera en un solo lugar.",
      description:
        "Cotizá para tus clientes en segundos. Gestioná renovaciones, emisiones y cobranzas sin complicaciones.",
      teamCount: "+21",
      teamLabel: "personas apoyándote",
      primaryCta: "Empezar gratis",
      secondaryCta: "Hablá con nosotros →",
    },
  ],
}

export default async function ProductoresPage() {
  const page = (await getHomePageData("productores")) ?? FALLBACK
  return <ProductPageTemplate page={page} />
}
