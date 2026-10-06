'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'

import type { ZapAttrs } from '@8ux-co/eelzap/fields'

import { COPY } from '@/lib/copy'

export interface NavItem {
  /** The label as delivered: in preview it carries its stega marker. */
  label: string
  href: string
  /** The URL field's tag: the preview updates the link's `href`. */
  attrs?: ZapAttrs
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Desktop navigation; the current section gets the Cereza underline. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="m-0 flex list-none gap-[38px] p-0">
        {items.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                {...item.attrs}
                aria-current={active ? 'page' : undefined}
                className={`inline-block py-2 font-display text-[17px] leading-none font-bold tracking-[0.1em] text-tinta uppercase decoration-cereza decoration-2 underline-offset-[10px] hover:underline ${active ? 'underline' : 'no-underline'}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Mobile navigation: a sheet under the header, opened from the menu button. */
export function MobileMenu({
  items,
  faq,
}: {
  items: NavItem[]
  faq: { label: string; href: string }
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const id = useId()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? COPY.closeMenu : COPY.openMenu}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center border-0 bg-transparent p-0 text-tinta"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-64px)] overflow-y-auto border-t border-linea bg-niebla px-5 pt-6 pb-10"
      >
        <nav aria-label="Principal">
          <ul className="m-0 list-none p-0">
            {([...items, faq] as NavItem[]).map((item) => (
              <li key={item.href} className="border-b border-linea">
                <Link
                  href={item.href}
                  {...item.attrs}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className="block py-4 font-display text-[34px] leading-none font-extrabold text-tinta uppercase no-underline aria-[current=page]:text-cereza"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
