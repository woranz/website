import { sendEmail } from "@/lib/email/send"
import {
  buildContactoEmail,
  type ContactoEmailData,
} from "@/lib/email/templates/contacto"
import { getFormConfig } from "@/lib/forms/registry"

export async function handleContacto(formData: FormData) {
  const formId = formData.get("_formId") as string
  if (!formId) {
    throw new Error("Falta el identificador del formulario.")
  }

  const config = getFormConfig(formId)
  if (!config) {
    throw new Error(`Formulario "${formId}" no encontrado.`)
  }

  // Extract and validate fields
  const fields: { label: string; value: string }[] = []

  for (const field of config.campos) {
    const value = (formData.get(field.name) as string) ?? ""

    if (field.required && !value.trim()) {
      throw new Error(`El campo "${field.label}" es obligatorio.`)
    }

    fields.push({ label: field.label, value })
  }

  // Build subject from template or default
  let subject = config.subjectTemplate ?? `Contacto — ${config.titulo}`

  // Replace {{fieldName}} placeholders in subject
  for (const { label, value } of fields) {
    subject = subject.replace(`{{${label}}}`, value)
  }

  // Also support replacing by field name
  for (const field of config.campos) {
    const value = (formData.get(field.name) as string) ?? ""
    subject = subject.replace(`{{${field.name}}}`, value)
  }

  const emailData: ContactoEmailData = {
    formId,
    formTitle: config.titulo,
    fields,
  }

  const html = buildContactoEmail(emailData)

  await sendEmail({
    to:
      process.env.NODE_ENV === "development"
        ? "marcos.moreira@woranz.com"
        : config.destinatario,
    cc:
      process.env.NODE_ENV === "development"
        ? undefined
        : config.cc && config.cc.length > 0
          ? config.cc
          : undefined,
    subject,
    html,
  })
}
