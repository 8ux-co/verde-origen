import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import type { ConfiguracionDocument } from '@/generated/cms'
import { COPY } from '@/lib/copy'
import { lines, pairs } from '@/lib/format'

import { navItems } from './site-header'

const heading =
  'm-0 mb-[18px] font-display text-[14px] leading-none font-bold tracking-[0.18em] text-hoja-texto uppercase'
const item = 'font-story text-[17px] leading-[1.35] text-niebla no-underline hover:underline'

export function SiteFooter({
  config,
  faqLabel,
}: {
  config: ConfiguracionDocument
  faqLabel: string
}) {
  const f = fields(config)
  const brand = cleanStega(config.content.logo?.alt ?? '') || 'Verde Origen'
  const hours = pairs(f.text('horario')).filter(([, time]) => !/cerrado/i.test(time))
  const socials = (
    [
      ['instagram_url', 'Instagram'],
      ['tiktok_url', 'TikTok'],
      ['youtube_url', 'YouTube'],
    ] as const
  ).filter(([key]) => !!f.value(key))
  const legal = (
    [
      ['terminos_url', 'Términos y condiciones'],
      ['datos_url', 'Tratamiento de datos personales'],
      ['envios_url', 'Envíos y devoluciones'],
    ] as const
  ).filter(([key]) => !!f.value(key))

  return (
    <footer className="bg-hoja text-niebla">
      <div className="wrap pt-[72px] pb-10 lg:pt-[88px] lg:pb-9">
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:gap-12 lg:grid-cols-[1.6fr_1fr_1.3fr_0.8fr]">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              aria-label={`${brand}, inicio`}
              className="inline-block text-niebla no-underline"
              {...f.attrs('logo')}
            >
              <span className="block font-display text-[44px] leading-[0.9] font-black tracking-[0.035em] uppercase lg:text-[56px]">
                {brand}
              </span>
              <span className="mt-[5px] block font-display text-[15px] leading-none font-bold tracking-[0.24em] text-hoja-texto uppercase lg:text-[20px]">
                {COPY.brandLine}
              </span>
            </Link>
            {f.text('lema') ? (
              <p className="mt-[18px] mb-0 max-w-[420px] font-story text-[18px] leading-[1.45] text-pretty text-hoja-texto lg:text-[20px]">
                {f.text('lema')}
              </p>
            ) : null}
          </div>

          <div>
            <h2 className={heading}>{COPY.explore}</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 font-story text-[17px] leading-[1.35]">
              {navItems(config).map((nav) => (
                <li key={nav.href}>
                  <Link href={nav.href} className={item}>
                    {nav.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/preguntas-frecuentes" className={item}>
                  {faqLabel}
                </Link>
              </li>
            </ul>
          </div>

          <div className="order-last col-span-2 md:order-none md:col-span-1">
            <h2 className={heading}>{COPY.shop}</h2>
            <div className="flex flex-col gap-[14px] font-story text-[17px] leading-[1.45]">
              <p className="m-0">
                {lines(f.text('direccion')).map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p className="m-0">
                {hours.map(([day, time], i) => (
                  <span key={i} className="block">
                    {day}
                    {time ? `, ${time}` : ''}
                  </span>
                ))}
              </p>
              <a
                href={`mailto:${f.value('email')}`}
                className="text-niebla no-underline hover:underline"
                {...f.attrs('email')}
              >
                {f.value('email')}
              </a>
              {f.value('whatsapp_url') ? (
                <a
                  href={f.value('whatsapp_url') ?? '#'}
                  {...f.attrs('whatsapp_url')}
                  className="text-niebla no-underline hover:underline"
                >
                  {COPY.whatsapp}
                </a>
              ) : null}
            </div>
          </div>

          {socials.length > 0 ? (
            <div>
              <h2 className={heading}>{COPY.follow}</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0 font-story text-[17px] leading-[1.35]">
                {socials.map(([key, label]) => (
                  <li key={key}>
                    <a
                      href={f.value(key) ?? '#'}
                      {...f.attrs(key)}
                      className={item}
                      rel="me noopener"
                      target="_blank"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[rgba(237,239,233,0.22)] pt-6 lg:mt-[72px] lg:flex-row lg:items-center lg:justify-between">
          <span className="font-story text-[15px] leading-[1.4] text-hoja-texto">
            © {new Date().getFullYear()} {f.text('razon_social')}
            {cleanStega(f.text('razon_social')).endsWith('.') ? ' ' : '. '}
            <span className="hidden lg:inline">{COPY.pricesNote}</span>
          </span>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            {legal.map(([key, label]) => (
              <a
                key={key}
                href={f.value(key) ?? '#'}
                {...f.attrs(key)}
                className="font-story text-[15px] leading-[1.4] text-hoja-texto underline underline-offset-[3px]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
