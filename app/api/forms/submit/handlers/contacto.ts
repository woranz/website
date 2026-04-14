import type { FormConfig } from "@/lib/forms/types"
import { sendEmail } from "@/lib/email/send"
import { sanitizeEmailHeaderValue } from "@/lib/email/sanitize"
import { DEV_EMAIL, isNonProductionEnv } from "@/lib/email/dev-override"
import {
  buildContactoEmail,
  type ContactoEmailData,
} from "@/lib/email/templates/contacto"

export async function handleContacto(
  config: FormConfig,
  values: Record<string, string>
) {
  const fields: { label: string; value: string }[] = []

  for (const field of config.campos) {
    fields.push({
      label: field.label,
      value: values[field.name] ?? "",
    })
  }

  let subject = config.subjectTemplate ?? `Contacto — ${config.titulo}`

  for (const { label, value } of fields) {
    subject = subject.replace(
      `{{${label}}}`,
      sanitizeEmailHeaderValue(value)
    )
  }

  for (const field of config.campos) {
    subject = subject.replace(
      `{{${field.name}}}`,
      sanitizeEmailHeaderValue(values[field.name] ?? "")
    )
  }

  const emailData: ContactoEmailData = {
    formId: config.id,
    formTitle: config.titulo,
    fields,
  }

  const html = buildContactoEmail(emailData)

  await sendEmail({
    to: isNonProductionEnv() ? DEV_EMAIL : config.destinatario,
    cc: isNonProductionEnv()
      ? undefined
      : config.cc && config.cc.length > 0
        ? config.cc
        : undefined,
    subject: sanitizeEmailHeaderValue(subject),
    html,
  })
}
