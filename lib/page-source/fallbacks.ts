import type { FeatureCarouselItem } from "@/lib/product-pages"
import type { ProductSegment } from "@/lib/product-paths"

type HomePageFallback = {
  heroDescription: string
  heroTitle: string
  imageAlt: string
  metadataDescription: string
  metadataTitle: string
  primaryCta: string
  secondaryCta: string
}

export const HOME_PAGE_FALLBACKS: Record<ProductSegment, HomePageFallback> = {
  personas: {
    heroDescription: "Seguros 100% online con personas reales del otro lado.",
    heroTitle: "Woranz",
    imageAlt: "Woranz personas",
    metadataDescription:
      "Cuando pasa algo, necesitás que alguien responda. Seguros 100% online con personas reales del otro lado.",
    metadataTitle: "Woranz — Seguros para Personas",
    primaryCta: "Ver seguros",
    secondaryCta: "Hablar con alguien →",
  },
  empresas: {
    heroDescription: "Seguros 100% online con personas reales del otro lado.",
    heroTitle: "Woranz",
    imageAlt: "Woranz empresas",
    metadataDescription:
      "Tu operación no se puede frenar. Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.",
    metadataTitle: "Woranz — Seguros para Empresas",
    primaryCta: "Ver coberturas",
    secondaryCta: "¡Hablemos!",
  },
  productores: {
    heroDescription: "Seguros 100% online con personas reales del otro lado.",
    heroTitle: "Woranz",
    imageAlt: "Woranz productores",
    metadataDescription:
      "Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.",
    metadataTitle: "Woranz — Productores",
    primaryCta: "Ver herramientas",
    secondaryCta: "Hablar con alguien →",
  },
}

export const DEFAULT_PRODUCT_DESCRIPTION =
  "Contratá online, con respaldo real y acompañamiento humano en cada paso."

export const CTA_DEFAULTS: Record<
  ProductSegment,
  {
    description: string
    primaryCta: string
    secondaryCta: string
    teamCount: string
    teamLabel: string
    title: string
  }
> = {
  personas: {
    title: "¿Querés saber más?",
    description:
      "Nuestro equipo te ayuda a elegir la cobertura justa para vos.",
    teamCount: "+20",
    teamLabel: "personas cuidando de vos",
    primaryCta: "Cotizá ahora",
    secondaryCta: "Hablá con nosotros →",
  },
  empresas: {
    title: "¿Necesitás proteger tu empresa?",
    description:
      "Te ayudamos a encontrar la cobertura que tu negocio necesita.",
    teamCount: "+20",
    teamLabel: "asesores listos para ayudarte",
    primaryCta: "Pedí una cotización",
    secondaryCta: "Hablá con nosotros →",
  },
  productores: {
    title: "¿Querés operar con Woranz?",
    description: "Sumate a nuestra red y empezá a cotizar en minutos.",
    teamCount: "+20",
    teamLabel: "personas del otro lado",
    primaryCta: "Empezá ahora",
    secondaryCta: "Hablá con nosotros →",
  },
}

export const FEATURE_CAROUSEL_DEFAULTS: Record<
  ProductSegment,
  {
    items: FeatureCarouselItem[]
    title: string
  }
> = {
  personas: {
    title: "Seguros pensados para vos.",
    items: [
      {
        imageSrc: "/images/features/personas-1-online.webp",
        text: "Cotizá y gestioná todo\nonline, cuando quieras.",
        textMobile: "Cotizá y gestioná\ntodo online.",
      },
      {
        imageSrc: "/images/features/productores-2-cerca.webp",
        text: "Siempre cerca tuyo,\nsiempre a un mensaje.",
        textMobile: "Siempre cerca tuyo,\na un mensaje.",
      },
      {
        imageSrc: "/images/features/personas-3-precio.webp",
        text: "El mejor precio, el mejor\nproducto. Sin vueltas.",
        textMobile: "El mejor precio.\nSin vueltas.",
      },
      {
        imageSrc: "/images/features/personas-4-simple.webp",
        text: "Simple, online y con la\nmejor experiencia.",
        textMobile: "Simple, online y con\nla mejor experiencia.",
      },
    ],
  },
  empresas: {
    title: "Seguros pensados para tu empresa.",
    items: [
      {
        imageSrc: "/images/features/empresas-1-online.webp",
        text: "Cotizá y gestioná las\ncoberturas de tu empresa.",
        textMobile: "Cotizá y gestioná\ntodo online.",
      },
      {
        imageSrc: "/images/features/empresas-2-cerca.webp",
        text: "Un equipo que entiende\ntu negocio, siempre cerca.",
        textMobile: "Siempre cerca\nde tu empresa.",
      },
      {
        imageSrc: "/images/features/empresas-3-medida.webp",
        text: "Coberturas a medida\nde tu operación.",
        textMobile: "Coberturas a medida\nde tu operación.",
      },
      {
        imageSrc: "/images/features/empresas-4-simple.webp",
        text: "Simple para vos\ny para tu equipo.",
        textMobile: "Simple para vos\ny tu equipo.",
      },
    ],
  },
  productores: {
    title: "Herramientas que te ayudan a vender.",
    items: [
      {
        imageSrc: "/images/features/productores-1-gestion.webp",
        text: "Cotizá, emití y seguí cada\noperación desde un solo lugar.",
        textMobile: "Cotizá, emití y seguí\ndesde un solo lugar.",
      },
      {
        imageSrc: "/images/features/productores-2-cerca.webp",
        text: "Soporte real, siempre\na un mensaje.",
        textMobile: "Soporte real,\na un mensaje.",
      },
      {
        imageSrc: "/images/features/productores-3-comisiones.webp",
        text: "Comisiones competitivas\ny liquidación transparente.",
        textMobile: "Comisiones competitivas\ny transparentes.",
      },
      {
        imageSrc: "/images/features/productores-4-simple.webp",
        text: "Tu cartera, simplificada\nen una sola plataforma.",
        textMobile: "Tu cartera,\nsimplificada.",
      },
      {
        imageSrc: "/images/features/personas-1-online.webp",
        text: "Multicotizador para comparar\nopciones al instante.",
        textMobile: "Compará opciones\nal instante.",
      },
      {
        imageSrc: "/images/features/empresas-3-medida.webp",
        text: "Catálogo amplio para cada\nperfil de cliente.",
        textMobile: "Catálogo amplio\npara cada cliente.",
      },
      {
        imageSrc: "/images/features/personas-4-simple.webp",
        text: "Emisión 100% digital,\nsin papeles ni demoras.",
        textMobile: "Emisión digital,\nsin papeles.",
      },
      {
        imageSrc: "/images/features/empresas-4-simple.webp",
        text: "Materiales de venta listos\npara compartir con tu cliente.",
        textMobile: "Materiales listos\npara compartir.",
      },
    ],
  },
}

export const RELATED_PRODUCTS_DEFAULT_TITLE: Record<ProductSegment, string> = {
  personas: "Más opciones para vos",
  empresas: "Más opciones para tu empresa",
  productores: "Más opciones para vos",
}

export const LEGACY_EMPRESAS_RELATED_PRODUCTS_TITLE = "Más opciones para vos"
