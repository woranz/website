import type { FormConfig } from "../types"

export const roboNotebook: FormConfig = {
  id: "robo-notebook",
  titulo: "Contratá tu seguro de notebook",
  destinatario: "patrimoniales@woranz.com",
  subjectTemplate: "Contratación Robo de Notebook — {{nombre}}",
  tituloExito: "¡Solicitud enviada!",
  descripcionExito: "Recibimos tus datos. Te contactamos en menos de 24hs.",
  campos: [
    { name: "nombre", type: "text", label: "Nombre completo", placeholder: "Tu nombre", required: true },
    { name: "email", type: "email", label: "Email", placeholder: "tu@email.com", required: true },
    { name: "telefono", type: "tel", label: "Teléfono", placeholder: "Ej: 11 2345 6789", required: true },
    { name: "comentarios", type: "textarea", label: "Comentarios", placeholder: "¿Algo más que quieras contarnos?" },
  ],
}
