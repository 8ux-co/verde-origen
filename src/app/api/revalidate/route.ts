import { revalidateTag } from 'next/cache'

import { verifyWebhookSignature, webhookChanges, type WebhookPayload } from '@8ux-co/eelzap'

import { env } from '@/lib/env'
import { tagsForChanges } from '@/lib/revalidation'

/**
 * Zap's webhook (Nest → workspace settings → Webhooks, events `zap.item.*`,
 * `zap.document.*`, `zap.media.*`, narrowed to this site), pointed at
 * `https://<site>/api/revalidate`.
 *
 * The signature is checked over the raw body with the endpoint's `whsec_`
 * secret; a stale timestamp or a bad signature is 401 and changes nothing.
 * Each change expires the cache tag of its collection or document, so the
 * pages that read it render fresh on their next visit (ISR); media changes
 * expire everything, since any page may show the file.
 */
export async function POST(request: Request) {
  const secret = env.webhookSecret
  if (!secret) return Response.json({ error: 'webhook_secret_not_configured' }, { status: 503 })

  const payload = await request.text()
  if (!(await verifyWebhookSignature(payload, request.headers, secret))) {
    return Response.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let event: WebhookPayload
  try {
    event = JSON.parse(payload) as WebhookPayload
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }

  const siteKey = env.siteKey
  const changes = webhookChanges(event).filter(
    (change) => !change.siteKey || change.siteKey === siteKey,
  )
  const tags = tagsForChanges(changes)
  // `expire: 0`: the next visit renders fresh content, never the stale page.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return Response.json({ ok: true, event: event.type, id: event.id, revalidated: tags })
}
