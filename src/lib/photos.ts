/**
 * The photo library: one entry per file uploaded to Zap media, keyed by the
 * file name without extension.
 *
 * Zap keeps no focal point per slot, so the art direction lives here: each
 * slot crops with `object-fit: cover` and the `object-position` below
 * (design handoff, images README «Uso en el sitio»). The seed reads `alt`
 * from this file to set each media's alt text in Zap; the site reads the
 * crops. A file Zap holds that is not listed here falls back to the centre.
 */

export type PhotoSlot =
  | 'hero'
  | 'cafe-card'
  | 'cafe-main'
  | 'cafe-gallery'
  | 'origen-band'
  | 'region-card'
  | 'origen-row'
  | 'origen-cover'
  | 'productor'
  | 'origen-gallery'
  | 'historia'
  | 'blog-card'
  | 'blog-cover'
  | 'blog-inline'
  | 'related-box'
  | 'nosotros-cover'
  | 'nosotros-gallery'
  | 'team'
  | 'author'

type Crop = string | { desktop: string; mobile: string }

export interface PhotoEntry {
  alt: string
  /** Default crop for any slot not listed in `slots`. */
  focal: string
  slots?: Partial<Record<PhotoSlot, Crop>>
}

export const PHOTOS = {
  'hero-manos-cereza': {
    alt: 'Manos de una caficultora seleccionando cerezas maduras de café en la rama, en una finca de Pitalito, Huila.',
    focal: '52% 50%',
    slots: { hero: { desktop: '52% 50%', mobile: '48% 55%' } },
  },
  'hero-filo-neblina': {
    alt: 'Cafetales bajo sombrío en el filo de Pitalito, con neblina subiendo del valle al amanecer y una casa al fondo.',
    focal: '50% 50%',
    slots: {
      'origen-cover': '50% 58%',
      'origen-band': { desktop: '50% 50%', mobile: '40% 55%' },
    },
  },
  'retrato-caficultora': {
    alt: 'Caficultora sonriendo en el beneficiadero de su finca, con las manos sobre cereza recién recogida.',
    focal: '50% 30%',
    slots: { author: '50% 30%' },
  },
  'retrato-caficultor': {
    alt: 'Caficultor midiendo los grados Brix de la cereza con un refractómetro, junto al tanque de fermentación.',
    focal: '40% 30%',
    slots: { 'blog-inline': '45% 28%', author: '40% 30%' },
  },
  'origen-huila': {
    alt: 'Ladera de cafetales con sombrío en Huila, con cerezas rojas en primer plano y montañas al atardecer.',
    focal: '32% 55%',
  },
  'origen-narino': {
    alt: 'Cañón del río Juanambú en Nariño, con cafetales en ladera muy empinada y una tarde nublada.',
    focal: '50% 50%',
    slots: {
      // Cherries in the foreground, not the canyon (fidelity review).
      'cafe-card': '80% 75%',
      'cafe-main': '80% 75%',
      'cafe-gallery': '80% 75%',
      'related-box': '80% 75%',
      'region-card': '35% 50%',
      'origen-cover': '50% 55%',
    },
  },
  'origen-cauca': {
    alt: 'Marquesina comunal de secado con café pergamino en Inzá, Cauca, y las montañas de Tierradentro al fondo.',
    focal: '50% 55%',
    slots: { 'region-card': '45% 55%' },
  },
  'origen-tolima': {
    alt: 'Mula cargando sacos de fique por un camino de herradura entre cafetales de Gaitania, Tolima.',
    focal: '45% 50%',
    slots: { 'origen-cover': '45% 55%' },
  },
  'proceso-camas-secado': {
    alt: 'Camas de secado con café pergamino al atardecer y un caficultor revisando el grano bajo el techo.',
    focal: '50% 55%',
    slots: {
      'cafe-card': '28% 60%',
      'cafe-main': '28% 60%',
      'related-box': '28% 60%',
      'origen-cover': '50% 60%',
      'origen-gallery': '22% 55%',
      'blog-card': '50% 60%',
      'blog-cover': '50% 60%',
    },
  },
  'proceso-fermentacion': {
    alt: 'Caficultor tomando la temperatura de la cereza en tanques de fermentación del beneficiadero.',
    focal: '60% 50%',
    slots: { 'blog-cover': { desktop: '58% 52%', mobile: '60% 50%' } },
  },
  'proceso-macro-cereza': {
    alt: 'Racimo de cerezas de café, maduras y pintonas, en la misma rama.',
    focal: '45% 55%',
    slots: { 'origen-gallery': '50% 55%' },
  },
  'taller-tostadora': {
    alt: 'Tostador revisando la curva de tueste en un portátil junto a la tostadora del taller en Bogotá.',
    focal: '50% 50%',
    slots: {
      historia: { desktop: '50% 50%', mobile: '40% 50%' },
      'nosotros-cover': '50% 45%',
      team: '33% 42%',
    },
  },
  'taller-enfriamiento': {
    alt: 'Café recién tostado cayendo a la bandeja de enfriamiento mientras el tostador abre la compuerta.',
    focal: '62% 60%',
    slots: { 'nosotros-gallery': '52% 50%' },
  },
  'taller-catacion': {
    alt: 'Mesa de catación con tazas en filas, mientras tres personas del equipo prueban el café al fondo.',
    focal: '50% 62%',
    slots: {
      'nosotros-gallery': '50% 60%',
      team: '18% 38%',
      'blog-card': '50% 60%',
      'blog-cover': '50% 60%',
    },
  },
  'producto-bolsa-250': {
    alt: 'Bolsa kraft de 250 g de café Verde Origen sobre la mesa de catación, con tazas alrededor.',
    focal: '45% 50%',
  },
  'producto-bolsa-500-abierta': {
    alt: 'Bolsa kraft de 500 g abierta, llena de café en grano, sobre tela de fique.',
    focal: '50% 50%',
  },
  'producto-bolsa-1kg-greca': {
    alt: 'Bolsa kraft de 1 kg de café junto a una greca de aluminio en la estufa de una cocina colombiana.',
    focal: '45% 50%',
  },
  'blog-v60': {
    alt: 'Vista cenital de un V60 sobre una balanza mientras se sirve agua en espiral sobre el café molido.',
    focal: '50% 45%',
  },
  'equipo-sellando': {
    alt: 'Integrante del equipo sellando bolsas kraft de café en el taller.',
    focal: '56% 45%',
    slots: { team: '58% 35%' },
  },
  'comunidad-villa-rica': {
    alt: 'Familias caficultoras del Grupo Villa Rica posando en su marquesina comunal, con sacos de cereza.',
    focal: '50% 45%',
    slots: { 'origen-cover': '50% 40%' },
  },
} satisfies Record<string, PhotoEntry>

