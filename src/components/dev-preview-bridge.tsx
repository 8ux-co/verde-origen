'use client'

import { useEffect } from 'react'

import { bootZapPreview } from '@8ux-co/eelzap/react'

/**
 * Development only: lets Zap's preview run against a Zap on localhost.
 *
 * Two gaps in 0.10.0 make a local round trip impossible without it (see the
 * README, "Local preview"):
 *
 * 1. The boot loads the overlay from the production CDN only
 *    (`https://zap.eel.software/js/preview/preview.v1.<hash>.js`). Before the
 *    Zap release that file is not served there, and a local Zap serves the
 *    same file at its own origin. This rewrites that one URL to the local
 *    Zap; the SRI hash stays, so only the identical file can run.
 * 2. Zap frames a site only at an https base URL, so a local site runs on
 *    https://localhost; the boot recognises a local Zap frame only from an
 *    http:// page. When the page is framed by the local Zap, this boots
 *    the client itself (the same `bootZapPreview` the SDK's component runs).
 *
 * Rendered by the root layout only when `next dev` runs and EELZAP_ORIGIN is
 * a localhost origin; production never ships it.
 */
const CDN_PREFIX = 'https://zap.eel.software/js/preview/'

interface DevPreviewBridgeProps {
  zapOrigin: string
  authOrigin?: string
  siteKey: string
  siteId?: string
  draftRoute: string
  /** The server already booted the client for a draft-mode page. */
  serverPreview: boolean
}

export function DevPreviewBridge(props: DevPreviewBridgeProps) {
  const { zapOrigin, authOrigin, siteKey, siteId, draftRoute, serverPreview } = props

  useEffect(() => {
    const head = document.head
    const original = head.appendChild
    head.appendChild = function appendChild<T extends Node>(this: HTMLHeadElement, node: T): T {
      if (node instanceof HTMLScriptElement && node.src.startsWith(CDN_PREFIX)) {
        node.src = `${zapOrigin}/js/preview/${node.src.slice(CDN_PREFIX.length)}`
      }
      return original.call(this, node) as T
    }

    let stop = () => {}
    const ancestors = (location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins
    const framedByLocalZap = window.parent !== window && ancestors?.[0] === zapOrigin
    if (!serverPreview && framedByLocalZap && location.protocol === 'https:') {
      stop = bootZapPreview({ siteKey, siteId, draftRoute, preview: true, zapOrigin, authOrigin })
    }

    return () => {
      stop()
      head.appendChild = original
    }
  }, [zapOrigin, authOrigin, siteKey, siteId, draftRoute, serverPreview])

  return null
}
