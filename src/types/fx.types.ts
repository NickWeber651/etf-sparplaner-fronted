/**
 * FX (FOREIGN EXCHANGE) TYPES
 * TypeScript Type-Definitionen für Währungskurs-API
 */

export interface LatestRatesResponse {
  base: string
  date: string
  rates: Record<string, number>
}

