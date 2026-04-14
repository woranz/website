"use client"

import { ContactForm } from "@/components/ContactForm"
import type { FormConfig } from "@/lib/forms/types"
import { getQuoterConfig, type QuoterConfig } from "@/lib/quoter-configs"

function QuoteSummary({
  quoterConfig,
  searchParams,
}: {
  quoterConfig: QuoterConfig
  searchParams: Record<string, string | undefined>
}) {
  const precio = searchParams.precio ? Number(searchParams.precio) : null

  const summaryItems: Array<{ label: string; value: string }> = []

  for (const field of quoterConfig.fields) {
    const rawValue = searchParams[field.name]
    if (!rawValue) continue

    if (field.options) {
      const option = field.options.find((o) => o.value === rawValue)
      summaryItems.push({ label: field.label, value: option?.label ?? rawValue })
    } else if (field.type === "money") {
      const num = Number(rawValue)
      summaryItems.push({
        label: field.label,
        value: num
          ? new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            }).format(num)
          : rawValue,
      })
    } else if (field.suffix) {
      summaryItems.push({ label: field.label, value: `${rawValue} ${field.suffix}` })
    } else {
      summaryItems.push({ label: field.label, value: rawValue })
    }
  }

  if (!precio && summaryItems.length === 0) return null

  return (
    <div className="mx-auto mb-8 w-full max-w-xl rounded-2xl bg-woranz-warm-1 px-6 py-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-woranz-muted">
        Tu cotización
      </h3>
      <div className="flex flex-col gap-2">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-woranz-text">{item.label}</span>
            <span className="font-medium text-woranz-ink">{item.value}</span>
          </div>
        ))}
        {precio ? (
          <div className="mt-2 flex items-center justify-between border-t border-woranz-warm-4 pt-3">
            <span className="text-base font-semibold text-woranz-ink">Precio estimado</span>
            <span className="font-display text-2xl font-bold text-woranz-ink">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(precio)}
              <span className="ml-1 text-sm font-normal text-woranz-text">
                {quoterConfig.priceLabel}
              </span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ContratacionView({
  formConfig,
  quoterConfigId,
  searchParams,
  productName,
  returnHref,
}: {
  formConfig: FormConfig
  quoterConfigId: string
  searchParams: Record<string, string | undefined>
  productName: string
  returnHref: string
}) {
  const quoterConfig = getQuoterConfig(quoterConfigId)

  return (
    <div className="mx-auto w-full max-w-page px-page-mobile md:px-page">
      <div className="mx-auto w-full max-w-xl pb-16 pt-8 md:pt-10">
        <ContactForm
          config={formConfig}
          productName={productName}
          returnHref={returnHref}
          searchParams={searchParams}
        />
        {quoterConfig && (
          <QuoteSummary
            quoterConfig={quoterConfig}
            searchParams={searchParams}
          />
        )}
      </div>
    </div>
  )
}
