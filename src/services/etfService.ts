/**
 * ETF SERVICE
 * Business Logic für ETF-Operationen
 *
 * Trennung von View und Logik:
 * - Views verwenden diesen Service
 * - Alle ETF-Operationen sind hier zentralisiert
 * - Testbar und wiederverwendbar
 */

import type { EtfInfo, EtfBasic } from '@/types'
import { ETF_DATA } from '@/data/etf.data'

/**
 * Gibt alle verfügbaren ETFs zurück
 */
export function getAllEtfs(): EtfInfo[] {
  return ETF_DATA
}

/**
 * Gibt eine vereinfachte ETF-Liste für Dropdowns zurück
 */
export function getEtfBasicList(): EtfBasic[] {
  return ETF_DATA.map(e => ({
    id: e.id,
    name: e.name,
    isin: e.isin,
    ter: e.ter,
  }))
}

/**
 * Findet einen ETF anhand der ID
 */
export function findEtfById(id: number): EtfInfo | null {
  return ETF_DATA.find(e => e.id === id) ?? null
}

/**
 * Findet einen ETF anhand des Namens (exakte Übereinstimmung)
 */
export function findEtfByName(name: string): EtfInfo | null {
  const normalized = normalizeName(name)
  return ETF_DATA.find(e => normalizeName(e.name) === normalized) ?? null
}

/**
 * Findet einen ETF anhand der ISIN
 */
export function findEtfByIsin(isin: string): EtfInfo | null {
  const normalizedIsin = isin.toUpperCase().trim()
  return ETF_DATA.find(e => e.isin.toUpperCase() === normalizedIsin) ?? null
}

/**
 * Findet einen ETF anhand einer Eingabe (Name oder ISIN)
 * Verwendet mehrere Matching-Strategien
 */
export function findEtfByInput(input: string): EtfInfo | null {
  if (!input) return null

  const key = keyify(input)
  const isin = extractIsin(input)

  // 1. Versuch: Exakter Name-Match
  const byExactName = ETF_DATA.find(e => keyify(e.name) === key)
  if (byExactName) return byExactName

  // 2. Versuch: ISIN-Match
  if (isin) {
    const byIsin = findEtfByIsin(isin)
    if (byIsin) return byIsin
  }

  // 3. Versuch: Name enthält Suchbegriff
  const inputLower = input.toLowerCase()
  const byContainsName = ETF_DATA.find(e => inputLower.includes(e.name.toLowerCase()))
  if (byContainsName) return byContainsName

  // 4. Versuch: ISIN enthält Suchbegriff
  const inputUpper = input.toUpperCase()
  const byContainsIsin = ETF_DATA.find(e => inputUpper.includes(e.isin.toUpperCase()))
  if (byContainsIsin) return byContainsIsin

  return null
}

/**
 * Normalisiert einen ETF-Namen
 * Entfernt TER-Informationen und Whitespace
 */
export function normalizeEtfName(input: string): string {
  const marker = ' (TER'
  const idx = input.indexOf(marker)
  const base = idx === -1 ? input : input.slice(0, idx)
  return base.trim()
}

/**
 * Erstellt einen Ranking-Text basierend auf Volatilität
 */
export function getRankTextByVolatility(id: number): string {
  const sorted = [...ETF_DATA].sort((a, b) => a.volatility1y - b.volatility1y)
  const pos = sorted.findIndex(x => x.id === id)

  if (pos === 0) return 'am stabilsten (niedrigste Volatilität) im Vergleich'
  if (pos === sorted.length - 1) return 'am volatilsten (höchste Volatilität) im Vergleich'
  return 'mittlere Volatilität im Vergleich'
}

/**
 * Erstellt einen Ranking-Text basierend auf Drawdown
 */
export function getRankTextByDrawdown(id: number): string {
  const sorted = [...ETF_DATA].sort((a, b) => b.maxDrawdown1y - a.maxDrawdown1y)
  const pos = sorted.findIndex(x => x.id === id)

  if (pos === 0) return 'hatte den geringsten Rückgang (Drawdown) im Vergleich'
  if (pos === sorted.length - 1) return 'hatte den stärksten Rückgang (Drawdown) im Vergleich'
  return 'liegt beim Drawdown im Mittelfeld'
}

// === PRIVATE HELPER FUNCTIONS ===

/**
 * Normalisiert einen Namen für Vergleiche (lowercase, ohne mehrfache Leerzeichen)
 */
function normalizeName(name: string): string {
  return normalizeEtfName(name)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Erstellt einen Schlüssel für Vergleiche
 */
function keyify(input: string): string {
  return normalizeName(input)
}

/**
 * Extrahiert eine ISIN aus einem String
 * Format: 2 Buchstaben gefolgt von 10 alphanumerischen Zeichen
 */
function extractIsin(input: string): string | null {
  const match = input.toUpperCase().match(/[A-Z]{2}[A-Z0-9]{10}/)
  return match ? match[0] : null
}

