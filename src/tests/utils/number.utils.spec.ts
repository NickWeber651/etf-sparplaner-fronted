/**
 * === NUMBER UTILS TESTS ===
 */

import { describe, it, expect } from 'vitest'
import { clamp, formatEuro, formatPercent, roundTo } from '@/utils/number.utils'

describe('number.utils', () => {
  describe('clamp', () => {
    it('sollte Wert im Bereich unverändert lassen', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })

    it('sollte zu niedrigen Wert auf Minimum begrenzen', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(-100, 25, 1000)).toBe(25)
    })

    it('sollte zu hohen Wert auf Maximum begrenzen', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(5000, 25, 1000)).toBe(1000)
    })

    it('sollte mit negativen Bereichen funktionieren', () => {
      expect(clamp(-5, -10, 0)).toBe(-5)
      expect(clamp(-15, -10, 0)).toBe(-10)
      expect(clamp(5, -10, 0)).toBe(0)
    })
  })

  describe('formatEuro', () => {
    it('sollte Betrag als Euro formatieren', () => {
      expect(formatEuro(1234.56)).toBe('1.234,56\u00A0€')
      expect(formatEuro(100)).toBe('100,00\u00A0€')
      expect(formatEuro(0)).toBe('0,00\u00A0€')
    })

    it('sollte große Beträge korrekt formatieren', () => {
      expect(formatEuro(1000000)).toBe('1.000.000,00\u00A0€')
    })

    it('sollte negative Beträge korrekt formatieren', () => {
      expect(formatEuro(-500.25)).toBe('-500,25\u00A0€')
    })
  })

  describe('formatPercent', () => {
    it('sollte Dezimalwert als Prozent formatieren', () => {
      expect(formatPercent(0.07)).toBe('7,00 %')
      expect(formatPercent(0.15)).toBe('15,00 %')
      expect(formatPercent(1)).toBe('100,00 %')
    })

    it('sollte Nachkommastellen beachten', () => {
      expect(formatPercent(0.07, 1)).toBe('7,0 %')
      expect(formatPercent(0.07, 3)).toBe('7,000 %')
    })

    it('sollte negative Werte korrekt formatieren', () => {
      expect(formatPercent(-0.05)).toBe('-5,00 %')
    })
  })

  describe('roundTo', () => {
    it('sollte auf 2 Nachkommastellen runden (default)', () => {
      expect(roundTo(1.234)).toBe(1.23)
      expect(roundTo(1.235)).toBe(1.24)
      expect(roundTo(1.239)).toBe(1.24)
    })

    it('sollte auf angegebene Nachkommastellen runden', () => {
      expect(roundTo(1.2345, 3)).toBe(1.235)
      expect(roundTo(1.2345, 1)).toBe(1.2)
      expect(roundTo(1.2345, 0)).toBe(1)
    })

    it('sollte mit negativen Zahlen funktionieren', () => {
      expect(roundTo(-1.235)).toBe(-1.24)
    })
  })
})

