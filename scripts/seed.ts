/**
 * Seeds the Verde Origen site in Zap through the PUBLIC API, with a site
 * secret key: the content model (collections, documents, sections, fields),
 * the photo library (media), and every entry and document value.
 *
 *   pnpm seed                 # create or converge everything
 *   pnpm seed --dry-run       # validate content and relations, write nothing
 *   pnpm seed --force         # re-save and re-publish entries even when unchanged
 *   pnpm seed --only=schema   # one stage: media, schema, content
 *
 * Env: EELZAP_API_KEY (a SECRET site key), EELZAP_BASE_URL (and optionally
 * EELZAP_PATH_PREFIX), SEED_PHOTOS_DIR (default ./seed-photos; the 20 PNGs).
 *
 * Idempotent: everything is keyed on stable identifiers (collection and
 * document keys, field keys, section names, item slugs, media file names).
 * A re-run updates in place, publishes only what changed and never deletes.
 * Fields, entries and media added in Zap by hand are left alone.
 */
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import {
  createClient,
  isEelZapError,
  type EelZapClient,
  type FieldInfo,
  type MediaDetail,
  type SectionInfo,
} from '@8ux-co/eelzap'

import { PHOTOS } from '../src/lib/photos'
import { retryingFetch } from '../src/lib/zap-fetch'
import { CAFES, ORIGENES } from './seed/content/catalog'
import { DOCUMENT_VALUES } from './seed/content/documents'
import { BLOG, PERSONAS, PREGUNTAS } from './seed/content/editorial'
import { COLLECTIONS, DOCUMENTS, type FieldDef, type ModelDef } from './seed/model'
import type { Entry, MediaRef, Values } from './seed/types'
import { LOGO, validateContent } from './seed/validate'

const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')
const FORCE = args.has('--force')
const only = [...args].find((a) => a.startsWith('--only='))?.slice('--only='.length)
const stage = (name: 'media' | 'schema' | 'content') => !only || only.split(',').includes(name)

const PHOTOS_DIR = resolve(process.env.SEED_PHOTOS_DIR ?? 'seed-photos')
const ASSETS_DIR = resolve('scripts/seed/assets')

const ENTRIES: Record<string, Entry[]> = {
  origenes: ORIGENES,
  personas: PERSONAS,
  cafes: CAFES,
  blog: BLOG,
  preguntas: PREGUNTAS,
}

/** Runs `fn`, naming `what` in the error it throws. */
async function context<T>(what: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const detail = isEelZapError(error)
      ? `${error.code} ${error.status}: ${error.message}`
      : String(error)
    throw new Error(`${what}: ${detail}`, { cause: error })
  }
}

const counts: Record<string, number> = {}
const bump = (key: string) => (counts[key] = (counts[key] ?? 0) + 1)
const log = (message: string) => console.log(`seed: ${message}`)

// ── Media ───────────────────────────────────────────────────────────────────

interface SeedMedia {
  id: string
  url: string
  alt: string
}

/**
 * The photos arrive as full-resolution PNGs of 2 to 3 MB, over Zap's default
 * 2 MB image limit. They are uploaded at their native size as JPEG (quality
 * 88); the site's image optimiser serves AVIF and WebP from there.
 */
async function prepare(file: string, contentType: string) {
  const bytes = await readFile(file)
  if (contentType !== 'image/jpeg') return { bytes, width: undefined, height: undefined }
  const { data, info } = await sharp(bytes).jpeg({ quality: 88, mozjpeg: true }).toBuffer({
    resolveWithObject: true,
  })
  return { bytes: data, width: info.width, height: info.height }
}

async function findMedia(cms: EelZapClient, filename: string): Promise<MediaDetail | null> {
  const { items } = await cms.media.list({
    search: filename.replace(/\.[a-z]+$/, ''),
    pageSize: 50,
  })
  return items.find((m) => m.filename === filename) ?? null
}

