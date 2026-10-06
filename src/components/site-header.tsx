import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import type { ConfiguracionDocument } from '@/generated/cms'
import { COPY } from '@/lib/copy'

import { CartCount } from './cart'
import { MobileMenu, NavLinks, type NavItem } from './site-nav'

export function navItems(config: ConfiguracionDocument): NavItem[] {
  const f = fields(config)
  return f
    .list('nav', 5)
    .filter((slot) => !slot.empty)
    .map((slot) => ({
      label: slot.text('texto'),
      href: slot.value('url') || '/',
      // URL fields update `href` in the preview, never the label.
      attrs: slot.attrs('url'),
    }))
}

function CartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M16 10a4 4 0 0 1-8 0" />
      <path d="M3.103 6.034h17.794" />
      <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
    </svg>
  )
}

export function SiteHeader({
  config,
  faqLabel,
}: {
  config: ConfiguracionDocument
  faqLabel: string
}) {
  const f = fields(config)
  const brand = cleanStega(config.content.logo?.alt ?? '') || 'Verde Origen'
  const items = navItems(config)
  const aviso = f.text('aviso')

  return (
    <>
      {aviso ? (
        <div className="bg-hoja px-5 py-[9px] text-center font-display text-[12px] leading-[1.35] font-semibold tracking-[0.12em] text-niebla uppercase max-lg:tracking-[0.08em] lg:py-3 lg:text-[14px]">
          {aviso}
        </div>
      ) : null}
      <header className="sticky top-0 z-40 border-b border-linea bg-niebla">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[44px_1fr_44px] items-center px-[10px] lg:h-24 lg:grid-cols-[1fr_auto_1fr] lg:px-20">
          <MobileMenu items={items} faq={{ label: faqLabel, href: '/preguntas-frecuentes' }} />
          <div className="text-center lg:text-left">
            <Link
              href="/"
              aria-label={`${brand}, ${COPY.home.toLowerCase()}`}
              className="inline-block text-tinta no-underline"
              {...f.attrs('logo')}
            >
              <span className="block font-display text-[24px] leading-[0.9] font-black tracking-[0.035em] uppercase lg:text-[30px]">
                {brand}
              </span>
              <span className="mt-[5px] hidden font-display text-[11px] leading-none font-bold tracking-[0.24em] text-tinta-2 uppercase lg:block">
                {COPY.brandLine}
              </span>
            </Link>
          </div>
          <NavLinks items={items} />
          <div className="flex justify-end">
            <div className="flex items-center gap-[6px]">
              <Link
                href="/cafes"
                aria-label={COPY.search}
                className="hidden h-11 w-11 items-center justify-center text-tinta lg:inline-flex"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Link>
              <Link
                href="/carrito"
                className="relative inline-flex h-11 w-11 items-center justify-center text-tinta no-underline lg:w-auto lg:gap-[10px] lg:border-[1.5px] lg:border-tinta lg:pr-[14px] lg:pl-3 lg:font-display lg:text-[16px] lg:leading-none lg:font-bold lg:tracking-[0.1em] lg:uppercase"
              >
                <CartIcon />
                <span className="sr-only lg:not-sr-only">{COPY.cart}</span>
                <CartCount className="absolute top-[5px] right-[3px] h-[18px] min-w-[18px] bg-cereza px-1 text-center font-display text-[12px] leading-[18px] font-bold text-white lg:static lg:h-[22px] lg:min-w-[22px] lg:px-[5px] lg:text-[13px] lg:leading-[22px] lg:tracking-normal" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
