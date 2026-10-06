/**
 * Contact form validation, shared by the form (as you submit) and the route
 * handler (always): a module with no directive, so both sides import the
 * same function. Errors are sentences, shown as text next to the field.
 */
export type ContactErrors = Partial<
  Record<'nombre' | 'email' | 'mensaje' | 'consentimiento', string>
>

export function validateContact(data: Record<string, string | undefined>): ContactErrors {
  const errors: ContactErrors = {}
  if (!data.nombre?.trim()) errors.nombre = 'Escribe tu nombre.'
  const email = data.email?.trim() ?? ''
  if (!email) errors.email = 'Escribe tu correo para poder responderte.'
  else if (!/^[^\s@]+@/.test(email))
    errors.email = 'Revisa el correo: debe tener una @, por ejemplo laura@gmail.com.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Revisa el correo: le falta el dominio, por ejemplo @gmail.com.'
  if (!data.mensaje?.trim()) errors.mensaje = 'Cuéntanos qué necesitas.'
  if (data.consentimiento !== 'si')
    errors.consentimiento = 'Necesitamos tu autorización para responderte.'
  return errors
}

export function isEmail(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  )
}
