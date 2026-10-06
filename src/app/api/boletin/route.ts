import { isEmail } from '@/lib/contact'

/**
 * The newsletter sign-up. It validates and acknowledges; the mailing list
 * itself lives outside Zap and plugs in here.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null
  if (!isEmail(body?.email)) return Response.json({ error: 'invalid_email' }, { status: 422 })
  return Response.json({ ok: true })
}
