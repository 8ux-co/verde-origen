import { PHOTOS } from '../../src/lib/photos'
import { COLLECTIONS, DOCUMENTS, type ModelDef } from './model'
import type { Entry, MediaRef, SeedValue, Values } from './types'

/**
 * Checks the seed content before anything is written: slugs, required
 * fields, enum options, photo names, and every relation (a slug in a TEXT
 * field) resolving to an entry. Returns the problems; empty means valid.
 */

export const LOGO = 'logo-verde-origen'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const knownMedia = (ref: MediaRef) => ref.media === LOGO || ref.media in PHOTOS

function mediaRefs(value: SeedValue | undefined): MediaRef[] {
  if (!value || typeof value !== 'object') return []
  return Array.isArray(value) ? value : [value]
}

export function checkValues(where: string, model: ModelDef, values: Values): string[] {
  const problems: string[] = []
  const fields = new Map(model.fields.map((f) => [f.key, f]))
  for (const key of Object.keys(values)) {
    if (!fields.has(key)) problems.push(`${where}: unknown field "${key}"`)
  }
  for (const field of model.fields) {
    const value = values[field.key]
    const empty = value === undefined || value === null || value === ''
    if (field.required && empty) problems.push(`${where}: required "${field.key}" is empty`)
    if (empty) continue
    if (field.type === 'ENUM' && !field.options?.some(([v]) => v === value))
      problems.push(`${where}: "${field.key}" has no option "${String(value)}"`)
    if ((field.type === 'IMAGE' || field.type === 'GALLERY') && !mediaRefs(value).every(knownMedia))
      problems.push(`${where}: "${field.key}" names an unknown photo`)
  }
  return problems
}

export function validateContent(content: {
  collections: Record<string, Entry[]>
  documents: Record<string, Values>
}): string[] {
  const problems: string[] = []
  const slugs = (key: string) => new Set((content.collections[key] ?? []).map((e) => e.slug))
  const origenes = slugs('origenes')
  const personas = slugs('personas')
  const cafes = slugs('cafes')

  for (const [key, entries] of Object.entries(content.collections)) {
    const model = COLLECTIONS.find((c) => c.key === key)
    if (!model) {
      problems.push(`${key}: no such collection in the model`)
      continue
    }
    const seen = new Set<string>()
    for (const entry of entries) {
      if (!SLUG.test(entry.slug)) problems.push(`${key}/${entry.slug}: bad slug`)
      if (seen.has(entry.slug)) problems.push(`${key}/${entry.slug}: duplicate slug`)
      seen.add(entry.slug)
      problems.push(...checkValues(`${key}/${entry.slug}`, model, entry.values))
    }
  }
  for (const doc of DOCUMENTS) {
    problems.push(...checkValues(`doc:${doc.key}`, doc, content.documents[doc.key] ?? {}))
  }

  // Relations are slugs in TEXT fields: a dangling one fails the seed.
  for (const cafe of content.collections.cafes ?? []) {
    if (!origenes.has(String(cafe.values.origen)))
      problems.push(`cafes/${cafe.slug}: origen "${cafe.values.origen}" is not an origen`)
  }
  for (const post of content.collections.blog ?? []) {
    if (!personas.has(String(post.values.autor)))
      problems.push(`blog/${post.slug}: autor "${post.values.autor}" is not a persona`)
    const cafe = post.values.cafe_relacionado
    if (cafe && !cafes.has(String(cafe)))
      problems.push(`blog/${post.slug}: cafe_relacionado "${cafe}" is not a cafe`)
  }
  return problems
}
