/**
 * === SPARPLAN CALCULATIONS TESTS ===
 */

import { describe, it, expect } from 'vitest'
import {
  calculateEndkapital,
  calculateGewinn,
  createScenario,
  calculateScenarios,
} from '@/utils/sparplan.calculations'

describe('sparplan.calculations', () => {
  describe('calculateEndkapital', () => {
    it('sollte Endkapital bei 0% Rendite berechnen', () => {
      // 200€ * 12 Monate * 15 Jahre = 36.000€
      const result = calculateEndkapital(200, 15, 0)
      expect(result).toBe(36000)
    })

    it('sollte Endkapital mit Rendite berechnen', () => {
      // Mit 7% Rendite sollte es deutlich mehr sein als 36.000€
      const result = calculateEndkapital(200, 15, 0.07)
      expect(result).toBeGreaterThan(36000)
      expect(result).toBeCloseTo(63392.46, 1) // Tatsächlicher berechneter Wert
    })

    it('sollte mit verschiedenen Raten funktionieren', () => {
      const result1 = calculateEndkapital(100, 10, 0.05)
      const result2 = calculateEndkapital(200, 10, 0.05)
      expect(result2).toBeCloseTo(result1 * 2, 0)
    })

    it('sollte auf 2 Nachkommastellen runden', () => {
      const result = calculateEndkapital(100, 10, 0.05)
      expect(result).toBe(Math.round(result * 100) / 100)
    })
  })

  describe('calculateGewinn', () => {
    it('sollte Gewinn korrekt berechnen', () => {
      const monthlyRate = 200
      const years = 15
      const endkapital = 63225.75

      // Eingezahlt: 200 * 12 * 15 = 36.000€
      // Gewinn: 63.225,75 - 36.000 = 27.225,75€
      const gewinn = calculateGewinn(monthlyRate, years, endkapital)
      expect(gewinn).toBeCloseTo(27225.75, 2)
    })

    it('sollte bei 0% Rendite 0 Gewinn ergeben', () => {
      const monthlyRate = 200
      const years = 15
      const endkapital = monthlyRate * 12 * years

      const gewinn = calculateGewinn(monthlyRate, years, endkapital)
      expect(gewinn).toBe(0)
    })

    it('sollte auf 2 Nachkommastellen runden', () => {
      const gewinn = calculateGewinn(100, 10, 15555.555)
      expect(gewinn).toBe(Math.round((15555.555 - 12000) * 100) / 100)
    })
  })

  describe('createScenario', () => {
    it('sollte Szenario-Objekt erstellen', () => {
      const scenario = createScenario('Test', 200, 15, 0.07)

      expect(scenario).toHaveProperty('label', 'Test')
      expect(scenario).toHaveProperty('rendite', 0.07)
      expect(scenario).toHaveProperty('endkapital')
      expect(scenario).toHaveProperty('gewinn')
      expect(scenario.endkapital).toBeGreaterThan(0)
      expect(scenario.gewinn).toBeGreaterThan(0)
    })
  })

  describe('calculateScenarios', () => {
    it('sollte 3 Szenarien erstellen', () => {
      const scenarios = calculateScenarios(200, 15)
      expect(scenarios).toHaveLength(3)
    })

    it('sollte Pessimistisch, Realistisch, Optimistisch enthalten', () => {
      const scenarios = calculateScenarios(200, 15)

      expect(scenarios[0]!.label).toBe('Pessimistisch')
      expect(scenarios[1]!.label).toBe('Realistisch')
      expect(scenarios[2]!.label).toBe('Optimistisch')
    })

    it('sollte aufsteigende Renditen haben', () => {
      const scenarios = calculateScenarios(200, 15)

      expect(scenarios[0]!.rendite).toBeLessThan(scenarios[1]!.rendite)
      expect(scenarios[1]!.rendite).toBeLessThan(scenarios[2]!.rendite)
    })

    it('sollte aufsteigende Endkapitalien haben', () => {
      const scenarios = calculateScenarios(200, 15)

      expect(scenarios[0]!.endkapital).toBeLessThan(scenarios[1]!.endkapital)
      expect(scenarios[1]!.endkapital).toBeLessThan(scenarios[2]!.endkapital)
    })

    it('sollte benutzerdefinierte Basis-Rendite nutzen', () => {
      const scenarios = calculateScenarios(200, 15, 0.10)

      expect(scenarios[1]!.rendite).toBe(0.10) // Realistisch = Basis
      expect(scenarios[0]!.rendite).toBe(0.07) // Pessimistisch = Basis - 0.03
      expect(scenarios[2]!.rendite).toBe(0.13) // Optimistisch = Basis + 0.03
    })
  })
})

