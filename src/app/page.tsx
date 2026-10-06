import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { BlogCard } from '@/components/blog-card'
import { CafeCard } from '@/components/cafe-card'
import { NewsletterForm } from '@/components/newsletter-form'
import { Photo } from '@/components/photo'
import { ArrowLink, SectionHead } from '@/components/ui'
import type { OrigenesItem } from '@/generated/cms'
import {
  findBySlug,
  getCafes,
  getDocument,
  getOrigenes,
  getPersonas,
  getPosts,
} from '@/lib/content'
import { altitudeRange, formatInt, numberWord, paragraphs } from '@/lib/format'

export const revalidate = 3600

interface Region {
  value: string
  label: string
  farms: OrigenesItem[]
  min: number
  max: number
}

/** Origins grouped by region, in the order the farms come (Huila first). */
function regions(origenes: OrigenesItem[]): Region[] {
  const out: Region[] = []
  for (const origen of origenes) {
    const { value, label } = origen.content.region
    let region = out.find((r) => r.value === value)
    if (!region) {
      region = { value, label, farms: [], min: Infinity, max: -Infinity }
      out.push(region)
    }
    region.farms.push(origen)
    region.min = Math.min(region.min, origen.content.altitud_min)
    region.max = Math.max(region.max, origen.content.altitud_max)
  }
  return out
}

