import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const legacyRedirects = require("./data/legacy-redirects.json")

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return legacyRedirects
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
