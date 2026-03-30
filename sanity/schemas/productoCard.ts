import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productoCard',
  title: 'Card de producto (carrusel)',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link (URL)',
      type: 'string',
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Más opciones para vos', value: 'mas-opciones' },
          { title: 'Seguros pensados para vos', value: 'seguros-pensados' },
          { title: 'Otros paquetes', value: 'otros-paquetes' },
        ],
      },
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'ordenAsc',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'categoria',
      media: 'imagen',
    },
  },
})
