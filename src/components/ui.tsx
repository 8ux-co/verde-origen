import Link from 'next/link'
import type { ReactNode } from 'react'

import type { ZapAttrs } from '@8ux-co/eelzap/fields'

import { COPY } from '@/lib/copy'
import { formatInt } from '@/lib/format'

export interface Crumb {
  label: ReactNode
  href?: string
}

export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={className}>
      <ol className="m-0 flex list-none flex-wrap gap-[10px] p-0 font-display text-[13px] leading-none font-bold tracking-[0.14em] uppercase">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="inline-flex items-center gap-[10px]">
              {!item.href ? (
                <span aria-current={last ? 'page' : undefined} className="text-tinta">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="text-tinta-2 no-underline hover:text-tinta">
                  {item.label}
                </Link>
              )}
              {last ? null : (
                <span aria-hidden="true" className="text-linea">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** The list-page head: breadcrumbs, a 150 px title, a lead, and an optional aside. */
export function PageHead({
  crumbs,
  title,
  intro,
  aside,
  titleClass = '',
}: {
  crumbs: Crumb[]
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  titleClass?: string
}) {
  return (
    <section className="wrap pt-5 pb-7 lg:pt-10 lg:pb-16">
      <Breadcrumbs items={[{ label: COPY.home, href: '/' }, ...crumbs]} />
      <div
        className={`mt-[22px] grid gap-10 lg:mt-10 lg:items-end lg:gap-20 ${aside ? 'lg:grid-cols-2' : ''}`}
      >
        <div className="flex flex-col gap-4 lg:gap-[26px]">
          <h1 className={`h1 ${titleClass}`}>{title}</h1>
          {intro ? <p className="lead max-w-[640px]">{intro}</p> : null}
        </div>
        {aside}
      </div>
    </section>
  )
}

/** A section header: eyebrow, H2, and an optional note or link on the right. */
export function SectionHead({
  eyebrow,
  title,
  side,
  dark,
  className = '',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  side?: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={`mb-7 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12 ${className}`}
    >
      <div className="flex flex-col gap-[14px] lg:gap-[18px]">
        {eyebrow ? (
          <span className={`eyebrow ${dark ? 'eyebrow--on-dark' : ''}`}>{eyebrow}</span>
        ) : null}
        <h2 className={`h2 ${dark ? 'text-niebla' : 'text-tinta'}`}>{title}</h2>
      </div>
      {side}
    </div>
  )
}

export function ArrowLink({
  href,
  children,
  className = '',
  ...rest
}: {
  href: string
  children: ReactNode
  className?: string
  'data-zap'?: string
}) {
  const external = /^https?:/i.test(href)
  return external ? (
    <a href={href} className={`link-arrow ${className}`} target="_blank" rel="noopener" {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} className={`link-arrow ${className}`} {...rest}>
      {children}
    </Link>
  )
}

/** Initials in a grey square: the fallback for a person without a photo. */
export function Initials({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center bg-[#B8C2B2] font-display font-extrabold tracking-[0.04em] text-[#1F2A22] ${className}`}
    >
      {name}
    </span>
  )
}

/** The closing band with a question and two buttons (Cafés, FAQ). */
export function HelpBand({
  title,
  text,
  actions,
}: {
  title: ReactNode
  text: ReactNode
  actions: ReactNode
}) {
  return (
    <section className="border-t border-linea bg-papel">
      <div className="wrap flex flex-col gap-[14px] py-11 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-[72px]">
        <div className="flex flex-col gap-[14px]">
          <h2 className="m-0 font-display text-[38px] leading-[0.92] font-extrabold text-balance uppercase lg:text-[52px]">
            {title}
          </h2>
          <p className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-tinta-2 lg:text-[20px]">
            {text}
          </p>
        </div>
        <div className="flex flex-wrap gap-[14px]">{actions}</div>
      </div>
    </section>
  )
}

/**
 * `1.780 a 1.900 msnm`, each figure tagged to its own field. Zap's preview
 * writes a tagged element's whole text as the field's value, so a tag goes on
 * exactly the figure, never on the unit or on a range of two fields.
 */
export function AltitudeRange({
  f,
  min,
  max,
}: {
  f: { attrs: (key: 'altitud_min' | 'altitud_max') => ZapAttrs }
  min: number
  max: number
}) {
  return (
    <>
      <span {...f.attrs('altitud_min')}>{formatInt(min)}</span> a{' '}
      <span {...f.attrs('altitud_max')}>{formatInt(max)}</span> msnm
    </>
  )
}
