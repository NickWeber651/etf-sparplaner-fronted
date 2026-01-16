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
  sanitizeNumberInput,
  validateSparrate,
  validateYears,
  validateSparplanRequest,
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

  describe('sanitizeNumberInput', () => {
    it('sollte gültige Zahlen durchlassen', () => {
      expect(sanitizeNumberInput(100, 0, 200, 50)).toBe(100)
      expect(sanitizeNumberInput('150', 0, 200, 50)).toBe(150)
    })

    it('sollte negative Zahlen auf Minimum clampen', () => {
      expect(sanitizeNumberInput(-100, 0, 200, 50)).toBe(0)
      expect(sanitizeNumberInput('-50', 25, 10000, 100)).toBe(25)
    })

    it('sollte zu große Zahlen auf Maximum clampen', () => {
      expect(sanitizeNumberInput(300, 0, 200, 50)).toBe(200)
      expect(sanitizeNumberInput(99999999, 25, 10000, 100)).toBe(10000)
    })

    it('sollte extreme Werte mit Default ersetzen', () => {
      expect(sanitizeNumberInput(Infinity, 0, 200, 50)).toBe(50)
      expect(sanitizeNumberInput(-Infinity, 0, 200, 50)).toBe(50)
      expect(sanitizeNumberInput(NaN, 0, 200, 50)).toBe(50)
    })

    it('sollte extrem große Zahlen abfangen', () => {
      const hugeNumber = '9999999999999999999999999999'
      expect(sanitizeNumberInput(hugeNumber, 25, 10000, 200)).toBe(200)
    })

    it('sollte null und undefined behandeln', () => {
      // null/undefined gibt defaultValue zurück
      expect(sanitizeNumberInput(null, 0, 200, 50)).toBe(50)
      expect(sanitizeNumberInput(undefined, 0, 200, 50)).toBe(50)
      // Auch mit anderen defaults
      expect(sanitizeNumberInput(null, 25, 200, 100)).toBe(100)
      expect(sanitizeNumberInput(undefined, 25, 200, 100)).toBe(100)
    })
  })

  describe('validateSparrate', () => {
    it('sollte gültige Sparraten akzeptieren', () => {
      expect(validateSparrate(25, false)).toBe(true)
      expect(validateSparrate(100, false)).toBe(true)
      expect(validateSparrate(10000, false)).toBe(true)
    })

    it('sollte negative Sparraten ablehnen', () => {
      expect(validateSparrate(-100, false)).toBe(false)
      expect(() => validateSparrate(-100, true)).toThrow('negativ')
    })

    it('sollte zu kleine Sparraten ablehnen', () => {
      expect(validateSparrate(10, false)).toBe(false)
      expect(() => validateSparrate(10, true)).toThrow('mindestens 25')
    })

    it('sollte zu große Sparraten ablehnen', () => {
      expect(validateSparrate(20000, false)).toBe(false)
      expect(() => validateSparrate(20000, true)).toThrow('maximal')
    })

    it('sollte unrealistische Werte ablehnen', () => {
      expect(validateSparrate(9999999999, false)).toBe(false)
      expect(() => validateSparrate(9999999999, true)).toThrow('unrealistisch')
    })

    it('sollte ungültige Typen ablehnen', () => {
      expect(validateSparrate(NaN, false)).toBe(false)
      expect(validateSparrate(Infinity, false)).toBe(false)
      expect(() => validateSparrate('abc', true)).toThrow('gültige Zahl')
    })
  })

  describe('validateYears', () => {
    it('sollte gültige Laufzeiten akzeptieren', () => {
      expect(validateYears(1, false)).toBe(true)
      expect(validateYears(25, false)).toBe(true)
      expect(validateYears(50, false)).toBe(true)
    })

    it('sollte negative Laufzeiten ablehnen', () => {
      expect(validateYears(-5, false)).toBe(false)
      expect(() => validateYears(-5, true)).toThrow('negativ')
    })

    it('sollte zu kleine Laufzeiten ablehnen', () => {
      expect(validateYears(0, false)).toBe(false)
      expect(() => validateYears(0, true)).toThrow('mindestens 1')
    })

    it('sollte zu große Laufzeiten ablehnen', () => {
      expect(validateYears(60, false)).toBe(false)
      expect(() => validateYears(60, true)).toThrow('maximal')
    })

    it('sollte unrealistische Werte ablehnen', () => {
      expect(validateYears(500, false)).toBe(false)
      expect(() => validateYears(500, true)).toThrow('unrealistisch')
    })
  })

  describe('validateSparplanRequest', () => {
    it('sollte gültigen Sparplan akzeptieren', () => {
      expect(() => validateSparplanRequest({
        etfName: 'S&P 500',
        monatlicheRate: 200,
        laufzeitJahre: 15,
      })).not.toThrow()
    })

    it('sollte fehlenden ETF-Namen ablehnen', () => {
      expect(() => validateSparplanRequest({
        etfName: '',
        monatlicheRate: 200,
        laufzeitJahre: 15,
      })).toThrow('ETF')
    })

    it('sollte ungültige Sparrate ablehnen', () => {
      expect(() => validateSparplanRequest({
        etfName: 'S&P 500',
        monatlicheRate: -200,
        laufzeitJahre: 15,
      })).toThrow()
    })

    it('sollte ungültige Laufzeit ablehnen', () => {
      expect(() => validateSparplanRequest({
        etfName: 'S&P 500',
        monatlicheRate: 200,
        laufzeitJahre: 100,
      })).toThrow()
    })
  })
})


