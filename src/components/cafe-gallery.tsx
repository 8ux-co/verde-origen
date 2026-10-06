'use client'

import { useRef, useState } from 'react'

import type { ZapAttrs } from '@8ux-co/eelzap/fields'

import { Photo, type BagLabel, type PhotoSource } from './photo'

/**
 * The coffee's photos: thumbnails beside the main image on desktop, a swipe
 * carousel with dots on mobile. The gallery container carries the GALLERY
 * field's tag, the main photo the IMAGE field's.
 */
export function CafeGallery({
  photos,
  galleryAttrs,
  bag,
  name,
}: {
  photos: PhotoSource[]
  galleryAttrs: ZapAttrs
  bag: BagLabel
  name: string
}) {
  const [current, setCurrent] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const active = photos[current] ?? photos[0]

  const onScroll = () => {
    const element = track.current
    if (!element) return
    setCurrent(Math.round(element.scrollLeft / element.clientWidth))
  }

  return (
    <div {...galleryAttrs}>
      {/* Desktop: thumbnails and the main photo */}
      <div className="hidden grid-cols-[92px_1fr] items-start gap-4 lg:grid">
        <div className="flex flex-col gap-[10px]">
          {photos.map((photo, i) => (
            <button
              key={`${photo.src}-${i}`}
              type="button"
              aria-label={`Ver foto ${i + 1} de ${photos.length}`}
              aria-current={i === current}
              onClick={() => setCurrent(i)}
              className={`block cursor-pointer bg-transparent p-0 ${i === current ? 'border-2 border-tinta' : 'border-0'}`}
            >
              <Photo
                image={{ ...photo, 'data-zap': undefined }}
                slot="cafe-gallery"
                ratio="4/5"
                sizes="92px"
                alt=""
              />
            </button>
          ))}
        </div>
        <Photo
          image={active}
          slot={current === 0 ? 'cafe-main' : 'cafe-gallery'}
          ratio="4/5"
          sizes="(min-width: 1024px) 640px, 100vw"
          priority
          bag={bag}
        />
      </div>

      {/* Mobile: carousel */}
      <div className="-mx-5 lg:hidden">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`Fotos de ${name}`}
          role="region"
        >
          {photos.map((photo, i) => (
            <div key={`${photo.src}-m-${i}`} className="w-full shrink-0 snap-start">
              <Photo
                image={i === 0 ? photo : { ...photo, 'data-zap': undefined }}
                slot={i === 0 ? 'cafe-main' : 'cafe-gallery'}
                ratio="4/5"
                sizes="100vw"
                priority={i === 0}
                alt={i === 0 ? undefined : ''}
                bag={bag}
              />
            </div>
          ))}
        </div>
        {photos.length > 1 ? (
          <div className="mt-[14px] flex justify-center gap-[6px]" aria-hidden="true">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-2 ${i === current ? 'w-[22px] bg-tinta' : 'w-2 bg-linea'}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
