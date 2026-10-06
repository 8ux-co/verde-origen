import type { Fields, FieldsRecord, ZapAttrs } from '@8ux-co/eelzap/fields'

/**
 * Numbered slots with a suffix: `nav_1_texto` + `nav_1_url`, `dato_1_valor`
 * + `dato_1_texto`. `fields().list()` reads `prefix_1 … prefix_n` only, so
 * a slot made of two fields is read here, through the same helpers: text
 * keeps its stega marker, the rest comes clean with its `data-zap` tag.
 */
export interface Slot {
  /** The text field as delivered (stega in preview). */
  text: (suffix: string) => string
  /** A field's value without markers (URLs, numbers). */
  value: (suffix: string) => string
  /** `data-zap` for a non-text field of the slot. */
  attrs: (suffix: string) => ZapAttrs
  /** True when the slot's first text is empty. */
  empty: boolean
}

export function slots<R extends FieldsRecord>(
  f: Fields<R>,
  prefix: string,
  count: number,
  firstSuffix: string,
): Slot[] {
  type AnyKey = Parameters<Fields<R>['attrs']>[0]
  return Array.from({ length: count }, (_, i) => {
    const key = (suffix: string) => `${prefix}_${i + 1}_${suffix}` as AnyKey
    const text = (suffix: string) => (f.text as (k: AnyKey) => string)(key(suffix))
    const value = (suffix: string) => {
      const raw = f.value(key(suffix)) as unknown
      return raw === null || raw === undefined ? '' : String(raw)
    }
    return {
      text,
      value,
      attrs: (suffix: string) => f.attrs(key(suffix)),
      empty: value(firstSuffix).trim() === '',
    }
  })
}
