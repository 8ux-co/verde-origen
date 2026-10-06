import type { Metadata } from 'next'
import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { BlogBrowser } from '@/components/blog-browser'
import { BlogCard, PostKicker } from '@/components/blog-card'
import { Photo } from '@/components/photo'
import { Initials, PageHead } from '@/components/ui'
import type { BlogItem, PersonasItem } from '@/generated/cms'
import { findBySlug, getDocument, getPersonas, getPosts, relationSlug } from '@/lib/content'
import { formatDate, initials } from '@/lib/format'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocument('pagina-blog')
  return {
    title: cleanStega(page.content.titulo ?? 'Diario'),
    description: cleanStega(page.content.intro ?? ''),
    alternates: { canonical: '/blog' },
  }
}

const CATEGORY_ORDER = ['origen', 'proceso', 'preparacion', 'tostion']

function Featured({
  post,
  author,
  priority,
}: {
  post: BlogItem
  author: PersonasItem | null
  priority: boolean
}) {
  const f = fields(post)
  const href = `/blog/${post.slug}`
  return (
    <article className="grid gap-6 border-t-[1.5px] border-tinta pt-8 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16 lg:pt-10">
      <Link href={href} aria-hidden="true" tabIndex={-1}>
        <Photo
          image={f.image('portada')}
          slot="blog-card"
          ratio="3/2"
          sizes="(min-width: 1024px) 740px, 100vw"
          priority={priority}
          dark
          alt=""
        />
      </Link>
      <div className="flex flex-col gap-4 lg:gap-5">
        <PostKicker post={post} />
        <h2 className="m-0 font-story text-[34px] leading-[1.08] font-medium tracking-[-0.015em] text-balance lg:text-[52px]">
          <Link href={href} className="text-tinta no-underline hover:underline">
            {f.text('titulo')}
          </Link>
        </h2>
        <p className="m-0 font-story text-[18px] leading-[1.55] text-pretty text-tinta-2 lg:text-[20px]">
          {f.text('extracto')}
        </p>
        <div className="mt-[6px] flex items-center gap-[14px]">
          {author ? (
            <Initials name={initials(author.content.nombre)} className="h-12 w-12 text-[17px]" />
          ) : null}
          <span className="flex flex-col gap-1">
            {author ? (
              <span className="font-display text-[16px] leading-none font-bold tracking-[0.1em] uppercase">
                {fields(author).text('nombre')}
              </span>
            ) : null}
            <time
              dateTime={String(post.content.fecha)}
              className="font-story text-[15px] leading-none text-tinta-2"
              {...f.attrs('fecha')}
            >
              {formatDate(post.content.fecha)}
            </time>
          </span>
        </div>
      </div>
    </article>
  )
}

export default async function BlogPage() {
  const [page, posts, personas] = await Promise.all([
    getDocument('pagina-blog'),
    getPosts(),
    getPersonas(),
  ])
  const f = fields(page)
  const featured = posts.find((post) => post.content.destacado) ?? posts[0] ?? null
  const categories = CATEGORY_ORDER.flatMap((value) => {
    const post = posts.find((p) => p.content.categoria?.value === value)
    return post ? [{ value, label: post.content.categoria.label }] : []
  })

  return (
    <>
      <PageHead
        crumbs={[{ label: f.text('titulo') }]}
        title={f.text('titulo')}
        intro={f.text('intro')}
      />
      <section className="wrap pt-2 pb-14 lg:pb-28">
        <BlogBrowser
          featuredSlug={featured?.slug ?? null}
          categories={categories}
          entries={posts.map((post, i) => {
            const author = findBySlug(personas, post.content.autor)
            return {
              slug: post.slug,
              categoria: post.content.categoria?.value ?? '',
              autor: relationSlug(post.content.autor),
              featured: <Featured post={post} author={author} priority={post === featured} />,
              card: <BlogCard post={post} author={author} priority={i > 0 && i < 4} />,
            }
          })}
        />
      </section>
    </>
  )
}
