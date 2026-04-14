import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'
import { buildProductPath } from '@/lib/product-paths'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    producto: defineLocations({
      select: {
        nombre: 'nombre',
        segmento: 'segmento',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          ...(doc?.segmento && doc?.slug
            ? [
                {
                  title: doc.nombre || 'Producto',
                  href: buildProductPath(doc.segmento, doc.slug),
                },
              ]
            : []),
          ...(doc?.segmento === 'personas'
            ? [{ title: 'Home Personas', href: '/' }]
            : []),
          ...(doc?.segmento === 'empresas'
            ? [{ title: 'Home Empresas', href: '/empresas' }]
            : []),
        ],
      }),
    }),
    paginaHome: defineLocations({
      select: {
        segmento: 'segmento',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.segmento === 'empresas' ? 'Home Empresas' : 'Home Personas',
            href: doc?.segmento === 'empresas' ? '/empresas' : '/',
          },
        ],
      }),
    }),

    settings: defineLocations({
      message: 'Configuración global del sitio',
      tone: 'caution',
    }),
  },
}
