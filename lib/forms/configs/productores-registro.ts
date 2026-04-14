import type { FormConfig } from "../types"
import { PROVINCIAS } from "@/lib/provincias"

export const productoresRegistro: FormConfig = {
  id: "productores-registro",
  titulo: "Completá tu alta",
  destinatario: "live@woranz.com",
  subjectTemplate: "Alta Productores — {{nombre}}",
  submitLabel: "Quiero sumarme",
  tituloExito: "¡Alta recibida!",
  descripcionExito:
    "Nos dejaste tus datos. Te escribimos para contarte los próximos pasos y activar tu ingreso.",
  campos: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre y apellido",
      placeholder: "Cómo te llamás",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 120,
      },
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
      name: "provincia",
      type: "select",
      label: "Provincia",
      required: true,
      placeholder: "Seleccioná tu provincia",
      options: PROVINCIAS.map((provincia) => ({
        label: provincia.label,
        value: provincia.value,
      })),
      validation: {
        maxLength: 120,
      },
    },
    {
      name: "perfil",
      type: "select",
      label: "Cómo operás hoy",
      placeholder: "Seleccioná una opción",
      required: true,
      options: [
        {
          label: "Estoy arrancando como productor",
          value: "arrancando",
        },
        {
          label: "Ya tengo cartera propia",
          value: "cartera-propia",
        },
        {
          label: "Trabajo con una organización o broker",
          value: "organizacion-broker",
        },
      ],
    },
    {
      name: "matricula",
      type: "text",
      label: "Matrícula SSN",
      placeholder: "Si ya la tenés, dejala acá",
      validation: {
        maxLength: 40,
        pattern: {
          regex: "^[0-9A-Za-z\\-/\\s]*$",
          message: "Ingresá una matrícula válida",
        },
      },
    },
    {
      name: "comentarios",
      type: "textarea",
      label: "Contanos un poco más",
      placeholder:
        "Si ya tenés cartera, equipo o una necesidad puntual, escribila acá.",
      validation: {
        maxLength: 500,
      },
    },
  ],
}
