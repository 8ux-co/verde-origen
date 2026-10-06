import { validateContact } from '@/lib/contact'

/**
 * The contact form's endpoint. It validates and acknowledges; delivery to the
 * team's inbox (Wrap, later) plugs in here. Nothing is stored in Zap.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object')
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  const data = Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.slice(0, 5000) : undefined,
    ]),
  )
  const errors = validateContact(data)
  if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 422 })
  return Response.json({ ok: true })
}
