import Link from "next/link"

import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import {
  DEFAULT_LOGIN_HREF,
  SUPPORT_NAVIGATION_LINKS,
  WORANZ_WHATSAPP_HREF,
} from "@/lib/site-links"

type PlaceholderPageAction = {
  href: string
  label: string
  variant?: "primary" | "secondary"
}

type PlaceholderPageProps = {
  actions?: PlaceholderPageAction[]
  description: string
  eyebrow: string
  notes?: string[]
  title: string
}

export function PlaceholderPage({
  actions = [],
  description,
  eyebrow,
  notes = [],
  title,
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader
        links={SUPPORT_NAVIGATION_LINKS}
        loginHref={DEFAULT_LOGIN_HREF}
      />
      <main className="flex-1">
        <section className="page-shell gap-8 px-page-mobile py-section-mobile md:px-page-wide md:py-section">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-3xl bg-woranz-warm-1 px-6 py-8 md:px-10 md:py-12">
            <span className="eyebrow-badge w-fit bg-white">{eyebrow}</span>
            <div className="flex flex-col gap-4">
              <h1 className="display-title">{title}</h1>
              <p className="section-copy max-w-2xl">{description}</p>
            </div>
            <div className="rounded-2xl border border-woranz-line bg-white px-5 py-5 text-sm leading-7 text-woranz-slate md:px-6">
              Esta página ya existe como destino real para que la navegación no
              quede rota mientras definimos su contenido final.
            </div>
            {notes.length > 0 ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {notes.map((note) => (
                  <li
                    key={note}
                    className="rounded-2xl bg-white/80 px-5 py-4 text-sm leading-6 text-woranz-slate"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-col gap-3 md:flex-row">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={
                    action.variant === "secondary"
                      ? "btn-secondary-outline w-full md:w-auto"
                      : "btn-primary-hero w-full md:w-auto"
                  }
                >
                  {action.label}
                </Link>
              ))}
              {actions.length === 0 ? (
                <>
                  <Link href="/contacto" className="btn-primary-hero w-full md:w-auto">
                    Ir a contacto
                  </Link>
                  <Link
                    href={WORANZ_WHATSAPP_HREF}
                    className="btn-secondary-outline w-full md:w-auto"
                  >
                    WhatsApp
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
