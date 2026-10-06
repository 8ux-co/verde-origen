import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import type { CafesItem } from '@/generated/cms'
import { formatInt, money, notesSentence, pesos } from '@/lib/format'

import { AddButton } from './cart'
import { Photo, type BagLabel } from './photo'

/** «Huila» for one region, «Varias regiones» for a blend. */
export function regionLabel(cafe: CafesItem): string {
  return cafe.content.region?.value === 'varias'
    ? 'Varias regiones'
    : (cafe.content.region?.label ?? '')
}

export function bagLabel(cafe: CafesItem): BagLabel {
  const c = cafe.content
  return {
    lote: c.lote,
    nombre: c.nombre,
    meta: `${regionLabel(cafe)} · ${formatInt(c.altitud)} msnm`,
  }
}

/** The variety's label, or the detail when the variety is «Varias». */
export function VarietyLabel({ cafe }: { cafe: CafesItem }) {
  const f = fields(cafe)
  return cafe.content.variedad?.value === 'varias' && cafe.content.variedad_detalle ? (
    <span>{f.text('variedad_detalle')}</span>
  ) : (
    <span {...f.attrs('variedad')}>{cafe.content.variedad?.label}</span>
  )
}

/**
 * A coffee card. Desktop: the full card (ficha line, notes, price, Agregar).
 * Mobile: the compact card of the 2-column grid.
 */
export function CafeCard({ cafe, priority }: { cafe: CafesItem; priority?: boolean }) {
  const f = fields(cafe)
  const c = cafe.content
  const href = `/cafes/${cafe.slug}`
  const price = pesos(c.precio_250)

  return (
    <article className="relative flex flex-col gap-3 lg:gap-0">
      <Link
        href={href}
        aria-label={`${cleanStega(c.nombre)}, lote ${cleanStega(c.lote)}`}
        className="block no-underline"
      >
        <Photo
          image={f.image('foto')}
          slot="cafe-card"
          ratio="4/5"
          sizes="(min-width: 1024px) 400px, 50vw"
          priority={priority}
          bag={bagLabel(cafe)}
        />
      </Link>
      <div className="flex flex-col gap-[6px] lg:mt-[18px] lg:gap-[10px] lg:border-t-[1.5px] lg:border-tinta lg:pt-5">
        <span className="eyebrow text-[11px]! lg:text-[13px]!">
          Lote {f.text('lote')} · <span {...f.attrs('region')}>{regionLabel(cafe)}</span>
          <span className="hidden lg:inline">, {f.text('municipio')}</span>
        </span>
        <Link href={href} className="no-underline">
          <h3 className="m-0 font-display text-[26px] leading-[0.95] font-extrabold text-tinta uppercase lg:text-[40px]">
            {f.text('nombre')}
          </h3>
        </Link>
        <span className="hidden font-story text-[16px] leading-[1.4] text-tinta-2 lg:inline">
          <VarietyLabel cafe={cafe} /> · <span {...f.attrs('proceso')}>{c.proceso?.label}</span> ·{' '}
          <span {...f.attrs('altitud')}>{formatInt(c.altitud)}</span> msnm
        </span>
        <span className="font-story text-[15px] leading-[1.35] text-tinta-2 italic lg:text-[19px] lg:text-tinta">
          {notesSentence(f.text('notas'))}
        </span>
        <div className="mt-1 flex items-center justify-between lg:mt-[10px]">
          <span className="inline-flex items-baseline gap-[7px] whitespace-nowrap">
            <span
              className="font-display text-[20px] leading-none font-extrabold tracking-[0.01em] text-tinta lg:text-[26px]"
              {...f.attrs('precio_250')}
            >
              {money(c.precio_250)}
            </span>
            <span className="font-story text-[13px] leading-none text-tinta-2 lg:text-[15px]">
              <span className="lg:hidden">· </span>
              <span className="hidden lg:inline">/ </span>250 g
            </span>
          </span>
          {price !== null ? (
            <AddButton
              className="hidden! lg:inline-flex!"
              line={{
                slug: cafe.slug,
                nombre: cleanStega(c.nombre),
                lote: cleanStega(c.lote),
                size: '250 g',
                molienda: 'Grano entero',
                pesos: price,
              }}
            />
          ) : null}
        </div>
      </div>
    </article>
  )
}
