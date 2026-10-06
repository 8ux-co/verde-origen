import { cache } from 'react'

import { cleanStega, type ItemListResponse } from '@8ux-co/eelzap'

import type {
  BlogItem,
  CafesItem,
  ConfiguracionDocument,
  ContactoDocument,
  InicioDocument,
  NosotrosDocument,
  OrigenesItem,
  PaginaBlogDocument,
  PaginaCafesDocument,
  PaginaOrigenesDocument,
  PaginaPreguntasDocument,
  PersonasItem,
  PreguntasItem,
} from '@/generated/cms'

import { collectionTag, documentTag, zap } from './zap'

/**
 * Typed reads, one per collection and document, deduplicated per request
 * (`cache`). Collections are small, so each is read whole in one request and
 * pages pick from it: a build renders every page with about a dozen distinct
 * requests, well inside Zap's 100 a minute.
 */

interface DocumentTypes {
  configuracion: ConfiguracionDocument
  inicio: InicioDocument
  nosotros: NosotrosDocument
  contacto: ContactoDocument
  'pagina-cafes': PaginaCafesDocument
  'pagina-origenes': PaginaOrigenesDocument
  'pagina-blog': PaginaBlogDocument
  'pagina-preguntas': PaginaPreguntasDocument
}

interface CollectionTypes {
  cafes: CafesItem
  origenes: OrigenesItem
  blog: BlogItem
  personas: PersonasItem
  preguntas: PreguntasItem
}

export type DocumentKey = keyof DocumentTypes
export type CollectionKey = keyof CollectionTypes

const readDocument = cache(async (key: DocumentKey) => {
  const { cms } = await zap([documentTag(key)])
  return cms.documents.get(key)
})

export function getDocument<K extends DocumentKey>(key: K): Promise<DocumentTypes[K]> {
  return readDocument(key) as unknown as Promise<DocumentTypes[K]>
}

const PAGE_SIZE = 100

const readCollection = cache(async (key: CollectionKey, published: boolean) => {
  const { cms } = await zap([collectionTag(key)], { published })
  const items: unknown[] = []
  for (let page = 1; ; page++) {
    const result: ItemListResponse = await cms.items.list(key, { page, pageSize: PAGE_SIZE })
    items.push(...result.data)
    const pages = result.pagination?.pageCount ?? 1
    if (page >= pages || result.data.length < PAGE_SIZE) break
  }
  return items
})

export async function getCollection<K extends CollectionKey>(
  key: K,
): Promise<CollectionTypes[K][]> {
  return (await readCollection(key, false)) as CollectionTypes[K][]
}

/** The published entries only, for build-time code (`generateStaticParams`). */
export async function getPublishedCollection<K extends CollectionKey>(
  key: K,
): Promise<CollectionTypes[K][]> {
  return (await readCollection(key, true)) as CollectionTypes[K][]
}

export async function getItem<K extends CollectionKey>(
  key: K,
  slug: string,
): Promise<CollectionTypes[K] | null> {
  const items = await getCollection(key)
  return items.find((item) => item.slug === slug) ?? null
}

// ── Collections, in the order the site shows them ───────────────────────────

const byOrden = (
  a: { content: { orden: number | null } },
  b: { content: { orden: number | null } },
) => (a.content.orden ?? 999) - (b.content.orden ?? 999)

/** Coffees on sale (`disponible`), by `orden`. */
export async function getCafes(): Promise<CafesItem[]> {
  const cafes = await getCollection('cafes')
  return cafes.filter((cafe) => cafe.content.disponible !== false).sort(byOrden)
}

export async function getOrigenes(): Promise<OrigenesItem[]> {
  const origenes = await getCollection('origenes')
  const order = ['huila', 'narino', 'cauca', 'tolima']
  return [...origenes].sort(
    (a, b) =>
      order.indexOf(a.content.region.value) - order.indexOf(b.content.region.value) ||
      (a.content.desde ?? 0) - (b.content.desde ?? 0),
  )
}

/** Articles, newest first. */
export async function getPosts(): Promise<BlogItem[]> {
  const posts = await getCollection('blog')
  return [...posts].sort((a, b) => String(b.content.fecha).localeCompare(String(a.content.fecha)))
}

export async function getPersonas(): Promise<PersonasItem[]> {
  return [...(await getCollection('personas'))].sort(byOrden)
}

export async function getPreguntas(): Promise<PreguntasItem[]> {
  return [...(await getCollection('preguntas'))].sort(byOrden)
}

// ── Relations: slugs in TEXT fields ─────────────────────────────────────────

/** A relation's target slug, without stega and spaces. */
export const relationSlug = (value: string | null | undefined) =>
  value ? cleanStega(value).trim() : ''

export function findBySlug<T extends { slug: string }>(
  items: T[],
  slug: string | null | undefined,
) {
  const target = relationSlug(slug)
  return target ? (items.find((item) => item.slug === target) ?? null) : null
}

/**
 * Every relation resolves, or the build fails naming the dangling ones
 * (design handoff: "fail the build on a dangling slug"). Called from
 * `generateStaticParams`, so `next build` stops before publishing a broken
 * link; at request time a missing target only hides its box.
 */
export async function assertRelations(): Promise<void> {
  const [cafes, origenes, posts, personas] = await Promise.all([
    getPublishedCollection('cafes'),
    getPublishedCollection('origenes'),
    getPublishedCollection('blog'),
    getPublishedCollection('personas'),
  ])
  const problems: string[] = []
  for (const cafe of cafes) {
    if (!findBySlug(origenes, cafe.content.origen))
      problems.push(`cafes/${cafe.slug}.origen → "${cafe.content.origen}"`)
  }
  for (const post of posts) {
    if (!findBySlug(personas, post.content.autor))
      problems.push(`blog/${post.slug}.autor → "${post.content.autor}"`)
    if (post.content.cafe_relacionado && !findBySlug(cafes, post.content.cafe_relacionado))
      problems.push(`blog/${post.slug}.cafe_relacionado → "${post.content.cafe_relacionado}"`)
  }
  if (problems.length > 0) {
    throw new Error(`Dangling relations in Zap content:\n  ${problems.join('\n  ')}`)
  }
}
