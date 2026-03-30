import { buildProductKey, buildProductPath, type ProductSegment } from "@/lib/product-paths"

export type ProductHero = {
  badge: string
  description: string
  descriptionMobile?: string
  features?: Array<{ icon: string; label: string }>
  imageAlt: string
  imageSrc: string
  primaryCtaHref?: string
  primaryCta: string
  secondaryCtaHref?: string
  secondaryCta: string
  title: string
}

export type ProductStep = {
  description: string
  number: string
  title: string
}

export type FaqItem = {
  answer: string
  question: string
}

export type CoverageItem = {
  description: string
  title: string
}

export type PackageCarouselItem = {
  cta: "button" | "link"
  description: string
  descriptionMobile?: string
  icon: "music" | "user" | "users"
  title: string
}

export type ProductCarouselItem = {
  href?: string
  imageSrc: string
  title: string
}

export type VariantItem = {
  description?: string
  href?: string
  items?: string[]
  title: string
}

export type FeatureCarouselItem = {
  imageSrc: string
  text?: string
  textMobile?: string
}

type QuoteSection = {
  description: string
  maxWidth?: "default" | "wide"
  mobileSteps?: boolean
  quoter: "accidentes" | "caucion"
  steps: ProductStep[]
  title: string
  type: "quote"
}

type CoverageSection = {
  columns: CoverageItem[][]
  title: string
  type: "coverage"
}

type VariantsSection = {
  items: VariantItem[]
  title: string
  type: "variants"
}

type RequirementsSection = {
  columns?: CoverageItem[][]
  items?: string[]
  title: string
  type: "requirements"
}

type CarouselSection =
  | {
      items: PackageCarouselItem[]
      title: string
      type: "carousel"
      variant: "package"
    }
  | {
      items: ProductCarouselItem[]
      title: string
      type: "carousel"
      variant: "product"
    }
  | {
      items: FeatureCarouselItem[]
      title: string
      type: "carousel"
      variant: "feature"
    }

type FaqSection = {
  desktopColumns: FaqItem[][]
  mobileItems?: FaqItem[]
  title: string
  type: "faq"
}

type CtaSection = {
  description: string
  primaryCtaHref?: string
  primaryCta: string
  secondaryCtaHref?: string
  secondaryCta: string
  teamCount: string
  teamLabel: string
  title: string
  titleMobile?: string
  type: "cta"
}

type StepsSection = {
  steps: ProductStep[]
  type: "steps"
}

export type ProductGridItem = {
  href?: string
  imageSrc: string
  title: string
}

type ProductGridSection = {
  items: ProductGridItem[]
  title: string
  type: "product-grid"
}

export type ProductPageSection =
  | QuoteSection
  | VariantsSection
  | RequirementsSection
  | CoverageSection
  | CarouselSection
  | FaqSection
  | CtaSection
  | StepsSection
  | ProductGridSection

export type ProductPageData = {
  hero: ProductHero
  isHome?: boolean
  metadata: {
    description: string
    title: string
  }
  path: string
  sections: ProductPageSection[]
  segment: ProductSegment
  slug: string
}

