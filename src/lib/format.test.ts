import { describe, expect, it } from 'vitest'

import {
  altitudeRange,
  familyCount,
  formatCOP,
  formatDate,
  formatDecimal,
  formatInt,
  formatMoney,
  formatRoastDay,
  formatShortDate,
  initials,
  lastRoastDay,
  lines,
  money,
  NBSP,
  notesList,
  notesSentence,
  numberWord,
  pairs,
  paragraphs,
  perHundredGrams,
  pesos,
  producerLabel,
} from './format'

/** A stega marker as Zap appends it in preview: zero-width characters only. */
const MARK = '⁠‍‌‌‍​⁠'

describe('money', () => {
  it('prints COP undecorated, es-CO, no decimals, a non-breaking space after $', () => {
    expect(formatCOP(48000)).toBe(`$${NBSP}48.000`)
    expect(formatCOP(9000)).toBe(`$${NBSP}9.000`)
    expect(formatCOP(168000)).toBe(`$${NBSP}168.000`)
  })

  it('reads amountMinor and never prints NaN', () => {
    expect(formatMoney({ amountMinor: 4_800_000, currency: 'COP' })).toBe(`$${NBSP}48.000`)
    expect(pesos({ amountMinor: 4_800_000, currency: 'COP' })).toBe(48_000)
    expect(formatMoney({ amountMinor: Number.NaN, currency: 'COP' })).toBe('')
    expect(pesos({ amountMinor: Number.NaN, currency: 'COP' })).toBeNull()
  })

  it('reads Zap CURRENCY values in minor units', () => {
    expect(formatMoney({ amountMinor: 4_800_000, currency: 'COP' })).toBe(`$${NBSP}48.000`)
    expect(pesos({ amountMinor: 8_900_000, currency: 'COP' })).toBe(89_000)
  })

  it('decorates a foreign amount exactly once', () => {
    expect(formatMoney({ amountMinor: 1200, currency: 'USD' })).toBe(`US$${NBSP}12,00`)
    expect(formatMoney({ amountMinor: 1200, currency: 'EUR' })).toBe(`12,00${NBSP}EUR`)
  })

  it('passes text through (a live preview value is already formatted) and has no pesos for it', () => {
    expect(money('$ 50.000')).toBe('$ 50.000')
    expect(pesos('$ 50.000')).toBeNull()
    expect(money(null)).toBe('')
  })

  it('prices per 100 g, rounded to the nearest $ 100', () => {
    expect(perHundredGrams(48_000, 250)).toBe(`$${NBSP}19.200 / 100 g`)
    expect(perHundredGrams(89_000, 500)).toBe(`$${NBSP}17.800 / 100 g`)
    expect(perHundredGrams(168_000, 1000)).toBe(`$${NBSP}16.800 / 100 g`)
  })
})

describe('numbers and dates', () => {
  it('groups thousands even under five digits, as the boards print', () => {
    expect(formatInt(1850)).toBe('1.850')
    expect(formatInt(950)).toBe('950')
    expect(altitudeRange(1780, 1900)).toBe('1.780–1.900')
    expect(altitudeRange(1780, 1900, ' a ')).toBe('1.780 a 1.900')
    expect(altitudeRange(1800, 1800)).toBe('1.800')
  })

  it('prints scores and areas with a decimal comma', () => {
    expect(formatDecimal(86)).toBe('86,0')
    expect(formatDecimal(4.5)).toBe('4,5')
  })

  it('formats DATE values in Spanish, without a timezone shift', () => {
    expect(formatDate('2026-09-28')).toBe('28 de septiembre de 2026')
    expect(formatShortDate('2026-09-28')).toBe('28 sept 2026')
    expect(formatDate(null)).toBe('')
  })

  it('finds the last roast day (Monday or Thursday) in Bogotá', () => {
    // Tuesday 6 October 2026, 03:00 UTC is still Monday 5 October in Bogotá.
    expect(lastRoastDay(new Date('2026-10-06T03:00:00Z')).toISOString().slice(0, 10)).toBe(
      '2026-10-05',
    )
    expect(lastRoastDay(new Date('2026-10-07T15:00:00Z')).toISOString().slice(0, 10)).toBe(
      '2026-10-05',
    )
    expect(lastRoastDay(new Date('2026-10-08T15:00:00Z')).toISOString().slice(0, 10)).toBe(
      '2026-10-08',
    )
    expect(formatRoastDay(new Date('2026-10-05T00:00:00Z'))).toBe('lunes 5 de octubre')
  })

  it('says small counts in words', () => {
    expect(numberWord(6)).toBe('seis')
    expect(numberWord(14)).toBe('14')
  })
})

describe('text', () => {
  it('turns tasting notes into chips and a sentence, keeping the stega marker', () => {
    expect(notesList('Panela, Mandarina, Cacao')).toEqual(['Panela', 'Mandarina', 'Cacao'])
    expect(notesSentence('Panela, Mandarina, Cacao')).toBe('Panela, mandarina y cacao')
    expect(notesSentence(`Panela, Mandarina, Cacao${MARK}`)).toBe(
      `Panela, mandarina y cacao${MARK}`,
    )
    expect(notesSentence('Chocolate')).toBe('Chocolate')
  })

  it('drops a line that holds only a marker', () => {
    expect(lines(`Uno\n\nDos\n${MARK}`)).toEqual(['Uno', 'Dos'])
  })

  it('splits «Día | hora» lines and blank-line paragraphs', () => {
    expect(pairs('Lunes a viernes | 8:00 a. m.\nDomingos | Cerrado')).toEqual([
      ['Lunes a viernes', '8:00 a. m.'],
      ['Domingos', 'Cerrado'],
    ])
    expect(pairs('Sin barra')).toEqual([['Sin barra', '']])
    expect(paragraphs('Uno.\n\nDos.')).toEqual(['Uno.', 'Dos.'])
  })

  it('makes initials without markers', () => {
    expect(initials(`Camila Restrepo${MARK}`)).toBe('CR')
    expect(initials('Daniela')).toBe('D')
  })

  it('chooses Productora, Productor or Productores from the name', () => {
    expect(producerLabel('Luz Marina Cuéllar')).toBe('Productora')
    expect(producerLabel('Rosa Elvira Yace y 9 familias')).toBe('Productores')
    expect(producerLabel('Familia Delgado Jojoa')).toBe('Productores')
    expect(producerLabel('Hernán Claros')).toBe('Productor')
    expect(producerLabel('José Libardo Ramírez')).toBe('Productor')
  })

  it('counts the families behind a producer line', () => {
    expect(familyCount('Rosa Elvira Yace y 9 familias')).toBe(10)
    expect(familyCount('Hernán Claros')).toBe(1)
  })
})
