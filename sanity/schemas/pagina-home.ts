import { defineField, defineType } from 'sanity'
import {
  seccionPasos,
  seccionCarouselProductos,
  seccionCarouselFeatures,
  seccionGridProductos,
  seccionCta,
} from './secciones'
import { seoField } from './fields/seo'

export default defineType({
  name: 'paginaHome',
  title: 'Página Home',
  type: 'document',
  fields: [
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
      name: 'heroTitulo',
      title: 'Hero — Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitulo',
      title: 'Hero — Subtítulo',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroSubtituloMobile',
      title: 'Hero — Subtítulo (mobile)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroFeatures',
      title: 'Hero — Features (pills)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icono', title: 'Ícono (lucide name)', type: 'string' },
            { name: 'texto', title: 'Texto', type: 'string' },
          ],
          preview: {
            select: { title: 'texto' },
          },
        },
      ],
    }),
    defineField({
      name: 'heroImagen',
      title: 'Hero — Imagen',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaPrimario',
      title: 'Hero — CTA Primario',
      type: 'object',
      fields: [
        { name: 'label', title: 'Texto', type: 'string' },
        { name: 'href', title: 'Link', type: 'string' },
      ],
    }),
    defineField({
      name: 'ctaSecundario',
      title: 'Hero — CTA Secundario',
      type: 'object',
      fields: [
        { name: 'label', title: 'Texto', type: 'string' },
        { name: 'href', title: 'Link', type: 'string' },
      ],
    }),
    seoField,
    defineField({
      name: 'secciones',
      title: 'Secciones',
      description: 'Arrastrá para reordenar las secciones de la página.',
      type: 'array',
      of: [
        seccionPasos,
        seccionCarouselProductos,
        seccionCarouselFeatures,
        seccionGridProductos,
        seccionCta,
      ],
    }),
    defineField({
      name: 'metaTitulo',
      title: 'Meta — Título (SEO)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescripcion',
      title: 'Meta — Descripción (SEO)',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'heroTitulo',
      subtitle: 'segmento',
    },
  },
})
