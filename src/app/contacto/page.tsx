import type { Metadata } from 'next'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { ContactForm } from '@/components/contact-form'
import { ContourMap } from '@/components/contour-map'
import { Photo } from '@/components/photo'
import { PageHead } from '@/components/ui'
import { getDocument } from '@/lib/content'
import { lines, pairs } from '@/lib/format'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocument('contacto')
  return {
    title: 'Contacto',
    description: cleanStega(page.content.intro ?? ''),
    alternates: { canonical: '/contacto' },
  }
}

const icon = 'shrink-0'

export default async function ContactoPage() {
  const [page, config] = await Promise.all([getDocument('contacto'), getDocument('configuracion')])
  const f = fields(page)
  const g = fields(config)
  const address = lines(g.text('direccion'))
  const whatsapp = g.value('whatsapp_url')
  const mayoristas = f.value('mayoristas_email')

  return (
    <>
      <PageHead crumbs={[{ label: 'Contacto' }]} title={f.text('titulo')} intro={f.text('intro')} />

      <section className="wrap pt-0 pb-14 lg:pt-6 lg:pb-28">
        <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-24">
          <ContactForm
            asuntos={lines(f.text('asuntos'))}
            datosUrl={g.value('datos_url') || '/tratamiento-de-datos'}
          />

          <div className="relative flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Taller y tienda</span>
              <h2 className="m-0 font-display text-[32px] leading-[0.95] font-extrabold uppercase lg:text-[38px]">
                {address.map((line, i) => (
                  <span key={i}>
                    {i > 0 ? ', ' : ''}
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <div>
              {pairs(g.text('horario')).map(([day, time], i) => (
                <div
                  key={i}
                  className="flex justify-between border-t border-linea py-3 font-story text-[17px] leading-[1.3]"
                >
                  <span>{day}</span>
                  <span className="text-tinta-2">{time}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${g.value('email')}`}
                className="inline-flex items-center gap-3 font-story text-[19px] leading-none text-tinta"
                {...g.attrs('email')}
              >
                <svg
                  className={icon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {g.value('email')}
              </a>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-3 font-story text-[19px] leading-none text-tinta"
                >
                  <svg
                    className={icon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  Escríbenos por WhatsApp
                </a>
              ) : null}
              {page.content.mapa_url ? (
                <a
                  href={f.value('mapa_url') ?? '#'}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-3 font-story text-[19px] leading-none text-tinta"
                >
                  <svg
                    className={icon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Abrir en Google Maps
                </a>
              ) : null}
            </div>
            <Photo
              image={
                page.content.mapa_imagen
                  ? f.image('mapa_imagen')
                  : { src: undefined, alt: undefined, ...f.attrs('mapa_imagen') }
              }
              slot="origen-gallery"
              ratio="4/3"
              sizes="(min-width: 1024px) 520px, 100vw"
              className="bg-[#DCE1D6]! text-hoja"
              emptyLabel="Mapa · 4:3"
              empty={
                <ContourMap
                  seed={59}
                  summits={[{ x: 400, y: 300, scale: 1.3 }]}
                  river="M-10,305 C200,300 600,285 810,280 M390,-10 C395,200 405,420 415,610"
                  pins={[{ label: 'Taller', x: 50, y: 48 }]}
                />
              }
            />
          </div>
        </div>
      </section>

      {page.content.mayoristas_titulo ? (
        <section className="bg-hoja text-niebla">
          <div className="wrap grid gap-6 py-14 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-[88px]">
            <div className="flex flex-col gap-[14px] lg:gap-[18px]">
              <span className="eyebrow eyebrow--on-dark">Mayoristas</span>
              <h2 className="h2 text-niebla">{f.text('mayoristas_titulo')}</h2>
            </div>
            <div className="flex flex-col gap-6">
              <p className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-hoja-texto lg:text-[20px]">
                {f.text('mayoristas_texto')}
              </p>
              {mayoristas ? (
                <div>
                  <a href={`mailto:${mayoristas}`} className="btn btn--on-dark">
                    Escribir a mayoristas
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
