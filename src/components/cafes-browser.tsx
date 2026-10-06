'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'

import { PRICE_RANGES } from '@/lib/copy'

/**
 * Filters and sort for the coffee list, in the page (the list is static and
 * ISR; filtering a dozen coffees needs no server round trip). The state lives
 * in the URL (`?region=huila&proceso=lavado&precio=45-60&orden=precio`), so a
 * filtered list can be linked; without JavaScript every coffee shows.
 */

export interface CafeFacets {
  region: string
  proceso: string
  notas: string | null
  pesos250: number | null
  orden: number
  puntaje: number | null
}

export interface BrowserItem {
  slug: string
  facets: CafeFacets
  card: ReactNode
}

export interface FacetOption {
  value: string
  label: string
  count: number
}

interface Group {
  key: 'region' | 'proceso' | 'notas'
  legend: string
  options: FacetOption[]
}

type SortKey = 'recomendados' | 'precio' | 'precio-desc' | 'puntaje'

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'recomendados', label: 'Recomendados' },
  { value: 'precio', label: 'Precio: de menor a mayor' },
  { value: 'precio-desc', label: 'Precio: de mayor a menor' },
  { value: 'puntaje', label: 'Puntaje' },
]

export interface State {
  region: string[]
  proceso: string[]
  notas: string[]
  precio: string
  orden: SortKey
}

export const EMPTY: State = {
  region: [],
  proceso: [],
  notas: [],
  precio: '',
  orden: 'recomendados',
}

function readUrl(): State {
  const query = new URLSearchParams(window.location.search)
  const list = (key: string) =>
    query
      .getAll(key)
      .flatMap((v) => v.split(','))
      .filter(Boolean)
  const orden = query.get('orden') as SortKey | null
  return {
    region: list('region'),
    proceso: list('proceso'),
    notas: list('notas'),
    precio: query.get('precio') ?? '',
    orden: SORTS.some((s) => s.value === orden) ? (orden as SortKey) : 'recomendados',
  }
}

