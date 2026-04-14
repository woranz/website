import type { FormConfig } from "../types"

export const garantiasAduaneras: FormConfig = {
  id: "garantias-aduaneras",
  titulo: "Consultá por tu garantía aduanera",
  destinatario: "caucion@woranz.com",
  cc: [],
  subjectTemplate: "Contacto Garantía Aduanera — {{nombre}}",
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
      name: "tipoOperacion",
      type: "select",
      label: "Tipo de operación",
      placeholder: "Seleccioná el tipo",
      required: true,
      options: [
        { label: "Importación temporal", value: "importacion-temporal" },
        { label: "Exportación temporal", value: "exportacion-temporal" },
        { label: "Tránsito", value: "transito" },
        { label: "Otra operación aduanera", value: "otra" },
      ],
    },
    {
      name: "comentarios",
      type: "textarea",
      label: "Comentarios",
      placeholder: "Contanos sobre la operación aduanera que necesitás garantizar",
    },
  ],
}
