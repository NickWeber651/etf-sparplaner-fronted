/**
 * === LOCAL STORAGE COMPOSABLE ===
 * Wiederverwendbare Logik für localStorage-Operationen
 */

import { ref, watch } from 'vue'

/**
 * Composable für typsichere localStorage-Operationen
 *
 * @param key - localStorage-Key
 * @param defaultValue - Standard-Wert wenn nichts gespeichert ist
 * @returns Reaktive Ref die automatisch in localStorage persistiert wird
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue)

  /**
   * Lädt Daten aus localStorage
   */
  function load() {
    try {
      const stored = localStorage.getItem(key)

      if (stored) {
        data.value = JSON.parse(stored) as T
      }
    } catch (error) {
      console.warn(`Fehler beim Laden von localStorage key "${key}":`, error)
      data.value = defaultValue
    }
  }

  /**
   * Speichert Daten in localStorage
   */
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.warn(`Fehler beim Speichern in localStorage key "${key}":`, error)
    }
  }

  /**
   * Löscht Daten aus localStorage
   */
  function remove() {
    try {
      localStorage.removeItem(key)
      data.value = defaultValue
    } catch (error) {
      console.warn(`Fehler beim Löschen von localStorage key "${key}":`, error)
    }
  }

  // Initial laden
  load()

  // Automatisch speichern bei Änderungen
  watch(data, save, { deep: true })

  return {
    data,
    save,
    load,
    remove,
  }
}

/**
 * Composable für Haltejahre-Verwaltung (spezifisch für Sparplan)
 *
 * @returns Funktionen zum Verwalten von Haltejahren pro Sparplan-ID
 */
export function useHoldYears() {
  const STORAGE_KEY = 'sparplan_hold_years_v1'
  const { data: holdYears, remove: clearHoldYears } = useLocalStorage<Record<number, number>>(STORAGE_KEY, {})

  /**
   * Holt Haltejahre für einen Sparplan
   */
  function getHoldYears(planId: number): number {
    return holdYears.value[planId] ?? 0
  }

  /**
   * Setzt Haltejahre für einen Sparplan
   */
  function setHoldYears(planId: number, years: number) {
    const clamped = Math.min(60, Math.max(0, years))
    holdYears.value = {
      ...holdYears.value,
      [planId]: clamped,
    }
  }

  /**
   * Löscht Haltejahre für einen Sparplan
   */
  function removeHoldYears(planId: number) {
    const { [planId]: _removed, ...rest } = holdYears.value
    holdYears.value = rest
  }

  return {
    getHoldYears,
    setHoldYears,
    removeHoldYears,
    clearHoldYears,
  }
}

