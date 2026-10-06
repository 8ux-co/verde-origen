/**
 * A `fetch` for the Zap client that waits out rate limits.
 *
 * Zap's public API allows a site key 100 requests a minute (60 for a public
 * key) and answers 429 with `Retry-After` past that. The SDK never retries on
 * its own, so a build that renders every page, or the seed, would fail
 * half-way. This waits the time Zap asks for (capped) and tries again, a few
 * times, for idempotent reads and for writes alike: a 429 is refused before
 * anything runs, so repeating the request is safe.
 */
export interface RetryOptions {
  attempts?: number
  /** Longest single wait, in ms. */
  maxWaitMs?: number
  onWait?: (ms: number, url: string) => void
}

export function retryingFetch(
  base: typeof fetch = fetch,
  options: RetryOptions = {},
): typeof fetch {
  const attempts = options.attempts ?? 4
  const maxWaitMs = options.maxWaitMs ?? 65_000
  return async function zapFetch(input, init) {
    for (let attempt = 1; ; attempt++) {
      const response = await base(input, init)
      if (response.status !== 429 || attempt >= attempts) return response
      const header = Number(response.headers.get('retry-after'))
      const waitMs = Math.min(
        maxWaitMs,
        (Number.isFinite(header) && header > 0 ? header : 2 ** attempt) * 1000,
      )
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      options.onWait?.(waitMs, url)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }
  }
}
