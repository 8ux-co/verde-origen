import { describe, expect, it } from 'vitest'

import { focalFor, hasApprovedCrop, photoName } from './photos'
import { blocks, decorateImages, splitAfterParagraph, takeLeading } from './rich-text'

const MARK = '⁠‍‌'

describe('rich text', () => {
  const story = `<h3>Desde 2021</h3><h2>Un saco${MARK}</h2><p>Uno.</p><p>Dos.${MARK}</p><p>Tres.</p>`

  it('splits top-level blocks', () => {
    expect(blocks(story)).toHaveLength(5)
    expect(blocks(null)).toEqual([])
  })

  it('lifts leading headings out of the story, keeping their markers', () => {
    const { taken, rest } = takeLeading(story, ['h3', 'h2'])
    expect(taken).toEqual({ h3: 'Desde 2021', h2: `Un saco${MARK}` })
    expect(rest).toBe(`<p>Uno.</p><p>Dos.${MARK}</p><p>Tres.</p>`)
  })

  it('does not lift a heading that is not at the top', () => {
    expect(takeLeading('<p>Antes.</p><h2>Título</h2>', ['h2']).taken).toEqual({})
  })

  it('splits after the n-th paragraph, for the producer quote', () => {
    expect(splitAfterParagraph('<h2>T</h2><p>1</p><p>2</p><p>3</p>', 2)).toEqual([
      '<h2>T</h2><p>1</p><p>2</p>',
      '<p>3</p>',
    ])
    expect(splitAfterParagraph('<p>1</p>', 2)).toEqual(['<p>1</p>', ''])
  })

  it('crops embedded images with the art direction for their file, lazily', () => {
    const html = decorateImages(
      '<figure><img src="https://x.r2.dev/media/1/retrato-caficultor.jpg" alt="Hernán"><figcaption>Pie</figcaption></figure>',
      'blog-inline',
    )
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('decoding="async"')
    expect(html).toContain('style="--fp:45% 28%"')
    expect(html).toContain('<figcaption>Pie</figcaption>')
  })
})

describe('photos', () => {
  it('names a photo from its media URL or file name', () => {
    expect(photoName('https://pub.r2.dev/sites/s/media/abc/hero-manos-cereza.jpg')).toBe(
      'hero-manos-cereza',
    )
    expect(photoName('producto-bolsa-250.png')).toBe('producto-bolsa-250')
    expect(photoName(null)).toBeNull()
  })

  it('crops per slot, desktop and mobile, with a centred fallback', () => {
    expect(focalFor('hero-manos-cereza', 'hero')).toEqual({ desktop: '52% 50%', mobile: '48% 55%' })
    expect(focalFor('origen-narino', 'cafe-card')).toEqual({
      desktop: '72% 62%',
      mobile: '72% 62%',
    })
    expect(focalFor('origen-narino', 'region-card').desktop).toBe('35% 50%')
    expect(focalFor('unknown-file', 'hero')).toEqual({ desktop: '50% 50%', mobile: '50% 50%' })
  })

  it('shows a photo in the author box only when it has a crop cut for it', () => {
    expect(hasApprovedCrop('retrato-caficultora', 'author')).toBe(true)
    // Camila's team portrait is a crop of the cupping photo: not an author photo.
    expect(hasApprovedCrop('taller-catacion', 'author')).toBe(false)
  })
})
