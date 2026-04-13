import type { FormConfig } from "../types"

export const caucionesTradicionales: FormConfig = {
  id: "cauciones-tradicionales",
  titulo: "Solicitá tu caución",
  destinatario: "caucion@woranz.com",
  cc: [],
  subjectTemplate: "Contacto Caución Tradicional — {{nombre}}",
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
      name: "tipoCaucion",
      type: "select",
      label: "Tipo de caución",
      placeholder: "Seleccioná el tipo",
      required: true,
      options: [
        { label: "Garantía de mantenimiento de oferta", value: "mantenimiento-oferta" },
        { label: "Garantía de cumplimiento de contrato", value: "cumplimiento-contrato" },
        { label: "Garantía de anticipo financiero", value: "anticipo-financiero" },
        { label: "Garantía de fondo de reparo", value: "fondo-reparo" },
        { label: "Caución de suministro", value: "suministro" },
        { label: "Caución de servicios", value: "servicios" },
        { label: "Caución de actividad o profesión", value: "actividad-profesion" },
      ],
    },
    {
      name: "comentarios",
      type: "textarea",
      label: "Comentarios",
      placeholder: "Contanos qué necesitás",
    },
  ],
}
