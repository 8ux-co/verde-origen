import type { WebhookChange } from '@8ux-co/eelzap'

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
