import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const productCatalog = require("./data/product-catalog.json")
const staticRedirects = require("./data/legacy-redirects.json")

function normalizeProductDestination(destination) {
  return destination.replace(
    /^\/(personas|empresas|productores)\/coberturas(?=\/|$)/,
    "/$1"
  )
}

const legacyProductRedirects = productCatalog.flatMap((product) =>
  (product.legacyPaths ?? []).map((source) => ({
    source,
    destination: normalizeProductDestination(
      `/${product.segmento}/coberturas/${product.slug}`
    ),
    permanent: true,
  }))
)

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
      ...staticRedirects.map((redirect) => ({
        ...redirect,
        destination: normalizeProductDestination(redirect.destination),
      })),
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
