'use client'

import { useSyncExternalStore } from 'react'

/**
 * A small cart kept in this browser (commerce is outside Zap and outside these
 * boards): lines of coffee, size, grind and quantity, priced when added.
 */

export interface CartLine {
  slug: string
  nombre: string
  lote: string
  size: string
  molienda: string
  pesos: number
  qty: number
}

const KEY = 'verde-origen:carrito'
const EVENT = 'verde-origen:carrito'
const EMPTY: CartLine[] = []

let snapshot: CartLine[] | null = null

function read(): CartLine[] {
  if (snapshot) return snapshot
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as unknown
    snapshot = Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY
  } catch {
    snapshot = EMPTY
  }
  return snapshot
}

function write(lines: CartLine[]) {
  snapshot = lines
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines))
  } catch {
    // Private mode: the cart lives for this page only.
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      snapshot = null
      onChange()
    }
  }
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function addToCart(line: CartLine) {
  const lines = read()
  const same = (l: CartLine) =>
    l.slug === line.slug && l.size === line.size && l.molienda === line.molienda
  const existing = lines.find(same)
  write(
    existing ? lines.map((l) => (same(l) ? { ...l, qty: l.qty + line.qty } : l)) : [...lines, line],
  )
}

export function setQuantity(index: number, qty: number) {
  const lines = read()
  write(
    qty <= 0
      ? lines.filter((_, i) => i !== index)
      : lines.map((l, i) => (i === index ? { ...l, qty } : l)),
  )
}

export function clearCart() {
  write([])
}

export function CartCount({ className }: { className?: string }) {
  const count = useCart().reduce((sum, line) => sum + line.qty, 0)
  if (count === 0) return null
  return (
    <span className={className} aria-label={`${count} ${count === 1 ? 'producto' : 'productos'}`}>
      {count}
    </span>
  )
}

interface AddButtonProps {
  line: Omit<CartLine, 'qty'>
  className?: string
  label?: string
}

/** «Agregar» on a card: 250 g, whole bean, one bag. */
export function AddButton({ line, className = '', label = 'Agregar' }: AddButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--sm ${className}`}
      onClick={() => addToCart({ ...line, qty: 1 })}
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
      {label}
    </button>
  )
}
