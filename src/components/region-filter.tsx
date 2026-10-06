'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Region toggles for the origins list (`?region=huila`, linked from the Inicio
 * region cards). The list is static; this hides rows in place, and without
 * JavaScript every farm shows.
 */
export function RegionFilter({
  regions,
  items,
  summary,
}: {
  regions: Array<{ value: string; label: string; count: number }>
  items: Array<{ slug: string; region: string; node: ReactNode }>
  summary: ReactNode
}) {
  const [region, setRegion] = useState('')

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('region') ?? ''
    setRegion(regions.some((r) => r.value === value) ? value : '')
  }, [regions])

  const choose = (value: string) => {
    setRegion(value)
    const url = value ? `${window.location.pathname}?region=${value}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filtrar por región" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={region === ''}
            onClick={() => choose('')}
            className="toggle"
          >
            Todas · {items.length}
          </button>
          {regions.map((r) => (
            <button
              key={r.value}
              type="button"
              aria-pressed={region === r.value}
              onClick={() => choose(r.value)}
              className="toggle"
            >
              {r.label} · {r.count}
            </button>
          ))}
        </div>
        <span className="font-story text-[17px] leading-none text-tinta-2">{summary}</span>
      </div>
      {items.map((item) => (
        <div key={item.slug} hidden={region !== '' && item.region !== region}>
          {item.node}
        </div>
      ))}
    </>
  )
}