async function ensureMedia(cms: EelZapClient): Promise<Map<string, SeedMedia>> {
  const out = new Map<string, SeedMedia>()
  const wanted: Array<{
    name: string
    file: string
    filename: string
    contentType: string
    alt: string
  }> = [
    ...Object.entries(PHOTOS).map(([name, photo]) => ({
      name,
      file: join(PHOTOS_DIR, `${name}.png`),
      filename: `${name}.jpg`,
      contentType: 'image/jpeg',
      alt: photo.alt,
    })),
    {
      name: LOGO,
      file: join(ASSETS_DIR, `${LOGO}.svg`),
      filename: `${LOGO}.svg`,
      contentType: 'image/svg+xml',
      alt: 'Verde Origen',
    },
  ]

  for (const photo of wanted) {
    const filename = photo.filename
    let media = await findMedia(cms, filename)
    if (!media) {
      if (!existsSync(photo.file)) {
        throw new Error(
          `${filename} is not in Zap and ${photo.file} is missing (set SEED_PHOTOS_DIR)`,
        )
      }
      if (DRY_RUN) {
        log(`would upload ${filename}`)
        continue
      }
      const { bytes, width, height } = await prepare(photo.file, photo.contentType)
      media = await cms.media.upload({
        file: new Blob([new Uint8Array(bytes)], { type: photo.contentType }),
        filename,
        contentType: photo.contentType,
        width,
        height,
        alt: photo.alt,
        title: photo.name,
      })
      bump('media.uploaded')
    } else if (!DRY_RUN && (media.alt ?? '') !== photo.alt) {
      media = await cms.media.update(media.id, { alt: photo.alt, title: photo.name })
      bump('media.updated')
    }
    if (!DRY_RUN && media.status !== 'PUBLISHED') {
      media = await cms.media.publish(media.id)
      bump('media.published')
    }
    out.set(photo.name, { id: media.id, url: media.url ?? media.signedUrl ?? '', alt: photo.alt })
  }
  return out
}

// ── Schema ──────────────────────────────────────────────────────────────────

/** The two field APIs (collections, documents) behind one shape. */
interface SchemaApi {
  fields: {
    list(key: string): Promise<FieldInfo[]>
    listDeleted(key: string): Promise<FieldInfo[]>
    restore(key: string, fieldId: string): Promise<FieldInfo>
    create(key: string, input: Record<string, unknown>): Promise<FieldInfo>
    update(key: string, fieldId: string, input: Record<string, unknown>): Promise<FieldInfo>
    reorder(key: string, fieldIds: string[]): Promise<unknown>
  }
  sections: {
    list(key: string): Promise<SectionInfo[]>
    create(key: string, input: { name: string }): Promise<SectionInfo>
  }
}

function fieldInput(def: FieldDef, sectionId: string | null): Record<string, unknown> {
  return {
    label: def.label,
    required: !!def.required,
    isUnique: !!def.unique,
    isFilterable: !!def.filterable,
    isSortable: !!def.sortable,
    isLocalized: false,
    description: def.description ?? null,
    sectionId,
    ...(def.options ? { options: def.options.map(([value, label]) => ({ value, label })) } : {}),
    ...(def.gallery
      ? {
          galleryMinItems: def.gallery.min ?? null,
          galleryMaxItems: def.gallery.max ?? null,
          galleryAllowedTypes: 'IMAGE',
        }
      : {}),
    ...(def.currencies ? { constraints: { currencies: def.currencies } } : {}),
  }
}

/** True when the live field already says what the definition says. */
function fieldMatches(live: FieldInfo, def: FieldDef, sectionId: string | null): boolean {
  const options = (live.options ?? []).map((o) => `${o.value}=${o.label}`).join('|')
  const wanted = (def.options ?? []).map(([v, l]) => `${v}=${l}`).join('|')
  const liveSection = (live as FieldInfo & { sectionId?: string | null }).sectionId ?? null
  return (
    live.label === def.label &&
    !!live.required === !!def.required &&
    !!live.isUnique === !!def.unique &&
    !!live.isFilterable === !!def.filterable &&
    !!live.isSortable === !!def.sortable &&
    (live.description ?? null) === (def.description ?? null) &&
    options === wanted &&
    liveSection === sectionId
  )
}

async function ensureFields(api: SchemaApi, model: ModelDef): Promise<void> {
  const sections = new Map((await api.sections.list(model.key)).map((s) => [s.name, s]))
  for (const name of model.sections) {
    if (!sections.has(name)) {
      sections.set(name, await api.sections.create(model.key, { name }))
      bump('sections.created')
    }
  }

  let live = await api.fields.list(model.key)
  const deleted = await api.fields.listDeleted(model.key).catch(() => [] as FieldInfo[])
  for (const def of model.fields) {
    const sectionId = sections.get(def.section)?.id ?? null
    let field = live.find((f) => f.key === def.key)
    if (!field) {
      const archived = deleted.find((f) => f.key === def.key)
      if (archived?.id) {
        field = await api.fields.restore(model.key, archived.id)
        bump('fields.restored')
      } else {
        field = await context(`${model.key}.${def.key}: create`, () =>
          api.fields.create(model.key, {
            key: def.key,
            type: def.type,
            ...fieldInput(def, sectionId),
          }),
        )
        bump('fields.created')
        continue
      }
    }
    if (field.type !== def.type) {
      throw new Error(`${model.key}.${def.key} is ${field.type} in Zap, the model says ${def.type}`)
    }
    if (!fieldMatches(field, def, sectionId)) {
      await context(`${model.key}.${def.key}: update`, () =>
        api.fields.update(model.key, field.id!, fieldInput(def, sectionId)),
      )
      bump('fields.updated')
      log(`${model.key}.${def.key}: field settings updated`)
    }
  }

  live = await api.fields.list(model.key)
  const order = model.fields.map((def) => live.find((f) => f.key === def.key)!.id!)
  const extras = live.filter((f) => !model.fields.some((d) => d.key === f.key)).map((f) => f.id!)
  const current = live.map((f) => f.id!)
  const wanted = [...order, ...extras]
  if (current.join() !== wanted.join()) {
    await api.fields.reorder(model.key, wanted)
    bump('fields.reordered')
  }
}

