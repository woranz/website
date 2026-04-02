/**
 * Base email layout with Woranz branding.
 * Reusable by any form template — just pass the body HTML.
 */
export function wrapInEmailLayout(
  bodyHtml: string,
  options?: { title?: string }
): string {
  const title = options?.title ?? "Woranz"

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#FBF9F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A2E;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FBF9F6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 24px;">
              <img src="https://www.woranz.com/images/woranz-logo.png" alt="Woranz" width="124" height="20" style="display:block;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#FFFFFF;padding:32px;border-radius:12px 12px 0 0;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F3F1EE;padding:20px 32px;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.5;">
                Este email fue generado automáticamente por Woranz.<br />
                © ${new Date().getFullYear()} Woranz. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Helper to create a styled section heading inside an email */
export function emailSectionTitle(text: string): string {
  return `<h2 style="margin:24px 0 12px;font-size:16px;font-weight:700;color:#1A1A2E;border-bottom:1px solid #E8E4DF;padding-bottom:8px;">${text}</h2>`
}

/** Helper to create a label-value row */
export function emailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;font-size:13px;color:#6B7280;width:40%;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:#1A1A2E;font-weight:500;">${value}</td>
  </tr>`
}

/** Wrap rows in a table */
export function emailTable(rows: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}</table>`
}
