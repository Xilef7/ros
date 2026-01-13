import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_CONVEX_URL!}/api/storage/*`),
    ],
  },
}

export default nextConfig
