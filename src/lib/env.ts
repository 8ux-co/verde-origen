/**
 * Server configuration, read once. Names only in `.env.example`; values in
 * `.env.local` (development) or the host's environment (production).
 */
function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`)
  return value
}

const LOCAL = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/

export const env = {
  /** The site's SECRET key: server reads, draft-mode token checks, the seed. */
  get apiKey() {
    return required('EELZAP_API_KEY')
  },
  /** Delivery API base, before `/v1`. Undefined → https://api.eelzap.com. */
  baseUrl: process.env.EELZAP_BASE_URL || undefined,
  pathPrefix: process.env.EELZAP_PATH_PREFIX || undefined,
  /** Where Zap's editor answers (preview-token checks). Default production. */
  zapOrigin: process.env.EELZAP_ORIGIN || 'https://zap.eel.software',
  siteKey: process.env.EELZAP_SITE_KEY || 'verde-origen',
  siteId: process.env.EELZAP_SITE_ID || undefined,
  webhookSecret: process.env.EELZAP_WEBHOOK_SECRET || undefined,
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://verdeorigen.co').replace(/\/$/, ''),
  /** ISR window for published content, seconds. Webhooks cut it short. */
  revalidate: Number(process.env.EELZAP_REVALIDATE_SECONDS || 3600),
  /**
   * A local Zap and Nest for the preview client. The SDK honours them only
   * from a local page, so leaving them set in production is harmless; they
   * are passed only when they are local origins.
   */
  get devZapOrigin() {
    const origin = process.env.EELZAP_ORIGIN
    return origin && LOCAL.test(origin) ? origin : undefined
  },
  get devAuthOrigin() {
    const origin = process.env.EELZAP_DEV_AUTH_ORIGIN
    return origin && LOCAL.test(origin) ? origin : undefined
  },
}
