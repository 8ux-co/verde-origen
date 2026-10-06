import { describe, expect, it } from 'vitest'

import { CAFES, ORIGENES } from './content/catalog'
import { DOCUMENT_VALUES } from './content/documents'
import { BLOG, PERSONAS, PREGUNTAS } from './content/editorial'
import { validateContent } from './validate'

const collections = {
  origenes: ORIGENES,
  personas: PERSONAS,
  cafes: CAFES,
  blog: BLOG,
  preguntas: PREGUNTAS,
}

describe('seed content', () => {
  it('validates as shipped', () => {
    expect(validateContent({ collections, documents: DOCUMENT_VALUES })).toEqual([])
  })

  it('fails on a dangling relation', () => {
    const broken = [
      { ...CAFES[0]!, values: { ...CAFES[0]!.values, origen: 'finca-que-no-existe' } },
    ]
    expect(
      validateContent({
        collections: { ...collections, cafes: broken },
        documents: DOCUMENT_VALUES,
      }),
    ).toContain('cafes/la-esperanza-lote-07: origen "finca-que-no-existe" is not an origen')
  })

  it('fails on an enum value the model does not have, and on an unknown photo', () => {
    const cafe = {
      ...CAFES[0]!,
      values: { ...CAFES[0]!.values, proceso: 'carbonico', foto: { media: 'no-existe' } },
    }
    const problems = validateContent({
      collections: { ...collections, cafes: [cafe] },
      documents: DOCUMENT_VALUES,
    })
    expect(problems).toContain('cafes/la-esperanza-lote-07: "proceso" has no option "carbonico"')
    expect(problems).toContain('cafes/la-esperanza-lote-07: "foto" names an unknown photo')
  })

  it('fails on a missing required document value', () => {
    const documents = { ...DOCUMENT_VALUES, inicio: { ...DOCUMENT_VALUES.inicio, hero_titulo: '' } }
    expect(validateContent({ collections, documents })).toContain(
      'doc:inicio: required "hero_titulo" is empty',
    )
  })
})
