import Link from 'next/link'

import { fields } from '@8ux-co/eelzap/fields'

import type { BlogItem, PersonasItem } from '@/generated/cms'
import { formatDate } from '@/lib/format'

import { Photo } from './photo'

/** «Proceso · 7 min de lectura», each part tagged to its field. */
export function PostKicker({ post, className = '' }: { post: BlogItem; className?: string }) {
  const f = fields(post)
  const minutes = post.content.lectura_min
  return (
    <span className={`eyebrow ${className}`}>
      <span {...f.attrs('categoria')}>{post.content.categoria?.label}</span>
      {minutes ? (
        <>
          {' · '}
          <span {...f.attrs('lectura_min')}>{minutes}</span> min de lectura
        </>
      ) : null}
    </span>
  )
}

export function BlogCard({
  post,
  author,
  priority,
}: {
  post: BlogItem
  author: PersonasItem | null
  priority?: boolean
}) {
  const f = fields(post)
  const href = `/blog/${post.slug}`
  return (
    <article className="relative flex flex-col gap-4">
      <Link href={href} aria-hidden="true" tabIndex={-1} className="block">
        <Photo
          image={f.image('portada')}
          slot="blog-card"
          ratio="3/2"
          sizes="(min-width: 1024px) 400px, 100vw"
          priority={priority}
          alt=""
        />
      </Link>
      <div className="flex flex-col gap-[10px]">
        <PostKicker post={post} className="eyebrow--sm" />
        <h3 className="m-0 font-story text-[22px] leading-[1.15] font-medium tracking-[-0.01em] text-balance text-tinta lg:text-[27px]">
          <Link href={href} className="text-inherit no-underline hover:underline">
            {f.text('titulo')}
          </Link>
        </h3>
        <p className="m-0 font-story text-[16px] leading-[1.5] text-pretty text-tinta-2 lg:text-[18px]">
          {f.text('extracto')}
        </p>
        <span className="font-story text-[14px] leading-[1.3] text-tinta-2">
          <time dateTime={String(post.content.fecha)} {...f.attrs('fecha')}>
            {formatDate(post.content.fecha)}
          </time>
          {author ? (
            <>
              {' · '}
              <span {...fields(author).attrs('nombre')}>{fields(author).text('nombre')}</span>
            </>
          ) : null}
        </span>
      </div>
    </article>
  )
}
