import type { Metadata } from 'next'
import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { FaqAccordion } from '@/components/faq-accordion'
import { RichText } from '@/components/rich-text'
import { HelpBand, PageHead } from '@/components/ui'
import type { PreguntasItem } from '@/generated/cms'
import { getDocument, getPreguntas } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocument('pagina-preguntas')
  return {
    title: cleanStega(page.content.titulo ?? 'Preguntas frecuentes'),
    description: cleanStega(page.content.intro ?? ''),
    alternates: { canonical: '/preguntas-frecuentes' },
  }
}

const TOPIC_ORDER = ['pedidos_envios', 'cafe_preparacion', 'mayoristas_visitas']

export default async function PreguntasPage() {
  const [page, preguntas, config] = await Promise.all([
    getDocument('pagina-preguntas'),
    getPreguntas(),
    getDocument('configuracion'),
  ])
  const f = fields(page)
  const g = fields(config)
  const topics: Array<{ value: string; label: string; items: PreguntasItem[] }> = []
  for (const pregunta of preguntas) {
    const { value, label } = pregunta.content.tema
    const topic = topics.find((t) => t.value === value)
    if (topic) topic.items.push(pregunta)
    else topics.push({ value, label, items: [pregunta] })
  }
  topics.sort((a, b) => TOPIC_ORDER.indexOf(a.value) - TOPIC_ORDER.indexOf(b.value))
  const anchor = (value: string) => value.replace(/_/g, '-')

  // FAQPage structured data, from the same content (no stega in JSON-LD).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: cleanStega(p.content.pregunta),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanStega(p.content.respuesta)
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <PageHead
        crumbs={[{ label: f.text('titulo') }]}
        title={f.text('titulo')}
        intro={f.text('intro')}
        titleClass="text-(length:--fl-page-long)!"
      />
      <section className="wrap pt-0 pb-12 lg:pt-4 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-24">
          <nav aria-label="Temas" className="lg:sticky lg:top-32 lg:self-start">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {topics.map((topic) => (
                <li key={topic.value}>
                  <a
                    href={`#${anchor(topic.value)}`}
                    className="flex justify-between border-t border-linea py-3 font-display text-[16px] leading-[1.2] font-bold tracking-[0.1em] text-tinta uppercase no-underline hover:text-cereza"
                  >
                    <span>{topic.label}</span>
                    <span className="text-tinta-2">{topic.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            {topics.map((topic, ti) => (
              <section
                key={topic.value}
                id={anchor(topic.value)}
                aria-labelledby={`${anchor(topic.value)}-h`}
                className="mb-14 scroll-mt-32"
              >
                <h2
                  id={`${anchor(topic.value)}-h`}
                  className="m-0 mb-2 font-display text-[32px] leading-none font-extrabold uppercase lg:text-[40px]"
                >
                  {topic.label}
                </h2>
                <FaqAccordion
                  openFirst={ti === 0}
                  questions={topic.items.map((item) => {
                    const q = fields(item)
                    return {
                      id: `faq-${item.slug}`,
                      question: q.text('pregunta'),
                      answer: <RichText html={item.content.respuesta} className="prose--answer" />,
                    }
                  })}
                />
              </section>
            ))}
          </div>
        </div>
      </section>
      <HelpBand
        title="¿No está tu pregunta?"
        text="Escríbenos y te respondemos en horario de taller."
        actions={
          <>
            <Link href="/contacto" className="btn btn--dark">
              Ir a contacto
            </Link>
            {g.value('whatsapp_url') ? (
              <a
                href={g.value('whatsapp_url') ?? '#'}
                {...g.attrs('whatsapp_url')}
                target="_blank"
                rel="noopener"
                className="btn"
              >
                WhatsApp
              </a>
            ) : null}
          </>
        }
      />
    </>
  )
}
