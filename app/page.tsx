import type { Metadata } from "next"

import { ProductPageTemplate } from "@/components/templates/product-page"
import { getHomePageData } from "@/lib/home-page-source"
import type { ProductPageData } from "@/lib/product-pages"
import { buildProductPath } from "@/lib/product-paths"

export const metadata: Metadata = {
  title: "Woranz — Seguros para Personas",
  description:
    "Cuando pasa algo, necesitás que alguien responda. Seguros 100% online con personas reales del otro lado.",
}

const FALLBACK: ProductPageData = {
  segment: "personas",
  slug: "home",
  path: "/",
  isHome: true,
  metadata: {
    title: "Woranz — Seguros para Personas",
    description:
      "Cuando pasa algo, necesitás que alguien responda. Seguros 100% online con personas reales del otro lado.",
  },
  hero: {
    badge: "",
    title: "Avanzá tranquilo, nosotros te cubrimos.",
    description:
      "Seguros 100% digitales para que cotices, elijas tu plan y manejes todo desde tu celu. Sin papeles, sin vueltas.",
    descriptionMobile:
      "Seguros 100% digitales. Cotizá, elegí tu plan y manejá todo desde tu celu.",
    features: [
      { icon: "shield-check", label: "Prestacional" },
      { icon: "zap", label: "Orientación al instante" },
      { icon: "credit-card", label: "Pagos online" },
    ],
    primaryCta: "Ver seguros",
    primaryCtaHref: "#coberturas",
    secondaryCta: "Hablar con alguien →",
    imageSrc: "/images/hero.png",
    imageAlt: "Personas protegidas por Woranz",
  },
  sections: [
    {
      type: "carousel",
      title: "Para cada situación, una cobertura concreta",
      variant: "product",
      items: [
        {
          title: "Caución de Alquiler",
          imageSrc: "/images/caucion/NX5mq.png",
          href: buildProductPath("personas", "caucion-alquiler"),
        },
        {
          title: "Seguro de Hogar",
          imageSrc: "/images/caucion/Ms5QP.png",
          href: buildProductPath("personas", "seguro-de-hogar"),
        },
        {
          title: "Accidentes Personales",
          imageSrc: "/images/caucion/QU0zo.png",
          href: buildProductPath("personas", "accidentes-personales"),
        },
        {
          title: "Robo de Celular",
          imageSrc: "/images/feature-3.png",
          href: buildProductPath("personas", "robo-celular"),
        },
        {
          title: "Turismo Estudiantil",
          imageSrc: "/images/caucion/N9GXE.png",
          href: buildProductPath("personas", "caucion-turismo-estudiantil"),
        },
      ],
    },
    {
      type: "steps",
      steps: [
        {
          number: "01",
          title: "Cotizá online",
          description:
            "Elegí tu cobertura y recibí tu precio en segundos. Sin formularios ni datos personales.",
        },
        {
          number: "02",
          title: "Contratá",
          description:
            "Pagá como quieras: tarjeta, débito o transferencia. Todo por Mercado Pago.",
        },
        {
          number: "03",
          title: "Listo, te cubrimos",
          description:
            "Tu póliza llega al toque a tu celu. Siempre disponible en tu cuenta Woranz.",
        },
      ],
    },
    {
      type: "faq",
      title: "¿Dudas?",
      mobileItems: [
        {
          question: "¿Qué tipo de seguros puedo contratar?",
          answer:
            "Caución de alquiler, accidentes personales, seguro de hogar, turismo estudiantil y microseguros para celular, bici y notebook.",
        },
        {
          question: "¿Cómo contrato?",
          answer:
            "Todo es online. Cotizás, elegís tu plan y pagás con Mercado Pago. Tu póliza llega al instante.",
        },
        {
          question: "¿Puedo cancelar cuando quiera?",
          answer:
            "Sí, sin penalidades. La cancelación se hace efectiva al finalizar el período ya pagado.",
        },
        {
          question: "¿Cómo hago un reclamo?",
          answer:
            "Desde tu cuenta en Woranz o por WhatsApp. Te respondemos en menos de 24 horas.",
        },
      ],
      desktopColumns: [
        [
          {
            question: "¿Qué tipo de seguros puedo contratar?",
            answer:
              "Caución de alquiler, accidentes personales, seguro de hogar, turismo estudiantil y microseguros para celular, bici y notebook. Todo 100% online.",
          },
          {
            question: "¿Cómo contrato?",
            answer:
              "Cotizás online, elegís tu plan y pagás con tarjeta o transferencia vía Mercado Pago. Tu póliza llega al instante a tu celu.",
          },
        ],
        [
          {
            question: "¿Puedo cancelar cuando quiera?",
            answer:
              "Sí, podés cancelar en cualquier momento sin penalidades. Se hace efectiva al finalizar el período ya pagado.",
          },
          {
            question: "¿Cómo hago un reclamo?",
            answer:
              "Desde tu cuenta en Woranz o por WhatsApp. Te respondemos en menos de 24 horas y te guiamos en todo el proceso.",
          },
        ],
      ],
    },
    {
      type: "cta",
      title: "Cuando lo necesites, estamos.",
      titleMobile: "Cuando lo necesites, estamos.",
      description:
        "No somos un call center. Somos personas reales que te acompañan en cada paso.",
      teamCount: "+21",
      teamLabel: "personas cuidando de vos",
      primaryCta: "Ver seguros",
      primaryCtaHref: "#coberturas",
      secondaryCta: "Hablar con alguien →",
    },
    {
      type: "carousel",
      title: "Seguros pensados para vos.",
      variant: "feature",
      items: [
        {
          imageSrc: "/images/feature-1.png",
          text: "Cotizá y gestioná todo online, cuando quieras.",
          textMobile: "Cotizá y consultá tus pólizas online 24/7.",
        },
        {
          imageSrc: "/images/feature-2.png",
          text: "Siempre cerca tuyo, siempre a un mensaje.",
          textMobile: "Siempre cerca tuyo ayudándote a avanzar.",
        },
        {
          imageSrc: "/images/feature-3.png",
          text: "El mejor precio, el mejor producto. Sin vueltas.",
          textMobile: "El mejor precio, sin vueltas.",
        },
        {
          imageSrc: "/images/feature-4.png",
          text: "Simple, online y con la mejor experiencia.",
          textMobile: "Simple, online y con la mejor experiencia.",
        },
      ],
    },
  ],
}

export default async function HomePage() {
  const page = (await getHomePageData("personas")) ?? FALLBACK
  return <ProductPageTemplate page={page} />
}
