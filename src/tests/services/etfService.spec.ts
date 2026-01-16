/**
 * ETF SERVICE TESTS
 * Unit-Tests für etfService.ts
 */

import { describe, it, expect } from 'vitest'
import {
  getAllEtfs,
  getEtfBasicList,
  findEtfById,
  findEtfByName,
  findEtfByIsin,
  findEtfByInput,
  normalizeEtfName,
  getRankTextByVolatility,
  getRankTextByDrawdown,
} from '@/services/etfService'

describe('etfService', () => {
  describe('getAllEtfs', () => {
    it('sollte alle ETFs zurückgeben', () => {
      const etfs = getAllEtfs()
      expect(etfs).toHaveLength(3)
      expect(etfs[0]?.name).toBe('S&P 500')
      expect(etfs[1]?.name).toBe('MSCI World')
      expect(etfs[2]?.name).toBe('FTSE All-World')
    })
  })

  describe('getEtfBasicList', () => {
    it('sollte vereinfachte ETF-Liste zurückgeben', () => {
      const list = getEtfBasicList()
      expect(list).toHaveLength(3)
      expect(list[0]).toHaveProperty('id')
      expect(list[0]).toHaveProperty('name')
      expect(list[0]).toHaveProperty('isin')
      expect(list[0]).toHaveProperty('ter')
      expect(list[0]).not.toHaveProperty('volatility1y')
    })
  })

  describe('findEtfById', () => {
    it('sollte ETF mit existierender ID finden', () => {
      const etf = findEtfById(1)
      expect(etf).not.toBeNull()
      expect(etf?.name).toBe('S&P 500')
    })

    it('sollte null für nicht existierende ID zurückgeben', () => {
      const etf = findEtfById(999)
      expect(etf).toBeNull()
    })
  })

  describe('findEtfByName', () => {
    it('sollte ETF mit exaktem Namen finden', () => {
      const etf = findEtfByName('MSCI World')
      expect(etf).not.toBeNull()
      expect(etf?.id).toBe(2)
    })

    it('sollte ETF case-insensitive finden', () => {
      const etf = findEtfByName('msci world')
      expect(etf).not.toBeNull()
      expect(etf?.id).toBe(2)
    })

    it('sollte ETF mit extra Whitespace finden', () => {
      const etf = findEtfByName('  MSCI  World  ')
      expect(etf).not.toBeNull()
      expect(etf?.id).toBe(2)
    })

    it('sollte null für nicht existierenden Namen zurückgeben', () => {
      const etf = findEtfByName('DAX')
      expect(etf).toBeNull()
    })
  })

  describe('findEtfByIsin', () => {
    it('sollte ETF mit ISIN finden', () => {
      const etf = findEtfByIsin('IE00B5BMR087')
      expect(etf).not.toBeNull()
      expect(etf?.name).toBe('S&P 500')
    })

    it('sollte ETF case-insensitive finden', () => {
      const etf = findEtfByIsin('ie00b5bmr087')
      expect(etf).not.toBeNull()
      expect(etf?.name).toBe('S&P 500')
    })

    it('sollte null für ungültige ISIN zurückgeben', () => {
      const etf = findEtfByIsin('INVALID')
      expect(etf).toBeNull()
    })
  })

  describe('findEtfByInput', () => {
    it('sollte ETF durch exakten Namen finden', () => {
      const etf = findEtfByInput('S&P 500')
      expect(etf).not.toBeNull()
      expect(etf?.id).toBe(1)
    })

    it('sollte ETF durch ISIN finden', () => {
      const etf = findEtfByInput('IE00B4L5Y983')
      expect(etf).not.toBeNull()
      expect(etf?.name).toBe('MSCI World')
    })

    it('sollte ETF durch Namen mit TER-Info finden', () => {
      const etf = findEtfByInput('MSCI World (TER: 0.20%)')
      expect(etf).not.toBeNull()
      expect(etf?.id).toBe(2)
    })

    it('sollte ETF durch Teil des Namens finden', () => {
      const etf = findEtfByInput('Der MSCI World ist toll')
      expect(etf).not.toBeNull()
      expect(etf?.id).toBe(2)
    })

    it('sollte ETF durch ISIN im Text finden', () => {
      const etf = findEtfByInput('Mein Favorit: IE00B3RBWM25')
      expect(etf).not.toBeNull()
      expect(etf?.name).toBe('FTSE All-World')
    })

    it('sollte null für leeren Input zurückgeben', () => {
      const etf = findEtfByInput('')
      expect(etf).toBeNull()
    })

    it('sollte null für nicht matchenden Input zurückgeben', () => {
      const etf = findEtfByInput('DAX 40')
      expect(etf).toBeNull()
    })
  })

  describe('normalizeEtfName', () => {
    it('sollte TER-Information entfernen', () => {
      const name = normalizeEtfName('S&P 500 (TER: 0.07%)')
      expect(name).toBe('S&P 500')
    })

    it('sollte Whitespace trimmen', () => {
      const name = normalizeEtfName('  MSCI World  ')
      expect(name).toBe('MSCI World')
    })

    it('sollte Namen ohne TER unverändert lassen', () => {
      const name = normalizeEtfName('FTSE All-World')
      expect(name).toBe('FTSE All-World')
    })
  })

  describe('getRankTextByVolatility', () => {
    it('sollte "am stabilsten" für niedrigste Volatilität zurückgeben', () => {
      const text = getRankTextByVolatility(2) // MSCI World: 15.5%
      expect(text).toContain('am stabilsten')
    })

    it('sollte "am volatilsten" für höchste Volatilität zurückgeben', () => {
      const text = getRankTextByVolatility(1) // S&P 500: 17.0%
      expect(text).toContain('am volatilsten')
    })

    it('sollte "mittlere" für mittlere Volatilität zurückgeben', () => {
      const text = getRankTextByVolatility(3) // FTSE All-World: 16.2%
      expect(text).toContain('mittlere')
    })
  })

  describe('getRankTextByDrawdown', () => {
    it('sollte "geringsten Rückgang" für besten Drawdown zurückgeben', () => {
      const text = getRankTextByDrawdown(2) // MSCI World: -12.5%
      expect(text).toContain('geringsten')
    })

    it('sollte "stärksten Rückgang" für schlechtesten Drawdown zurückgeben', () => {
      const text = getRankTextByDrawdown(1) // S&P 500: -14.0%
      expect(text).toContain('stärksten')
    })

    it('sollte "Mittelfeld" für mittleren Drawdown zurückgeben', () => {
      const text = getRankTextByDrawdown(3) // FTSE All-World: -13.2%
      expect(text).toContain('Mittelfeld')
    })
  })
})

