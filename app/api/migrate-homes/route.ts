import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const homes = [
  {
    _id: 'home-personas',
    _type: 'paginaHome',
    segmento: 'personas',
    heroTitulo: 'Avanzá tranquilo, nosotros te cubrimos.',
    heroSubtitulo:
      'Seguros 100% digitales para que cotices, elijas tu plan y manejes todo desde tu celu. Sin papeles, sin vueltas.',
    heroSubtituloMobile:
      'Seguros 100% digitales. Cotizá, elegí tu plan y manejá todo desde tu celu.',
    heroFeatures: [
      { _key: 'f1', icono: 'shield-check', texto: 'Prestacional' },
      { _key: 'f2', icono: 'zap', texto: 'Orientación al instante' },
      { _key: 'f3', icono: 'credit-card', texto: 'Pagos online' },
    ],
    ctaPrimario: { label: 'Ver seguros', href: '#coberturas' },
    ctaSecundario: { label: 'Hablar con alguien →' },
    secciones: [
      {
        _key: 's1',
        _type: 'seccionPasos',
        pasos: [
          {
            _key: 'p1',
            numero: '01',
            titulo: 'Cotizá online',
            descripcion:
              'Elegí tu cobertura y recibí tu precio en segundos. Sin formularios ni datos personales.',
          },
          {
            _key: 'p2',
            numero: '02',
            titulo: 'Contratá',
            descripcion:
              'Pagá como quieras: tarjeta, débito o transferencia. Todo por Mercado Pago.',
          },
          {
            _key: 'p3',
            numero: '03',
            titulo: 'Listo, te cubrimos',
            descripcion:
              'Tu póliza llega al toque a tu celu. Siempre disponible en tu cuenta Woranz.',
          },
        ],
      },
      {
        _key: 's2',
        _type: 'seccionCarouselFeatures',
        titulo: 'Seguros pensados para vos.',
        items: [
          {
            _key: 'i1',
            texto: 'Cotizá y gestioná todo online, cuando quieras.',
            textoMobile: 'Cotizá y consultá tus pólizas online 24/7.',
          },
          {
            _key: 'i2',
            texto: 'Siempre cerca tuyo, siempre a un mensaje.',
            textoMobile: 'Siempre cerca tuyo ayudándote a avanzar.',
          },
          {
            _key: 'i3',
            texto: 'El mejor precio, el mejor producto. Sin vueltas.',
            textoMobile: 'El mejor precio, sin vueltas.',
          },
          {
            _key: 'i4',
            texto: 'Simple, online y con la mejor experiencia.',
            textoMobile: 'Simple, online y con la mejor experiencia.',
          },
        ],
      },
      {
        _key: 's3',
        _type: 'seccionCta',
        titulo: 'Cuando lo necesites, estamos.',
        tituloMobile: 'Cuando lo necesites, estamos.',
        descripcion:
          'No somos un call center. Somos personas reales que te acompañan en cada paso.',
        teamCount: '+21',
        teamLabel: 'personas cuidando de vos',
        ctaPrimario: { label: 'Ver seguros', href: '#coberturas' },
        ctaSecundario: { label: 'Hablar con alguien →' },
      },
    ],
    metaTitulo: 'Woranz — Seguros para Personas',
    metaDescripcion:
      'Seguros 100% digitales para que cotices, elijas tu plan y manejes todo desde tu celu. Sin papeles, sin vueltas.',
  },
  {
    _id: 'home-empresas',
    _type: 'paginaHome',
    segmento: 'empresas',
    heroTitulo: 'Tu operación no se puede frenar.',
    heroSubtitulo:
      'Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.',
    heroSubtituloMobile:
      'Nos ocupamos de las coberturas para que vos sigas avanzando.',
    heroFeatures: [
      { _key: 'f1', icono: 'building', texto: 'Coberturas corporativas' },
      { _key: 'f2', icono: 'zap', texto: 'Emisión en 24hs' },
      { _key: 'f3', icono: 'users', texto: 'Equipo dedicado' },
    ],
    ctaPrimario: { label: 'Hablar con un especialista' },
    ctaSecundario: { label: 'Ver coberturas →' },
    secciones: [
      {
        _key: 's1',
        _type: 'seccionCta',
        titulo: 'Tu empresa crece. Su cobertura también.',
        tituloMobile: 'Tu empresa crece. Su cobertura también.',
        descripcion:
          'Empresas de todos los tamaños eligen Woranz para operar tranquilas.',
        teamCount: '+9',
        teamLabel: 'personas para ayudarte',
        ctaPrimario: { label: 'Pedí tu propuesta' },
        ctaSecundario: { label: 'Agendá una llamada →' },
      },
    ],
    metaTitulo: 'Woranz — Seguros para Empresas',
    metaDescripcion:
      'Tu operación no se puede frenar. Nosotros nos ocupamos de las coberturas para que vos sigas avanzando.',
  },
  {
    _id: 'home-productores',
    _type: 'paginaHome',
    segmento: 'productores',
    heroTitulo: 'Más clientes, más simple.',
    heroSubtitulo:
      'Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.',
    heroSubtituloMobile:
      'Gestioná coberturas desde un solo lugar. Sin Excel, sin drama.',
    heroFeatures: [
      { _key: 'f1', icono: 'briefcase', texto: 'Portal para productores' },
      { _key: 'f2', icono: 'zap', texto: 'Comisiones al instante' },
      { _key: 'f3', icono: 'credit-card', texto: 'Pagos online' },
    ],
    ctaPrimario: { label: 'Empezar gratis' },
    ctaSecundario: { label: 'Conocé el portal →' },
    secciones: [
      {
        _key: 's1',
        _type: 'seccionCta',
        titulo: 'Tu cartera, en un solo lugar.',
        tituloMobile: 'Tu cartera en un solo lugar.',
        descripcion:
          'Cotizá para tus clientes en segundos. Gestioná renovaciones, emisiones y cobranzas sin complicaciones.',
        teamCount: '+21',
        teamLabel: 'personas apoyándote',
        ctaPrimario: { label: 'Empezar gratis' },
        ctaSecundario: { label: 'Hablá con nosotros →' },
      },
    ],
    metaTitulo: 'Woranz — Productores',
    metaDescripcion:
      'Cotizá, emití y gestioná todas tus coberturas desde un solo lugar. Sin Excel, sin papel, sin drama.',
  },
]

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Solo en development' }, { status: 403 })
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error: 'Falta SANITY_API_WRITE_TOKEN en .env.local',
        help: 'Creá un token en https://www.sanity.io/manage/project/hvh56bbh/api#tokens con permisos Editor',
      },
      { status: 500 }
    )
  }

  const results: Array<{ segment: string; status: string; id?: string; error?: string }> = []

  for (const home of homes) {
    try {
      const result = await client.createOrReplace(home as any)
      results.push({ segment: home.segmento, status: 'ok', id: result._id })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ segment: home.segmento, status: 'error', error: message })
    }
  }

  return NextResponse.json({ results })
}
