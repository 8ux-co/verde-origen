import { cleanStega } from '@8ux-co/eelzap'

import type { CafesItem, OrigenesItem } from '@/generated/cms'

const clean = (value: string | null | undefined) => cleanStega(value ?? '').trim()

/**
 * The region line of a coffee: its region's label, or, for a blend
 * (`region: varias`), the regions of the farms its `municipio` names, in the
 * order named: «Pitalito y Planadas» → «Huila y Tolima». Falls back to
 * «Varias regiones» when no farm matches.
 */
export function regionText(cafe: CafesItem, origenes: OrigenesItem[]): string {
  if (cafe.content.region?.value !== 'varias') return cafe.content.region?.label ?? ''
  const towns = clean(cafe.content.municipio).toLocaleLowerCase('es-CO')
  const found = origenes
    .map((origen) => ({
      at: towns.indexOf(clean(origen.content.municipio).toLocaleLowerCase('es-CO')),
      origen,
    }))
    .filter(({ at, origen }) => at >= 0 && clean(origen.content.municipio) !== '')
    .sort((a, b) => a.at - b.at)
    .map(({ origen }) => origen.content.region.label)
  const regions = [...new Set(found)]
  if (regions.length === 0) return 'Varias regiones'
  return regions.length === 1
    ? regions[0]!
    : `${regions.slice(0, -1).join(', ')} y ${regions.at(-1)}`
}

/**
 * Up to `count` coffees to suggest next to one: same region first, then same
 * process, each group in the shop's order (`orden`); never the coffee itself.
 */
export function relatedCafes(cafe: CafesItem, cafes: CafesItem[], count = 3): CafesItem[] {
  const others = cafes.filter((other) => other.slug !== cafe.slug)
  const sameRegion = others.filter((o) => o.content.region.value === cafe.content.region.value)
  const sameProcess = others.filter(
    (o) => !sameRegion.includes(o) && o.content.proceso.value === cafe.content.proceso.value,
  )
  return [...sameRegion, ...sameProcess].slice(0, count)
}
