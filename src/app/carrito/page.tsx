import type { Metadata } from 'next'

import { cleanStega } from '@8ux-co/eelzap'

import { CartView } from '@/components/cart-view'
import { Breadcrumbs } from '@/components/ui'
import { getDocument } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Carrito',
  robots: { index: false },
}

/** Commerce is outside Zap (design handoff); the cart lives in the browser and closes on WhatsApp. */
export default async function CarritoPage() {
  const config = await getDocument('configuracion')
  return (
    <section className="wrap pt-5 pb-16 lg:pt-10 lg:pb-28">
      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Carrito' }]} />
      <h1 className="h1 mt-6 lg:mt-10">Carrito</h1>
      <CartView whatsapp={cleanStega(config.content.whatsapp_url ?? '')} />
    </section>
  )
}
