import Link from "next/link"
import Image from "next/image"
import { MusicNote03Icon } from "hugeicons-react"
import {
  Briefcase,
  Building,
  ArrowRight,
  ChevronRight,
  CreditCard,
  FileText,
  Package,
  Scale,
  ShieldCheck,
  User,
  Users,
  Zap,
} from "lucide-react"

import { ProductSearchList } from "@/components/ProductSearchList"
import { CarouselWithHeader } from "@/components/Carousel"
import { ContactForm } from "@/components/ContactForm"
import { CaucionQuoterDesktop, CaucionQuoterMobile } from "@/components/CaucionQuoter"
import { GenericQuoterDesktop, GenericQuoterMobile } from "@/components/GenericQuoter"
import { QuoterDesktop, QuoterMobile } from "@/components/Quoter"
import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { SegmentTabs } from "@/components/site/segment-tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TeamAvatars } from "@/components/ui/team-avatars"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  PRODUCT_QUOTER_SECTION_ID,
  SUPPORT_NAVIGATION_LINKS,
} from "@/lib/site-links"
import type {
  CoverageItem,
  FaqItem,
  FeatureCarouselItem,
  PackageCarouselItem,
  ProductCarouselItem,
  ProductGridItem,
  ProductPageData,
  ProductPageSection,
  ProductStep,
} from "@/lib/product-pages"
import { getFormConfig } from "@/lib/forms/registry"
import { cn } from "@/lib/utils"

const PRODUCERS_HERO_CTA = {
  href: "/productores/registro",
  label: "Registrate como productor",
} as const

const PRODUCT_COVERAGES_SECTION_ID = "coberturas"

function ActionButton({
  className,
  href,
  label,
}: {
  className: string
  href?: string
  label: string
}) {
  const hasArrow = label.includes("→")
  const text = hasArrow ? label.replace(/\s*→\s*$/, "") : label
  const content = hasArrow ? (
    <>{text} <ArrowRight className="ml-2 h-4 w-4" /></>
  ) : (
    text
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  )
}

function HeroActions({ page }: { page: ProductPageData }) {
  if (page.isHome && page.segment === "productores") {
    return (
      <div className="flex w-full flex-col items-center gap-4 pt-6 md:w-auto md:flex-row md:gap-6 md:pt-8 lg:pt-6">
        <ActionButton
          className="btn-primary-hero"
          href={PRODUCERS_HERO_CTA.href}
          label={PRODUCERS_HERO_CTA.label}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 pt-6 md:w-auto md:flex-row md:gap-6 md:pt-8 lg:pt-6">
      <ActionButton
        className="btn-primary-hero"
        href={page.hero.primaryCtaHref}
        label={page.hero.primaryCta}
      />
      {page.hero.secondaryCta ? (
        <ActionButton
          className="btn-secondary-outline"
          href={page.hero.secondaryCtaHref}
          label={page.hero.secondaryCta}
        />
      ) : null}
    </div>
  )
}

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  building: Building,
  "credit-card": CreditCard,
  "shield-check": ShieldCheck,
  users: Users,
  zap: Zap,
}

