/**
 * === NUMBER UTILITIES ===
 * Hilfsfunktionen für numerische Operationen
 */

/**
 * Begrenzt eine Zahl auf einen Min/Max-Bereich
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Formatiert eine Zahl als Euro-Währung
 */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formatiert eine Zahl als Prozent
 */
export function formatPercent(value: number, decimals = 2): string {
  const formatted = (value * 100).toFixed(decimals).replace('.', ',')
  return `${formatted} %`
}

/**
 * Rundet eine Zahl auf n Nachkommastellen
 */
export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

