/**
 * === DATE UTILITIES ===
 * Hilfsfunktionen für Datumsformatierung
 */

/**
 * Formatiert ISO-Datumsstring in deutsches Format
 * @param isoString - ISO-Datum (z.B. "2025-12-06T10:30:00Z")
 * @returns Formatiertes Datum (z.B. "06.12.2025") oder leerer String
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  // Prüfe ob Datum gültig ist
  if (Number.isNaN(date.getTime())) {
    return isoString // Fallback: Original-String zurückgeben
  }

  return date.toLocaleDateString('de-DE')
}

/**
 * Formatiert ISO-Datumsstring in deutsches Format mit Uhrzeit
 * @param isoString - ISO-Datum
 * @returns Formatiertes Datum mit Zeit (z.B. "06.12.2025, 10:30")
 */
export function formatDateTime(isoString?: string): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  if (Number.isNaN(date.getTime())) {
    return isoString
  }

  return date.toLocaleString('de-DE')
}

