/** A reference to a media file by its photo name (`hero-manos-cereza`). */
export interface MediaRef {
  media: string
  caption?: string
}

export type SeedValue = string | number | boolean | null | MediaRef | MediaRef[]

export type Values = Record<string, SeedValue>

export interface Entry {
  slug: string
  values: Values
}
