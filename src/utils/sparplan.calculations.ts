/**
 * === SPARPLAN CALCULATION UTILITIES ===
 * Berechnungslogik für Sparplan-Szenarien
 */

import type { Scenario } from '@/types'

/**
 * Berechnet Endkapital eines Sparplans mit monatlicher Verzinsung
 */
export function calculateEndkapital(
  monthlyRate: number,
  years: number,
  annualReturn: number
): number {
  const months = years * 12
  const monthlyReturn = annualReturn / 12

  if (monthlyReturn === 0) {
    return monthlyRate * months
  }

  const endkapital = monthlyRate * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)
  return Math.round(endkapital * 100) / 100
}

/**
 * Berechnet Gewinn (Endkapital - eingezahltes Kapital)
 */
export function calculateGewinn(
  monthlyRate: number,
  years: number,
  endkapital: number
): number {
  const eingezahlt = monthlyRate * years * 12
  return Math.round((endkapital - eingezahlt) * 100) / 100
}

/**
 * Erstellt Szenario-Objekt für eine bestimmte Rendite
 */
export function createScenario(
  label: string,
  monthlyRate: number,
  years: number,
  rendite: number
): Scenario {
  const endkapital = calculateEndkapital(monthlyRate, years, rendite)
  const gewinn = calculateGewinn(monthlyRate, years, endkapital)

  return {
    label,
    rendite,
    endkapital,
    gewinn,
  }
}

/**
 * Berechnet alle Standard-Szenarien
 */
export function calculateScenarios(
  monthlyRate: number,
  years: number,
  baseReturn = 0.07
): Scenario[] {
  return [
    createScenario('Pessimistisch', monthlyRate, years, baseReturn - 0.03),
    createScenario('Realistisch', monthlyRate, years, baseReturn),
    createScenario('Optimistisch', monthlyRate, years, baseReturn + 0.03),
  ]
}

/**
 * Berechnet Szenarien basierend auf ETF-Daten
 */
export function calculateAdvancedScenarios(
  monthlyRate: number,
  years: number,
  volatility: number,
  maxDrawdown: number
): Scenario[] {
  const baseReturn = 0.07
  const pessimistic = Math.abs(maxDrawdown) / 100
  const optimistic = baseReturn + (volatility / 300)

  return [
    createScenario('Pessimistisch', monthlyRate, years, pessimistic),
    createScenario('Realistisch', monthlyRate, years, baseReturn),
    createScenario('Optimistisch', monthlyRate, years, optimistic),
  ]
}

