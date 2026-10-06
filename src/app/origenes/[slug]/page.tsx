import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { CafeCard } from '@/components/cafe-card'
import { ContourMap } from '@/components/contour-map'
import { Photo } from '@/components/photo'
import { RichText } from '@/components/rich-text'
import { AltitudeRange, ArrowLink, Breadcrumbs } from '@/components/ui'
import { getCafes, getDocument, getItem, getPublishedCollection, relationSlug } from '@/lib/content'
import { altitudeRange, formatDecimal, lines, producerLabel } from '@/lib/format'
import { splitAfterParagraph, takeLeading } from '@/lib/rich-text'

export const revalidate = 3600

export async function generateStaticParams() {
  const origenes = await getPublishedCollection('origenes')
  return origenes.map((origen) => ({ slug: origen.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const origen = await getItem('origenes', slug)
  if (!origen) return {}
  return {
    title: `Finca ${cleanStega(origen.content.nombre)}`,
    description: cleanStega(origen.content.resumen ?? ''),
    alternates: { canonical: `/origenes/${origen.slug}` },
    openGraph: {
      images: origen.content.foto_portada?.url ? [origen.content.foto_portada.url] : undefined,
    },
  }
}

export default async function OrigenPage({ params }: Props) {
  const { slug } = await params
  const [origen, cafes, inicio] = await Promise.all([
    getItem('origenes', slug),
    getCafes(),
    getDocument('inicio'),
  ])
  if (!origen) notFound()

  const f = fields(origen)
  const c = origen.content
  const name = f.text('nombre')
  const producer = producerLabel(c.productor)
  const { taken, rest } = takeLeading(c.historia, ['h2'])
  const [before, after] = splitAfterParagraph(rest, 2)
  const [arrivalTitle, ...arrival] = lines(f.text('como_llegar'))
  const gallery = (c.galeria ?? []).filter((item) => item.media?.url).slice(0, 3)
  const farmCafes = cafes.filter((cafe) => relationSlug(cafe.content.origen) === origen.slug)
  const fi = fields(inicio)

  const facts: Array<{ label: string; value: React.ReactNode }> = [
    { label: producer, value: f.text('productor') },
    { label: 'Altitud', value: <AltitudeRange f={f} min={c.altitud_min} max={c.altitud_max} /> },
    ...(c.variedades ? [{ label: 'Variedades', value: f.text('variedades') }] : []),
    ...(c.hectareas
      ? [
          {
            label: 'Tamaño',
            value: (
              <>
                <span {...f.attrs('hectareas')}>
                  {formatDecimal(c.hectareas, Number.isInteger(c.hectareas) ? 0 : 1)}
                </span>{' '}
                hectáreas
              </>
            ),
          },
        ]
      : []),
    ...(c.cosecha ? [{ label: 'Cosecha principal', value: f.text('cosecha') }] : []),
    ...(c.desde
      ? [{ label: 'Compramos desde', value: <span {...f.attrs('desde')}>{c.desde}</span> }]
      : []),
  ]

  return (
    <>
      <section className="wrap pt-5 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Orígenes', href: '/origenes' },
            { label: name },
          ]}
        />
        <div className="mt-6 mb-7 flex flex-col gap-4 lg:mt-10 lg:mb-12 lg:gap-[22px]">
          <span className="eyebrow eyebrow--lg">
            <span {...f.attrs('region')}>{c.region.label}</span> · {f.text('municipio')}
            {c.vereda ? <> · {f.text('vereda')}</> : null}
          </span>
          <h1 className="m-0 font-display text-(length:--fl-finca) leading-[0.88] font-black tracking-[-0.005em] text-balance uppercase">
            Finca {name}
          </h1>
        </div>
        <div className="relative -mx-5 md:mx-0">
          <Photo
            image={f.image('foto_portada')}
            slot="origen-cover"
            ratio="21/9"
            sizes="(min-width: 1024px) 1280px, 100vw"
            priority
            className="aspect-[3/2]! md:aspect-[21/9]!"
          />
          <div aria-hidden="true" className="stamp top-6 right-5 -rotate-4 lg:top-11 lg:right-12">
            <span className="stamp__big">{altitudeRange(c.altitud_min, c.altitud_max)}</span>
            <span className="stamp__small">msnm</span>
          </div>
        </div>
      </section>

      {/* Datos */}
      <section className="wrap pt-10 pb-4 lg:pt-14 lg:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-[10px] border-t-[1.5px] border-tinta py-[22px]"
            >
              <span className="eyebrow eyebrow--muted">{fact.label}</span>
              <span className="font-display text-[26px] leading-[1.05] font-extrabold uppercase lg:text-[30px]">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className="wrap py-12 lg:py-[88px]">
        <div className="grid gap-10 lg:grid-cols-[4fr_1fr_7fr] lg:gap-0">
          {c.productor_foto ? (
            <div className="flex flex-col gap-[14px]">
              <Photo
                image={f.image('productor_foto')}
                slot="productor"
                ratio="4/5"
                sizes="(min-width: 1024px) 420px, 100vw"
              />
              <span className="font-story text-[16px] leading-[1.4] text-tinta-2 italic">
                {cleanStega(c.productor)}, en el beneficiadero de {cleanStega(c.nombre)}.
              </span>
            </div>
          ) : (
            <div />
          )}
          <div className="hidden lg:block" />
          <div className="flex max-w-[680px] flex-col gap-[22px]">
            {taken.h2 ? (
              <h2
                className="m-0 font-display text-(length:--fl-h2-sm) leading-[0.92] font-extrabold text-balance uppercase"
                dangerouslySetInnerHTML={{ __html: taken.h2 }}
              />
            ) : null}
            <RichText
              html={before}
              className="prose lg:[&_p]:text-[20px]! lg:[&_p]:leading-[1.6]!"
            />
            {c.cita ? (
              <blockquote className="m-0 my-[18px] border-y-[1.5px] border-tinta py-7">
                <p className="m-0 font-story text-[26px] leading-[1.25] italic lg:text-[34px]">
                  «{f.text('cita')}»
                </p>
                <footer className="mt-4">
                  <span className="eyebrow lg:text-[14px]!">{cleanStega(c.productor)}</span>
                </footer>
              </blockquote>
            ) : null}
            <RichText
              html={after}
              className="prose lg:[&_p]:text-[20px]! lg:[&_p]:leading-[1.6]!"
            />
          </div>
        </div>
      </section>

      {/* Mapa y cómo llegar */}
      <section className="wrap pb-12 lg:pt-6 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[8fr_4fr] lg:items-end lg:gap-14">
          <Photo
            image={
              c.mapa_imagen
                ? f.image('mapa_imagen')
                : { src: undefined, alt: undefined, ...f.attrs('mapa_imagen') }
            }
            slot="origen-gallery"
            ratio="16/9"
            sizes="(min-width: 1024px) 840px, 100vw"
            className="bg-[#DCE1D6]! text-hoja"
            emptyLabel="Mapa"
            empty={
              <ContourMap
                seed={origen.slug.length * 17}
                pins={[
                  { label: cleanStega(c.nombre), x: 42, y: 44 },
                  { label: cleanStega(c.municipio), x: 78, y: 66 },
                ]}
              />
            }
          />
          {arrivalTitle ? (
            <div className="flex flex-col gap-[18px]">
              <span className="eyebrow">Cómo llegar</span>
              <h3 className="m-0 font-display text-[32px] leading-[0.95] font-extrabold uppercase lg:text-[40px]">
                {arrivalTitle}
              </h3>
              {arrival.map((line, i) => (
                <p
                  key={i}
                  className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-tinta-2 lg:text-[19px]"
                >
                  {line}
                </p>
              ))}
              {c.mapa_url ? (
                <div>
                  <ArrowLink href={f.value('mapa_url') ?? '#'}>Abrir en Google Maps</ArrowLink>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Galería */}
      {gallery.length > 0 ? (
        <section className="wrap pb-12 lg:pb-24" {...f.attrs('galeria')}>
          <div className="grid grid-cols-2 items-end gap-3 lg:grid-cols-[6fr_3fr_3fr] lg:gap-5">
            {gallery.map((item, i) => (
              <div
                key={`${item.media!.id}-${i}`}
                className={i === 0 ? 'col-span-2 lg:col-span-1' : ''}
              >
                <Photo
                  image={{
                    src: item.media!.url ?? undefined,
                    alt: item.caption ?? item.media!.alt ?? '',
                  }}
                  slot="origen-gallery"
                  ratio={i === 0 ? '3/2' : '3/4'}
                  sizes={
                    i === 0 ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 320px, 50vw'
                  }
                  dark={i === 2}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Cafés de esta finca */}
      <section className="border-t border-linea">
        <div className="wrap py-12 lg:pt-24 lg:pb-28">
          <div className="mb-6 flex items-end justify-between lg:mb-12">
            <h2 className="m-0 font-display text-(length:--fl-h2-md) leading-[0.92] font-extrabold text-balance uppercase">
              Cafés de esta finca
            </h2>
            <ArrowLink href="/cafes" className="hidden lg:inline-flex">
              Todos los cafés
            </ArrowLink>
          </div>
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-7 lg:grid-cols-3 lg:gap-10">
            {farmCafes.map((cafe) => (
              <CafeCard key={cafe.slug} cafe={cafe} />
            ))}
            {farmCafes.length % 3 !== 0 ? (
              <div className="col-span-2 flex flex-col justify-end gap-[18px] border border-linea bg-papel p-6 lg:col-span-1 lg:p-8">
                <span className="eyebrow">Próxima cosecha</span>
                <h3 className="m-0 font-display text-[30px] leading-[0.95] font-extrabold uppercase lg:text-[34px]">
                  {fi.text('boletin_titulo')}
                </h3>
                <p className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-tinta-2 lg:text-[18px]">
                  {fi.text('boletin_texto')}
                </p>
                <div>
                  <Link href="/#boletin" className="btn btn--sm">
                    Avisarme
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
