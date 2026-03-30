import { defineField, defineType, defineArrayMember } from 'sanity'

const seccionPasos = defineArrayMember({
  name: 'seccionPasos',
  title: 'Pasos (Cómo funciona)',
  type: 'object',
  fields: [
    defineField({
      name: 'pasos',
      title: 'Pasos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'numero', title: 'Número', type: 'string' },
            { name: 'titulo', title: 'Título', type: 'string' },
            { name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Pasos — Cómo funciona' }
    },
  },
})

const seccionCarouselProductos = defineArrayMember({
  name: 'seccionCarouselProductos',
  title: 'Carousel de Productos',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({
      name: 'productos',
      title: 'Productos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'producto' }] }],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Carousel de Productos' }
    },
  },
})

const seccionCarouselFeatures = defineArrayMember({
  name: 'seccionCarouselFeatures',
  title: 'Carousel de Features',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'imagen', title: 'Imagen', type: 'image', options: { hotspot: true } },
            { name: 'texto', title: 'Texto desktop', type: 'string' },
            { name: 'textoMobile', title: 'Texto mobile', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Carousel de Features' }
    },
  },
})

const seccionGridProductos = defineArrayMember({
  name: 'seccionGridProductos',
  title: 'Grilla de Productos',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({
      name: 'productos',
      title: 'Productos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'producto' }] }],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Grilla de Productos' }
    },
  },
})

const seccionCta = defineArrayMember({
  name: 'seccionCta',
  title: 'CTA final',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({ name: 'tituloMobile', title: 'Título mobile', type: 'string' }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'teamCount', title: 'Número de equipo', type: 'string' }),
    defineField({ name: 'teamLabel', title: 'Label de equipo', type: 'string' }),
    defineField({
      name: 'ctaPrimario',
      title: 'CTA Primario',
      type: 'object',
      fields: [
        { name: 'label', title: 'Texto', type: 'string' },
        { name: 'href', title: 'Link', type: 'string' },
      ],
    }),
    defineField({
      name: 'ctaSecundario',
      title: 'CTA Secundario',
      type: 'object',
      fields: [
        { name: 'label', title: 'Texto', type: 'string' },
        { name: 'href', title: 'Link', type: 'string' },
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'CTA Final' }
    },
  },
})

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
