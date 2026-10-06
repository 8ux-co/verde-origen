'use client'

import Link from 'next/link'

import { formatCOP } from '@/lib/format'

import { clearCart, setQuantity, useCart } from './cart'

const FREE_SHIPPING = 150_000

export function CartView({ whatsapp }: { whatsapp: string }) {
  const lines = useCart()
  const total = lines.reduce((sum, line) => sum + line.pesos * line.qty, 0)

  if (lines.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-start gap-5 border-t-[1.5px] border-tinta pt-8">
        <p className="m-0 font-story text-[20px] text-tinta-2">Tu carrito está vacío.</p>
        <Link href="/cafes" className="btn btn--buy">
          Ver los cafés
        </Link>
      </div>
    )
  }

  const message = [
    'Hola, quiero hacer este pedido:',
    ...lines.map(
      (l) =>
        `- ${l.qty} × ${l.nombre} (lote ${l.lote}), ${l.size}, ${l.molienda}: ${formatCOP(l.pesos * l.qty)}`,
    ),
    `Total: ${formatCOP(total)}`,
  ].join('\n')
  const orderUrl = whatsapp
    ? `${whatsapp}${whatsapp.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`
    : null

  return (
    <div className="mt-10">
      <ul className="m-0 list-none border-t-[1.5px] border-tinta p-0">
        {lines.map((line, i) => (
          <li
            key={`${line.slug}-${line.size}-${line.molienda}`}
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-linea py-5"
          >
            <div className="flex flex-col gap-1">
              <span className="eyebrow eyebrow--sm">Lote {line.lote}</span>
              <Link
                href={`/cafes/${line.slug}`}
                className="font-display text-[28px] leading-none font-extrabold text-tinta uppercase no-underline"
              >
                {line.nombre}
              </Link>
              <span className="font-story text-[16px] text-tinta-2">
                {line.size} · {line.molienda} · {formatCOP(line.pesos)} c/u
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="sr-only" htmlFor={`qty-${i}`}>
                Cantidad de {line.nombre}
              </label>
              <input
                id={`qty-${i}`}
                type="number"
                min={0}
                max={99}
                value={line.qty}
                onChange={(event) => setQuantity(i, Number(event.target.value) || 0)}
                className="input h-11! w-20 text-center"
              />
              <span className="min-w-[110px] text-right font-display text-[22px] font-extrabold">
                {formatCOP(line.pesos * line.qty)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[34px] leading-none font-black">
            Total {formatCOP(total)}
          </span>
          <span className="font-story text-[16px] text-tinta-2">
            {total >= FREE_SHIPPING
              ? 'Envío gratis.'
              : `Te faltan ${formatCOP(FREE_SHIPPING - total)} para el envío gratis.`}{' '}
            IVA incluido.
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={clearCart} className="btn">
            Vaciar
          </button>
          {orderUrl ? (
            <a href={orderUrl} target="_blank" rel="noopener" className="btn btn--buy">
              Pedir por WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
