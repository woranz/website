import type { Metadata } from "next"

import {
  WORANZ_DEFAULT_OG_IMAGE_PATH,
  WORANZ_SITE_NAME,
  WORANZ_SITE_URL,
} from "@/lib/site-config"

export type PageMetadataConfig = {
  canonicalPath?: string
  description: string
  imageAlt?: string
  imageUrl?: string
  noIndex?: boolean
  title: string
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return new URL(value, WORANZ_SITE_URL).toString()
}

export function buildPageMetadata({
  canonicalPath,
  description,
  imageAlt,
  imageUrl,
  noIndex = false,
  title,
}: PageMetadataConfig): Metadata {
  const canonicalUrl = canonicalPath
    ? new URL(canonicalPath, WORANZ_SITE_URL).toString()
    : undefined
  const socialImage = toAbsoluteUrl(imageUrl || WORANZ_DEFAULT_OG_IMAGE_PATH)
  const robots = noIndex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : undefined

  return {
    title,
    description,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: WORANZ_SITE_NAME,
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: socialImage,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots,
  }
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(WORANZ_SITE_URL),
    title: WORANZ_SITE_NAME,
    description:
      "Seguros online para personas, empresas y productores. Coberturas claras, soporte real y una experiencia simple de punta a punta.",
    keywords: [
      "seguros online",
      "seguros argentina",
      "seguros para empresas",
      "seguros para personas",
      "Woranz",
    ],
    openGraph: {
      title: WORANZ_SITE_NAME,
      description:
        "Seguros online para personas, empresas y productores. Coberturas claras, soporte real y una experiencia simple de punta a punta.",
      siteName: WORANZ_SITE_NAME,
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: toAbsoluteUrl(WORANZ_DEFAULT_OG_IMAGE_PATH),
          alt: WORANZ_SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: WORANZ_SITE_NAME,
      description:
        "Seguros online para personas, empresas y productores. Coberturas claras, soporte real y una experiencia simple de punta a punta.",
      images: [toAbsoluteUrl(WORANZ_DEFAULT_OG_IMAGE_PATH)],
    },
  }
}
