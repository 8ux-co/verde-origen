'use client'

import { useId, useState, type FormEvent } from 'react'

import { cleanStega } from '@8ux-co/eelzap'

import { validateContact, type ContactErrors as Errors } from '@/lib/contact'

/**
 * The contact form. The site's route handler receives it (`/api/contacto`);
 * nothing is stored in Zap. Subjects come from `contacto.asuntos`.
 */
export function ContactForm({ asuntos, datosUrl }: { asuntos: string[]; datosUrl: string }) {
  const id = useId()
  const [errors, setErrors] = useState<Errors>({})
  const [asunto, setAsunto] = useState(asuntos[0] ?? '')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const orderSubject = /pedido/i.test(cleanStega(asunto))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const data = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]))
    const found = validateContact(data)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }
    setStatus('sending')
    const response = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, asunto: cleanStega(data.asunto ?? '') }),
    }).catch(() => null)
    setStatus(response?.ok ? 'sent' : 'failed')
  }

  if (status === 'sent') {
    return (
      <div role="status" className="flex flex-col gap-4 border-t-[1.5px] border-tinta pt-6">
        <h2 className="m-0 font-display text-[40px] leading-[0.95] font-extrabold uppercase">
          Recibimos tu mensaje
        </h2>
        <p className="m-0 font-story text-[19px] leading-[1.55] text-tinta-2">
          Te respondemos en horario de taller, casi siempre el mismo día.
        </p>
      </div>
    )
  }

  const field = (name: keyof Errors) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  })
  const error = (name: keyof Errors) =>
    errors[name] ? (
      <span id={`${id}-${name}-error`} className="field-error">
        {errors[name]}
      </span>
    ) : null

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-[22px]">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-nombre`} className="field-label">
            Nombre
          </label>
          <input {...field('nombre')} type="text" autoComplete="name" className="input" />
          {error('nombre')}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-email`} className="field-label">
            Correo electrónico
          </label>
          <input
            {...field('email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="tu@correo.com"
            className="input"
          />
          {error('email')}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-asunto`} className="field-label">
            Asunto
          </label>
          <select
            id={`${id}-asunto`}
            name="asunto"
            className="select"
            value={asunto}
            onChange={(event) => setAsunto(event.target.value)}
          >
            {asuntos.map((option) => (
              <option key={option} value={option}>
                {cleanStega(option)}
              </option>
            ))}
          </select>
        </div>
        {orderSubject ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-pedido`} className="field-label">
              Número de pedido{' '}
              <span className="font-story text-[15px] font-normal tracking-normal text-tinta-2 normal-case">
                opcional
              </span>
            </label>
            <input
              id={`${id}-pedido`}
              name="pedido"
              type="text"
              placeholder="VO-0000"
              className="input"
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-mensaje`} className="field-label">
          Mensaje
        </label>
        <textarea
          {...field('mensaje')}
          placeholder="Cuéntanos qué necesitas"
          className="textarea"
        />
        {error('mensaje')}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${id}-consentimiento`}
          className="flex cursor-pointer items-start gap-3 font-story text-[16px] leading-[1.45]"
        >
          <input
            {...field('consentimiento')}
            type="checkbox"
            value="si"
            className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-hoja"
          />
          <span>
            Autorizo a Verde Origen a usar mis datos para responder este mensaje, según la{' '}
            <a href={datosUrl} className="text-tinta underline underline-offset-[3px]">
              política de tratamiento de datos personales
            </a>
            .
          </span>
        </label>
        {error('consentimiento')}
      </div>
      <div className="flex flex-col items-start gap-3">
        <button type="submit" className="btn btn--lg btn--buy" disabled={status === 'sending'}>
          Enviar mensaje
        </button>
        {status === 'failed' ? (
          <span role="alert" className="field-error">
            No pudimos enviar el mensaje. Inténtalo de nuevo, o escríbenos por WhatsApp.
          </span>
        ) : null}
      </div>
    </form>
  )
}
