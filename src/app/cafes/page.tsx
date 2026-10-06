import type { Metadata } from 'next'
import Link from 'next/link'

import { cleanStega } from '@8ux-co/eelzap'
import { fields } from '@8ux-co/eelzap/fields'

import { CafeCard } from '@/components/cafe-card'
import { CafesBrowser, type FacetOption } from '@/components/cafes-browser'
import { HelpBand, PageHead } from '@/components/ui'
import type { CafesItem } from '@/generated/cms'
import { getCafes, getDocument } from '@/lib/content'
import { pesos } from '@/lib/format'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocument('pagina-cafes')
  return {
    title: cleanStega(page.content.titulo ?? 'Cafés'),
    description: cleanStega(page.content.intro ?? ''),
    alternates: { canonical: '/cafes' },
  }
}

const REGION_ORDER = ['huila', 'narino', 'cauca', 'tolima', 'varias']
const PROCESO_ORDER = ['lavado', 'honey', 'natural', 'anaerobico']
const NOTAS_ORDER = ['frutal', 'floral', 'citrico', 'chocolate_caramelo']

function facet(
  cafes: CafesItem[],
  pick: (cafe: CafesItem) => { value: string; label: string } | null | undefined,
  order: string[],
): FacetOption[] {
  const options = new Map<string, FacetOption>()
  for (const cafe of cafes) {
    const value = pick(cafe)
    if (!value) continue
    const label = value.value === 'varias' && pick === regionPick ? 'Varias regiones' : value.label
    const option = options.get(value.value) ?? { value: value.value, label, count: 0 }
    option.count++
    options.set(value.value, option)
  }
  return [...options.values()].sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value))
}

const regionPick = (cafe: CafesItem) => cafe.content.region

export default async function CafesPage() {
  const [page, cafes] = await Promise.all([getDocument('pagina-cafes'), getCafes()])
  const f = fields(page)

  return (
    <>
      <PageHead
        crumbs={[{ label: f.text('titulo') }]}
        title={f.text('titulo')}
        intro={f.text('intro')}
      />
      <section className="wrap pt-2 pb-14 lg:pb-28">
        <CafesBrowser
          groups={[
            { key: 'region', legend: 'Origen', options: facet(cafes, regionPick, REGION_ORDER) },
            {
              key: 'proceso',
              legend: 'Proceso',
              options: facet(cafes, (c) => c.content.proceso, PROCESO_ORDER),
            },
            {
              key: 'notas',
              legend: 'Notas',
              options: facet(cafes, (c) => c.content.familia_notas, NOTAS_ORDER),
            },
          ]}
          items={cafes.map((cafe, i) => ({
            slug: cafe.slug,
            facets: {
              region: cafe.content.region.value,
              proceso: cafe.content.proceso.value,
              notas: cafe.content.familia_notas?.value ?? null,
              pesos250: pesos(cafe.content.precio_250),
              orden: cafe.content.orden ?? 999,
              puntaje: cafe.content.puntaje,
            },
            card: <CafeCard cafe={cafe} priority={i < 3} />,
          }))}
        />
      </section>
      <HelpBand
        title="¿No sabes cuál elegir?"
        text="Cuéntanos qué tomas y cómo lo preparas. Te respondemos con uno, casi siempre el mismo día."
        actions={
          <>
            <Link href="/contacto" className="btn btn--dark">
              Escríbenos
            </Link>
            <Link href="/preguntas-frecuentes" className="btn hidden lg:inline-flex">
              Preguntas frecuentes
            </Link>
          </>
        }
      />
    </>
  )
}
