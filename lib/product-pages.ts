import type { PageMetadataConfig } from "@/lib/metadata"
import type { ProductSegment } from "@/lib/product-paths"

export type ProductHero = {
  badge: string
  description: string
  descriptionMobile?: string
  features?: Array<{ icon: string; label: string }>
  imageAlt: string
  imageSrc: string
  primaryCtaHref?: string
  primaryCta: string
  secondaryCtaHref?: string
  secondaryCta?: string
  title: string
}

export type ProductStep = {
  description: string
  number: string
  title: string
}

export type FaqItem = {
  answer: string
  question: string
}

export type CoverageItem = {
  description: string
  title: string
}

export type PackageCarouselItem = {
  cta: "button" | "link"
  description: string
  descriptionMobile?: string
  icon: "music" | "user" | "users"
  title: string
}

export type ProductCarouselItem = {
  href?: string
  imageSrc: string
  title: string
}

export type VariantItem = {
  description?: string
  href?: string
  icon?: string
  items?: string[]
  title: string
}

export type FeatureCarouselItem = {
  imageSrc: string
  text?: string
  textMobile?: string
}

type QuoteSection = {
  description: string
  formConfigId?: string
  maxWidth?: "default" | "wide"
  mobileSteps?: boolean
  quoter: "accidentes" | "caucion" | "contacto" | "generico"
  quoterConfigId?: string
  steps: ProductStep[]
  title: string
  type: "quote"
}

type CoverageSection = {
  columns: CoverageItem[][]
  title: string
  type: "coverage"
}

type VariantsSection = {
  items: VariantItem[]
  title: string
  type: "variants"
}

type RequirementsSection = {
  columns?: CoverageItem[][]
  description?: string
  items?: string[]
  title: string
  type: "requirements"
}

type CarouselSection =
  | {
      items: PackageCarouselItem[]
      title: string
      type: "carousel"
      variant: "package"
    }
  | {
      items: ProductCarouselItem[]
      title: string
      type: "carousel"
      variant: "product"
    }
  | {
      items: FeatureCarouselItem[]
      title: string
      type: "carousel"
      variant: "feature"
    }

type FaqSection = {
  desktopColumns: FaqItem[][]
  mobileItems?: FaqItem[]
  title: string
  type: "faq"
}

type CtaSection = {
  description: string
  primaryCtaHref?: string
  primaryCta: string
  secondaryCtaHref?: string
  secondaryCta?: string
  teamCount: string
  teamLabel: string
  title: string
  titleMobile?: string
  type: "cta"
}

type ExplanationSection = {
  body: string
  bodyMobile?: string
  title: string
  type: "explanation"
}

type StepsSection = {
  steps: ProductStep[]
  type: "steps"
}

export type ProductGridItem = {
  href?: string
  imageSrc: string
  title: string
}

type ProductGridSection = {
  items: ProductGridItem[]
  title: string
  type: "product-grid"
}

export type ProductPageSection =
  | QuoteSection
  | ExplanationSection
  | VariantsSection
  | RequirementsSection
  | CoverageSection
  | CarouselSection
  | FaqSection
  | CtaSection
  | StepsSection
  | ProductGridSection

export type ProductPageData = {
  hero: ProductHero
  isHome?: boolean
  metadata: PageMetadataConfig
  path: string
  sections: ProductPageSection[]
  segment: ProductSegment
  slug: string
}
