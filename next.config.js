const productCatalog = require("./data/product-catalog.json")

const legacyProductRedirects = productCatalog.flatMap((product) =>
  (product.legacyPaths ?? []).map((source) => ({
    source,
    destination: `/${product.segmento}/coberturas/${product.slug}`,
    permanent: true,
  }))
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return legacyProductRedirects
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

module.exports = async () => {
  const { withPruneEditor } = await import("@patio/prune-editor/next")

  return withPruneEditor(nextConfig)
}
