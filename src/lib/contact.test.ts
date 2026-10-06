import { describe, expect, it } from 'vitest'

import { isEmail, validateContact } from './contact'

const valid = {
  nombre: 'Laura Méndez',
  email: 'laura@gmail.com',
  mensaje: 'Hola',
  consentimiento: 'si',
}

describe('contact form validation', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('names each missing or wrong field in words', () => {
    const errors = validateContact({
      ...valid,
      nombre: ' ',
      email: 'laura.mendez@',
      consentimiento: undefined,
    })
    expect(errors.nombre).toBe('Escribe tu nombre.')
    expect(errors.email).toBe('Revisa el correo: le falta el dominio, por ejemplo @gmail.com.')
    expect(errors.consentimiento).toBeDefined()
    expect(errors.mensaje).toBeUndefined()
  })

  it('tells a missing @ apart from a missing domain', () => {
    expect(validateContact({ ...valid, email: 'laura' }).email).toContain('@')
    expect(isEmail('laura@gmail.com')).toBe(true)
    expect(isEmail('laura@gmail')).toBe(false)
    expect(isEmail(42)).toBe(false)
  })
})
