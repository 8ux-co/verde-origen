/**
 * Hosts Zap serves media from, for `next/image`'s `remotePatterns`: Zap's own
 * media domain and R2's public buckets, always. EELZAP_MEDIA_HOSTS
 * (comma-separated host patterns) ADDS hosts, so a custom domain never drops
 * the defaults and the site's images never depend on that variable being set.
 */
export const DEFAULT_MEDIA_HOSTS = [
  'media.zap.eel.software',
  '**.r2.dev',
  '**.r2.cloudflarestorage.com',
] as const

export function mediaHosts(extra: string | undefined): string[] {
  const added = (extra ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
  return [...new Set([...DEFAULT_MEDIA_HOSTS, ...added])]
}
