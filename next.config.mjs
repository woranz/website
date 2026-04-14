import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const coverageRedirectPlan = require("./data/coverage-redirect-plan.json")
const productCatalog = require("./data/product-catalog.json")
const staticRedirects = require("./data/legacy-redirects.json")

function normalizeProductDestination(destination) {
  return destination.replace(
    /^\/(personas|empresas|productores)\/coberturas(?=\/|$)/,
    "/$1"
  )
}

function expandLegacySourceVariants(redirect) {
  if (
    redirect.source === "/" ||
    redirect.source.endsWith("/") ||
    redirect.source.includes(":") ||
    redirect.source.includes("*") ||
    redirect.source.includes("(")
  ) {
    return [redirect]
  }

  return [redirect, { ...redirect, source: `${redirect.source}/` }]
}

function buildRuntimeRedirects(redirects) {
  return redirects.flatMap((redirect) =>
    expandLegacySourceVariants({
      destination: normalizeProductDestination(redirect.destination),
      permanent: redirect.permanent,
      source: redirect.source,
    })
  )
}

const legacyProductRedirects = buildRuntimeRedirects(
  productCatalog.flatMap((product) =>
    (product.legacyPaths ?? []).map((source) => ({
      source,
      destination: `/${product.segmento}/coberturas/${product.slug}`,
      permanent: true,
    }))
  )
)

const coverageRedirects = buildRuntimeRedirects(coverageRedirectPlan)
const normalizedStaticRedirects = buildRuntimeRedirects(staticRedirects)

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:segmento(personas|empresas|productores)/coberturas/:slug",
        destination: "/:segmento/:slug",
        permanent: true,
      },
      {
        source:
          "/:segmento(personas|empresas|productores)/coberturas/:slug/:path*",
        destination: "/:segmento/:slug/:path*",
        permanent: true,
      },
      ...normalizedStaticRedirects,
      ...coverageRedirects,
      ...legacyProductRedirects,
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
