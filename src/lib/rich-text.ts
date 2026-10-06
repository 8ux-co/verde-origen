import { focalFor, photoName, type PhotoSlot } from './photos'

/**
 * RICH_TEXT arrives as sanitised HTML with images already resolved to URLs
 * (and, in preview, a stega marker on the last text of each block). These
 * helpers split it into blocks and decorate its images; they never rewrite
 * text, so the markers survive.
 */

const BLOCK =
  /<(h[1-6]|p|ul|ol|blockquote|figure|div|pre|table)(?:\s[^>]*)?>[\s\S]*?<\/\1>|<img\b[^>]*>/gi

/** Top-level blocks, in order. Text outside a block is dropped. */
export function blocks(html: string | null | undefined): string[] {
  return (html ?? '').match(BLOCK) ?? []
}

export function tagOf(block: string): string {
  return /^<([a-z0-9]+)/i.exec(block)?.[1]?.toLowerCase() ?? ''
}

/** The inner HTML of a single block. */
export function inner(block: string): string {
  return block.replace(/^<[^>]+>/, '').replace(/<\/[a-z0-9]+>$/i, '')
}

/**
 * Takes the leading blocks of the given tags (`h3`, `h2`, in any order) off
 * the top: `{ taken: { h3: '…', h2: '…' }, rest: '…' }`. Nosotros uses it to
 * lift «Desde 2021» and the section title out of the story.
 */
export function takeLeading(html: string | null | undefined, tags: string[]) {
  const all = blocks(html)
  const taken: Record<string, string> = {}
  let i = 0
  while (i < all.length && tags.includes(tagOf(all[i]!)) && !(tagOf(all[i]!) in taken)) {
    taken[tagOf(all[i]!)] = inner(all[i]!)
    i++
  }
  return { taken, rest: all.slice(i).join('') }
}

/** Splits after the `n`-th paragraph: the producer's quote goes there. */
export function splitAfterParagraph(html: string | null | undefined, n: number): [string, string] {
  const all = blocks(html)
  let seen = 0
  for (let i = 0; i < all.length; i++) {
    if (tagOf(all[i]!) === 'p' && ++seen === n) {
      return [all.slice(0, i + 1).join(''), all.slice(i + 1).join('')]
    }
  }
  return [all.join(''), '']
}

/**
 * Embedded images: lazy, async, and cropped with the art direction of
 * `slot` for their file (`--fp`), since Zap keeps no focal point.
 */
export function decorateImages(html: string, slot: PhotoSlot): string {
  return html.replace(/<img\b([^>]*)>/gi, (_match, attrs: string) => {
    const src = /\ssrc="([^"]*)"/i.exec(attrs)?.[1]
    const focal = focalFor(photoName(src), slot)
    const extra = [
      /\sloading=/i.test(attrs) ? '' : ' loading="lazy"',
      /\sdecoding=/i.test(attrs) ? '' : ' decoding="async"',
      /\sstyle=/i.test(attrs) ? '' : ` style="--fp:${focal.desktop}"`,
    ].join('')
    return `<img${attrs}${extra}>`
  })
}