export type PhotoName = keyof typeof PHOTOS

/** `hero-manos-cereza.png` or a media URL ending in it → `hero-manos-cereza`. */
export function photoName(filenameOrUrl: string | null | undefined): string | null {
  if (!filenameOrUrl) return null
  const last = filenameOrUrl.split('?')[0]!.split('/').pop() ?? ''
  const base = last.replace(/\.[a-z0-9]+$/i, '')
  // Zap stores objects as `<uuid>-<filename>` or similar; match by suffix.
  const known = (Object.keys(PHOTOS) as PhotoName[]).find(
    (name) => base === name || base.endsWith(`-${name}`) || base.endsWith(`_${name}`),
  )
  return known ?? base
}

export interface Focal {
  desktop: string
  mobile: string
}

/** The crop for `slot`, desktop and mobile, for the file named `name`. */
export function focalFor(name: string | null, slot: PhotoSlot): Focal {
  const entry = name ? (PHOTOS as Record<string, PhotoEntry>)[name] : undefined
  const crop = entry?.slots?.[slot] ?? entry?.focal ?? '50% 50%'
  return typeof crop === 'string' ? { desktop: crop, mobile: crop } : crop
}

/**
 * Whether the file has an approved crop for `slot`. The author box only shows
 * a photo cut for it (a portrait); a team crop from a group photo is not one,
 * so the box falls back to initials (images README: «Autora: sin foto»).
 */
export function hasApprovedCrop(name: string | null, slot: PhotoSlot): boolean {
  const entry = name ? (PHOTOS as Record<string, PhotoEntry>)[name] : undefined
  return !!entry?.slots?.[slot]
}

/**
 * Where the plain kraft bags stand in their photos, for the lot label the
 * site prints over them (percentages of the 4:5 frame, label width).
 */
export const BAG_PLACEMENT: Record<string, { x: string; y: string; w: string; r?: string }> = {
  'producto-bolsa-250': { x: '46.6%', y: '53%', w: '21%' },
  'producto-bolsa-500-abierta': { x: '50.5%', y: '58.5%', w: '31%' },
  'producto-bolsa-1kg-greca': { x: '41.5%', y: '53%', w: '24%' },
}
