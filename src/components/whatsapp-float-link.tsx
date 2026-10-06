'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * The floating link, hidden while the footer is on screen: the footer carries
 * its own WhatsApp link, and the float would cover the legal links.
 */
export function WhatsAppFloatLink({
  href,
  label,
  className,
  children,
}: {
  href: string
  label: string
  className: string
  children: ReactNode
}) {
  const [footerInView, setFooterInView] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setFooterInView(!!entry?.isIntersecting))
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      aria-hidden={footerInView || undefined}
      tabIndex={footerInView ? -1 : undefined}
      className={`${className} transition-opacity duration-200 ${footerInView ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      {children}
    </a>
  )
}
