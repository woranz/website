import type { FormConfig } from "../types"

export const aeronavegacion: FormConfig = {
  id: "aeronavegacion",
  titulo: "Hablá con un especialista",
  destinatario: "patrimoniales@woranz.com",
  subjectTemplate: "Contacto Aeronavegación — {{nombre}}",
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
      name: "comentarios",
      type: "textarea",
      label: "Comentarios",
      placeholder: "Contanos qué operación aérea querés asegurar",
    },
  ],
}
