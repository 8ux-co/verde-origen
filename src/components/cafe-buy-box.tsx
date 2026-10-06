'use client'

import { useId, useState } from 'react'

import { cleanStega } from '@8ux-co/eelzap'
import { useZapLiveUpdates } from '@8ux-co/eelzap/react'

import type { CafesItem } from '@/generated/cms'
import { MOLIENDAS } from '@/lib/copy'
import { formatCOP, money, perHundredGrams, pesos } from '@/lib/format'

import { addToCart } from './cart'

const SIZES = [
  { key: 'precio_250', label: '250 g', grams: 250 },
  { key: 'precio_500', label: '500 g', grams: 500 },
  { key: 'precio_1kg', label: '1 kg', grams: 1000 },
] as const

type SizeKey = (typeof SIZES)[number]['key']

/**
 * Price, size and grind. A computed view of the entry (price per 100 g, the
 * selected size, sold-out sizes), so it follows the editor's unsaved values
 * through `useZapLiveUpdates`: change a price in Zap and the box re-computes
 * as you type. Outside a preview the hook returns the entry unchanged.
 */
export function CafeBuyBox({
  cafe: delivered,
  attrs,
  roastNote,
  shippingNote,
}: {
  cafe: CafesItem
  attrs: Record<SizeKey, { 'data-zap'?: string }>
  roastNote: string
  /** Desktop only, as on the boards. */
  shippingNote?: string
}) {
  const cafe = useZapLiveUpdates(delivered)
  const id = useId()
  // Live values arrive formatted for display (a price as text), so read loosely.
  const content = cafe.content as Omit<CafesItem['content'], SizeKey> & Record<SizeKey, unknown>
  const available = SIZES.filter((size) => content[size.key] !== null && content[size.key] !== '')
  const [size, setSize] = useState<SizeKey>(
    available.find((s) => s.key === 'precio_500')?.key ?? available[0]?.key ?? 'precio_250',
  )
  const [molienda, setMolienda] = useState<string>(MOLIENDAS[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const selected = SIZES.find((s) => s.key === size)!
  const value = content[size] as Parameters<typeof money>[0]
  const unit = pesos(value)
  const total = unit !== null ? formatCOP(unit * qty) : money(value)

  const add = () => {
    if (unit === null) return
    addToCart({
      slug: cafe.slug,
      nombre: cleanStega(String(content.nombre)),
      lote: cleanStega(String(content.lote)),
      size: selected.label,
      molienda,
      pesos: unit,
      qty,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2400)
  }

  return (
    <div className="flex flex-col gap-[22px] lg:gap-[26px]">
      <div className="flex items-baseline gap-[10px] lg:gap-3">
        <span
          className="font-display text-[38px] leading-none font-black lg:text-[44px]"
          {...attrs[size]}
        >
          {money(value)}
        </span>
        <span className="font-story text-[15px] leading-none text-tinta-2 lg:text-[17px]">
          {selected.label} · IVA incluido
        </span>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 p-0 font-display text-[14px] leading-none font-bold tracking-[0.16em] uppercase">
          Tamaño
        </legend>
        <div className="grid gap-[10px] lg:grid-cols-3">
          {SIZES.map((option) => {
            const optionValue = content[option.key] as Parameters<typeof money>[0]
            const soldOut = optionValue === null || optionValue === undefined || optionValue === ''
            const optionPesos = pesos(optionValue)
            const checked = option.key === size
            return (
              <label
                key={option.key}
                htmlFor={`${id}-${option.key}`}
                className={`relative flex items-center justify-between gap-[6px] rounded-[2px] px-4 py-[14px] lg:flex-col lg:items-start lg:px-[14px] lg:pb-[13px] ${
                  checked ? 'border-2 border-tinta bg-papel' : 'border-[1.5px] border-linea'
                } ${soldOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <input
                  id={`${id}-${option.key}`}
                  type="radio"
                  name={`${id}-size`}
                  value={option.key}
                  checked={checked}
                  disabled={soldOut}
                  onChange={() => setSize(option.key)}
                  className="absolute h-px w-px opacity-0"
                />
                <span className="flex flex-col gap-[6px]">
                  <span className="font-display text-[26px] leading-none font-extrabold">
                    {option.label}
                  </span>
                  {optionPesos !== null ? (
                    <span className="hidden font-story text-[14px] leading-[1.2] whitespace-nowrap text-tinta-2 lg:block">
                      {perHundredGrams(optionPesos, option.grams)}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`inline-flex items-center gap-[6px] font-display text-[19px] leading-none font-bold tracking-[0.02em] ${checked ? 'text-cereza' : ''}`}
                >
                  {/* The tag sits on the price alone: the preview rewrites its whole text. */}
                  <span {...attrs[option.key]}>{soldOut ? 'Agotado' : money(optionValue)}</span>
                  {checked ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : null}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="m-0 hidden border-0 p-0 lg:block">
        <legend className="mb-3 p-0 font-display text-[14px] leading-none font-bold tracking-[0.16em] uppercase">
          Molienda
        </legend>
        <div className="flex flex-wrap gap-2">
          {MOLIENDAS.map((option) => (
            <label
              key={option}
              className={`inline-flex h-[42px] cursor-pointer items-center rounded-[2px] px-[14px] font-story text-[16px] leading-none ${
                option === molienda
                  ? 'border-2 border-tinta bg-papel'
                  : 'border-[1.5px] border-linea'
              }`}
            >
              <input
                type="radio"
                name={`${id}-molienda`}
                value={option}
                checked={option === molienda}
                onChange={() => setMolienda(option)}
                className="absolute h-px w-px opacity-0"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-[10px] lg:hidden">
        <label htmlFor={`${id}-molienda-m`} className="field-label">
          Molienda
        </label>
        <select
          id={`${id}-molienda-m`}
          className="select"
          value={molienda}
          onChange={(event) => setMolienda(event.target.value)}
        >
          {MOLIENDAS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-[10px] lg:flex">
        <div
          role="group"
          aria-label="Cantidad"
          className="inline-flex h-14 items-center rounded-[2px] border-[1.5px] border-tinta lg:h-[52px]"
        >
          <button
            type="button"
            aria-label="Quitar una"
            onClick={() => setQty((n) => Math.max(1, n - 1))}
            className="inline-flex h-full w-[50px] cursor-pointer items-center justify-center border-0 bg-transparent lg:w-[46px]"
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
              <path d="M5 12h14" />
            </svg>
          </button>
          <label htmlFor={`${id}-qty`} className="sr-only">
            Cantidad
          </label>
          <input
            id={`${id}-qty`}
            inputMode="numeric"
            value={qty}
            onChange={(event) =>
              setQty(Math.max(1, Math.min(99, Number(event.target.value.replace(/\D/g, '')) || 1)))
            }
            className="w-[34px] border-0 bg-transparent text-center font-display text-[20px] leading-none font-extrabold"
          />
          <button
            type="button"
            aria-label="Agregar una"
            onClick={() => setQty((n) => Math.min(99, n + 1))}
            className="inline-flex h-full w-[50px] cursor-pointer items-center justify-center border-0 bg-transparent lg:w-[46px]"
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
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={unit === null}
          className="btn btn--buy h-14! lg:h-[52px]!"
        >
          <span className="lg:hidden">Agregar · {total}</span>
          <span className="hidden lg:inline">Agregar al carrito · {total}</span>
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="-mt-2 m-0 flex gap-[10px] font-story text-[15px] leading-[1.55] text-pretty text-tinta-2 lg:text-[16px] lg:leading-[1.45]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mt-[2px] hidden shrink-0 lg:block"
        >
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
          <path d="M12 22V12" />
          <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
        </svg>
        <span>
          {added ? (
            'Agregado al carrito.'
          ) : (
            <>
              {roastNote}
              {shippingNote ? <span className="hidden lg:inline"> {shippingNote}</span> : null}
            </>
          )}
        </span>
      </p>
    </div>
  )
}
