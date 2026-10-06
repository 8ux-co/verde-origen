import { draftMode } from 'next/headers'

import { createDraftModeExitRoute } from '@8ux-co/eelzap/next'

/** Ends a preview: `/api/zap-preview/exit?path=/cafes`. */
export const GET = createDraftModeExitRoute({ draftMode })
