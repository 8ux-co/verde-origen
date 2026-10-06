import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import { cleanStega } from '@8ux-co/eelzap'

import { BAG_PLACEMENT, focalFor, photoName, type PhotoSlot } from '@/lib/photos'

/** What `fields(record).image(key)` returns: src, alt, size and, in preview, `data-zap`. */
export interface PhotoSource {
  src: string | undefined
  alt: string | undefined
  width?: number | undefined
  height?: number | undefined
  'data-zap'?: string
}

export interface BagLabel {
  lote: string
  nombre: string
  meta: string
}

interface PhotoProps {
  image: PhotoSource | null | undefined
  slot: PhotoSlot
  /** CSS aspect ratio, `4/5`. */
  ratio: string
  sizes: string
  priority?: boolean
  dark?: boolean
  /** `''` for a decorative repeat in the same view (images README). */
  alt?: string
  className?: string
  /** Printed over the plain kraft bags. */
  bag?: BagLabel
  /** Shown in an empty slot (a map, a portrait not yet taken). */
  empty?: ReactNode
  emptyLabel?: string
  children?: ReactNode
}

const isSigned = (src: string) => /[?&]X-Amz-|[?&]signature=/i.test(src)

/**
 * A photo slot: `object-fit: cover` at the slot's ratio, cropped with the art
 * direction for its file and slot (desktop and mobile), served by Next's
 * optimiser as AVIF or WebP. The `data-zap` tag lands on the `<img>`, which is
 * where Zap's preview swaps an image as it is edited.
 */
export function Photo({
  image,
  slot,
  ratio,
  sizes,
  priority,
  dark,
  alt,
  className = '',
  bag,
  empty,
  emptyLabel,
  children,
}: PhotoProps) {
  const src = image?.src
  const name = photoName(src)
  const focal = focalFor(name, slot)
  const style = {
    aspectRatio: ratio,
    '--fp': focal.desktop,
    '--fp-m': focal.mobile,
  } as CSSProperties
  const placement = name ? BAG_PLACEMENT[name] : undefined
  const tag = image?.['data-zap'] ? { 'data-zap': image['data-zap'] } : {}

  if (!src) {
    return (
      <figure
        className={`photo frame-marks ${dark ? 'photo--dark text-[#D9E0D4]' : 'text-[#2C3830]'} ${className}`}
        style={style}
        {...tag}
      >
        {empty}
        {emptyLabel ? <span className="frame-label">{emptyLabel}</span> : null}
        {children}
      </figure>
    )
  }

  return (
    <figure className={`photo ${dark ? 'photo--dark' : ''} ${className}`} style={style}>
      <Image
        src={src}
        alt={alt ?? cleanStega(image?.alt ?? '')}
        fill
        sizes={sizes}
        priority={priority}
        quality={75}
        unoptimized={isSigned(src)}
        {...tag}
      />
      {bag && placement ? (
        <span
          className="bag-label"
          aria-hidden="true"
          style={
            {
              '--bx': placement.x,
              '--by': placement.y,
              '--bw': placement.w,
              '--br': placement.r,
            } as CSSProperties
          }
        >
          <span className="bag-label__brand">Verde Origen</span>
          <span className="bag-label__rule" />
          <span className="bag-label__lot">Lote {cleanStega(bag.lote)}</span>
          <span className="bag-label__name">{cleanStega(bag.nombre)}</span>
          <span className="bag-label__meta">{cleanStega(bag.meta)}</span>
        </span>
      ) : null}
      {children}
    </figure>
  )
}