const accidentesPersonales: ProductPageData = {
  segment: "personas",
  slug: "accidentes-personales",
  path: buildProductPath("personas", "accidentes-personales"),
  metadata: {
    title: "Woranz - Accidentes Personales | Seguro 100% Online",
    description:
      "Te cubrís hoy, para cualquier cosa que pase mañana.",
  },
  hero: {
    badge: "Accidentes personales",
    title: "La cobertura ante accidentes que podés obtener en tiempo real",
    description:
      "Te cubrís hoy, para cualquier cosa que pase mañana.",
    descriptionMobile:
      "Te cubrís hoy, para cualquier cosa que pase mañana.",
    primaryCta: "Cotizá tu cobertura ahora",
    secondaryCta: "Hablá con nosotros →",
    imageSrc: "/images/hero.png",
    imageAlt: "Persona activa y segura",
  },
  sections: [
    {
      type: "quote",
      title: "Calculá tu precio",
      description: "Elegí tu actividad, la vigencia y cotizá en segundos.",
      quoter: "accidentes",
      steps: [
        {
          number: "01",
          title: "Cotizá online",
          description:
            "Elegí tu cobertura y recibí tu precio al instante sin datos personales ni formularios interminables.",
        },
        {
          number: "02",
          title: "Contratá",
          description:
            "Pagá con Mercado Pago con tarjeta de crédito, débito o transferencia.",
        },
        {
          number: "03",
          title: "Listo, estás cubierto",
          description:
            "Tu plan llega al instante a tu celular. Siempre disponible en tu cuenta de Woranz.",
        },
      ],
    },
    {
      type: "carousel",
      title: "Otros paquetes disponibles",
      variant: "package",
      items: [
        {
          icon: "music",
          title: "Lollapalooza 2026",
          description:
            "Cobertura para el personal que trabaja en el festival. Staff, técnicos, proveedores y equipo de producción.",
          descriptionMobile:
            "Cobertura para personal y staff que trabaja en el festival. Técnicos, proveedores y producción.",
          cta: "button",
        },
        {
          icon: "user",
          title: "24 hs",
          description:
            "Te cubrimos las 24 horas, los 365 días. Para vos que no parás nunca.",
          descriptionMobile:
            "Protección personal ante accidentes. Ideal para trabajadores independientes y profesionales.",
          cta: "link",
        },
        {
          icon: "users",
          title: "Laboral e in itinere",
          description:
            "Te cubre en el trabajo y en el camino de ida y vuelta. Así de simple.",
          descriptionMobile:
            "Cobertura para toda tu familia. Protegé a los que más querés.",
          cta: "link",
        },
      ],
    },
    {
      type: "faq",
      title: "¿Dudas?",
      mobileItems: [
        {
          question: "¿Qué cubre el seguro de accidentes personales?",
          answer:
            "Cubre gastos médicos, internación, cirugías y rehabilitación por accidentes. También incluye indemnización por fallecimiento o invalidez permanente.",
        },
        {
          question: "¿Quiénes pueden contratar este seguro?",
          answer:
            "Cualquier persona mayor de 18 años residente en Argentina. También podés incluir a tu familia o grupo de trabajo.",
        },
        {
          question: "¿Cómo hago un reclamo si tengo un accidente?",
          answer:
            "Desde tu cuenta en Woranz o por WhatsApp. Te respondemos en menos de 24 horas y te guiamos en todo el proceso.",
        },
        {
          question: "¿Cuánto tarda en activarse la cobertura?",
          answer:
            "Tu cobertura se activa de forma inmediata una vez confirmado el pago. Recibís tu póliza digital al instante.",
        },
      ],
      desktopColumns: [
        [
          {
            question: "¿Qué me cubre exactamente?",
            answer:
              "Nuestro seguro cubre gastos médicos por accidente, internación, cirugías, rehabilitación y traslados. Además, incluye indemnización por fallecimiento accidental o invalidez total y permanente. Todo respaldado por aseguradoras de primera línea.",
          },
          {
            question: "¿Quién puede contratarlo?",
            answer:
              "Cualquier persona mayor de 18 años residente en Argentina puede contratar este seguro. También ofrecemos planes familiares, corporativos y para grupos específicos como deportistas o estudiantes.",
          },
          {
            question: "¿Qué hago si tengo un accidente?",
            answer:
              "Ingresá a tu cuenta de Woranz o escribinos por WhatsApp. Te respondemos en menos de 24 horas hábiles. Te acompañamos en todo el proceso de reclamo y gestionamos directamente con la aseguradora.",
          },
        ],
        [
          {
            question: "¿Cuándo empiezo a estar cubierto?",
            answer:
              "Tu cobertura se activa de forma inmediata una vez confirmado el pago. No hay período de carencia. Recibís tu póliza digital al instante en tu email y en tu cuenta de Woranz.",
          },
          {
            question: "¿Puedo cancelar cuando quiera?",
            answer:
              "Sí, podés cancelar tu seguro en cualquier momento sin penalidades. La cancelación se hace efectiva al finalizar el período ya pagado.",
          },
          {
            question: "¿Cómo pago?",
            answer:
              "Aceptamos tarjetas de crédito, débito y transferencias bancarias a través de Mercado Pago. Podés elegir pago mensual o anual con descuento.",
          },
        ],
      ],
    },
    {
      type: "cta",
      title: "Si tenés dudas, estamos acá.",
      titleMobile: "Si tenés dudas, estamos acá.",
      description:
        "No somos un call center. Somos personas reales que te acompañan en cada paso.",
      teamCount: "+21",
      teamLabel: "personas cuidando de vos",
      primaryCta: "Empezar ahora",
      primaryCtaHref: buildProductPath("personas", "caucion-alquiler"),
      secondaryCta: "Hablá con nosotros →",
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
          textMobile: "Siempre cerca tuyo ayudandote a avanzar.",
        },
        {
          imageSrc: "/images/feature-3.png",
          text: "El mejor precio, el mejor producto. Sin vueltas.",
          textMobile: "El mejor precio, el mejor producto. Sin vueltas.",
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

const caucionAlquiler: ProductPageData = {
  segment: "personas",
  slug: "caucion-alquiler",
  path: buildProductPath("personas", "caucion-alquiler"),
  metadata: {
    title: "Woranz - Caución Alquiler | Garantía Digital",
    description:
      "Resolvés tu alquiler con una póliza real, aceptada por el mercado y lista en horas.",
  },
  hero: {
    badge: "Caución de Alquiler",
    title: "La garantía de alquiler más completa, al mejor precio",
    description:
      "Resolvés tu alquiler con una póliza real, aceptada por el mercado y lista en horas.",
    primaryCta: "Cotizá tu garantía ahora",
    secondaryCta: "Hablá con nosotros →",
    imageSrc: "/images/products/caucion-alquiler-hero-v2.png",
    imageAlt: "Pareja feliz con las llaves de su nuevo hogar",
  },
  sections: [
    {
      type: "quote",
      title: "Calculá tu precio",
      description: "Ingresá el monto de tu alquiler y el plazo del contrato.",
      quoter: "caucion",
      maxWidth: "wide",
      mobileSteps: true,
      steps: [
        {
          number: "01",
          title: "Cotizá online",
          description:
            "Elegí tu plan y te damos el precio al toque. Sin datos personales ni formularios eternos.",
        },
        {
          number: "02",
          title: "Contratá",
          description:
            "Pagá con Mercado Pago con tarjeta de crédito, débito o transferencia.",
        },
        {
          number: "03",
          title: "Listo, estás cubierto",
          description:
            "Tu cobertura al instante en el celu. Siempre disponible en tu cuenta Woranz.",
        },
      ],
    },
    {
      type: "coverage",
      title: "Qué cubre",
      columns: [
        [
          {
            title: "Pago de alquiler ante incumplimiento",
            description:
              "Si el inquilino no paga, la póliza responde ante el propietario.",
          },
          {
            title: "Expensas",
            description:
              "Cobertura de expensas impagas durante la vigencia del contrato.",
          },
          {
            title: "Servicios e impuestos",
            description:
              "Cobertura de servicios básicos e impuestos impagos.",
          },
        ],
        [
          {
            title: "Ocupación indebida",
            description:
              "Cobertura hasta restitución del inmueble si el inquilino no desocupa.",
          },
          {
            title: "Daños al inmueble",
            description:
              "Según plan, cobertura por daños causados a la propiedad.",
          },
        ],
      ],
    },
    {
      type: "carousel",
      title: "Más opciones para vos",
      variant: "product",
      items: [
        {
          title: "Accidentes personales",
          imageSrc: "/images/caucion/NX5mq.png",
          href: buildProductPath("personas", "accidentes-personales"),
        },
        {
          title: "Caución Turismo estudiantil",
          imageSrc: "/images/caucion/N9GXE.png",
          href: buildProductPath("personas", "caucion-turismo-estudiantil"),
        },
        {
          title: "Seguro de Hogar",
          imageSrc: "/images/caucion/Ms5QP.png",
          href: buildProductPath("personas", "seguro-de-hogar"),
        },
        {
          title: "Incendio",
          imageSrc: "/images/caucion/32Qlr.png",
          href: buildProductPath("empresas", "incendio"),
        },
        {
          title: "Robo de celular",
          imageSrc: "/images/caucion/QU0zo.png",
          href: buildProductPath("personas", "robo-celular"),
        },
      ],
    },
    {
      type: "faq",
      title: "¿Dudas sobre tu garantía?",
      desktopColumns: [
        [
          {
            question: "¿Qué es una garantía de alquiler?",
            answer:
              "Es un seguro que reemplaza al garante tradicional. Protege al propietario y te permite alquilar sin necesidad de tener una propiedad como garantía.",
          },
          {
            question: "¿Qué necesito para sacarla?",
            answer:
              "Solo necesitás DNI, recibo de sueldo o constancia de ingresos. El proceso es 100% online y la aprobación demora menos de 24 horas.",
          },
          {
            question: "¿Cuánto tarda en estar lista?",
            answer:
              "La aprobación es casi inmediata. En menos de 2 horas hábiles tenés la respuesta y podés continuar con tu contrato de alquiler.",
          },
        ],
        [
          {
            question: "¿Puedo pagar en cuotas?",
            answer:
              "Sí, podés pagar en hasta 6 cuotas sin interés con todas las tarjetas de crédito a través de Mercado Pago.",
          },
          {
            question: "¿Qué pasa si no puedo pagar el alquiler?",
            answer:
              "Contactanos antes de que venza tu cuota. Tenemos opciones de financiación y podemos buscar una solución juntos.",
          },
          {
            question: "¿La aceptan todos los propietarios?",
            answer:
              "Sí, nuestra garantía está respaldada por aseguradoras de primera línea y es aceptada por inmobiliarias y propietarios en todo el país.",
          },
        ],
      ],
    },
    {
      type: "cta",
      title: "Tu próximo alquiler, sin vueltas.",
      description:
        "Cotizá online, presentá la póliza y seguí con la mudanza.",
      teamCount: "+9",
      teamLabel: "personas cuidando de vos",
      primaryCta: "Cotizá tu garantía",
      primaryCtaHref: buildProductPath("personas", "caucion-alquiler"),
      secondaryCta: "Hablá con un asesor →",
    },
    {
      type: "carousel",
      title: "Seguros pensados para vos.",
      variant: "feature",
      items: [
        { imageSrc: "/images/caucion/ySZm4.png" },
        { imageSrc: "/images/caucion/Ulxwa.png" },
        { imageSrc: "/images/caucion/8Cm0G.png" },
        { imageSrc: "/images/caucion/4FmGS.png" },
      ],
    },
  ],
}

const paginaEjemplo: ProductPageData = {
  segment: "personas",
  slug: "pagina-ejemplo",
  path: buildProductPath("personas", "pagina-ejemplo"),
  metadata: {
    title: "Woranz - Página de ejemplo",
    description:
      "Página de ejemplo para validar el template dinámico de producto en la ruta por slug.",
  },
  hero: {
    badge: "Página de ejemplo",
    title: "Template dinámico funcionando.",
    description:
      "Esta URL existe para probar el render de `app/[slug]` con una página completa y estable.",
    descriptionMobile:
      "Página de ejemplo para validar el template dinámico con una ruta real.",
    primaryCta: "Probar el template",
    primaryCtaHref: buildProductPath("personas", "caucion-alquiler"),
    secondaryCta: "Hablá con nosotros →",
    imageSrc: "/images/caucion-hero.jpg",
    imageAlt: "Página de ejemplo del template de Woranz",
  },
  sections: [
    {
      type: "quote",
      title: "Probá el cotizador",
      description: "Sección de ejemplo para verificar que el flujo completo renderiza bien.",
      quoter: "accidentes",
      mobileSteps: true,
      steps: [
        {
          number: "01",
          title: "Entrás por slug",
          description:
            "La página se resuelve desde `app/[slug]` y carga el template correcto.",
        },
        {
          number: "02",
          title: "Se arma el contenido",
          description:
            "El template recibe hero, coberturas, FAQs y CTA con el mismo shape que usa producción.",
        },
        {
          number: "03",
          title: "Podés iterar rápido",
          description:
            "Sirve como base para cargar nuevos productos mientras el contenido final se termina en CMS.",
        },
      ],
    },
    {
      type: "coverage",
      title: "Qué valida esta página",
      columns: [
        [
          {
            title: "Hero completo",
            description: "Título, bajada, CTAs e imagen principal del producto.",
          },
          {
            title: "Secciones reutilizables",
            description:
              "Coberturas, FAQs, carruseles y CTA final con el mismo layout del resto del sitio.",
          },
        ],
        [
          {
            title: "Ruta dinámica",
            description:
              "La URL queda accesible por slug sin crear una carpeta dedicada para cada página.",
          },
          {
            title: "Fallback estable",
            description:
              "Aunque Sanity no tenga contenido completo, la página sigue siendo navegable.",
          },
        ],
      ],
    },
    {
      type: "faq",
      title: "Preguntas frecuentes",
      mobileItems: [
        {
          question: "¿Para qué sirve esta página?",
          answer:
            "Para comprobar que el template dinámico funciona sin depender de un producto final cargado en CMS.",
        },
        {
          question: "¿La ruta es real?",
          answer:
            "Sí. Podés abrir `/pagina-ejemplo` y usarla como referencia mientras cargás contenido definitivo.",
        },
        {
          question: "¿Esto reemplaza Sanity?",
          answer:
            "No. Es un fallback de ejemplo; cuando haya contenido en Sanity, la ruta también puede resolverlo.",
        },
        {
          question: "¿Se puede duplicar para otros productos?",
          answer:
            "Sí. El template ya quedó desacoplado de páginas hardcodeadas individuales.",
        },
      ],
      desktopColumns: [
        [
          {
            question: "¿Para qué sirve esta página?",
            answer:
              "Sirve para validar el template dinámico de producto con una URL estable y contenido suficientemente completo para revisar layout y flujo.",
          },
          {
            question: "¿La ruta es real o sólo de desarrollo?",
            answer:
              "Es una ruta real del sitio resuelta por slug. No depende de una carpeta dedicada como `/caucion-alquiler`.",
          },
        ],
        [
          {
            question: "¿Qué pasa cuando haya contenido en Sanity?",
            answer:
              "La capa de resolución ahora puede tomar documentos del CMS y, si faltan datos o no existe el slug, volver al catálogo estático.",
          },
          {
            question: "¿Puedo usarla como base para nuevos productos?",
            answer:
              "Sí. Podés clonar esta estructura y reemplazar textos, imágenes y secciones según el producto final.",
          },
        ],
      ],
    },
    {
      type: "carousel",
      title: "Visuales de ejemplo",
      variant: "feature",
      items: [
        {
          imageSrc: "/images/feature-1.png",
          text: "Una sola plantilla, muchos productos.",
          textMobile: "Una sola plantilla, muchos productos.",
        },
        {
          imageSrc: "/images/feature-2.png",
          text: "Slug dinámico con contenido consistente.",
          textMobile: "Slug dinámico consistente.",
        },
        {
          imageSrc: "/images/feature-3.png",
          text: "Fallback local más lectura desde CMS.",
          textMobile: "Fallback local + CMS.",
        },
      ],
    },
    {
      type: "cta",
      title: "¿Querés convertir esta base en un producto real?",
      titleMobile: "¿Querés usar esta base en un producto real?",
      description:
        "La estructura ya está resuelta. Falta solamente cargar el contenido definitivo y ajustar el cotizador que corresponda.",
      teamCount: "4+",
      teamLabel: "personas listas para ayudarte",
      primaryCta: "Crear nueva página",
      primaryCtaHref: buildProductPath("personas", "caucion-alquiler"),
      secondaryCta: "Hablá con nosotros →",
    },
  ],
}

export const homeProductRoute = {
  segment: accidentesPersonales.segment,
  slug: accidentesPersonales.slug,
} as const

export const productPages: Record<string, ProductPageData> = {
  [buildProductKey(accidentesPersonales.segment, accidentesPersonales.slug)]: accidentesPersonales,
  [buildProductKey(caucionAlquiler.segment, caucionAlquiler.slug)]: caucionAlquiler,
  [buildProductKey(paginaEjemplo.segment, paginaEjemplo.slug)]: paginaEjemplo,
}

export function getProductPageData(segment: ProductSegment, slug: string) {
  return productPages[buildProductKey(segment, slug)]
}
