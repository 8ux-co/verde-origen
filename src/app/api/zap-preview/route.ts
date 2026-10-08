import { cookies, draftMode } from 'next/headers'

import { createDraftModeRoute } from '@8ux-co/eelzap/next'

import { env } from '@/lib/env'

/**
 * Zap's editor loads `/api/zap-preview?token=zpt_…&path=/cafes/…` in its
 * preview frame. The route checks the token with Zap (live, minted for this
 * site), turns on Next's draft mode with frame-safe cookies and redirects to
 * the page, without the token. Pages then read drafts with it (`lib/zap.ts`).
 */
export const GET = createDraftModeRoute({
  siteKey: env.siteKey,
  apiKey: env.apiKey,
  zapOrigin: env.zapOrigin,
  draftMode,
  cookies,
})

/**
 * Since eelzap 0.11 the client keeps the token out of the URL: it sends it in
 * the fragment and the page posts it here, so the route answers POST too.
 */
export const POST = GET
