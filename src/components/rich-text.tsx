import { decorateImages } from '@/lib/rich-text'
import type { PhotoSlot } from '@/lib/photos'

/**
 * A RICH_TEXT field. Zap delivers it as sanitised HTML (scripts removed,
 * embedded images resolved); in preview its blocks carry stega markers, so
 * the overlay finds each block with no tag. Images get the slot's crop.
 */
export function RichText({
  html,
  className = 'prose',
  imageSlot = 'blog-inline',
  as: Tag = 'div',
  ...rest
}: {
  html: string | null | undefined
  className?: string
  imageSlot?: PhotoSlot
  as?: 'div' | 'section'
  'data-zap'?: string
}) {
  if (!html) return null
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: decorateImages(html, imageSlot) }}
      {...rest}
    />
  )
}