function HeroFeatures({ features }: { features: Array<{ icon: string; label: string }> }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
      {features.map((feature) => {
        const Icon = FEATURE_ICONS[feature.icon]
        return (
          <div
            key={feature.label}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-[#6B4C3B]"
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            <span>{feature.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function HeroSection({ page }: { page: ProductPageData }) {
  return (
    <section className="page-shell items-center gap-12 px-page-mobile pt-10 md:gap-16 md:px-page md:pt-hero-top">
      {page.isHome ? <SegmentTabs /> : null}
      <div className="flex flex-col items-center gap-4">
        {page.hero.badge ? (
          <Badge
            variant="secondary"
            className="eyebrow-badge h-auto border-0 bg-woranz-warm-1 px-4 py-1.5 text-xs md:px-5 md:py-2 md:text-sm"
          >
            {page.hero.badge}
          </Badge>
        ) : null}

        <div className="flex w-full max-w-hero-copy flex-col items-center gap-4 md:gap-5">
          <h1 className="display-title text-center">
            {page.hero.title}
          </h1>
          <p className="section-copy max-w-copy text-center">
            <span className="hidden md:inline">
              {page.hero.description}
            </span>
            <span className="md:hidden">
              {page.hero.descriptionMobile ?? page.hero.description}
            </span>
          </p>
        </div>

        <HeroActions page={page} />

        {page.hero.features?.length ? <HeroFeatures features={page.hero.features} /> : null}
      </div>

      <div className="hero-media-frame relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-woranz-warm-1 to-slate-200 md:self-center md:rounded-2xl">
        <Image
          src={page.hero.imageSrc}
          alt={page.hero.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>
    </section>
  )
}

function SectionHeader({
  title,
  description,
}: {
  description?: string
  title: string
}) {
  return (
    <div className="flex w-full max-w-content flex-col items-center gap-2 md:gap-1">
      <h2 className="section-title text-center">{title}</h2>
      {description ? (
        <p className="section-copy text-center">{description}</p>
      ) : null}
    </div>
  )
}

function QuoteSection({ section, basePath }: { section: Extract<ProductPageSection, { type: "quote" }>; basePath: string }) {
  const contactConfig =
    section.quoter === "contacto" && section.formConfigId
      ? getFormConfig(section.formConfigId)
      : undefined

  if (section.quoter === "contacto" && !contactConfig) return null
  if (section.quoter === "generico" && !section.quoterConfigId) return null

  return (
    <section
      id={PRODUCT_QUOTER_SECTION_ID}
      className="page-shell gap-8 px-page-mobile py-section-mobile md:gap-10 md:px-page-wide md:py-section scroll-mt-24"
    >
      <div className="flex flex-col items-center gap-8">
        <SectionHeader title={section.title} description={section.description} />
        <Card
          className={cn(
            "quote-card w-full border-none px-0 py-0 ring-0",
            section.maxWidth === "wide"
              ? "max-w-quoter md:max-w-quoter"
              : "max-w-quoter-mobile md:max-w-none"
          )}
        >
          <CardContent className="p-0">
            {section.quoter === "contacto" && contactConfig ? (
              <ContactForm
                config={contactConfig}
                embedded
                productName={section.title}
                returnHref={basePath}
              />
            ) : section.quoter === "caucion" ? (
              <>
                <CaucionQuoterMobile />
                <CaucionQuoterDesktop />
              </>
            ) : section.quoter === "generico" && section.quoterConfigId ? (
              <>
                <GenericQuoterMobile configId={section.quoterConfigId} basePath={basePath} />
                <GenericQuoterDesktop configId={section.quoterConfigId} basePath={basePath} />
              </>
            ) : (
              <>
                <QuoterMobile />
                <QuoterDesktop />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="hidden flex-col items-center gap-5 pt-8 md:flex">
        <div className="flex w-full items-stretch">
          {section.steps.map((step, index) => (
            <StepRowItem
              key={step.number}
              step={step}
              showSeparator={index < section.steps.length - 1}
            />
          ))}
        </div>
      </div>

      {section.mobileSteps ? (
        <div className="flex flex-col gap-8 md:hidden">
          {section.steps.map((step, index) => (
            <StepColumnItem
              key={step.number}
              step={step}
              bordered={index < section.steps.length - 1}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function StepRowItem({
  step,
  showSeparator,
}: {
  showSeparator: boolean
  step: ProductStep
}) {
  return (
    <>
      <div className="flex flex-1 flex-col gap-3">
        <span className="step-number">{step.number}</span>
        <span className="text-xl font-bold leading-6 text-woranz-slate">
          {step.title}
        </span>
        <p className="text-body text-woranz-text">{step.description}</p>
      </div>
      {showSeparator ? (
        <Separator
          orientation="vertical"
          className="mx-6 hidden bg-woranz-line md:block"
        />
      ) : null}
    </>
  )
}

function StepColumnItem({
  bordered,
  step,
}: {
  bordered: boolean
  step: ProductStep
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 pb-8",
        bordered ? "border-b border-woranz-line" : ""
      )}
    >
      <span className="step-number">{step.number}</span>
      <span className="text-card-mobile font-bold text-woranz-ink">
        {step.title}
      </span>
      <p className="text-body text-woranz-text">{step.description}</p>
    </div>
  )
}

function ExplanationSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "explanation" }>
}) {
  const desktopText = section.body
  const mobileText = section.bodyMobile ?? section.body
  const desktopParagraphs = desktopText.split(/\n\n+/).filter(Boolean)
  const mobileParagraphs = mobileText.split(/\n\n+/).filter(Boolean)

  return (
    <section className="page-shell gap-4 px-page-mobile py-section-mobile md:gap-5 md:px-page-wide md:py-section">
      <h2 className="section-title">{section.title}</h2>
      <div className="flex flex-col gap-3 md:max-w-[50%] md:gap-4">
        {desktopParagraphs.map((p, i) => (
          <p
            key={i}
            className="hidden text-body leading-relaxed text-woranz-text md:block md:text-lg md:leading-8"
          >
            {p}
          </p>
        ))}
        {mobileParagraphs.map((p, i) => (
          <p
            key={i}
            className="text-body leading-relaxed text-woranz-text md:hidden"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}

function CoverageSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "coverage" }>
}) {
  const mobileItems = section.columns.flat()

  return (
    <section className="page-shell gap-8 px-page-mobile py-section-mobile md:gap-10 md:px-page-wide md:py-section">
      <h2 className="section-title">{section.title}</h2>

      <div className="hidden grid-cols-2 gap-16 md:grid">
        {section.columns.map((column, index) => (
          <AccordionColumn key={index} items={column} />
        ))}
      </div>

      <div className="md:hidden">
        <AccordionColumn items={mobileItems} mobile />
      </div>
    </section>
  )
}

function VariantsSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "variants" }>
}) {
  return (
    <section
      id={PRODUCT_COVERAGES_SECTION_ID}
      className="w-full scroll-mt-24 py-section-mobile md:py-section"
    >
      <CarouselWithHeader title={section.title} fullWidth>
        {section.items.map((item) => (
          <CoverageVariantCard key={item.title} item={item} />
        ))}
      </CarouselWithHeader>
    </section>
  )
}

function VariantIcon({ icon }: { icon?: string }) {
  const Icon =
    icon === "mantenimiento-oferta"
      ? FileText
      : icon === "cumplimiento-contrato"
        ? ShieldCheck
        : icon === "anticipo-financiero"
          ? CreditCard
          : icon === "fondo-reparo"
            ? ShieldCheck
            : icon === "suministro"
              ? Package
              : icon === "servicios"
                ? Briefcase
                : icon === "actividad-profesion"
                  ? Building
                  : icon === "judicial"
                    ? Scale
                    : Briefcase

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 text-woranz-slate shadow-sm">
      <Icon className="h-7 w-7" strokeWidth={1.8} />
    </div>
  )
}

function CoverageVariantCard({ item }: { item: Extract<ProductPageSection, { type: "variants" }>["items"][number] }) {
  return (
    <Card
      className="flex h-full w-[280px] border-none bg-woranz-warm-1 p-0 shadow-elevated ring-0 md:w-[360px]"
      style={{ minHeight: "380px" }}
    >
      <CardContent className="flex h-full flex-col justify-between gap-8 p-8 md:p-10">
        <div className="flex flex-col gap-5">
          <VariantIcon icon={item.icon} />
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-woranz-slate md:text-2xl">
              {item.title}
            </h3>
            {item.description ? (
              <p className="text-[15px] leading-relaxed text-woranz-text md:text-base md:leading-7">
                {item.description}
              </p>
            ) : null}
          </div>
          {item.items?.length ? (
            <ul className="flex flex-col gap-2.5 text-sm text-woranz-text md:text-[15px]">
              {item.items.map((detail) => (
                <li key={detail} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-woranz-yellow" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {item.href ? (
          <Link
            href={item.href}
            className="btn-link-brand inline-flex items-center w-fit whitespace-nowrap px-0 text-sm md:text-body"
          >
            Solicitar esta cobertura
            <ArrowRight className="ml-2 h-4 w-4 shrink-0 self-center" />
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}

function RequirementsSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "requirements" }>
}) {
  const items = (section.items ?? []).filter(Boolean)

  return (
    <section className="page-shell gap-8 px-page-mobile py-section-mobile md:gap-10 md:px-page-wide md:py-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-6 rounded-2xl bg-woranz-warm-1 px-6 py-7 md:px-10 md:py-10">
        <SectionHeader title={section.title} description={section.description} />
        <ul className="grid gap-3 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-start gap-3 rounded-xl bg-white/70 px-4 py-4"
            >
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-woranz-yellow" />
              <span className="text-sm leading-6 text-woranz-slate md:text-base md:leading-7">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function AccordionColumn({
  items,
  mobile = false,
}: {
  items: CoverageItem[]
  mobile?: boolean
}) {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionItem
          key={item.title}
          value={`${item.title}-${index}`}
          className={mobile ? "border-woranz-divider" : "border-woranz-divider"}
        >
          <AccordionTrigger
            className={cn(
              "font-semibold text-woranz-ink hover:no-underline",
              mobile
                ? "py-4 text-base"
                : "py-5 text-lg md:text-xl"
            )}
          >
            <span className="pr-4 text-left">{item.title}</span>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "text-woranz-text",
              mobile
                ? "pb-4 text-sm leading-6"
                : "pb-5 text-base leading-7"
            )}
          >
            {item.description}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function FaqSection({ section }: { section: Extract<ProductPageSection, { type: "faq" }> }) {
  const mobileItems = section.mobileItems ?? section.desktopColumns.flat()

  return (
    <section className="page-shell gap-8 px-page-mobile py-section-mobile md:gap-10 md:px-page-wide md:py-section">
      <h2 className="section-title">{section.title}</h2>

      <div className="md:hidden">
        <FaqAccordion items={mobileItems} />
      </div>

      <div className="hidden gap-16 md:flex">
        {section.desktopColumns.map((column, index) => (
          <div key={index} className="flex-1">
            <FaqAccordion items={column} desktop />
          </div>
        ))}
      </div>
    </section>
  )
}

function FaqAccordion({
  desktop = false,
  items,
}: {
  desktop?: boolean
  items: FaqItem[]
}) {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionItem
          key={`${item.question}-${index}`}
          value={`${item.question}-${index}`}
          className="border-woranz-divider"
        >
          <AccordionTrigger
            className={cn(
              "font-semibold text-woranz-ink hover:no-underline",
              desktop
                ? "py-5 text-lg md:text-xl"
                : "py-4 text-base"
            )}
          >
            <span className="pr-4 text-left">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "text-woranz-text",
              desktop
                ? "pb-5 text-base leading-7"
                : "pb-4 text-sm leading-6"
            )}
          >
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function CtaSection({ section }: { section: Extract<ProductPageSection, { type: "cta" }> }) {
  return (
    <section className="page-shell px-page-mobile py-section-mobile md:px-page-wide md:py-section">
      <div className="surface-cta px-8 py-10 md:px-16 md:py-16">
        <div className="flex flex-col items-center gap-6 md:gap-8">
          <div className="flex max-w-cta flex-col items-center gap-4">
            <h2 className="section-title text-center">
              <span className="hidden md:inline">
                {section.title}
              </span>
              <span className="md:hidden">
                {section.titleMobile ?? section.title}
              </span>
            </h2>
            <p className="section-copy text-center">
              {section.description}
            </p>
          </div>

          <TeamAvatars
            teamCount={section.teamCount}
            teamLabel={section.teamLabel}
          />

          <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row md:gap-6">
            <ActionButton
              className="btn-primary-hero w-full md:w-auto"
              href={section.primaryCtaHref}
              label={section.primaryCta}
            />
            {section.secondaryCta ? (
              <ActionButton
                className="btn-secondary-outline w-full md:w-auto"
                href={section.secondaryCtaHref ?? "/contacto"}
                label={section.secondaryCta}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function PackageCard({ item }: { item: PackageCarouselItem }) {
  return (
    <Card className="package-card-frame border-none bg-woranz-warm-1 p-7 shadow-elevated ring-0 md:p-10">
      <CardContent className="flex h-full flex-col justify-between p-0">
        <div className="flex flex-col gap-4 md:gap-5">
          {item.icon === "music" ? (
            <MusicNote03Icon className="h-14 w-14 text-woranz-slate" strokeWidth={1} />
          ) : null}
          {item.icon === "user" ? (
            <User className="h-14 w-14 text-woranz-slate" strokeWidth={1} />
          ) : null}
          {item.icon === "users" ? (
            <Users className="h-14 w-14 text-woranz-slate" strokeWidth={1} />
          ) : null}
          <h3 className="text-card-mobile font-semibold text-woranz-slate md:text-card">
            {item.title}
          </h3>
          <p className="text-body text-woranz-text md:text-xl md:leading-8">
            <span className="hidden md:inline">{item.description}</span>
            <span className="md:hidden">{item.descriptionMobile ?? item.description}</span>
          </p>
        </div>
        {item.cta === "button" ? (
          <button type="button" className="btn-primary-card mt-6 md:mt-8">
            Cotizá online
          </button>
        ) : (
          <span className="btn-link-brand mt-6 w-fit px-0 md:mt-8">
            Hablá con nosotros <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        )}
      </CardContent>
    </Card>
  )
}

function FeatureCard({ item }: { item: FeatureCarouselItem }) {
  const hasCopy = Boolean(item.text || item.textMobile)

  return (
    <div className="feature-card-frame relative overflow-hidden rounded-xl bg-gradient-to-br from-woranz-warm-1 to-slate-200">
      <Image
        src={item.imageSrc}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 260px, 360px"
      />
      {hasCopy ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <p className="absolute inset-x-4 bottom-5 z-10 text-lg font-bold leading-6 text-white md:inset-x-5 md:bottom-6 md:text-2xl md:leading-8">
            <span className="hidden whitespace-pre-line md:inline">
              {item.text}
            </span>
            <span className="whitespace-pre-line md:hidden">
              {item.textMobile ?? item.text}
            </span>
          </p>
        </>
      ) : null}
    </div>
  )
}

function ProductCard({ item }: { item: ProductCarouselItem }) {
  const card = (
    <div className="product-card-frame relative overflow-hidden rounded-xl">
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 280px, 360px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="absolute inset-x-4 bottom-5 z-10 flex items-center justify-between gap-3">
        <span className="text-card-mobile font-semibold text-white md:text-card">
          {item.title}
        </span>
        {item.href ? <ChevronRight className="h-5 w-5 shrink-0 text-white" /> : null}
      </div>
    </div>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {card}
      </Link>
    )
  }

  return card
}

function CarouselSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "carousel" }>
}) {
  return (
    <section
      id={section.variant === "product" ? "seguros" : undefined}
      className="w-full py-section-mobile md:py-section scroll-mt-24"
    >
      <CarouselWithHeader title={section.title} fullWidth>
        {section.variant === "package"
          ? section.items.map((item) => (
              <PackageCard key={item.title} item={item} />
            ))
          : null}
        {section.variant === "feature"
          ? section.items.map((item) => (
              <FeatureCard key={item.imageSrc} item={item} />
            ))
          : null}
        {section.variant === "product"
          ? section.items.map((item) => (
              <ProductCard key={item.title} item={item} />
            ))
          : null}
      </CarouselWithHeader>
    </section>
  )
}

function StandaloneStepsSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "steps" }>
}) {
  return (
    <section className="page-shell px-page-mobile py-section-mobile md:px-page-wide md:py-section">
      <div className="w-full">
        {/* Desktop: horizontal row */}
        <div className="hidden w-full md:flex md:items-stretch">
          {section.steps.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-stretch gap-0">
              <div className="flex flex-1 flex-col gap-3">
                <span className="step-number">{step.number}</span>
                <span className="text-xl font-bold leading-tight text-woranz-slate">
                  {step.title}
                </span>
                <p className="text-[15px] leading-normal text-woranz-text">
                  {step.description}
                </p>
              </div>
              {index < section.steps.length - 1 ? (
                <Separator
                  orientation="vertical"
                  className="mx-6 bg-woranz-line"
                />
              ) : null}
            </div>
          ))}
        </div>
        {/* Mobile: stacked column */}
        <div className="flex flex-col gap-6 md:hidden">
          {section.steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "flex flex-col gap-2",
                index < section.steps.length - 1 ? "border-b border-woranz-line pb-6" : ""
              )}
            >
              <span className="step-number">{step.number}</span>
              <span className="text-lg font-bold text-woranz-ink">
                {step.title}
              </span>
              <p className="text-sm leading-relaxed text-woranz-text">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductGridSection({
  section,
}: {
  section: Extract<ProductPageSection, { type: "product-grid" }>
}) {
  return (
    <section id="coberturas" className="w-full bg-woranz-warm-1 scroll-mt-24">
      <div className="page-shell gap-8 px-page-mobile py-section-mobile md:gap-10 md:px-page-wide md:py-section">
        <h2 className="section-title">{section.title}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {section.items.map((item) => {
            const card = (
              <div className="relative h-[200px] overflow-hidden rounded-2xl bg-gradient-to-br from-woranz-warm-3 to-woranz-warm-1 md:h-[300px]">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute inset-x-5 bottom-5 text-lg font-bold leading-tight text-white drop-shadow-sm md:text-[22px]">
                  {item.title}
                </span>
              </div>
            )
            if (item.href) {
              return (
                <Link key={item.title} href={item.href} className="block">
                  {card}
                </Link>
              )
            }
            return <div key={item.title}>{card}</div>
          })}
        </div>
      </div>
    </section>
  )
}

function renderSection(section: ProductPageSection, basePath: string) {
  switch (section.type) {
    case "quote":
      return <QuoteSection section={section} basePath={basePath} />
    case "explanation":
      return <ExplanationSection section={section} />
    case "variants":
      return <VariantsSection section={section} />
    case "requirements":
      return <RequirementsSection section={section} />
    case "coverage":
      return <CoverageSection section={section} />
    case "carousel":
      return <CarouselSection section={section} />
    case "steps":
      return <StandaloneStepsSection section={section} />
    case "product-grid":
      return <ProductGridSection section={section} />
    case "product-search-list":
      return <ProductSearchList title={section.title} items={section.items} />
    case "faq":
      return <FaqSection section={section} />
    case "cta":
      return <CtaSection section={section} />
    default:
      return null
  }
}

function ProductPageTemplate({ page }: { page: ProductPageData }) {
  return (
    <div className="flex flex-col bg-white">
      <SiteHeader links={SUPPORT_NAVIGATION_LINKS} />
      <main className="flex flex-col">
        <HeroSection page={page} />
        {page.sections.map((section, index) => (
          <div key={`${section.type}-${index}`}>{renderSection(section, page.path)}</div>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}

export { ProductPageTemplate }
