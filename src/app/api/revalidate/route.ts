import { revalidateTag } from 'next/cache'

import { verifyWebhookSignature, type WebhookPayload } from '@8ux-co/eelzap'

import { env } from '@/lib/env'
import { tagsForEvent } from '@/lib/revalidation'

/**
 * Zap's webhook (Nest → workspace settings → Webhooks), pointed at
 * `https://<site>/api/revalidate` and narrowed to this site. Recommended
 * events: `zap.item.*`, `zap.document.*`, `zap.media.*`, `zap.collection.*`,
 * `zap.seo.updated`, `zap.schema.field_changed`, `zap.site.updated`.
 *
 * The signature is checked over the raw body with the endpoint's `whsec_`
 * secret; a stale timestamp or a bad signature is 401 and changes nothing.
 * Each change expires the cache tag of its collection or document, so the
 * pages that read it render fresh on their next visit (ISR). Media, SEO,
 * collection, schema and site events expire everything; drafts, assignments
 * and comments expire nothing (`tagsForEvent`).
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

  const tags = tagsForEvent(event, env.siteKey)
  // `expire: 0`: the next visit renders fresh content, never the stale page.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return Response.json({ ok: true, event: event.type, id: event.id, revalidated: tags })
}
