import { describe, expect, it } from 'vitest'

import { EMPTY, matches, sorted, type BrowserItem } from './cafes-browser'

const item = (slug: string, facets: Partial<BrowserItem['facets']>): BrowserItem => ({
  slug,
  card: null,
  facets: {
    region: 'huila',
    proceso: 'lavado',
    notas: null,
    pesos250: 48_000,
    orden: 1,
    puntaje: 86,
    ...facets,
  },
})

const cafes = [
  item('a', { pesos250: 45_000, orden: 3 }),
  item('b', { pesos250: 45_001, region: 'cauca', orden: 1 }),
  item('c', { pesos250: 60_000, proceso: 'honey', orden: 2, puntaje: 89 }),
  item('d', { pesos250: 96_000, notas: 'floral', orden: 4 }),
]

describe('coffee filters', () => {
  it('puts price boundaries in the lower range ((min, max])', () => {
    const pick = (precio: string) =>
      cafes.filter((c) => matches(c, { ...EMPTY, precio })).map((c) => c.slug)
    expect(pick('hasta-45')).toEqual(['a'])
    expect(pick('45-60')).toEqual(['b', 'c'])
    expect(pick('mas-60')).toEqual(['d'])
  })

  it('ORs within a group and ANDs across groups', () => {
    const state = { ...EMPTY, region: ['huila', 'cauca'], proceso: ['lavado'] }
    expect(cafes.filter((c) => matches(c, state)).map((c) => c.slug)).toEqual(['a', 'b', 'd'])
  })

  it('sorts by the manual order, price and score', () => {
    expect(sorted(cafes, 'recomendados').map((c) => c.slug)).toEqual(['b', 'c', 'a', 'd'])
    expect(sorted(cafes, 'precio').map((c) => c.slug)).toEqual(['a', 'b', 'c', 'd'])
    expect(sorted(cafes, 'precio-desc')[0]?.slug).toBe('d')
    expect(sorted(cafes, 'puntaje')[0]?.slug).toBe('c')
  })
})