export default async function InicioPage() {
  const [inicio, cafes, origenes, posts, personas] = await Promise.all([
    getDocument('inicio'),
    getCafes(),
    getOrigenes(),
    getPosts(),
    getPersonas(),
  ])
  const f = fields(inicio)
  const destacados = cafes.filter((cafe) => cafe.content.destacado)
  const first = destacados[0]
  const datos = f.list('dato', 4).filter((slot) => !slot.empty)
  const historia = paragraphs(f.text('historia_texto'))

  return (
    <>
      {/* Héroe */}
      <section className="wrap pt-7 pb-14 lg:pt-[72px] lg:pb-[104px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,560px)] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-5 lg:gap-[30px]">
            {f.text('hero_antetitulo') ? (
              <span className="eyebrow eyebrow--lg">{f.text('hero_antetitulo')}</span>
            ) : null}
            <h1 className="m-0 font-display text-(length:--fl-hero) leading-[0.88] font-black tracking-[-0.005em] text-balance uppercase">
              {f.text('hero_titulo')}
            </h1>
            <p className="m-0 max-w-[560px] font-story text-[18px] leading-[1.5] text-pretty lg:text-[23px] lg:leading-[1.45]">
              {f.text('hero_texto')}
            </p>
            <div className="mt-1 flex flex-col items-stretch gap-[14px] sm:flex-row sm:items-center sm:gap-7 lg:mt-2">
              <Link
                href={f.value('hero_cta_url') || '/cafes'}
                className="btn btn--lg btn--buy"
                {...f.attrs('hero_cta_url')}
              >
                {f.text('hero_cta_texto')}
              </Link>
              {f.text('hero_enlace_texto') ? (
                <div className="text-center sm:text-left">
                  <ArrowLink
                    href={f.value('hero_enlace_url') || '/origenes'}
                    {...f.attrs('hero_enlace_url')}
                  >
                    {f.text('hero_enlace_texto')}
                  </ArrowLink>
                </div>
              ) : null}
            </div>
          </div>
          <div className="relative">
            <Photo
              image={f.image('hero_imagen')}
              slot="hero"
              ratio="4/5"
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
              dark
            />
            {first ? (
              <div
                aria-hidden="true"
                className="stamp top-11 right-[14px] -rotate-5 lg:top-auto lg:right-auto lg:bottom-24 lg:-left-16"
              >
                <span className="stamp__big">Lote {cleanStega(first.content.lote)}</span>
                <span className="stamp__small hidden lg:block">
                  {cleanStega(first.content.nombre)}
                </span>
                <span className="stamp__small">{formatInt(first.content.altitud)} msnm</span>
              </div>
            ) : null}
          </div>
        </div>

        {datos.length > 0 ? (
          <div className="mt-[52px] grid grid-cols-2 gap-x-5 gap-y-6 lg:mt-[88px] lg:grid-cols-4 lg:gap-8">
            {datos.map((dato) => (
              <div
                key={dato.key}
                className="flex flex-col gap-[6px] border-t-[1.5px] border-tinta pt-[14px] lg:gap-[10px] lg:pt-[22px]"
              >
                <span className="font-display text-(length:--fl-figure) leading-[0.9] font-black">
                  {dato.text('valor')}
                </span>
                <span className="max-w-[240px] font-story text-[15px] leading-[1.35] text-tinta-2 lg:text-[17px] lg:leading-[1.4]">
                  {dato.text('texto')}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Cafés destacados */}
      {destacados.length > 0 ? (
        <section className="section rule-top lg:border-t-0">
          <div className="wrap">
            <SectionHead
              eyebrow={f.text('destacados_antetitulo')}
              title={f.text('destacados_titulo')}
              side={
                <div className="hidden max-w-[420px] flex-col gap-[18px] lg:flex">
                  <p className="m-0 font-story text-[18px] leading-[1.55] text-pretty text-tinta-2">
                    {f.text('destacados_texto')}
                  </p>
                  <div>
                    <ArrowLink href="/cafes">Ver los {numberWord(cafes.length)} cafés</ArrowLink>
                  </div>
                </div>
              }
            />
            <div className="grid grid-cols-2 gap-x-[14px] gap-y-7 lg:grid-cols-3 lg:gap-10">
              {destacados.slice(0, 4).map((cafe, i) => (
                <div key={cafe.slug} className={i === 3 ? 'lg:hidden' : ''}>
                  <CafeCard cafe={cafe} priority={i === 0} />
                </div>
              ))}
            </div>
            <div className="mt-8 lg:hidden">
              <Link href="/cafes" className="btn w-full lg:w-auto">
                Ver los {numberWord(cafes.length)} cafés
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Orígenes */}
      <section className="section on-dark bg-hoja text-niebla">
        <div className="wrap">
          <div className="mb-7 grid gap-[14px] lg:mb-16 lg:grid-cols-2 lg:items-end lg:gap-20">
            <div className="flex flex-col gap-[14px] lg:gap-[18px]">
              <span className="eyebrow eyebrow--on-dark">Orígenes</span>
              <h2 className="m-0 font-display text-(length:--fl-h2-xl) leading-[0.92] font-extrabold text-balance text-niebla uppercase">
                {f.text('origenes_titulo')}
              </h2>
            </div>
            <p className="m-0 max-w-[560px] font-story text-[17px] leading-[1.55] text-pretty text-hoja-texto lg:text-[20px]">
              {f.text('origenes_texto')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-7 lg:grid-cols-4 lg:gap-7">
            {regions(origenes).map((region) => {
              const lead = region.farms[0]!
              const lf = fields(lead)
              const photo = lead.content.foto_region
                ? lf.image('foto_region')
                : lf.image('foto_portada')
              return (
                <article key={region.value} className="flex flex-col gap-[10px] lg:gap-4">
                  <Link
                    href={`/origenes?region=${region.value}`}
                    className="block"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Photo
                      image={photo}
                      slot="region-card"
                      ratio="3/4"
                      sizes="(min-width: 1024px) 300px, 50vw"
                      dark
                      alt=""
                    />
                  </Link>
                  <h3
                    className="m-0 font-display text-(length:--fl-region) leading-[0.9] font-black text-niebla uppercase lg:mt-[6px]"
                    {...lf.attrs('region')}
                  >
                    {region.label}
                  </h3>
                  <span className="eyebrow eyebrow--on-dark text-[11px]! lg:text-[14px]!">
                    {altitudeRange(region.min, region.max)} msnm
                  </span>
                  <p className="m-0 hidden font-story text-[18px] leading-[1.45] text-niebla lg:block">
                    {region.farms.map((farm) => (
                      <span key={farm.slug} className="block">
                        {fields(farm).text('nombre')}, {fields(farm).text('municipio')}
                      </span>
                    ))}
                  </p>
                  <div className="hidden lg:block">
                    <ArrowLink href={`/origenes?region=${region.value}`} className="text-[15px]!">
                      Ver fincas de {region.label}
                    </ArrowLink>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="section">
        <div className="wrap grid gap-7 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-20">
          <Photo
            image={f.image('historia_imagen')}
            slot="historia"
            ratio="3/2"
            sizes="(min-width: 1024px) 700px, 100vw"
          />
          <div className="flex flex-col gap-4 lg:gap-[22px]">
            {f.text('historia_antetitulo') ? (
              <span className="eyebrow">{f.text('historia_antetitulo')}</span>
            ) : null}
            <h2 className="m-0 font-display text-[40px] leading-[0.92] font-extrabold text-balance uppercase lg:text-[60px]">
              {f.text('historia_titulo')}
            </h2>
            {historia.map((paragraph, i) => (
              <p key={i} className={`body ${i > 0 ? 'hidden lg:block' : ''}`}>
                {paragraph}
              </p>
            ))}
            {f.text('historia_cta_texto') ? (
              <div className="lg:mt-[6px]">
                <ArrowLink
                  href={f.value('historia_cta_url') || '/nosotros'}
                  {...f.attrs('historia_cta_url')}
                >
                  {f.text('historia_cta_texto')}
                </ArrowLink>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Diario */}
      {posts.length > 0 ? (
        <section className="section rule-top">
          <div className="wrap">
            <SectionHead
              eyebrow="Diario"
              title={f.text('diario_titulo')}
              side={
                <div className="hidden lg:block">
                  <ArrowLink href="/blog">Ir al diario</ArrowLink>
                </div>
              }
              className="lg:mb-[52px]!"
            />
            <div className="grid gap-10 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, i) => (
                <div key={post.slug} className={i === 2 ? 'hidden lg:block' : ''}>
                  <BlogCard post={post} author={findBySlug(personas, post.content.autor)} />
                </div>
              ))}
            </div>
            <div className="mt-8 lg:hidden">
              <Link href="/blog" className="btn w-full">
                Ir al diario
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Boletín */}
      <section id="boletin" className="border-y border-linea bg-papel">
        <div className="wrap grid gap-8 py-14 lg:grid-cols-2 lg:items-end lg:gap-20 lg:py-24">
          <div className="flex flex-col gap-4 lg:gap-5">
            <span className="eyebrow">Boletín</span>
            <h2 className="h2">{f.text('boletin_titulo')}</h2>
            <p className="m-0 max-w-[520px] font-story text-[17px] leading-[1.55] text-pretty text-tinta-2 lg:text-[20px]">
              {f.text('boletin_texto')}
            </p>
          </div>
          <NewsletterForm note={f.text('boletin_nota')} />
        </div>
      </section>
    </>
  )
}
