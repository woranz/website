import { defineField } from "sanity"

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description:
        "Si se deja vacío, el frontend deriva el título desde el contenido principal.",
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 2,
      description:
        "Si se deja vacío, el frontend deriva la descripción desde el contenido principal.",
    }),
    defineField({
      name: "image",
      title: "Open Graph image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
})
