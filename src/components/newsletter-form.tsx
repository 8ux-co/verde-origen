'use client'

import { useId, useState, type FormEvent } from 'react'

type State =
  { kind: 'idle' } | { kind: 'sending' } | { kind: 'done' } | { kind: 'error'; message: string }

/** The newsletter sign-up. The site's route answers it (the list itself lives outside Zap). */
export function NewsletterForm({ note }: { note?: string }) {
  const id = useId()
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({
        kind: 'error',
        message: 'Revisa el correo: debe tener la forma nombre@dominio.com.',
      })
      return
    }
    setState({ kind: 'sending' })
    const response = await fetch('/api/boletin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => null)
    setState(
      response?.ok
        ? { kind: 'done' }
        : {
            kind: 'error',
            message: 'No pudimos guardar tu correo. Inténtalo de nuevo en un momento.',
          },
    )
  }

  if (state.kind === 'done') {
    return (
      <p role="status" className="m-0 font-story text-[20px] leading-[1.45]">
        Listo. Te escribimos cuando tostemos el próximo lote.
      </p>
    )
  }

  const error = state.kind === 'error'
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[10px]">
      <label htmlFor={`${id}-email`} className="field-label">
        Correo electrónico
      </label>
      <div className="flex flex-col gap-[10px] sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          aria-invalid={error || undefined}
          aria-describedby={error ? `${id}-error` : note ? `${id}-note` : undefined}
          className="input h-14!"
        />
        <button type="submit" className="btn btn--lg btn--buy" disabled={state.kind === 'sending'}>
          Suscribirme
        </button>
      </div>
      {error ? (
        <span id={`${id}-error`} className="field-error">
          {state.message}
        </span>
      ) : null}
      {note ? (
        <span id={`${id}-note`} className="font-story text-[15px] leading-[1.4] text-tinta-2">
          {note}
        </span>
      ) : null}
    </form>
  )
}
