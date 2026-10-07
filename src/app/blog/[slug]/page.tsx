import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { BlogCard } from '@/components/blog-card'
import { Photo } from '@/components/photo'
import { RichText } from '@/components/rich-text'
import { ArrowLink, Breadcrumbs, Initials } from '@/components/ui'
import type { BlogItem, PersonasItem } from '@/generated/cms'
import { regionText } from '@/lib/catalog'
import {
  findBySlug,
  getCollection,
  getItem,
  getPersonas,
  getPosts,
  getPublishedCollection,
} from '@/lib/content'
import { formatDate, formatShortDate, initials, money, notesSentence } from '@/lib/format'
import { hasApprovedCrop, photoName } from '@/lib/photos'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getPublishedCollection('blog')
  return posts.map((post) => ({ slug: post.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getItem('blog', slug)
  if (!post) return {}
  return {
    title: cleanStega(post.content.titulo),
    description: cleanStega(post.content.extracto),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: String(post.content.fecha),
      images: post.content.portada?.url ? [post.content.portada.url] : undefined,
    },
  }
}

/** Same category first, then the newest; three, never the article itself. */
function moreToRead(post: BlogItem, posts: BlogItem[]): BlogItem[] {
  const others = posts.filter((p) => p.slug !== post.slug)
  const same = others.filter((p) => p.content.categoria?.value === post.content.categoria?.value)
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, 3)
}

