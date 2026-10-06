import { fields } from '@8ux-co/eelzap/fields'

import type { ConfiguracionDocument } from '@/generated/cms'
import { COPY } from '@/lib/copy'

import { WhatsAppFloatLink } from './whatsapp-float-link'

/**
 * The WhatsApp button: bottom right, desktop only, outside the bottom-centre
 * zone (600 × 96) that Zap's toolbar uses. On mobile the footer and the
 * contact page carry the link instead; nothing fixed sits at the bottom.
 */
export function WhatsAppFloat({ config }: { config: ConfiguracionDocument }) {
  const f = fields(config)
  const href = f.value('whatsapp_url')
  if (!href) return null
  return (
    <WhatsAppFloatLink
      href={href}
      label={COPY.whatsapp}
      attrs={f.attrs('whatsapp_url')}
      className="fixed right-7 bottom-7 z-45 hidden h-[52px] items-center gap-[10px] bg-hoja px-5 font-display text-[16px] leading-none font-bold tracking-[0.1em] text-niebla uppercase no-underline shadow-[0_8px_20px_rgba(22,32,26,0.22)] hover:bg-tinta lg:inline-flex"
    >
      <svg
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
      WhatsApp
    </WhatsAppFloatLink>
  )
}
