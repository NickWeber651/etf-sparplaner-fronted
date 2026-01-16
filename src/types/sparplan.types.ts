/**
 * === SPARPLAN TYPE DEFINITIONS ===
 * TypeScript-Definitionen für Sparplan-Daten (Request/Response)
 */

/** Request-Body für neuen Sparplan (POST) */
export interface SparplanRequest {
  etfName: string
  monatlicheRate: number
  laufzeitJahre: number
}

/** Response vom Backend mit ID und Zeitstempel */
export interface SparplanResponse {
  id: number
  etfName: string
  monatlicheRate: number
  laufzeitJahre: number
  erstelltAm: string // ISO-Date-String
}

/** Szenario-Berechnung für einen Sparplan */
export interface Scenario {
  label: string
  rendite: number
  endkapital: number
  gewinn: number
}

