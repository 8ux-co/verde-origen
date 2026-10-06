/** Cache tags for Zap reads: one per collection and document, plus one for all. */
export const TAG_ALL = 'zap'
export const collectionTag = (key: string) => `zap:collection:${key}`
export const documentTag = (key: string) => `zap:document:${key}`
