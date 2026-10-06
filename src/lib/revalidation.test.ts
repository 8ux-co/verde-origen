import { describe, expect, it } from 'vitest'

import type { WebhookPayload } from '@8ux-co/eelzap'

import { tagsForEvent } from './revalidation'

const SITE = { id: 's', key: 'verde-origen' }

function event(type: string, data: Record<string, unknown> = {}): WebhookPayload {
  return {
    id: `evt_${type}`,
    type,
    version: 2,
    app: 'zap',
    workspace_id: 'w',
    occurred_at: '2026-10-06T12:00:00Z',
    actor: { user_id: null, display_name: 'Zap', kind: 'SYSTEM' },
    subject: { workspace_id: 'w', site_id: 's' },
    data: { site: SITE, ...data },
  } as WebhookPayload
}

const tags = (type: string, data?: Record<string, unknown>) =>
  tagsForEvent(event(type, data), 'verde-origen')

describe('tagsForEvent', () => {
  it('expires an item event’s collection', () => {
    const data = { collection: { id: 'c', key: 'cafes' }, items: [{ id: 'i', slug: 'mananera' }] }
    for (const type of [
      'zap.item.published',
      'zap.item.unpublished',
      'zap.item.deleted',
      'zap.item.rolled_back',
    ]) {
      expect(tags(type, data)).toEqual(['zap:collection:cafes'])
    }
  })

  it('expires a document event’s document', () => {
    expect(tags('zap.document.published', { documents: [{ id: 'd', key: 'inicio' }] })).toEqual([
      'zap:document:inicio',
    ])
  })

  it('expires everything for a media event', () => {
    expect(tags('zap.media.published', { media: [{ id: 'm' }] })).toEqual(['zap'])
  })

  it('expires everything for SEO, collection, schema and site events', () => {
    for (const type of [
      'zap.seo.updated',
      'zap.collection.created',
      'zap.collection.updated',
      'zap.collection.deleted',
      'zap.schema.field_changed',
      'zap.site.updated',
    ]) {
      expect(tags(type), type).toEqual(['zap'])
    }
  })

  it('ignores drafts, assignments and comments: they never reach the live site', () => {
    for (const type of [
      'zap.item.draft_updated',
      'zap.document.draft_updated',
      'zap.item.assigned',
      'zap.document.assigned',
      'zap.comment.created',
      'zap.comment.resolved',
      'ping',
    ]) {
      expect(
        tags(type, { collection: { id: 'c', key: 'cafes' }, items: [{ id: 'i', slug: 'x' }] }),
        type,
      ).toEqual([])
    }
  })

  it('ignores another site’s events, site-wide ones included', () => {
    const other = {
      ...event('zap.seo.updated'),
      data: { site: { id: 'o', key: 'otro-sitio' } },
    } as WebhookPayload
    expect(tagsForEvent(other, 'verde-origen')).toEqual([])
  })

  it('ignores events the site does not render (API keys, site creation)', () => {
    expect(tags('zap.site.api_key.created')).toEqual([])
    expect(tags('zap.site.created')).toEqual([])
  })
})
