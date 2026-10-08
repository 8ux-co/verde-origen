import type { NextConfig } from 'next'

import { mediaHosts } from './src/lib/media-hosts'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No AGENTS.md / CLAUDE.md written into the repo by `next dev`.
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Photo widths from the art direction: 400, 800, 1200, 1600 (never past the source).
    deviceSizes: [400, 640, 800, 1200, 1600],
    imageSizes: [88, 120, 160, 240],
    qualities: [60, 75],
    remotePatterns: mediaHosts(process.env.EELZAP_MEDIA_HOSTS).map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
}

export default nextConfig
