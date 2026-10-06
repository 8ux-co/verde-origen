import type { Metadata, Viewport } from 'next'
import { Big_Shoulders, Newsreader } from 'next/font/google'
import { draftMode } from 'next/headers'

import { cleanStega } from '@8ux-co/eelzap'
import { DEFAULT_DRAFT_ROUTE, ZapPreview } from '@8ux-co/eelzap/next'

import { DevPreviewBridge } from '@/components/dev-preview-bridge'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { getDocument } from '@/lib/content'
import { env } from '@/lib/env'

import './globals.css'

/**
 * Google now ships Big Shoulders Display as the `opsz` 72 end of the variable
 * Big Shoulders; the display cut is pinned in globals.css (`'opsz' 72`).
 */
const bigShoulders = Big_Shoulders({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  axes: ['opsz'],
  variable: '--font-big-shoulders',
  display: 'swap',
  // No metric overrides exist for it; the fallback is Arial Narrow (globals.css).
  adjustFontFallback: false,
})

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const config = await getDocument('configuracion')
  const brand = cleanStega(config.content.logo?.alt ?? '') || 'Verde Origen'
  const description = cleanStega(config.content.lema ?? '')
  const logo = config.content.logo?.url ?? undefined
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: `${brand} · Tostadores de origen`, template: `%s · ${brand}` },
    description,
    icons: logo ? { icon: logo } : undefined,
    openGraph: { siteName: brand, locale: 'es_CO', type: 'website' },
  }
}

export const viewport: Viewport = {
  themeColor: '#1E3B2D',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, faqPage, draft] = await Promise.all([
    getDocument('configuracion'),
    getDocument('pagina-preguntas'),
    draftMode(),
  ])
  const faqLabel = cleanStega(faqPage.content.titulo ?? '') || 'Preguntas frecuentes'
  const devZap = process.env.NODE_ENV === 'development' ? env.devZapOrigin : undefined

  return (
    <html lang="es-CO" className={`${bigShoulders.variable} ${newsreader.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-papel focus:p-3"
        >
          Ir al contenido
        </a>
        <SiteHeader config={config} faqLabel={faqLabel} />
        <main id="contenido">{children}</main>
        <SiteFooter config={config} faqLabel={faqLabel} />
        <WhatsAppFloat config={config} />
        {devZap ? (
          <DevPreviewBridge
            zapOrigin={devZap}
            authOrigin={env.devAuthOrigin}
            siteKey={env.siteKey}
            siteId={env.siteId}
            draftRoute={DEFAULT_DRAFT_ROUTE}
            serverPreview={draft.isEnabled}
          />
        ) : null}
        <ZapPreview
          siteKey={env.siteKey}
          siteId={env.siteId}
          preview={draft.isEnabled}
          zapOrigin={env.devZapOrigin}
          authOrigin={env.devAuthOrigin}
        />
      </body>
    </html>
  )
}
