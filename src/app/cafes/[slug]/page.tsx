import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { CafeBuyBox } from '@/components/cafe-buy-box'
import { bagLabel, CafeCard, VarietyLabel } from '@/components/cafe-card'
import { CafeGallery } from '@/components/cafe-gallery'
import { Photo, type PhotoSource } from '@/components/photo'
import { RichText } from '@/components/rich-text'
import { AltitudeRange, ArrowLink, Breadcrumbs } from '@/components/ui'
import type { CafesItem, OrigenesItem } from '@/generated/cms'
import { regionText, relatedCafes } from '@/lib/catalog'
import {
  assertRelations,
  findBySlug,
  getCafes,
  getCollection,
  getItem,
  getPublishedCollection,
} from '@/lib/content'
import {
  formatCOP,
  formatDecimal,
  formatInt,
  formatRoastDay,
  lastRoastDay,
  notesList,
  pairs,
  producerLabel,
} from '@/lib/format'

export const revalidate = 3600

export async function generateStaticParams() {
  await assertRelations()
  const cafes = await getPublishedCollection('cafes')
  return cafes
    .filter((cafe) => cafe.content.disponible !== false)
    .map((cafe) => ({ slug: cafe.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cafe = await getItem('cafes', slug)
  if (!cafe) return {}
  const name = cleanStega(cafe.content.nombre)
  return {
    title: `${name}, lote ${cleanStega(cafe.content.lote)}`,
    description: cleanStega(cafe.content.resumen),
    alternates: { canonical: `/cafes/${cafe.slug}` },
    openGraph: { images: cafe.content.foto?.url ? [cafe.content.foto.url] : undefined },
  }
}

/**
 * «de la vereda Bruselas», «del corregimiento de Gaitania», or the town for a
 * blend: the lead words, the place, and the field the place comes from (the
 * farm's `vereda` or the coffee's `municipio`), so the place is tagged alone.
 */
function placePhrase(
  cafe: CafesItem,
  origen: OrigenesItem | null,
): { lead: string; place: string; field: 'vereda' | 'municipio' } {
  const vereda = cleanStega(origen?.content.vereda ?? '')
  if (cafe.content.region.value === 'varias' || !vereda)
    return { lead: 'de', place: cleanStega(cafe.content.municipio), field: 'municipio' }
  const lower = vereda.charAt(0).toLocaleLowerCase('es-CO') + vereda.slice(1)
  return { lead: /^vereda\b/i.test(vereda) ? 'de la' : 'del', place: lower, field: 'vereda' }
}

export default async function CafePage({ params }: Props) {
  const { slug } = await params
  const [cafe, cafes, origenes] = await Promise.all([
    getItem('cafes', slug),
    getCafes(),
    getCollection('origenes'),
  ])
  if (!cafe) notFound()

  const f = fields(cafe)
  const c = cafe.content
  const origen = findBySlug(origenes, c.origen)
  const o = origen ? fields(origen) : null
  const roast = formatRoastDay(lastRoastDay())

  const photos: PhotoSource[] = [f.image('foto')]
  for (const item of c.galeria ?? []) {
    if (!item.media?.url || item.media.id === c.foto?.id) continue
    photos.push({
      src: item.media.url,
      alt: item.media.alt ?? '',
      width: item.media.width ?? undefined,
      height: item.media.height ?? undefined,
    })
  }

  const recipes = pairs(f.value('preparacion'))
  const related = relatedCafes(cafe, cafes)
  const region = regionText(cafe, origenes)
  const place = placePhrase(cafe, origen)

  return (
    <>
      <section className="wrap pt-4 pb-12 lg:pt-8 lg:pb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Cafés', href: '/cafes' },
            { label: f.text('nombre') },
          ]}
          className="[&_li:first-child]:hidden lg:[&_li:first-child]:inline-flex"
        />
        <div className="mt-4 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,748px)_1fr] lg:items-start lg:gap-[72px]">
          <CafeGallery
            photos={photos}
            galleryAttrs={f.attrs('galeria')}
            bag={bagLabel(cafe, region)}
            name={cleanStega(c.nombre)}
          />

          <div className="flex flex-col gap-[22px] lg:gap-[26px]">
            <div className="flex flex-col gap-3 lg:gap-4">
              <span className="eyebrow lg:text-[15px]!">
                Lote <span {...f.attrs('lote')}>{f.text('lote')}</span>
                {' · '}
                <span {...f.attrs('region')}>{region}</span>
                {', '}
                <span {...f.attrs('municipio')}>{f.text('municipio')}</span>
              </span>
              <h1 className="m-0 font-display text-(length:--fl-cafe) leading-[0.88] font-black tracking-[-0.005em] text-balance uppercase">
                {f.text('nombre')}
              </h1>
              <p className="m-0 font-story text-[18px] leading-[1.45] text-pretty lg:text-[21px]">
                {f.text('resumen')}
              </p>
            </div>
            <div className="flex flex-col gap-[10px]">
              <span className="eyebrow eyebrow--muted hidden lg:inline-block">
                Notas de catación
              </span>
              {/* One TEXT field split into chips: the tag covers the list. */}
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0" {...f.attrs('notas')}>
                {notesList(f.value('notas')).map((note, i) => (
                  <li key={i} className="chip">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            <CafeBuyBox
              cafe={cafe}
              attrs={{
                precio_250: f.attrs('precio_250'),
                precio_500: f.attrs('precio_500'),
                precio_1kg: f.attrs('precio_1kg'),
              }}
              roastNote={`Tostado el ${roast}. Sale de Bogotá al día siguiente.`}
              shippingNote={`Envío gratis desde ${formatCOP(150_000)}.`}
            />
          </div>
        </div>
      </section>

      {/* Ficha de lote */}
      <section className="border-t-[1.5px] border-tinta lg:border-0">
        <div className="wrap grid gap-5 pt-10 pb-12 lg:grid-cols-[4fr_8fr] lg:gap-20 lg:pt-24 lg:pb-8">
          <div className="flex flex-col gap-3 lg:gap-4">
            <span className="eyebrow">Ficha de lote</span>
            <h2 className="m-0 font-display text-(length:--fl-h2-sm) leading-[0.92] font-extrabold text-balance uppercase">
              Lote <span {...f.attrs('lote')}>{f.text('lote')}</span>, {place.lead}{' '}
              <span {...(place.field === 'vereda' && o ? o.attrs('vereda') : f.attrs('municipio'))}>
                {place.place}
              </span>
            </h2>
          </div>
          <dl className="ficha ficha--2">
            {origen && o ? (
              <div>
                <dt>Finca</dt>
                <dd>
                  <Link
                    href={`/origenes/${origen.slug}`}
                    className="underline underline-offset-[3px]"
                  >
                    Finca {o.text('nombre')}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>{producerLabel(c.productor)}</dt>
              <dd>{f.text('productor')}</dd>
            </div>
            <div>
              <dt>Municipio</dt>
              <dd>
                <span {...f.attrs('municipio')}>{f.text('municipio')}</span>
                {c.region.value !== 'varias' ? (
                  <>
                    {', '}
                    <span {...f.attrs('region')}>{c.region.label}</span>
                  </>
                ) : null}
              </dd>
            </div>
            <div>
              <dt>Altitud</dt>
              <dd>
                <span {...f.attrs('altitud')}>{formatInt(c.altitud)}</span> msnm
              </dd>
            </div>
            <div>
              <dt>Variedad</dt>
              <dd>
                <VarietyLabel cafe={cafe} />
              </dd>
            </div>
            <div>
              <dt>Proceso</dt>
              <dd>
                <span {...f.attrs('proceso')}>{c.proceso.label}</span>
                {c.proceso_detalle ? (
                  <>
                    ,{' '}
                    <span {...f.attrs('proceso_detalle')}>
                      {f.text('proceso_detalle').charAt(0).toLocaleLowerCase('es-CO') +
                        f.text('proceso_detalle').slice(1)}
                    </span>
                  </>
                ) : null}
              </dd>
            </div>
            {c.secado ? (
              <div>
                <dt>Secado</dt>
                <dd>{f.text('secado')}</dd>
              </div>
            ) : null}
            {c.cosecha ? (
              <div>
                <dt>Cosecha</dt>
                <dd>{f.text('cosecha')}</dd>
              </div>
            ) : null}
            {c.puntaje !== null ? (
              <div>
                <dt>Puntaje</dt>
                <dd>
                  <span {...f.attrs('puntaje')}>{formatDecimal(c.puntaje)}</span> puntos SCA, catado
                  en el taller
                </dd>
              </div>
            ) : null}
            {c.tueste ? (
              <div>
                <dt>Tueste</dt>
                <dd {...f.attrs('tueste')}>{c.tueste.label}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      {/* Sobre este lote */}
      <section className="wrap pt-2 pb-12 lg:pt-16 lg:pb-28">
        <div className="grid gap-[18px] lg:grid-cols-[4fr_5fr_3fr] lg:gap-16 lg:border-t-[1.5px] lg:border-tinta lg:pt-12">
          <h2 className="m-0 font-display text-(length:--fl-h2-sm) leading-[0.92] font-extrabold text-balance uppercase">
            Sobre este lote
          </h2>
          <RichText html={c.descripcion} className="prose" />
          {recipes.length > 0 ? (
            <div className="mt-6 lg:mt-0">
              <span className="eyebrow">Cómo lo preparamos</span>
              {/* One LONG_TEXT shown as method and recipe rows: the tag covers them all. */}
              <div className="mt-[14px]" {...f.attrs('preparacion')}>
                {recipes.map(([method, recipe], i) => (
                  <div key={i} className="border-t border-linea py-4">
                    <span className="block font-display text-[22px] leading-none font-extrabold uppercase">
                      {method}
                    </span>
                    <span className="mt-2 block font-story text-[17px] leading-[1.45] text-tinta-2">
                      {recipe}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* El origen de este café */}
      {origen && o ? (
        <section className="on-dark bg-hoja text-niebla">
          <div className="wrap grid gap-[22px] py-12 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-24">
            <Photo
              image={o.image('foto_portada')}
              slot="origen-band"
              ratio="3/2"
              sizes="(min-width: 1024px) 640px, 100vw"
              dark
            />
            <div className="flex flex-col gap-[14px] lg:gap-5">
              <span className="eyebrow eyebrow--on-dark">
                El origen<span className="hidden lg:inline"> de este café</span>
              </span>
              <h2 className="m-0 font-display text-(length:--fl-h2-xl) leading-[0.92] font-extrabold text-balance text-niebla uppercase">
                Finca {o.text('nombre')}
              </h2>
              {origen.content.resumen ? (
                <p className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-hoja-texto lg:text-[19px]">
                  {o.text('resumen')}
                </p>
              ) : null}
              <dl className="ficha hidden lg:grid">
                <div>
                  <dt>{producerLabel(origen.content.productor)}</dt>
                  <dd>{o.text('productor')}</dd>
                </div>
                <div>
                  <dt>Altitud</dt>
                  <dd>
                    <AltitudeRange
                      f={o}
                      min={origen.content.altitud_min}
                      max={origen.content.altitud_max}
                    />
                  </dd>
                </div>
                {origen.content.desde ? (
                  <div>
                    <dt>Compramos desde</dt>
                    <dd {...o.attrs('desde')}>{origen.content.desde}</dd>
                  </div>
                ) : null}
              </dl>
              <div>
                <ArrowLink href={`/origenes/${origen.slug}`}>Conocer la finca</ArrowLink>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* También te puede gustar */}
      {related.length > 0 ? (
        <section className="wrap py-12 lg:py-28">
          <div className="mb-6 flex items-end justify-between lg:mb-12">
            <h2 className="m-0 font-display text-(length:--fl-h2-md) leading-[0.92] font-extrabold text-balance uppercase max-lg:text-[36px] max-lg:tracking-[-0.01em]">
              También te puede gustar
            </h2>
            <ArrowLink href="/cafes" className="hidden lg:inline-flex">
              Todos los cafés
            </ArrowLink>
          </div>
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-7 lg:grid-cols-3 lg:gap-10">
            {related.map((other, i) => (
              <div key={other.slug} className={i === 2 ? 'hidden lg:block' : ''}>
                <CafeCard cafe={other} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
