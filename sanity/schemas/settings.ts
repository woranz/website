import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del sitio',
      type: 'string',
      initialValue: 'Woranz',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción (SEO)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'homeHeadline',
      title: 'Home - Headline',
      type: 'string',
    }),
    defineField({
      name: 'homeSubtitulo',
      title: 'Home - Subtítulo',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'homeFaqs',
      title: 'Home - FAQs',
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
      name: 'contactoTitulo',
      title: 'Contacto - Título',
      type: 'string',
    }),
    defineField({
      name: 'contactoSubtitulo',
      title: 'Contacto - Subtítulo',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaPrimarioHref',
      title: 'CTA global primario - Link',
      type: 'string',
    }),
    defineField({
      name: 'ctaSecundarioHref',
      title: 'CTA global secundario - Link',
      type: 'string',
    }),
    defineField({
      name: 'whatsappNumero',
      title: 'WhatsApp - Número',
      type: 'string',
      description: 'Formato: 5491112345678',
    }),
    defineField({
      name: 'emailContacto',
      title: 'Email de contacto',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuración del sitio',
      }
    },
  },
})
