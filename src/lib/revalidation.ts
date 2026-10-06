import { webhookChanges, type WebhookChange, type WebhookPayload } from '@8ux-co/eelzap'

import { collectionTag, documentTag, TAG_ALL } from './tags'

/**
 * The cache tags a webhook's changes expire: an item → its collection, a
 * document → itself, a media file → everything (any page may show it).
 */
export function tagsForChanges(changes: readonly WebhookChange[]): string[] {
  const tags = new Set<string>()
  for (const change of changes) {
    if (change.type === 'item' && change.collectionKey)
      tags.add(collectionTag(change.collectionKey))
    else if (change.type === 'document') tags.add(documentTag(change.resourceKey))
    else tags.add(TAG_ALL)
  }
  return [...tags]
}

/**
 * Events that change what every page may render but that `webhookChanges()`
 * does not flatten (it answers `[]` for them): SEO feeds the metadata of every
 * page and the sitemap, a collection or field change can reshape any read,
 * and the site's settings apply everywhere. They expire everything.
 */
const SITE_WIDE = /^zap\.(?:collection\.[a-z_]+|seo\.updated|schema\.field_changed|site\.updated)$/

/**
 * Events that never reach the live site: drafts and assignments stay in the
 * editor, comments are conversation. A delivery of one changes nothing.
 */
const IGNORED = /(?:\.draft_updated|\.assigned)$|^zap\.comment\.|^ping$/

/** The site an event names, when its payload says (`data.site.key`). */
function siteOf(event: WebhookPayload): string | null {
  const data = event.data as { site?: { key?: unknown } } | null | undefined
  return typeof data?.site?.key === 'string' ? data.site.key : null
}

/**
 * The cache tags a verified delivery expires for the site `siteKey`. Item,
 * document and media events go through `webhookChanges()`; site-wide events
 * expire everything; drafts, assignments, comments and other sites' events
 * expire nothing.
 */
export function tagsForEvent(event: WebhookPayload, siteKey: string): string[] {
  const type = String(event.type ?? '')
  if (IGNORED.test(type)) return []
  const site = siteOf(event)
  if (site && site !== siteKey) return []
  if (SITE_WIDE.test(type)) return [TAG_ALL]
  const changes = webhookChanges(event).filter(
    (change) => !change.siteKey || change.siteKey === siteKey,
  )
  return tagsForChanges(changes)
}
