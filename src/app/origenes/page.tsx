import type { Metadata } from 'next'
import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { ContourMap } from '@/components/contour-map'
import { Photo } from '@/components/photo'
import { RegionFilter } from '@/components/region-filter'
import { AltitudeRange, ArrowLink, PageHead } from '@/components/ui'
import type { CafesItem, OrigenesItem } from '@/generated/cms'
import { getCafes, getDocument, getOrigenes, relationSlug } from '@/lib/content'
import { altitudeRange, familyCount, producerLabel } from '@/lib/format'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocument('pagina-origenes')
  return {
    title: cleanStega(page.content.titulo ?? 'Orígenes'),
    description: cleanStega(page.content.intro ?? ''),
    alternates: { canonical: '/origenes' },
  }
}

/** Where each department sits on the drawn map (percent of the frame). */
const REGION_PINS: Record<string, { x: number; y: number }> = {
  tolima: { x: 58, y: 22 },
  huila: { x: 62, y: 52 },
  cauca: { x: 33, y: 56 },
  narino: { x: 22, y: 84 },
}

function cafesIn(origen: OrigenesItem, cafes: CafesItem[]) {
  return cafes.filter((cafe) => relationSlug(cafe.content.origen) === origen.slug).length
}

function OrigenRow({
  origen,
  cafes,
  first,
}: {
  origen: OrigenesItem
  cafes: number
  first: boolean
}) {
  const f = fields(origen)
  const c = origen.content
  const href = `/origenes/${origen.slug}`
  return (
    <article className="grid gap-5 border-t-[1.5px] border-tinta py-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-16 lg:py-10">
      <Link href={href} aria-hidden="true" tabIndex={-1}>
        <Photo
          image={f.image('foto_portada')}
          slot="origen-row"
          ratio="3/2"
          sizes="(min-width: 1024px) 520px, 100vw"
          priority={first}
          alt=""
        />
      </Link>
      <div className="flex flex-col gap-4">
        <span className="eyebrow lg:text-[14px]!">
          <span {...f.attrs('region')}>{c.region.label}</span>
          {' · '}
          <span {...f.attrs('municipio')}>{f.text('municipio')}</span>
          {c.vereda ? (
            <>
              {' · '}
              <span {...f.attrs('vereda')}>{f.text('vereda')}</span>
            </>
          ) : null}
        </span>
        <h2 className="m-0 font-display text-[52px] leading-[0.9] font-black uppercase lg:text-[76px]">
          <Link href={href} className="text-tinta no-underline hover:underline">
            {f.text('nombre')}
          </Link>
        </h2>
        <p className="m-0 font-story text-[19px] leading-[1.3] text-pretty lg:text-[22px]">
          <span className="sr-only">{producerLabel(c.productor)}: </span>
          {f.text('productor')}
        </p>
        <div className="mt-[6px]">
          <dl className="ficha ficha--2">
            <div>
              <dt>Altitud</dt>
              <dd>
                <AltitudeRange f={f} min={c.altitud_min} max={c.altitud_max} />
              </dd>
            </div>
            {c.variedades ? (
              <div>
                <dt>Variedades</dt>
                <dd>{f.text('variedades')}</dd>
              </div>
            ) : null}
            {c.cosecha ? (
              <div>
                <dt>Cosecha</dt>
                <dd>{f.text('cosecha')}</dd>
              </div>
            ) : null}
            {c.desde ? (
              <div>
                <dt>Compramos desde</dt>
                <dd {...f.attrs('desde')}>{c.desde}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-7">
          <ArrowLink href={href}>Ver la finca</ArrowLink>
          {cafes > 0 ? (
            <span className="font-story text-[16px] leading-none text-tinta-2">
              {cafes} {cafes === 1 ? 'café' : 'cafés'} en la tienda
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default async function OrigenesPage() {
  const [page, origenes, cafes] = await Promise.all([
    getDocument('pagina-origenes'),
    getOrigenes(),
    getCafes(),
  ])
  const f = fields(page)
  const regions: Array<{ value: string; label: string; count: number }> = []
  for (const origen of origenes) {
    const { value, label } = origen.content.region
    const region = regions.find((r) => r.value === value)
    if (region) region.count++
    else regions.push({ value, label, count: 1 })
  }
  const families = origenes.reduce((sum, origen) => sum + familyCount(origen.content.productor), 0)
  const min = Math.min(...origenes.map((o) => o.content.altitud_min))
  const max = Math.max(...origenes.map((o) => o.content.altitud_max))

  return (
    <>
      <PageHead
        crumbs={[{ label: f.text('titulo') }]}
        title={f.text('titulo')}
        intro={f.text('intro')}
        aside={
          <Photo
            image={
              page.content.mapa
                ? f.image('mapa')
                : { src: undefined, alt: undefined, ...f.attrs('mapa') }
            }
            slot="region-card"
            ratio="4/3"
            sizes="(min-width: 1024px) 640px, 100vw"
            className="bg-[#DCE1D6]! text-hoja"
            emptyLabel="Mapa · 4:3"
            empty={
              <ContourMap
                pins={regions.map((r) => ({
                  label: r.label,
                  ...(REGION_PINS[r.value] ?? { x: 50, y: 50 }),
                }))}
              />
            }
          />
        }
      />
      <section className="wrap pt-0 pb-14 lg:pt-6 lg:pb-28">
        <RegionFilter
          regions={regions}
          summary={`${families} familias, ${altitudeRange(min, max, ' a ')} msnm`}
          items={origenes.map((origen, i) => ({
            slug: origen.slug,
            region: origen.content.region.value,
            node: <OrigenRow origen={origen} cafes={cafesIn(origen, cafes)} first={i === 0} />,
          }))}
        />
      </section>
    </>
  )
}
