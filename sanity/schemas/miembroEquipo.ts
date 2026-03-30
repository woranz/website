import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'miembroEquipo',
  title: 'Miembro del equipo',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rol',
      title: 'Rol / Puesto',
      type: 'string',
    }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'mostrarEnHome',
      title: 'Mostrar en Home',
      type: 'boolean',
      initialValue: true,
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
      title: 'nombre',
      subtitle: 'rol',
      media: 'foto',
    },
  },
})
