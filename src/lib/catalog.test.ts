import { describe, expect, it } from 'vitest'

import type { CafesItem, OrigenesItem } from '@/generated/cms'

import { regionText, relatedCafes } from './catalog'

const region = (value: string, label: string) => ({ value, label }) as never

const cafe = (slug: string, r: [string, string], proceso: string, municipio = 'X') =>
  ({
    slug,
    content: { region: region(...r), proceso: region(proceso, proceso), municipio },
  }) as unknown as CafesItem

const origen = (municipio: string, r: [string, string]) =>
  ({ content: { municipio, region: region(...r) } }) as unknown as OrigenesItem

const origenes = [origen('Planadas', ['tolima', 'Tolima']), origen('Pitalito', ['huila', 'Huila'])]

describe('regionText', () => {
  it('names one region by its label', () => {
    expect(regionText(cafe('a', ['huila', 'Huila'], 'lavado'), origenes)).toBe('Huila')
  })

  it('names a blend by the regions of the towns it lists, in that order', () => {
    const blend = cafe('m', ['varias', 'Varias'], 'lavado', 'Pitalito y Planadas')
    expect(regionText(blend, origenes)).toBe('Huila y Tolima')
  })

  it('falls back when no farm matches', () => {
    expect(regionText(cafe('m', ['varias', 'Varias'], 'lavado', 'Neiva'), origenes)).toBe(
      'Varias regiones',
    )
  })
})

describe('relatedCafes', () => {
  it('takes the same region first, then the same process, never the coffee itself', () => {
    const cafes = [
      cafe('self', ['huila', 'Huila'], 'lavado'),
      cafe('p1', ['cauca', 'Cauca'], 'lavado'),
      cafe('r1', ['huila', 'Huila'], 'honey'),
      cafe('none', ['narino', 'Nariño'], 'natural'),
      cafe('p2', ['tolima', 'Tolima'], 'lavado'),
    ]
    expect(relatedCafes(cafes[0]!, cafes).map((c) => c.slug)).toEqual(['r1', 'p1', 'p2'])
  })
})