function writeUrl(state: State) {
  const query = new URLSearchParams()
  for (const key of ['region', 'proceso', 'notas'] as const) {
    if (state[key].length) query.set(key, state[key].join(','))
  }
  if (state.precio) query.set('precio', state.precio)
  if (state.orden !== 'recomendados') query.set('orden', state.orden)
  const search = query.toString()
  window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`)
}

export function matches(item: BrowserItem, state: State): boolean {
  const { facets } = item
  if (state.region.length && !state.region.includes(facets.region)) return false
  if (state.proceso.length && !state.proceso.includes(facets.proceso)) return false
  if (state.notas.length && !(facets.notas && state.notas.includes(facets.notas))) return false
  if (state.precio) {
    // Ranges are (min, max]: «Hasta $ 45.000» includes 45.000, the next starts above it.
    const range = PRICE_RANGES.find((r) => r.id === state.precio)
    const price = facets.pesos250
    if (range && !(price !== null && price > range.min && price <= range.max)) return false
  }
  return true
}

export function sorted(items: BrowserItem[], orden: SortKey): BrowserItem[] {
  const price = (item: BrowserItem) => item.facets.pesos250 ?? Number.POSITIVE_INFINITY
  const copy = [...items]
  switch (orden) {
    case 'precio':
      return copy.sort((a, b) => price(a) - price(b))
    case 'precio-desc':
      return copy.sort((a, b) => price(b) - price(a))
    case 'puntaje':
      return copy.sort((a, b) => (b.facets.puntaje ?? 0) - (a.facets.puntaje ?? 0))
    default:
      return copy.sort((a, b) => a.facets.orden - b.facets.orden)
  }
}

const plural = (n: number) => `${n} ${n === 1 ? 'café' : 'cafés'}`

export function CafesBrowser({ items, groups }: { items: BrowserItem[]; groups: Group[] }) {
  const id = useId()
  const [state, setState] = useState<State>(EMPTY)
  const [sheetOpen, setSheetOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => setState(readUrl()), [])

  const update = useCallback((next: State) => {
    setState(next)
    writeUrl(next)
  }, [])

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (sheetOpen && !element.open) element.showModal()
    if (!sheetOpen && element.open) element.close()
  }, [sheetOpen])

  const visible = useMemo(
    () =>
      sorted(
        items.filter((item) => matches(item, state)),
        state.orden,
      ),
    [items, state],
  )
  const visibleSlugs = new Set(visible.map((item) => item.slug))

  const toggle = (key: Group['key'], value: string) => {
    const current = state[key]
    update({
      ...state,
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    })
  }

  const active: Array<{ key: Group['key'] | 'precio'; value: string; label: string }> = [
    ...groups.flatMap((group) =>
      state[group.key].map((value) => ({
        key: group.key,
        value,
        label: group.options.find((o) => o.value === value)?.label ?? value,
      })),
    ),
    ...(state.precio
      ? [
          {
            key: 'precio' as const,
            value: state.precio,
            label: PRICE_RANGES.find((r) => r.id === state.precio)?.label ?? '',
          },
        ]
      : []),
  ]

  const remove = (chip: (typeof active)[number]) =>
    chip.key === 'precio'
      ? update({ ...state, precio: '' })
      : update({ ...state, [chip.key]: state[chip.key].filter((v) => v !== chip.value) })

  const filters = (prefix: string) => (
    <form onSubmit={(event) => event.preventDefault()}>
      {groups.map((group, gi) => (
        <fieldset
          key={group.key}
          className={`m-0 border-0 p-0 pb-[22px] ${gi > 0 ? 'border-t border-linea pt-[22px]' : ''}`}
        >
          <legend className="float-left mb-[10px] w-full p-0 font-display text-[14px] leading-none font-bold tracking-[0.16em] uppercase">
            {group.legend}
          </legend>
          <div className="clear-both">
            {group.options.map((option) => {
              const inputId = `${prefix}-${group.key}-${option.value}`
              return (
                <label
                  key={option.value}
                  htmlFor={inputId}
                  className="flex cursor-pointer items-center gap-3 py-[7px] font-story text-[17px] leading-[1.3]"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={state[group.key].includes(option.value)}
                    onChange={() => toggle(group.key, option.value)}
                    className="m-0 h-[18px] w-[18px] accent-hoja"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="font-display text-[14px] leading-none font-semibold tracking-[0.06em] text-tinta-2">
                    {option.count}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
      <fieldset className="m-0 border-0 border-t border-linea p-0 pt-[22px]">
        <legend className="float-left mb-[10px] w-full p-0 font-display text-[14px] leading-none font-bold tracking-[0.16em] uppercase">
          Precio por 250 g
        </legend>
        <div className="clear-both">
          {[{ id: '', label: 'Todos' }, ...PRICE_RANGES].map((range) => {
            const inputId = `${prefix}-precio-${range.id || 'todos'}`
            const count = range.id
              ? items.filter((item) => matches(item, { ...EMPTY, precio: range.id })).length
              : items.length
            return (
              <label
                key={inputId}
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-3 py-[7px] font-story text-[17px] leading-[1.3]"
              >
                <input
                  id={inputId}
                  type="radio"
                  name={`${prefix}-precio`}
                  checked={state.precio === range.id}
                  onChange={() => update({ ...state, precio: range.id })}
                  className="m-0 h-[18px] w-[18px] accent-hoja"
                />
                <span className="flex-1">{range.label}</span>
                <span className="font-display text-[14px] leading-none font-semibold tracking-[0.06em] text-tinta-2">
                  {count}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </form>
  )

  const sortSelect = (selectId: string, hiddenLabel: boolean) => (
    <div className="flex items-center gap-3">
      <label htmlFor={selectId} className={hiddenLabel ? 'sr-only' : 'field-label'}>
        Ordenar
      </label>
      <select
        id={selectId}
        className="select h-11! w-full lg:w-[240px]"
        value={state.orden}
        onChange={(event) => update({ ...state, orden: event.target.value as SortKey })}
      >
        {SORTS.map((sort) => (
          <option key={sort.value} value={sort.value}>
            {sort.label}
          </option>
        ))}
      </select>
    </div>
  )

  const chips = (
    <>
      <span
        role="status"
        className="mr-1 font-display text-[18px] leading-none font-extrabold uppercase lg:mr-2 lg:text-[22px]"
      >
        {plural(visible.length)}
      </span>
      {active.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          aria-label={`Quitar filtro ${chip.label}`}
          onClick={() => remove(chip)}
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-[2px] border-[1.5px] border-tinta bg-papel pr-[10px] pl-[14px] font-display text-[14px] leading-none font-bold tracking-[0.1em] uppercase"
        >
          {chip.label}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      ))}
      {active.length > 0 ? (
        <button
          type="button"
          onClick={() => update({ ...EMPTY, orden: state.orden })}
          className="cursor-pointer border-0 bg-transparent px-[6px] font-story text-[16px] leading-none text-tinta-2 underline underline-offset-[3px]"
        >
          Borrar filtros
        </button>
      ) : null}
    </>
  )

  return (
    <div className="grid gap-16 lg:grid-cols-[260px_1fr]">
      <aside aria-label="Filtros" className="hidden lg:block">
        {filters(`${id}-d`)}
      </aside>

      <div>
        {/* Mobile controls */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-[10px]">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setSheetOpen(true)}
              className="btn btn--sm h-[46px]!"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M10 5H3" />
                <path d="M12 19H3" />
                <path d="M14 3v4" />
                <path d="M16 17v4" />
                <path d="M21 12h-9" />
                <path d="M21 19h-5" />
                <path d="M21 5h-7" />
                <path d="M8 10v4" />
                <path d="M8 12H3" />
              </svg>
              Filtrar{active.length ? ` · ${active.length}` : ''}
            </button>
            {sortSelect(`${id}-orden-m`, true)}
          </div>
          <div className="mt-[14px] flex flex-wrap items-center gap-2">{chips}</div>
        </div>

        {/* Desktop toolbar */}
        <div className="mb-9 hidden items-center justify-between gap-6 border-b-[1.5px] border-tinta pb-[22px] lg:flex">
          <div className="flex flex-wrap items-center gap-3">{chips}</div>
          {sortSelect(`${id}-orden`, false)}
        </div>

        <ul className="m-0 mt-7 grid list-none grid-cols-2 gap-x-[14px] gap-y-8 border-t-[1.5px] border-tinta p-0 pt-6 lg:mt-0 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-14 lg:border-0 lg:pt-0">
          {sorted(items, state.orden).map((item) => (
            <li key={item.slug} hidden={!visibleSlugs.has(item.slug)}>
              {item.card}
            </li>
          ))}
        </ul>
        {visible.length === 0 ? (
          <p className="m-0 mt-8 font-story text-[19px] text-tinta-2">
            Ningún café coincide con estos filtros.{' '}
            <button
              type="button"
              onClick={() => update({ ...EMPTY, orden: state.orden })}
              className="cursor-pointer border-0 bg-transparent p-0 font-story text-[19px] text-tinta underline underline-offset-[3px]"
            >
              Ver todos
            </button>
          </p>
        ) : null}
      </div>

      <dialog
        ref={dialog}
        aria-label="Filtros"
        onClose={() => setSheetOpen(false)}
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-none overflow-y-auto border-0 border-t-[1.5px] border-tinta bg-niebla p-5 text-tinta backdrop:bg-[rgba(22,32,26,0.4)] lg:hidden"
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="font-display text-[26px] leading-none font-extrabold uppercase">
            Filtrar
          </span>
          <button type="button" onClick={() => setSheetOpen(false)} className="btn btn--sm">
            Ver {plural(visible.length)}
          </button>
        </div>
        {filters(`${id}-m`)}
      </dialog>
    </div>
  )
}
