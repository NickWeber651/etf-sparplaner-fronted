/**
 * LOCAL STORAGE SERVICE
 * Business Logic für LocalStorage-Operationen
 *
 * Diese Logik war zuvor in Components verteilt - jetzt zentralisiert
 */

import { clamp } from '@/utils/number.utils'

/**
 * Lädt Halte-Jahre aus dem LocalStorage
 */
export function loadHoldYears(storageKey: string): Record<number, number> {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return {}

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const clean: Record<number, number> = {}

    for (const [k, v] of Object.entries(parsed)) {
      const id = Number(k)
      const years = typeof v === 'number' ? v : Number(v)
      if (Number.isFinite(id) && Number.isFinite(years)) {
        clean[id] = clamp(years, 0, 60)
      }
    }

    return clean
  } catch {
    return {}
  }
}

/**
 * Speichert Halte-Jahre im LocalStorage
 */
export function saveHoldYears(storageKey: string, data: Record<number, number>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // Fehler ignorieren (z.B. wenn LocalStorage voll ist)
  }
}

/**
 * Holt die Halte-Jahre für eine bestimmte Plan-ID
 */
export function getHoldYearsForPlan(data: Record<number, number>, planId: number): number {
  return data[planId] ?? 0
}

/**
 * Setzt die Halte-Jahre für eine bestimmte Plan-ID
 */
export function setHoldYearsForPlan(
  data: Record<number, number>,
  planId: number,
  years: number
): Record<number, number> {
  return {
    ...data,
    [planId]: clamp(years, 0, 60),
  }
}

/**
 * Entfernt die Halte-Jahre für eine bestimmte Plan-ID
 */
export function removeHoldYearsForPlan(
  data: Record<number, number>,
  planId: number
): Record<number, number> {
  const { [planId]: _removed, ...rest } = data
  return rest
}