async function ensureSchema(cms: EelZapClient): Promise<void> {
  const { data: collections } = await cms.collections.list()
  for (const model of COLLECTIONS) {
    const existing = collections.find((c) => c.key === model.key)
    if (!existing) {
      await cms.collections.create({
        key: model.key,
        name: model.name,
        description: model.description,
      })
      bump('collections.created')
    } else if (existing.name !== model.name || existing.description !== model.description) {
      await cms.collections.update(model.key, { name: model.name, description: model.description })
      bump('collections.updated')
    }
    await ensureFields(cms.collections as unknown as SchemaApi, model)
  }

  const { data: documents } = await cms.documents.list({ preview: true, stega: false })
  for (const model of DOCUMENTS) {
    const existing = documents.find((d) => d.key === model.key)
    if (!existing) {
      await cms.documents.create({
        key: model.key,
        name: model.name,
        description: model.description,
      })
      bump('documents.created')
    } else if (existing.name !== model.name) {
      await cms.documents.update(model.key, { name: model.name, description: model.description })
      bump('documents.updated')
    }
    await ensureFields(cms.documents as unknown as SchemaApi, model)
  }
}

// ── Content ─────────────────────────────────────────────────────────────────

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function expandFigures(html: string, media: Map<string, SeedMedia>): string {
  return html.replace(
    /\{\{figure:([a-z0-9-]+)\|([^}]*)\}\}/g,
    (_m, name: string, caption: string) => {
      const file = media.get(name)
      if (!file) throw new Error(`unknown figure photo "${name}"`)
      return `<figure><img src="${file.url}" alt="${escapeHtml(file.alt)}" data-media-id="${file.id}"><figcaption>${escapeHtml(caption)}</figcaption></figure>`
    },
  )
}

/** Seed values → the public API's write shape (keys, enum values, ids, minor units). */
function encode(
  model: ModelDef,
  values: Values,
  media: Map<string, SeedMedia>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const field of model.fields) {
    if (!(field.key in values)) continue
    const value = values[field.key]
    if (value === null || value === undefined) {
      out[field.key] = null
      continue
    }
    const id = (ref: MediaRef) => {
      const file = media.get(ref.media)
      if (!file) throw new Error(`media ${ref.media} was not uploaded`)
      return file.id
    }
    switch (field.type) {
      case 'IMAGE':
        out[field.key] = id(value as MediaRef)
        break
      case 'GALLERY':
        out[field.key] = (value as MediaRef[]).map((ref) => ({
          mediaId: id(ref),
          caption: ref.caption ?? null,
        }))
        break
      case 'CURRENCY':
        out[field.key] = { amountMinor: Math.round(Number(value) * 100), currency: 'COP' }
        break
      case 'RICH_TEXT':
        out[field.key] = expandFigures(String(value), media)
        break
      default:
        out[field.key] = value
    }
  }
  return out
}

/** A delivered value in the write shape, to tell whether a save would change anything. */
function normalizeDelivered(field: FieldDef, value: unknown): unknown {
  if (value === null || value === undefined || value === '') return null
  const record = value as Record<string, unknown>
  switch (field.type) {
    case 'ENUM':
      return typeof value === 'object' ? (record.value ?? record.key ?? null) : value
    case 'IMAGE':
      return typeof value === 'object' ? (record.id ?? record.mediaId ?? null) : value
    case 'GALLERY':
      return Array.isArray(value)
        ? value.map((entry: Record<string, unknown>) => ({
            mediaId: entry.mediaId ?? entry.id ?? (entry.media as Record<string, unknown>)?.id,
            caption: entry.caption ?? null,
          }))
        : null
    case 'CURRENCY':
      return typeof value === 'object'
        ? { amountMinor: Number(record.amountMinor ?? record.amount), currency: record.currency }
        : value
    case 'DATE':
      return String(value).slice(0, 10)
    case 'RICH_TEXT':
      return normalizeHtml(String(value))
    default:
      return value
  }
}

/** Rich text compares without image URLs (re-signed) and insignificant whitespace. */
const normalizeHtml = (html: string) =>
  html
    .replace(/\s(src|srcset|data-status|referrerpolicy)="[^"]*"/g, '')
    .replace(/>\s+</g, '><')
    .trim()

