import { defineField, defineArrayMember } from 'sanity'

export const seccionCotizador = defineArrayMember({
  name: 'seccionCotizador',
  title: 'Cotizador',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({
      name: 'modo',
      title: 'Tipo de cotizador',
      type: 'string',
      options: {
        list: [
          { title: 'Cotizador inline - caución', value: 'inline-caucion' },
          { title: 'Cotizador inline - accidentes', value: 'inline-accidentes' },
          { title: 'Contacto directo', value: 'contacto' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'maxWidth',
      title: 'Ancho máximo',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Ancho', value: 'wide' },
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'mostrarPasosMobile',
      title: 'Mostrar pasos en mobile',
      type: 'boolean',
      initialValue: false,
    }),
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
    select: { title: 'titulo', modo: 'modo' },
    prepare({ title, modo }) {
      return { title: title || 'Cotizador', subtitle: modo }
    },
  },
})

export const seccionCobertura = defineArrayMember({
  name: 'seccionCobertura',
  title: 'Coberturas',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', initialValue: 'Qué cubre' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'titulo', title: 'Título', type: 'string' },
            { name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 },
          ],
          preview: {
            select: { title: 'titulo' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Coberturas' }
    },
  },
})

export const seccionFaq = defineArrayMember({
  name: 'seccionFaq',
  title: 'Preguntas frecuentes',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', initialValue: 'Preguntas frecuentes' }),
    defineField({
      name: 'items',
      title: 'Preguntas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'pregunta', title: 'Pregunta', type: 'string' },
            { name: 'respuesta', title: 'Respuesta', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'pregunta' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Preguntas frecuentes' }
    },
  },
})

export const seccionVariantes = defineArrayMember({
  name: 'seccionVariantes',
  title: 'Variantes',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', initialValue: 'Variantes' }),
    defineField({
      name: 'items',
      title: 'Variantes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'titulo', title: 'Título', type: 'string' },
            { name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 },
            {
              name: 'items',
              title: 'Bullets',
              type: 'array',
              of: [{ type: 'string' }],
            },
            { name: 'href', title: 'Link', type: 'string' },
          ],
          preview: {
            select: { title: 'titulo', subtitle: 'descripcion' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Variantes' }
    },
  },
})

export const seccionRequisitos = defineArrayMember({
  name: 'seccionRequisitos',
  title: 'Requisitos',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', initialValue: 'Requisitos' }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Lista',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Requisitos' }
    },
  },
})

export const seccionPasos = defineArrayMember({
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

export const seccionCarouselProductos = defineArrayMember({
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

export const seccionCarouselFeatures = defineArrayMember({
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

export const seccionCarouselPaquetes = defineArrayMember({
  name: 'seccionCarouselPaquetes',
  title: 'Carousel de Paquetes',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Paquetes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icono',
              title: 'Ícono',
              type: 'string',
              options: {
                list: [
                  { title: 'Música', value: 'music' },
                  { title: 'Persona', value: 'user' },
                  { title: 'Personas', value: 'users' },
                ],
              },
            },
            { name: 'titulo', title: 'Título', type: 'string' },
            { name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 },
            { name: 'descripcionMobile', title: 'Descripción mobile', type: 'text', rows: 2 },
            {
              name: 'cta',
              title: 'Tipo de CTA',
              type: 'string',
              options: {
                list: [
                  { title: 'Botón', value: 'button' },
                  { title: 'Link', value: 'link' },
                ],
              },
              initialValue: 'link',
            },
          ],
          preview: {
            select: { title: 'titulo' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Carousel de Paquetes' }
    },
  },
})

export const seccionExplicacion = defineArrayMember({
  name: 'seccionExplicacion',
  title: 'Explicación del producto',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', initialValue: 'Qué es' }),
    defineField({ name: 'cuerpo', title: 'Cuerpo', type: 'text', rows: 6 }),
    defineField({ name: 'cuerpoMobile', title: 'Cuerpo (mobile)', type: 'text', rows: 4, description: 'Versión más corta para mobile. Si se deja vacío se usa el cuerpo principal.' }),
  ],
  preview: {
    select: { title: 'titulo' },
    prepare({ title }) {
      return { title: title || 'Explicación del producto' }
    },
  },
})

export const seccionGridProductos = defineArrayMember({
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

export const seccionCta = defineArrayMember({
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
