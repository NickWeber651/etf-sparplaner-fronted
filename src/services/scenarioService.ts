/**
 * SPARPLAN SCENARIO SERVICE
 * Business Logic für Sparplan-Szenario-Berechnungen
 *
 * Diese Logik war zuvor in MyList.vue - jetzt extrahiert und wiederverwendbar
 */

import type { EtfInfo, RiskLabel } from '@/types'

export interface Scenario {
  etf: EtfInfo | null
  paidIn: number
  holdYears: number
  worst: number
  base: number
  best: number
  endWorst: number
  endBase: number
  endBest: number
  drawdownHint: number | null
}

export const EMPTY_SCENARIO: Scenario = {
  etf: null,
  paidIn: 0,
  holdYears: 0,
  worst: 0,
  base: 0,
  best: 0,
  endWorst: 0,
  endBase: 0,
  endBest: 0,
  drawdownHint: null,
}

/**
 * Berechnet die Basis-Rendite basierend auf dem Risiko-Label
 */
export function baseReturnByRiskLabel(riskLabel?: RiskLabel): number {
  if (riskLabel === 'niedrig') return 0.04
  if (riskLabel === 'hoch') return 0.08
  return 0.06 // mittel
}

/**
 * Konvertiert jährliche Rendite in monatliche Rendite
 */
export function monthlyRateFromAnnual(annualReturn: number): number {
  return Math.pow(1 + annualReturn, 1 / 12) - 1
}

/**
 * Berechnet den zukünftigen Wert eines monatlichen Sparplans
 * @param pmt - Monatliche Sparrate
 * @param years - Laufzeit in Jahren
 * @param annualReturn - Jährliche Rendite
 */
export function futureValueMonthly(pmt: number, years: number, annualReturn: number): number {
  const n = Math.round(years * 12)
  if (n <= 0) return 0

  const r = monthlyRateFromAnnual(annualReturn)
  if (Math.abs(r) < 1e-12) return pmt * n

  return pmt * ((Math.pow(1 + r, n) - 1) / r)
}

/**
 * Lässt einen Wert über eine bestimmte Anzahl von Monaten wachsen
 */
export function growForMonths(value: number, annualReturn: number, months: number): number {
  if (months <= 0) return value
  const r = monthlyRateFromAnnual(annualReturn)
  return value * Math.pow(1 + r, months)
}

/**
 * Formatiert einen Dezimalwert als Prozent (z.B. 0.06 → "6.0% p.a.")
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}% p.a.`
}

/**
 * Berechnet alle Szenarien für einen Sparplan
 */
export function calculateScenarios(
  etf: EtfInfo | null,
  monthlyRate: number,
  years: number,
  holdYears: number
): Scenario {
  const base = baseReturnByRiskLabel(etf?.riskLabel)
  const worst = Math.max(0, base - 0.03)
  const best = base + 0.03

  const paidIn = monthlyRate * 12 * years
  const holdMonths = Math.round(holdYears * 12)

  const endWorstAfterSaving = futureValueMonthly(monthlyRate, years, worst)
  const endBaseAfterSaving = futureValueMonthly(monthlyRate, years, base)
  const endBestAfterSaving = futureValueMonthly(monthlyRate, years, best)

  const endWorst = growForMonths(endWorstAfterSaving, worst, holdMonths)
  const endBase = growForMonths(endBaseAfterSaving, base, holdMonths)
  const endBest = growForMonths(endBestAfterSaving, best, holdMonths)

  const drawdownHint = etf?.maxDrawdown1y != null
    ? endBase * (1 + etf.maxDrawdown1y / 100)
    : null

  return {
    etf,
    paidIn,
    holdYears,
    worst,
    base,
    best,
    endWorst,
    endBase,
    endBest,
    drawdownHint,
  }
}