function changedFields(
  model: ModelDef,
  wanted: Record<string, unknown>,
  delivered: Record<string, unknown>,
) {
  const changed: string[] = []
  for (const field of model.fields) {
    if (!(field.key in wanted)) continue
    let a = wanted[field.key]
    if (field.type === 'RICH_TEXT' && typeof a === 'string') a = normalizeHtml(a)
    const b = normalizeDelivered(field, delivered[field.key])
    if (JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)) changed.push(field.key)
  }
  return changed
}

async function ensureItems(cms: EelZapClient, media: Map<string, SeedMedia>): Promise<void> {
  for (const model of COLLECTIONS) {
    for (const entry of ENTRIES[model.key] ?? []) {
      const values = encode(model, entry.values, media)
      let existing: { content: Record<string, unknown>; status: string } | null = null
      try {
        existing = await cms.items.get(model.key, entry.slug, { preview: true, stega: false })
      } catch (error) {
        if (!(isEelZapError(error) && error.status === 404)) throw error
      }
      if (!existing) {
        await context(`${model.key}/${entry.slug}: create`, () =>
          cms.items.create(model.key, { slug: entry.slug, values }),
        )
        await cms.items.publish(model.key, entry.slug)
        bump('items.created')
        continue
      }
      const changed = changedFields(model, values, existing.content)
      const live = existing.status.toLowerCase() === 'published'
      if (changed.length === 0 && live && !FORCE) {
        bump('items.unchanged')
        continue
      }
      if (changed.length > 0 || FORCE) {
        await context(`${model.key}/${entry.slug}: update`, () =>
          cms.items.update(model.key, entry.slug, { values }),
        )
        if (changed.length > 0) log(`${model.key}/${entry.slug}: ${changed.join(', ')}`)
      }
      await cms.items.publish(model.key, entry.slug)
      bump('items.published')
    }
  }
}

async function ensureDocuments(cms: EelZapClient, media: Map<string, SeedMedia>): Promise<void> {
  for (const model of DOCUMENTS) {
    const values = encode(model, DOCUMENT_VALUES[model.key] ?? {}, media)
    const existing = await cms.documents.get(model.key, { preview: true, stega: false })
    const changed = changedFields(model, values, existing.content as Record<string, unknown>)
    const live = existing.status.toLowerCase() === 'published'
    if (changed.length === 0 && live && !FORCE) {
      bump('documents.unchanged')
      continue
    }
    if (changed.length > 0 || FORCE) {
      await context(`doc:${model.key}: values`, () =>
        cms.documents.values.update(model.key, values),
      )
      if (changed.length > 0) log(`doc:${model.key}: ${changed.join(', ')}`)
    }
    await cms.documents.publish(model.key)
    bump('documents.published')
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const apiKey = process.env.EELZAP_API_KEY
  if (!apiKey?.startsWith('secret_')) {
    throw new Error('EELZAP_API_KEY must be a SECRET site key (secret_…)')
  }
  const problems = validateContent({ collections: ENTRIES, documents: DOCUMENT_VALUES })
  if (problems.length > 0) throw new Error(`content does not validate:\n  ${problems.join('\n  ')}`)
  log('content and relations validate')

  const cms = createClient({
    apiKey,
    baseUrl: process.env.EELZAP_BASE_URL,
    pathPrefix: process.env.EELZAP_PATH_PREFIX,
    timeout: 180_000,
    fetch: retryingFetch(fetch, {
      onWait: (ms) => log(`rate limited by Zap, waiting ${Math.round(ms / 1000)} s`),
    }),
  })
  const site = await cms.site.get()
  log(
    `site ${site.key} (${site.name}), locales ${site.locales.join(', ')}${DRY_RUN ? ', dry run' : ''}`,
  )

  const media = stage('media') || stage('content') ? await ensureMedia(cms) : new Map()
  if (DRY_RUN) {
    log('dry run: stopping before schema and content writes')
    return
  }
  if (stage('schema')) await ensureSchema(cms)
  if (stage('content')) {
    await ensureItems(cms, media)
    await ensureDocuments(cms, media)
  }

  log(
    Object.entries(counts)
      .map(([k, v]) => `${k} ${v}`)
      .join(', ') || 'nothing to do',
  )
  log('set in Zap (site settings, not on the public API):')
  log(`  base URL = your site's origin; «Otros dominios» for any extra origin`)
  for (const model of [...COLLECTIONS, ...DOCUMENTS]) {
    log(`  «Ruta en tu sitio» ${model.key.padEnd(17)} ${model.previewPath}`)
  }
}

main().catch((error: unknown) => {
  console.error(`seed: failed: ${error instanceof Error ? error.message : String(error)}`)
  if (isEelZapError(error)) console.error(`seed: ${error.code} (${error.status})`)
  if (process.env.SEED_DEBUG) console.error(error)
  process.exitCode = 1
})
