import { createHmac } from 'node:crypto'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const revalidateTag = vi.fn()
vi.mock('next/cache', () => ({ revalidateTag }))

const SECRET = 'whsec_test_only_0123456789abcdef'

/** Signs like Zap: HMAC-SHA256 of `${timestamp}.${body}`, keyed with the secret minus `whsec_`. */
function signed(body: object, { secret = SECRET, age = 0 } = {}) {
  const raw = JSON.stringify(body)
  const timestamp = String(Math.floor(Date.now() / 1000) - age)
  const signature = createHmac('sha256', secret.replace(/^whsec_/, ''))
    .update(`${timestamp}.${raw}`)
    .digest('hex')
  return new Request('https://verdeorigen.test/api/revalidate', {
    method: 'POST',
    headers: {
      'X-Eel-Timestamp': timestamp,
      'X-Eel-Signature': `v1=${signature}`,
      'Content-Type': 'application/json',
    },
    body: raw,
  })
}

const itemPublished = {
  id: 'evt_1',
  type: 'zap.item.published',
  version: 2,
  app: 'zap',
  workspace_id: 'w',
  occurred_at: new Date().toISOString(),
  actor: { user_id: null, display_name: 'Zap', kind: 'SYSTEM' },
  subject: { workspace_id: 'w', site_id: 's' },
  data: {
    site: { id: 's', key: 'verde-origen' },
    collection: { id: 'c', key: 'cafes' },
    items: [{ id: 'i', slug: 'la-esperanza-lote-07' }],
  },
}

async function post(request: Request) {
  const { POST } = await import('./route')
  return POST(request)
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.resetModules()
    revalidateTag.mockClear()
    vi.stubEnv('EELZAP_WEBHOOK_SECRET', SECRET)
    vi.stubEnv('EELZAP_SITE_KEY', 'verde-origen')
  })
  afterEach(() => vi.unstubAllEnvs())

  it('expires the changed collection for a signed delivery', async () => {
    const response = await post(signed(itemPublished))
    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('zap:collection:cafes', { expire: 0 })
  })

  it('expires a document by its key', async () => {
    const response = await post(
      signed({
        ...itemPublished,
        type: 'zap.document.published',
        data: { site: { id: 's', key: 'verde-origen' }, documents: [{ id: 'd', key: 'inicio' }] },
      }),
    )
    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('zap:document:inicio', { expire: 0 })
  })

  it('refuses a delivery signed with another secret, and revalidates nothing', async () => {
    const response = await post(signed(itemPublished, { secret: 'whsec_someone_else' }))
    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('refuses a replayed delivery outside the five-minute window', async () => {
    const response = await post(signed(itemPublished, { age: 600 }))
    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('ignores another site of the same workspace', async () => {
    const response = await post(
      signed({
        ...itemPublished,
        data: { ...itemPublished.data, site: { id: 'x', key: 'otro-sitio' } },
      }),
    )
    expect(response.status).toBe(200)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('answers 503 when no secret is configured', async () => {
    vi.stubEnv('EELZAP_WEBHOOK_SECRET', '')
    const response = await post(signed(itemPublished))
    expect(response.status).toBe(503)
  })
})
