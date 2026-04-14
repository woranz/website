import type { FormConfig } from "../types"

export const caucionJudicial: FormConfig = {
  id: "caucion-judicial",
  titulo: "Consultá por tu caución judicial",
  destinatario: "caucion@woranz.com",
  cc: [],
  subjectTemplate: "Contacto Caución Judicial — {{nombre}}",
  tituloExito: "¡Solicitud enviada!",
  descripcionExito: "Recibimos tus datos. Te contactamos en menos de 24hs.",
  campos: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre completo",
      placeholder: "Tu nombre",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "tu@email.com",
      required: true,
    },
    {
      name: "telefono",
      type: "tel",
      label: "Teléfono",
      placeholder: "Ej: 11 2345 6789",
      required: true,
    },
    {
      name: "empresa",
      type: "text",
      label: "Empresa",
      placeholder: "Nombre de tu empresa",
    },
    {
      name: "tipoGarantia",
      type: "select",
      label: "Tipo de garantía",
      placeholder: "Seleccioná el tipo",
      required: true,
      options: [
        { label: "Embargo", value: "embargo" },
        { label: "Medida cautelar", value: "medida-cautelar" },
        { label: "Contracautela", value: "contracautela" },
        { label: "Otra garantía judicial", value: "otra" },
      ],
    },
    {
      name: "juzgado",
      type: "text",
      label: "Juzgado o Tribunal",
      placeholder: "Ej: Juzgado Nacional en lo Comercial N° 5",
    },
    {
      name: "comentarios",
      type: "textarea",
      label: "Comentarios",
      placeholder: "Contanos sobre el proceso judicial que requiere garantía",
    },
  ],
}
