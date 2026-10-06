import type { Metadata } from 'next'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { Photo } from '@/components/photo'
import { RichText } from '@/components/rich-text'
import { Breadcrumbs, Initials } from '@/components/ui'
import { getDocument, getPersonas } from '@/lib/content'
import { slots } from '@/lib/fields-extra'
import { initials } from '@/lib/format'
import { takeLeading } from '@/lib/rich-text'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocument('nosotros')
  return {
    title: 'Nosotros',
    description: cleanStega(page.content.intro ?? ''),
    alternates: { canonical: '/nosotros' },
  }
}

const GALLERY_RATIOS = ['4/5', '3/4', '3/4', '4/5']

export default async function NosotrosPage() {
  const [page, personas] = await Promise.all([getDocument('nosotros'), getPersonas()])
  const f = fields(page)
  const c = page.content
  const { taken, rest } = takeLeading(c.historia, ['h3', 'h2'])
  const principios = slots(f, 'principio', 3, 'titulo').filter((slot) => !slot.empty)
  const gallery = (c.galeria ?? []).filter((item) => item.media?.url).slice(0, 4)
  const team = personas.filter((persona) => persona.content.en_equipo)
  const visitUrl = f.value('visita_cta_url')

  return (
    <>
      <section className="wrap pt-5 pb-12 lg:pt-8 lg:pb-24">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Nosotros' }]} />
        <div className="mt-6 mb-8 grid gap-5 lg:mt-10 lg:mb-14 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-20">
          <h1 className="h1 text-(length:--fl-page-long)!">{f.text('titulo')}</h1>
          <p className="m-0 font-story text-[18px] leading-[1.45] text-pretty text-tinta-2 lg:text-[23px]">
            {f.text('intro')}
          </p>
        </div>
        <div className="-mx-5 md:mx-0">
          <Photo
            image={f.image('portada')}
            slot="nosotros-cover"
            ratio="21/9"
            sizes="(min-width: 1024px) 1280px, 100vw"
            priority
            className="aspect-[3/2]! md:aspect-[21/9]!"
          />
        </div>
      </section>

      <section className="rule-top">
        <div className="wrap grid gap-6 py-12 lg:grid-cols-[4fr_8fr] lg:gap-20 lg:py-24">
          <div className="flex flex-col gap-4">
            {taken.h3 ? (
              <span className="eyebrow" dangerouslySetInnerHTML={{ __html: taken.h3 }} />
            ) : null}
            {taken.h2 ? (
              <h2
                className="m-0 font-display text-(length:--fl-h2-sm) leading-[0.92] font-extrabold text-balance uppercase"
                dangerouslySetInnerHTML={{ __html: taken.h2 }}
              />
            ) : null}
          </div>
          <RichText
            html={rest}
            className="prose max-w-[700px] lg:[&_p]:text-[20px]! lg:[&_p]:leading-[1.6]! [&>*+*]:mt-[22px]!"
          />
        </div>
      </section>

      {principios.length > 0 ? (
        <section className="bg-hoja text-niebla">
          <div className="wrap grid gap-10 py-12 md:grid-cols-3 lg:gap-12 lg:py-24">
            {principios.map((principio, i) => (
              <div
                key={i}
                className="flex flex-col gap-[14px] border-t-[1.5px] border-[rgba(237,239,233,0.4)] pt-[22px] lg:gap-[18px] lg:pt-[26px]"
              >
                <span
                  className="font-display text-[64px] leading-[0.85] font-black text-numeral lg:text-[88px]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="m-0 font-display text-[32px] leading-[0.95] font-extrabold text-niebla uppercase lg:text-[40px]">
                  {principio.text('titulo')}
                </h3>
                <p className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-hoja-texto lg:text-[19px]">
                  {principio.text('texto')}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length > 0 ? (
        <section className="wrap pt-12 lg:pt-24" {...f.attrs('galeria')}>
          <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-[3fr_2fr_2fr_3fr] lg:gap-5">
            {gallery.map((item, i) => (
              <Photo
                key={`${item.media!.id}-${i}`}
                image={{
                  src: item.media!.url ?? undefined,
                  alt: item.caption ?? item.media!.alt ?? '',
                }}
                slot="nosotros-gallery"
                ratio={GALLERY_RATIOS[i] ?? '4/5'}
                sizes="(min-width: 1024px) 380px, 50vw"
                dark={i === 3}
              />
            ))}
          </div>
        </section>
      ) : null}

      {team.length > 0 ? (
        <section className="wrap py-12 lg:py-28">
          <h2 className="m-0 mb-6 font-display text-(length:--fl-h2-md) leading-[0.92] font-extrabold text-balance uppercase lg:mb-12">
            Quiénes tuestan tu café
          </h2>
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-8 lg:grid-cols-4 lg:gap-8">
            {team.map((persona) => {
              const p = fields(persona)
              return (
                <div key={persona.slug} className="flex flex-col gap-[10px] lg:gap-[14px]">
                  <Photo
                    image={
                      persona.content.foto
                        ? p.image('foto')
                        : { src: undefined, alt: undefined, ...p.attrs('foto') }
                    }
                    slot="team"
                    ratio="4/5"
                    sizes="(min-width: 1024px) 300px, 50vw"
                    empty={
                      <span className="absolute inset-0 flex items-center justify-center bg-[#B8C2B2]">
                        <Initials
                          name={initials(persona.content.nombre)}
                          className="h-auto w-auto bg-transparent! text-[56px] lg:text-[72px]"
                        />
                      </span>
                    }
                  />
                  <h3 className="m-0 font-display text-[24px] leading-[0.95] font-extrabold uppercase lg:text-[32px]">
                    {p.text('nombre')}
                  </h3>
                  <span className="font-story text-[16px] leading-[1.3] text-tinta-2 lg:text-[17px]">
                    {p.text('cargo')}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {c.visita_titulo ? (
        <section className="border-t border-linea bg-papel">
          <div className="wrap flex flex-col gap-[14px] py-11 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-[72px]">
            <div className="flex flex-col gap-[14px]">
              <h2 className="m-0 font-display text-[38px] leading-[0.92] font-extrabold text-balance uppercase lg:text-[56px]">
                {f.text('visita_titulo')}
              </h2>
              <p className="m-0 font-story text-[17px] leading-[1.55] text-pretty text-tinta-2 lg:text-[20px]">
                {f.text('visita_texto')}
              </p>
            </div>
            <div>
              <a
                href={visitUrl || '/contacto'}
                className="btn btn--dark"
                target={visitUrl ? '_blank' : undefined}
                rel="noopener"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
