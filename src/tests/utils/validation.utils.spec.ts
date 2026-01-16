/**
 * === VALIDATION UTILS TESTS ===
 */

import { describe, it, expect } from 'vitest'
import {
  validateEmailLength,
  validatePasswordLength,
  validateEtfName,
  validateAmount,
  validateDuration,
  isValidSparrate,
  isValidLaufzeit,
  VALIDATION_LIMITS,
} from '@/utils/validation.utils'

describe('validation.utils', () => {
  describe('validateEmailLength', () => {
    it('sollte gültige E-Mail akzeptieren', () => {
      expect(() => validateEmailLength('test@example.com')).not.toThrow()
      expect(() => validateEmailLength('a@b.c')).not.toThrow()
    })

    it('sollte leere E-Mail ablehnen', () => {
      expect(() => validateEmailLength('')).toThrow('darf nicht leer sein')
      expect(() => validateEmailLength('   ')).toThrow('darf nicht leer sein')
    })

    it('sollte zu lange E-Mail ablehnen', () => {
      const longEmail = 'a'.repeat(255) + '@test.com'
      expect(() => validateEmailLength(longEmail)).toThrow('zu lang')
    })

    it('sollte benutzerdefinierten Kontext nutzen', () => {
      expect(() => validateEmailLength('', 'Ihre E-Mail')).toThrow('Ihre E-Mail darf nicht leer sein')
    })
  })

  describe('validatePasswordLength', () => {
    it('sollte gültiges Passwort akzeptieren', () => {
      expect(() => validatePasswordLength('password123')).not.toThrow()
      expect(() => validatePasswordLength('a')).not.toThrow()
    })

    it('sollte leeres Passwort ablehnen', () => {
      expect(() => validatePasswordLength('')).toThrow('darf nicht leer sein')
    })

    it('sollte zu langes Passwort ablehnen', () => {
      const longPassword = 'a'.repeat(VALIDATION_LIMITS.PASSWORD_MAX_LENGTH + 1)
      expect(() => validatePasswordLength(longPassword)).toThrow('zu lang')
    })
  })

  describe('validateEtfName', () => {
    it('sollte gültigen ETF-Namen akzeptieren', () => {
      expect(() => validateEtfName('S&P 500')).not.toThrow()
      expect(() => validateEtfName('MSCI World')).not.toThrow()
    })

    it('sollte leeren Namen ablehnen', () => {
      expect(() => validateEtfName('')).toThrow('darf nicht leer sein')
    })

    it('sollte zu langen Namen ablehnen', () => {
      const longName = 'a'.repeat(VALIDATION_LIMITS.ETF_NAME_MAX_LENGTH + 1)
      expect(() => validateEtfName(longName)).toThrow('zu lang')
    })
  })

  describe('validateAmount', () => {
    it('sollte gültige Beträge akzeptieren', () => {
      expect(() => validateAmount('100')).not.toThrow()
      expect(() => validateAmount('100.50')).not.toThrow()
      expect(() => validateAmount('100,50')).not.toThrow()
      expect(() => validateAmount(100)).not.toThrow()
    })

    it('sollte leeren Betrag ablehnen', () => {
      expect(() => validateAmount('')).toThrow('darf nicht leer sein')
    })

    it('sollte ungültiges Format ablehnen', () => {
      expect(() => validateAmount('abc')).toThrow('gültige Zahl')
      expect(() => validateAmount('100.123')).toThrow('max. 2 Dezimalstellen')
    })

    it('sollte negative Beträge ablehnen', () => {
      expect(() => validateAmount('-100')).toThrow('positive Zahl')
    })
  })

  describe('validateDuration', () => {
    it('sollte gültige Laufzeit akzeptieren', () => {
      expect(() => validateDuration(10)).not.toThrow()
      expect(() => validateDuration(1)).not.toThrow()
      expect(() => validateDuration(50)).not.toThrow()
    })

    it('sollte null oder negative Laufzeit ablehnen', () => {
      expect(() => validateDuration(0)).toThrow('positive Zahl')
      expect(() => validateDuration(-5)).toThrow('positive Zahl')
    })

    it('sollte zu lange Laufzeit ablehnen', () => {
      expect(() => validateDuration(100)).toThrow('zu groß')
    })
  })

  describe('isValidSparrate', () => {
    it('sollte gültige Sparraten erkennen', () => {
      expect(isValidSparrate(25)).toBe(true)
      expect(isValidSparrate(100)).toBe(true)
      expect(isValidSparrate(10000)).toBe(true)
    })

    it('sollte ungültige Sparraten erkennen', () => {
      expect(isValidSparrate(24)).toBe(false)
      expect(isValidSparrate(10001)).toBe(false)
      expect(isValidSparrate(0)).toBe(false)
    })
  })

  describe('isValidLaufzeit', () => {
    it('sollte gültige Laufzeiten erkennen', () => {
      expect(isValidLaufzeit(1)).toBe(true)
      expect(isValidLaufzeit(25)).toBe(true)
      expect(isValidLaufzeit(50)).toBe(true)
    })

    it('sollte ungültige Laufzeiten erkennen', () => {
      expect(isValidLaufzeit(0)).toBe(false)
      expect(isValidLaufzeit(51)).toBe(false)
      expect(isValidLaufzeit(-5)).toBe(false)
    })
  })
})

