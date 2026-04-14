import { defineField, defineType } from 'sanity'
import {
  seccionCotizador,
  seccionCobertura,
  seccionExplicacion,
  seccionFaq,
  seccionVariantes,
  seccionRequisitos,
  seccionPasos,
  seccionCarouselProductos,
  seccionCarouselFeatures,
  seccionCarouselPaquetes,
  seccionGridProductos,
  seccionCta,
} from './secciones'
import { seoField } from './fields/seo'

export default defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre del producto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'segmento',
      title: 'Segmento',
      type: 'string',
      options: {
        list: [
          { title: 'Personas', value: 'personas' },
          { title: 'Empresas', value: 'empresas' },
          { title: 'Productores', value: 'productores' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destacado',
      title: 'Destacado',
      type: 'boolean',
      initialValue: false,
      description: 'Usalo para priorizar productos en listados o destacados.',
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      initialValue: 999,
      description: 'Menor número = aparece antes.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'nombre',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge (etiqueta)',
      type: 'string',
      description: 'Ej: "Caución alquiler"',
    }),
    defineField({
      name: 'navIcon',
      title: 'Ícono de navegación',
      type: 'string',
      description: 'Nombre del ícono de Lucide para el menú de coberturas. Ej: "key", "home", "shield", "flame", "smartphone", "bike", "laptop"',
    }),
    defineField({
      name: 'headline',
      title: 'Headline principal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen Hero',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'cardImage',
      title: 'Imagen de card',
      description: 'Se usa en carruseles y grillas de productos. Si falta, el frontend usa la hero.',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ctaPrimario',
      title: 'CTA primario (hero)',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'ctaSecundario',
      title: 'CTA secundario (hero)',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Texto',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'ocultarCtaSecundario',
      title: 'Ocultar CTA secundario del hero',
      type: 'boolean',
      initialValue: false,
    }),
    seoField,
    defineField({
      name: 'secciones',
      title: 'Secciones de la página',
      description: 'Arrastrá para reordenar las secciones del producto.',
      type: 'array',
      of: [
        seccionCotizador,
        seccionExplicacion,
        seccionCobertura,
        seccionFaq,
        seccionVariantes,
        seccionRequisitos,
        seccionPasos,
        seccionCarouselProductos,
        seccionCarouselFeatures,
        seccionCarouselPaquetes,
        seccionGridProductos,
        seccionCta,
      ],
    }),
    defineField({
      name: 'pendientesValidacion',
      title: 'Pendientes de validación',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Checklist interno. Si tiene elementos, el producto no debería publicarse.',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'segmento',
      media: 'heroImage',
    },
  },
  orderings: [
    {
      title: 'Destacados primero',
      name: 'destacadosPrimero',
      by: [
        { field: 'destacado', direction: 'desc' },
        { field: 'orden', direction: 'asc' },
        { field: 'nombre', direction: 'asc' },
      ],
    },
    {
      title: 'Orden manual',
      name: 'ordenAsc',
      by: [
        { field: 'orden', direction: 'asc' },
        { field: 'nombre', direction: 'asc' },
      ],
    },
  ],
})
