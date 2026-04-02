import sgMail from "@sendgrid/mail"

export type EmailAttachment = {
  content: string // base64
  filename: string
  type: string
}

export type EmailOptions = {
  to: string | string[]
  cc?: string | string[]
  subject: string
  html: string
  attachments?: EmailAttachment[]
}

export async function sendEmail(options: EmailOptions) {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY is not configured")
  }

  sgMail.setApiKey(apiKey)

  const msg = {
    to: options.to,
    cc: options.cc,
    from: process.env.SENDGRID_FROM_EMAIL ?? "live@woranz.com",
    subject: options.subject,
    html: options.html,
    attachments: options.attachments?.map((a) => ({
      content: a.content,
      filename: a.filename,
      type: a.type,
      disposition: "attachment" as const,
    })),
  }

  await sgMail.send(msg)
}