/** The author's square: a photo cut for it, else initials (images README). */
function AuthorMark({ author, size }: { author: PersonasItem; size: 'sm' | 'lg' }) {
  const photo = author.content.foto
  if (photo?.url && hasApprovedCrop(photoName(photo.filename ?? photo.url), 'author')) {
    return (
      <Photo
        image={fields(author).image('foto')}
        slot="author"
        ratio="1/1"
        sizes={size === 'sm' ? '52px' : '112px'}
        className={size === 'sm' ? 'w-11 lg:w-[52px]' : 'w-full'}
      />
    )
  }
  return (
    <Initials
      name={initials(author.content.nombre)}
      className={
        size === 'sm'
          ? 'h-11 w-11 text-[16px] lg:h-[52px] lg:w-[52px] lg:text-[19px]'
          : 'aspect-square w-full text-[26px] lg:text-[34px]'
      }
    />
  )
}

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params
  const [post, posts, personas, cafes, origenes] = await Promise.all([
    getItem('blog', slug),
    getPosts(),
    getPersonas(),
    getCollection('cafes'),
    getCollection('origenes'),
  ])
  if (!post) notFound()

  const f = fields(post)
  const c = post.content
  const author = findBySlug(personas, c.autor)
  const a = author ? fields(author) : null
  const cafe = findBySlug(cafes, c.cafe_relacionado)
  const k = cafe ? fields(cafe) : null
  const minutes = c.lectura_min
  const more = moreToRead(post, posts)

  return (
    <>
      <article>
        <header className="wrap pt-5 pb-7 lg:pt-10 lg:pb-14">
          <div className="mx-auto flex max-w-[900px] flex-col gap-4 lg:items-center lg:gap-6 lg:text-center">
            <Breadcrumbs
              items={[
                { label: 'Diario', href: '/blog' },
                {
                  label: <span {...f.attrs('categoria')}>{c.categoria?.label}</span>,
                  href: `/blog?categoria=${c.categoria?.value}`,
                },
              ]}
            />
            <h1 className="m-0 font-story text-(length:--fl-article) leading-[1.06] font-medium tracking-[-0.02em] text-balance lg:mt-3">
              {f.text('titulo')}
            </h1>
            <p className="m-0 max-w-[720px] font-story text-[19px] leading-[1.45] text-pretty text-tinta-2 lg:text-[24px]">
              {f.text('extracto')}
            </p>
            <div className="flex items-center gap-3 text-left lg:mt-2 lg:gap-[14px]">
              {author ? <AuthorMark author={author} size="sm" /> : null}
              <span className="flex flex-col gap-[5px] lg:gap-[6px]">
                {author && a ? (
                  <span className="font-display text-[14px] leading-none font-bold tracking-[0.1em] uppercase lg:text-[16px]">
                    <span {...a.attrs('nombre')}>{a.text('nombre')}</span>
                    <span className="hidden lg:inline">
                      {' · '}
                      <span {...a.attrs('cargo')}>{a.text('cargo')}</span>
                    </span>
                  </span>
                ) : null}
                <span className="font-story text-[14px] leading-none text-tinta-2 lg:text-[16px]">
                  <time dateTime={String(c.fecha)} {...f.attrs('fecha')}>
                    <span className="lg:hidden">{formatShortDate(c.fecha)}</span>
                    <span className="hidden lg:inline">{formatDate(c.fecha)}</span>
                  </time>
                  {minutes ? (
                    <>
                      {' · '}
                      <span {...f.attrs('lectura_min')}>{minutes}</span> min
                      <span className="hidden lg:inline"> de lectura</span>
                    </>
                  ) : null}
                </span>
              </span>
            </div>
          </div>
        </header>

        <figure className="m-0 lg:mx-auto lg:max-w-[1440px] lg:px-20 lg:pb-[72px]">
          <Photo
            image={f.image('portada')}
            slot="blog-cover"
            ratio="16/9"
            sizes="(min-width: 1024px) 1280px, 100vw"
            priority
            dark
            className="aspect-[3/2]! lg:aspect-[16/9]!"
          />
          {c.portada_pie ? (
            <figcaption className="mx-5 mt-[10px] font-story text-[14px] leading-[1.4] text-tinta-2 italic lg:mx-0 lg:mt-[14px] lg:text-[16px]">
              {f.text('portada_pie')}
            </figcaption>
          ) : null}
        </figure>

        <div className="wrap pt-8 pb-12 lg:pt-0 lg:pb-28">
          <div className="relative mx-auto max-w-[680px]">
            <RichText html={c.cuerpo} className="prose--article" imageSlot="blog-inline" />

            {cafe && k ? (
              <aside className="mt-7 grid grid-cols-[88px_1fr] items-center gap-4 border border-linea bg-papel p-4 lg:mt-12 lg:grid-cols-[120px_1fr_auto] lg:gap-6 lg:p-5">
                <Link href={`/cafes/${cafe.slug}`} tabIndex={-1} aria-hidden="true">
                  <Photo
                    image={k.image('foto')}
                    slot="related-box"
                    ratio="4/5"
                    sizes="120px"
                    alt=""
                  />
                </Link>
                <div className="flex flex-col gap-2">
                  <span className="eyebrow eyebrow--sm">
                    Lote <span {...k.attrs('lote')}>{k.text('lote')}</span> ·{' '}
                    <span {...k.attrs('region')}>{regionText(cafe, origenes)}</span>
                    <span className="hidden lg:inline">
                      {', '}
                      <span {...k.attrs('municipio')}>{k.text('municipio')}</span>
                    </span>
                  </span>
                  <h3 className="m-0 font-display text-[26px] leading-[0.95] font-extrabold uppercase lg:text-[32px]">
                    {k.text('nombre')}
                  </h3>
                  <span className="hidden font-story text-[17px] leading-[1.3] text-tinta-2 italic lg:inline">
                    {notesSentence(k.text('notas'))}
                  </span>
                  <span className="inline-flex items-baseline gap-[7px] whitespace-nowrap">
                    <span className="lg:hidden font-display text-[18px] leading-none font-extrabold">
                      Desde
                    </span>
                    <span
                      className="font-display text-[18px] leading-none font-extrabold tracking-[0.01em] lg:text-[22px]"
                      {...k.attrs('precio_250')}
                    >
                      {money(cafe.content.precio_250)}
                    </span>
                    <span className="hidden font-story text-[15px] leading-none text-tinta-2 lg:inline">
                      / 250 g
                    </span>
                  </span>
                  <ArrowLink href={`/cafes/${cafe.slug}`} className="text-[14px]! lg:hidden">
                    Ver el café
                  </ArrowLink>
                </div>
                <Link
                  href={`/cafes/${cafe.slug}`}
                  className="btn btn--sm btn--buy hidden lg:inline-flex"
                >
                  Ver el café
                </Link>
              </aside>
            ) : null}

            {author && a ? (
              <div className="mt-10 grid grid-cols-[72px_1fr] gap-4 border-t-[1.5px] border-tinta pt-6 lg:mt-16 lg:grid-cols-[112px_1fr] lg:gap-7 lg:pt-8">
                <AuthorMark author={author} size="lg" />
                <div className="flex flex-col gap-[6px] lg:gap-[10px]">
                  <span className="eyebrow eyebrow--sm eyebrow--muted hidden lg:inline-block">
                    Escribe
                  </span>
                  <h3 className="m-0 font-display text-[24px] leading-[0.95] font-extrabold uppercase lg:text-[32px]">
                    {a.text('nombre')}
                  </h3>
                  {author.content.bio ? (
                    <p className="m-0 font-story text-[16px] leading-[1.55] text-pretty text-tinta-2 lg:text-[18px]">
                      {a.text('bio')}
                    </p>
                  ) : null}
                  <div className="hidden lg:block">
                    <ArrowLink href={`/blog?autor=${author.slug}`} className="text-[15px]!">
                      Más de {cleanStega(author.content.nombre).split(' ')[0]}
                    </ArrowLink>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {more.length > 0 ? (
        <section className="border-t border-linea">
          <div className="wrap pt-12 pb-14 lg:pt-24 lg:pb-28">
            <div className="mb-6 flex items-end justify-between lg:mb-12">
              <h2 className="m-0 font-display text-(length:--fl-h2-md) leading-[0.92] font-extrabold text-balance uppercase">
                Sigue leyendo
              </h2>
              <ArrowLink href="/blog" className="hidden lg:inline-flex">
                Todo el diario
              </ArrowLink>
            </div>
            <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {more.map((other, i) => (
                <div key={other.slug} className={i === 2 ? 'hidden lg:block' : ''}>
                  <BlogCard post={other} author={findBySlug(personas, other.content.autor)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
