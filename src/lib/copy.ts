/**
 * Interface labels that are not content: they name controls and sections the
 * same way on every page, so they live in the site, not in Zap. Everything a
 * person edits (titles, texts, prices, links) comes from Zap.
 */
export const COPY = {
  brandLine: 'Tostadores de origen · Bogotá',
  cart: 'Carrito',
  search: 'Buscar',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  home: 'Inicio',
  explore: 'Explora',
  shop: 'Taller y tienda',
  follow: 'Síguenos',
  whatsapp: 'Escríbenos por WhatsApp',
  pricesNote: 'Todos los precios en pesos colombianos, IVA incluido.',
  add: 'Agregar',
  allCafes: 'Todos los cafés',
  readMore: 'Sigue leyendo',
  allPosts: 'Todo el diario',
  lot: 'Lote',
  minutes: (n: number) => `${n} min de lectura`,
} as const

/** Grind options: a constant of the shop, not a Zap field (design handoff). */
export const MOLIENDAS = [
  'Grano entero',
  'Filtro: V60 o Chemex',
  'Prensa francesa',
  'Espresso',
  'Greca o moka',
] as const

/** Price filter ranges for 250 g, in pesos (coded in the site). */
export const PRICE_RANGES = [
  { id: 'hasta-45', label: 'Hasta $\u00a045.000', min: 0, max: 45_000 },
  { id: '45-60', label: '$\u00a045.000 a $\u00a060.000', min: 45_000, max: 60_000 },
  { id: 'mas-60', label: 'Más de $\u00a060.000', min: 60_000, max: Number.POSITIVE_INFINITY },
] as const
