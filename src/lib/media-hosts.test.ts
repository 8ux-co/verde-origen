import { describe, expect, it } from 'vitest'

import { DEFAULT_MEDIA_HOSTS, mediaHosts } from './media-hosts'

describe('mediaHosts', () => {
  it("allows Zap's media domain and R2 with no variable set", () => {
    expect(mediaHosts(undefined)).toEqual([...DEFAULT_MEDIA_HOSTS])
    expect(mediaHosts(undefined)).toContain('media.zap.eel.software')
  })

  it('adds the hosts from EELZAP_MEDIA_HOSTS without dropping the defaults or repeating one', () => {
    expect(mediaHosts(' cdn.example.com , media.zap.eel.software,, ')).toEqual([
      ...DEFAULT_MEDIA_HOSTS,
      'cdn.example.com',
    ])
  })
})
