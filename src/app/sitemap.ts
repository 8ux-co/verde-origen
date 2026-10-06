import type { MetadataRoute } from 'next'

import { getPublishedCollection } from '@/lib/content'
import { env } from '@/lib/env'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cafes, origenes, posts] = await Promise.all([
    getPublishedCollection('cafes'),
    getPublishedCollection('origenes'),
    getPublishedCollection('blog'),
  ])
  const url = (path: string) => `${env.siteUrl}${path}`
  const pages = [
    '/',
    '/cafes',
    '/origenes',
    '/blog',
    '/nosotros',
    '/contacto',
    '/preguntas-frecuentes',
  ]
  return [
    ...pages.map((path) => ({ url: url(path) })),
    ...cafes
      .filter((cafe) => cafe.content.disponible !== false)
      .map((cafe) => ({ url: url(`/cafes/${cafe.slug}`), lastModified: cafe.meta.updatedAt })),
    ...origenes.map((origen) => ({
      url: url(`/origenes/${origen.slug}`),
      lastModified: origen.meta.updatedAt,
    })),
    ...posts.map((post) => ({ url: url(`/blog/${post.slug}`), lastModified: post.meta.updatedAt })),
  ]
}
