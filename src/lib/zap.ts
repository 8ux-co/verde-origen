import { cookies, draftMode, headers } from 'next/headers'
import { cache } from 'react'

import { createClient, type EelZapClient } from '@8ux-co/eelzap'
import { getValidPreviewToken } from '@8ux-co/eelzap/next'

import { env } from './env'

/**
 * The Zap client for this request.
 *
 * Published reads go through Next's data cache, tagged per collection and
 * document so the webhook (`/api/revalidate`) can expire exactly what
 * changed; the pages themselves are ISR (`revalidate`).
 *
 * In draft mode (Zap's preview, after `/api/zap-preview`), reads use the
 * preview token as the credential, but only once Zap confirms it is live and
 * minted for this site (`getValidPreviewToken`): those reads come back with
 * drafts and unpublished entries, carry stega markers, and are never cached.
 */

export { collectionTag, documentTag, TAG_ALL } from './tags'
import { TAG_ALL } from './tags'

function taggedFetch(tags: string[]): typeof fetch {
  return (input, init) =>
    fetch(input, {
      ...init,
      cache: 'force-cache',
      next: { tags: [TAG_ALL, ...tags], revalidate: env.revalidate },
    })
}

const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' })

/** The live preview token of this request, or null (not in draft mode, or refused). */
export const previewToken = cache(async (): Promise<string | null> => {
  const draft = await draftMode()
  if (!draft.isEnabled) return null
  return getValidPreviewToken(
    { headers: await headers(), cookies: await cookies() },
    { siteKey: env.siteKey, apiKey: env.apiKey, zapOrigin: env.zapOrigin },
  )
})

export interface ZapSession {
  cms: EelZapClient
  /** True when this request reads drafts (and text carries stega). */
  preview: boolean
}

/**
 * `published: true` for build-time code with no request (`generateStaticParams`),
 * where draft mode cannot be read: always the published, cached client.
 */
export async function zap(
  tags: string[],
  options: { published?: boolean } = {},
): Promise<ZapSession> {
  const token = options.published ? null : await previewToken()
  const common = { baseUrl: env.baseUrl, pathPrefix: env.pathPrefix, timeout: 90_000 }
  if (token) {
    return {
      cms: createClient({ ...common, apiKey: token, fetch: noStoreFetch }),
      preview: true,
    }
  }
  return {
    cms: createClient({ ...common, apiKey: env.apiKey, fetch: taggedFetch(tags) }),
    preview: false,
  }
}
