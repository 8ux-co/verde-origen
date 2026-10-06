'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Category tabs, author filter and paging for the journal
 * (`?categoria=proceso`, `?autor=camila-restrepo`, `?pagina=2`). The page is
 * static; this only shows and hides articles already rendered.
 */
export interface BlogEntry {
  slug: string
  categoria: string
  autor: string
  featured: ReactNode
  card: ReactNode
}

export const PAGE_SIZE = 6

interface Filter {
  categoria: string
  autor: string
  pagina: number
}

export function BlogBrowser({
  entries,
  categories,
  featuredSlug,
}: {
  entries: BlogEntry[]
  categories: Array<{ value: string; label: string }>
  featuredSlug: string | null
}) {
  const [filter, setFilter] = useState<Filter>({ categoria: '', autor: '', pagina: 1 })

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    setFilter({
      categoria: query.get('categoria') ?? '',
      autor: query.get('autor') ?? '',
      pagina: Math.max(1, Number(query.get('pagina')) || 1),
    })
  }, [])

  const apply = (next: Filter) => {
    setFilter(next)
    const query = new URLSearchParams()
    if (next.categoria) query.set('categoria', next.categoria)
    if (next.autor) query.set('autor', next.autor)
    if (next.pagina > 1) query.set('pagina', String(next.pagina))
    const search = query.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}`,
    )
  }

  const matching = entries.filter(
    (entry) =>
      (!filter.categoria || entry.categoria === filter.categoria) &&
      (!filter.autor || entry.autor === filter.autor),
  )
  const featured = matching.find((entry) => entry.slug === featuredSlug) ?? matching[0] ?? null
  const rest = matching.filter((entry) => entry !== featured)
  const pages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE))
  const page = Math.min(filter.pagina, pages)
  const shown = new Set(
    rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((entry) => entry.slug),
  )

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Categorías">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {[{ value: '', label: 'Todo' }, ...categories].map((category) => (
              <li key={category.value}>
                <a
                  href={category.value ? `?categoria=${category.value}` : '?'}
                  aria-current={filter.categoria === category.value ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    apply({ categoria: category.value, autor: filter.autor, pagina: 1 })
                  }}
                  className="toggle"
                >
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="font-story text-[17px] leading-none text-tinta-2">
          {matching.length} {matching.length === 1 ? 'artículo' : 'artículos'}
          {filter.autor ? (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => apply({ ...filter, autor: '', pagina: 1 })}
                className="cursor-pointer border-0 bg-transparent p-0 font-story text-[17px] text-tinta-2 underline underline-offset-[3px]"
              >
                ver todos los autores
              </button>
            </>
          ) : null}
        </span>
      </div>

      {entries.map((entry) => (
        <div key={`f-${entry.slug}`} hidden={entry !== featured || page > 1}>
          {entry.featured}
        </div>
      ))}

      <div className="mt-12 grid gap-10 md:grid-cols-2 lg:mt-0 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16 lg:pt-16">
        {entries.map((entry) => (
          <div key={entry.slug} hidden={!shown.has(entry.slug)}>
            {entry.card}
          </div>
        ))}
      </div>

      {pages > 1 ? (
        <nav
          aria-label="Paginación"
          className="mt-14 flex items-center justify-between border-t-[1.5px] border-tinta pt-7 lg:mt-[72px]"
        >
          <button
            type="button"
            className="btn btn--sm"
            disabled={page <= 1}
            onClick={() => apply({ ...filter, pagina: page - 1 })}
          >
            Anteriores
          </button>
          <span className="font-story text-[17px] leading-none text-tinta-2">
            Página {page} de {pages}
          </span>
          <button
            type="button"
            className="btn btn--sm"
            disabled={page >= pages}
            onClick={() => apply({ ...filter, pagina: page + 1 })}
          >
            Siguientes
          </button>
        </nav>
      ) : null}
    </>
  )
}
