/**
 * === DATE UTILS TESTS ===
 */

import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime } from '@/utils/date.utils'

describe('date.utils', () => {
  describe('formatDate', () => {
    it('sollte ISO-Datum in deutsches Format konvertieren', () => {
      const isoDate = '2025-12-06T10:30:00Z'
      const result = formatDate(isoDate)

      // Format kann je nach Locale variieren (6.12.2025 oder 06.12.2025)
      expect(result).toMatch(/\d{1,2}\.12\.2025/)
      expect(result).toContain('2025')
    })

    it('sollte leeren String bei undefined zurückgeben', () => {
      expect(formatDate(undefined)).toBe('')
    })

    it('sollte leeren String bei leerem String zurückgeben', () => {
      expect(formatDate('')).toBe('')
    })

    it('sollte Original bei ungültigem Datum zurückgeben', () => {
      const invalid = 'not-a-date'
      expect(formatDate(invalid)).toBe(invalid)
    })
  })

  describe('formatDateTime', () => {
    it('sollte ISO-Datum mit Zeit formatieren', () => {
      const isoDate = '2025-12-06T10:30:00Z'
      const result = formatDateTime(isoDate)

      // Sollte Datum UND Zeit enthalten (Format variiert je nach Locale)
      expect(result).toMatch(/\d{1,2}\.12\.2025/)
      expect(result).toContain('2025')
      // Zeit kann je nach Timezone variieren, aber sollte vorhanden sein
      expect(result.length).toBeGreaterThan(10)
    })

    it('sollte leeren String bei undefined zurückgeben', () => {
      expect(formatDateTime(undefined)).toBe('')
    })

    it('sollte Original bei ungültigem Datum zurückgeben', () => {
      const invalid = 'invalid-datetime'
      expect(formatDateTime(invalid)).toBe(invalid)
    })
  })
})

