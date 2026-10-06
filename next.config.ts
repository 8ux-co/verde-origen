import type { NextConfig } from 'next'

/**
 * Hosts Zap serves media from. R2's public buckets by default; add a custom
 * media domain with EELZAP_MEDIA_HOSTS (comma-separated host patterns).
 */
const mediaHosts = (process.env.EELZAP_MEDIA_HOSTS ?? '**.r2.dev,**.r2.cloudflarestorage.com')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean)

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
    remotePatterns: mediaHosts.map((hostname) => ({ protocol: 'https' as const, hostname })),
  },
}

export default nextConfig
