/**
 * MY LIST LOGIC
 * Business Logic für MyList Component
 *
 * Trennung: View (MyList.vue) vs Logik (MyList.logic.ts)
 * - MyList.vue = Template (was der User sieht)
 * - MyList.logic.ts = Code (Berechnungen, State, Functions)
 */

import { ref, onMounted, watch, computed, type Ref } from 'vue'
import type { SparplanResponse, SparplanRequest, EtfInfo } from '@/types'
import {
  getSparplaene,
  deleteSparplan,
  updateSparplan,
} from '@/services/sparplanApi'
import { getAllEtfs, findEtfByInput } from '@/services/etfService'
import { clamp } from '@/utils/number.utils'
import {
  sanitizeNumberInput,
  validateSparplanRequest,
  VALIDATION_LIMITS,
} from '@/utils/validation.utils'
import {
  calculateScenarios,
  formatPercent,
  type Scenario,
  EMPTY_SCENARIO,
} from '@/services/scenarioService'
import {
  loadHoldYears,
  saveHoldYears,
  getHoldYearsForPlan,
  setHoldYearsForPlan,
  removeHoldYearsForPlan,
} from '@/services/storageService'

const HOLD_STORAGE_KEY = 'sparplan_hold_years_v1'

export function useMyList(props: { reloadKey?: number }) {
  // === DATA ===
  const ETF_INFO = getAllEtfs()

  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sparplaene = ref<SparplanResponse[]>([])

  // Inline-Edit State
  const editingId = ref<number | null>(null)
  const savingId = ref<number | null>(null)
  const editForm = ref<SparplanRequest>({
    etfName: '',
    monatlicheRate: 0,
    laufzeitJahre: 0,
  })

  // Inline-Delete-Confirm State
  const confirmDeleteId = ref<number | null>(null)
  const deletingId = ref<number | null>(null)

  // Szenario/Details State
  const expandedId = ref<number | null>(null)

  // Haltejahre (localStorage)
  const holdYearsByPlanId = ref<Record<number, number>>({})

  // === LIFECYCLE ===
  onMounted(() => {
    holdYearsByPlanId.value = loadHoldYears(HOLD_STORAGE_KEY)
    void loadSparplaene()
  })

  watch(
    () => props.reloadKey,
    () => {
      void loadSparplaene()
    }
  )

  // === COMPUTED ===
  const scenariosById = computed<Record<number, Scenario>>(() => {
    const out: Record<number, Scenario> = {}
    for (const p of sparplaene.value) {
      const etf = findEtfInfoByPlanName(p.etfName)
      const holdYears = getHoldYearsForPlan(holdYearsByPlanId.value, p.id)
      out[p.id] = calculateScenarios(etf, p.monatlicheRate, p.laufzeitJahre, holdYears)
    }
    return out
  })

  // === FUNCTIONS ===

  function getScenario(id: number): Scenario {
    return scenariosById.value[id] ?? EMPTY_SCENARIO
  }

  function normalizeEtfNameFromDb(label: string): string {
    const marker = ' (TER'
    const idx = label.indexOf(marker)
    return (idx === -1 ? label : label.slice(0, idx)).trim()
  }

  function findEtfInfoByPlanName(etfNameFromDb: string): EtfInfo | null {
    const clean = normalizeEtfNameFromDb(etfNameFromDb)
    return findEtfByInput(clean)
  }

  function formatDate(iso?: string): string {
    if (!iso) return ''
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('de-DE')
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)
  }

  function getHoldYearsValue(id: number): number {
    return getHoldYearsForPlan(holdYearsByPlanId.value, id)
  }

  function updateHoldYears(id: number, years: number): void {
    // Sanitize Input: verhindere negative Zahlen und extreme Werte
    const sanitized = sanitizeNumberInput(
      years,
      0,
      VALIDATION_LIMITS.REASONABLE_MAX_YEARS,
      0
    )
    holdYearsByPlanId.value = setHoldYearsForPlan(holdYearsByPlanId.value, id, sanitized)
    saveHoldYears(HOLD_STORAGE_KEY, holdYearsByPlanId.value)
  }

  function toggleDetails(id: number): void {
    editingId.value = null
    confirmDeleteId.value = null
    expandedId.value = expandedId.value === id ? null : id
  }

  // === API FUNCTIONS ===

  async function loadSparplaene(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      sparplaene.value = await getSparplaene()
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? (e.message || 'Fehler beim Laden der Sparpläne') : 'Fehler beim Laden der Sparpläne'
    } finally {
      loading.value = false
    }
  }

  // Edit Functions
  function startEdit(p: SparplanResponse): void {
    expandedId.value = null
    confirmDeleteId.value = null
    editingId.value = p.id
    editForm.value = {
      etfName: p.etfName,
      monatlicheRate: p.monatlicheRate,
      laufzeitJahre: p.laufzeitJahre,
    }
  }

  function cancelEdit(): void {
    editingId.value = null
  }

  async function saveEdit(id: number): Promise<void> {
    error.value = null
    savingId.value = id

    try {
      // Sanitize Inputs bevor Validierung
      const sanitizedRate = sanitizeNumberInput(
        editForm.value.monatlicheRate,
        VALIDATION_LIMITS.SPARRATE_MIN,
        VALIDATION_LIMITS.SPARRATE_MAX,
        VALIDATION_LIMITS.SPARRATE_MIN
      )

      const sanitizedYears = sanitizeNumberInput(
        editForm.value.laufzeitJahre,
        VALIDATION_LIMITS.YEARS_MIN,
        VALIDATION_LIMITS.YEARS_MAX,
        VALIDATION_LIMITS.YEARS_MIN
      )

      // Erstelle bereinigtes Request-Objekt
      const sanitizedRequest: SparplanRequest = {
        etfName: editForm.value.etfName,
        monatlicheRate: sanitizedRate,
        laufzeitJahre: sanitizedYears,
      }

      // Validiere kompletten Request
      validateSparplanRequest(sanitizedRequest)

      // Update durchführen
      const updated = await updateSparplan(id, sanitizedRequest)
      sparplaene.value = sparplaene.value.map(p => (p.id === id ? updated : p))
      editingId.value = null
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? (e.message || 'Fehler beim Bearbeiten des Sparplans') : 'Fehler beim Bearbeiten des Sparplans'
    } finally {
      savingId.value = null
    }
  }

  // Delete Functions
  function requestDelete(id: number): void {
    expandedId.value = null
    editingId.value = null
    confirmDeleteId.value = id
  }

  function cancelDelete(): void {
    confirmDeleteId.value = null
  }

  async function confirmDelete(id: number): Promise<void> {
    error.value = null
    deletingId.value = id
    try {
      await deleteSparplan(id)
      sparplaene.value = sparplaene.value.filter((p: SparplanResponse) => p.id !== id)
      confirmDeleteId.value = null

      holdYearsByPlanId.value = removeHoldYearsForPlan(holdYearsByPlanId.value, id)
      saveHoldYears(HOLD_STORAGE_KEY, holdYearsByPlanId.value)

      if (expandedId.value === id) expandedId.value = null
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? (e.message || 'Fehler beim Löschen des Sparplans') : 'Fehler beim Löschen des Sparplans'
    } finally {
      deletingId.value = null
    }
  }

  // === RETURN (Public API) ===
  return {
    // State
    loading,
    error,
    sparplaene,
    editingId,
    savingId,
    editForm,
    confirmDeleteId,
    deletingId,
    expandedId,

    // Functions
    getScenario,
    formatDate,
    formatCurrency,
    formatPercent,
    getHoldYearsValue,
    updateHoldYears,
    toggleDetails,
    loadSparplaene,
    startEdit,
    cancelEdit,
    saveEdit,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}

