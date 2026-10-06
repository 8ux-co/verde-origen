/**
 * Colombian formatting, in one place: money, numbers, dates and the small
 * text transforms the boards use. Pure functions, unit-tested.
 *
 * Money (design handoff): COP is the home currency, so it is never
 * decorated: `$ 48.000`, es-CO, no decimals, a non-breaking space after `$`.
 * A foreign amount gets exactly one decoration (`US$ 12,00`, `12,00 EUR`).
 */

export const NBSP = ' '

const integer = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0, useGrouping: 'always' })
const twoDecimals = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: 'always',
})

/** `1850` → `1.850` (grouped even under five digits, as the boards print). */
export function formatInt(value: number): string {
  return integer.format(value)
}

/** `86` → `86,0`; `4.5` → `4,5`. */
export function formatDecimal(value: number, digits = 1): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: 'always',
  }).format(value)
}

/** Whole pesos → `$ 48.000`. */
export function formatCOP(pesos: number): string {
  return `$${NBSP}${integer.format(Math.round(pesos))}`
}

/** A Zap CURRENCY value (minor units) as display money. */
export function formatMoney(value: { amount: number; currency: string }): string {
  const major = value.amount / 100
  switch (value.currency) {
    case 'COP':
      return formatCOP(major)
    case 'USD':
      return `US$${NBSP}${twoDecimals.format(major)}`
    default:
      return `${twoDecimals.format(major)}${NBSP}${value.currency}`
  }
}

export type MoneyLike = { amount: number; currency: string } | string | null | undefined

/**
 * Money from a delivered value, or from an unsaved value the preview sends
 * (already formatted by Zap as text): text passes through.
 */
export function money(value: MoneyLike): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return formatMoney(value)
}

/** Whole pesos in a CURRENCY value, or null (sold out, or not a number yet). */
export function pesos(value: MoneyLike): number | null {
  if (!value || typeof value === 'string') return null
  return value.amount / 100
}

/** `$ 19.200 / 100 g` for 250 g at $ 48.000. */
export function perHundredGrams(totalPesos: number, grams: number): string {
  // Rounded to the nearest $ 100, as a shelf label would.
  return `${formatCOP(Math.round(totalPesos / grams) * 100)} / 100 g`
}

export function formatAltitude(metres: number): string {
  return `${formatInt(metres)} msnm`
}

/** `1.780–1.900` (figures) or `1.780 a 1.900` (prose). */
export function altitudeRange(min: number, max: number, joiner: '–' | ' a ' = '–'): string {
  return min === max ? formatInt(min) : `${formatInt(min)}${joiner}${formatInt(max)}`
}

const longDate = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const shortDate = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function toDate(value: string | Date): Date | null {
  const date =
    typeof value === 'string' ? new Date(value.length === 10 ? `${value}T00:00:00Z` : value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

/** `2026-09-28` → `28 de septiembre de 2026`. */
export function formatDate(value: string | Date | null | undefined): string {
  const date = value ? toDate(value) : null
  return date ? longDate.format(date) : ''
}

/** `2026-09-28` → `28 sep 2026`. */
export function formatShortDate(value: string | Date | null | undefined): string {
  const date = value ? toDate(value) : null
  return date ? shortDate.format(date).replace(/\./g, '').replace(/ de /g, ' ') : ''
}

const ROAST_DAYS = [1, 4] // lunes, jueves

/** The most recent roast day (Monday or Thursday) on or before `now`, in Bogotá. */
export function lastRoastDay(now: Date = new Date()): Date {
  const bogota = new Date(now.getTime() - 5 * 60 * 60 * 1000) // UTC−5, no DST
  const day = new Date(Date.UTC(bogota.getUTCFullYear(), bogota.getUTCMonth(), bogota.getUTCDate()))
  for (let i = 0; i < 7; i++) {
    if (ROAST_DAYS.includes(day.getUTCDay())) return day
    day.setUTCDate(day.getUTCDate() - 1)
  }
  return day
}

const roastFormat = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

/** `lunes 5 de octubre`. */
export function formatRoastDay(date: Date): string {
  return roastFormat.format(date).replace(',', '')
}

// ── Text ────────────────────────────────────────────────────────────────────

/** `Panela, Mandarina, Cacao` → `['Panela', 'Mandarina', 'Cacao']`. */
export function notesList(notes: string | null | undefined): string[] {
  return (notes ?? '')
    .split(',')
    .map((note) => note.trim())
    .filter((note) => note.replace(/[​-‍⁠﻿]/g, '').length > 0)
}

/** `Panela, Mandarina, Cacao` → `Panela, mandarina y cacao`. */
export function notesSentence(notes: string | null | undefined): string {
  const list = notesList(notes).map((note, i) => (i === 0 ? note : note.toLocaleLowerCase('es-CO')))
  if (list.length <= 1) return list.join('')
  return `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}`
}

/** Non-empty lines of a LONG_TEXT. */
export function lines(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.replace(/[​-‍⁠﻿]/g, '').length > 0)
}

/** `Día | hora` lines → `[['Día', 'hora'], …]`. A line without `|` has an empty second half. */
export function pairs(text: string | null | undefined): Array<[string, string]> {
  return lines(text).map((line) => {
    const at = line.indexOf('|')
    return at === -1 ? [line, ''] : [line.slice(0, at).trim(), line.slice(at + 1).trim()]
  })
}

/** Paragraphs of a LONG_TEXT, split on blank lines. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

/** `Camila Restrepo` → `CR`. */
export function initials(name: string | null | undefined): string {
  return (name ?? '')
    .replace(/[​-‍⁠﻿]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toLocaleUpperCase('es-CO'))
    .join('')
}

/** «Productora» or «Productor», chosen from the name (design: site-chosen). */
export function producerLabel(name: string | null | undefined): string {
  const clean = (name ?? '').replace(/[​-‍⁠﻿]/g, '').trim()
  if (/^(familia|grupo)\b/i.test(clean) || / y \d+ familias/i.test(clean)) return 'Productores'
  const first = clean.split(/\s+/)[0]?.toLocaleLowerCase('es-CO') ?? ''
  const feminine = [
    'luz',
    'rosa',
    'maría',
    'maria',
    'ana',
    'camila',
    'daniela',
    'marcela',
    'rosalba',
  ]
  return feminine.includes(first) || /a$/.test(first) ? 'Productora' : 'Productor'
}

const WORDS = [
  'cero',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
]

/** `6` → `seis` (up to twelve, then figures), for counts in running text. */
export function numberWord(n: number): string {
  return WORDS[n] ?? formatInt(n)
}

/** Families behind a producer line: «Rosa Elvira Yace y 9 familias» is ten, a name is one. */
export function familyCount(productor: string | null | undefined): number {
  const match = /y\s+(\d+)\s+familias/i.exec(
    (productor ?? '').replace(/[\u200b-\u200d\u2060\ufeff]/g, ''),
  )
  return match ? Number(match[1]) + 1 : 1
}
