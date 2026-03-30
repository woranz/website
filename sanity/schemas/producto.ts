import { defineField, defineType } from 'sanity'

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
      name: 'cotizador',
      title: 'Cotizador / flujo comercial',
      type: 'object',
      fields: [
        defineField({
          name: 'modo',
          title: 'Modo',
          type: 'string',
          options: {
            list: [
              { title: 'Cotizador inline - caución', value: 'inline-caucion' },
              { title: 'Cotizador inline - accidentes', value: 'inline-accidentes' },
              { title: 'Contacto directo', value: 'contacto' },
              { title: 'Sin cotizador', value: 'none' },
            ],
          },
          initialValue: 'none',
        }),
        defineField({
          name: 'titulo',
          title: 'Título de la sección',
          type: 'string',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'ctaLabel',
          title: 'CTA label',
          type: 'string',
        }),
        defineField({
          name: 'ctaHref',
          title: 'CTA href',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'variantes',
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
            select: {
              title: 'titulo',
              subtitle: 'descripcion',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'requisitos',
      title: 'Requisitos',
      type: 'object',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'items',
          title: 'Lista',
          type: 'array',
          of: [{ type: 'string' }],
        }),
      ],
    }),
    defineField({
      name: 'coberturas',
      title: 'Coberturas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icono', title: 'Ícono', type: 'image', options: { hotspot: true } },
            { name: 'titulo', title: 'Título', type: 'string' },
            { name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 },
          ],
          preview: {
            select: {
              title: 'titulo',
              media: 'icono',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'pasos',
      title: 'Pasos (Cómo funciona)',
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
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'pregunta', title: 'Pregunta', type: 'string' },
            { name: 'respuesta', title: 'Respuesta', type: 'text', rows: 3 },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaTitulo',
      title: 'CTA - Título',
      type: 'string',
    }),
    defineField({
      name: 'ctaSubtitulo',
      title: 'CTA - Subtítulo',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaBoton',
      title: 'CTA - Texto del botón',
      type: 'string',
    }),
    defineField({
      name: 'ctaPrimario',
      title: 'CTA primario',
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
      title: 'CTA secundario',
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
      name: 'productosRelacionados',
      title: 'Productos relacionados',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'producto' }],
        },
      ],
      description: 'Productos que aparecen en "Más opciones para vos"',
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
