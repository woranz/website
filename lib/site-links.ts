export type SiteLink = {
  href: string
  label: string
}

export const WORANZ_WHATSAPP_HREF = "https://wa.me/5491160061771"
export const PRODUCT_QUOTER_SECTION_ID = "cotizador"
export const DEFAULT_LOGIN_HREF = "https://asegurados.woranz.com"

export const SUPPORT_NAVIGATION_LINKS: SiteLink[] = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

const QUOTE_LABEL_PATTERN = /\b(cotiz|contrat|propuesta|garant[ií]a)\b/i
const CONTACT_LABEL_PATTERN = /\b(habl|contact|especialista|whatsapp|escrib)\b/i

export function resolveProductCtaHref({
  contactHref,
  href,
  hasQuoteSection,
  label,
}: {
  contactHref?: string
  href?: string
  hasQuoteSection: boolean
  label: string
}) {
  const trimmedHref = href?.trim()

  if (trimmedHref && trimmedHref !== "#") {
    return trimmedHref
  }

  if (hasQuoteSection && QUOTE_LABEL_PATTERN.test(label)) {
    return `#${PRODUCT_QUOTER_SECTION_ID}`
  }

  if (CONTACT_LABEL_PATTERN.test(label)) {
    return contactHref
  }

  return undefined
}
