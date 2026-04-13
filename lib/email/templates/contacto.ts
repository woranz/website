import { emailRow, emailSectionTitle, emailTable, wrapInEmailLayout } from "./base"

export type ContactoEmailData = {
  formId: string
  formTitle: string
  fields: { label: string; value: string }[]
}

export function buildContactoEmail(data: ContactoEmailData): string {
  const rows = data.fields
    .filter((f) => f.value.trim())
    .map((f) => emailRow(f.label, f.value))
    .join("")

  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1A1A2E;">
      Nueva solicitud de contacto
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">
      ${data.formTitle}
    </p>

    ${emailSectionTitle("Datos del contacto")}
    ${emailTable(rows)}
  `

  return wrapInEmailLayout(body, { title: `${data.formTitle} - Woranz` })
}
