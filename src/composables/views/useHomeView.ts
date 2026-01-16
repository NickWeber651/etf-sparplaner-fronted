/**
 * HOME VIEW LOGIC
 * Business Logic fuer HomeView
 */

import { ref, computed } from 'vue'
import { createSparplan } from '@/services/sparplanApi'
import {
  getEtfBasicList,
  findEtfByInput,
  getRankTextByVolatility,
  getRankTextByDrawdown
} from '@/services/etfService'
import type { EtfInfo } from '@/types'

export function useHomeView() {
  // ETF-Daten
  const etfs = ref(getEtfBasicList())
  const loadingEtfs = ref(false)
  const errorEtfs = ref<string | null>(null)

  // Szenario State
  const selectedEtf = ref('')
  const selectedEtfRaw = ref('')
  const monthlyRate = ref(200)
  const years = ref(15)

  // Computed
  const selectedEtfInfo = computed<EtfInfo | null>(() => {
    const raw = selectedEtfRaw.value || selectedEtf.value
    return findEtfByInput(raw)
  })

  const showEtfDebug = computed(() => {
    return (selectedEtfRaw.value || selectedEtf.value) && !selectedEtfInfo.value
  })

  // UI Messages
  const isSaving = ref(false)
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const reloadKey = ref(0)

  // Functions
  function rankTextByVol(id: number) {
    return getRankTextByVolatility(id)
  }

  function rankTextByDrawdown(id: number) {
    return getRankTextByDrawdown(id)
  }

  async function handleSubmitPlan(payload: { etf: string; rate: number; years: number }) {
    selectedEtfRaw.value = payload.etf
    selectedEtf.value = payload.etf
    monthlyRate.value = payload.rate
    years.value = payload.years

    errorMessage.value = null
    successMessage.value = null
    isSaving.value = true

    try {
      const selectedEtfObj = etfs.value.find(e => e.name === payload.etf)
      const etfNameFormatted = selectedEtfObj
        ? `${selectedEtfObj.name} (TER: ${(selectedEtfObj.ter * 100).toFixed(2)} %)`
        : payload.etf

      await createSparplan({
        etfName: etfNameFormatted,
        monatlicheRate: payload.rate,
        laufzeitJahre: payload.years,
      })

      successMessage.value = '✅ Sparplan erfolgreich gespeichert!'
      reloadKey.value += 1
      setTimeout(() => (successMessage.value = null), 3000)
    } catch (e) {
      errorMessage.value = e instanceof Error ? e.message : 'Fehler beim Speichern des Sparplans'
    } finally {
      isSaving.value = false
    }
  }

  return {
    etfs,
    loadingEtfs,
    errorEtfs,
    selectedEtf,
    selectedEtfRaw,
    monthlyRate,
    years,
    selectedEtfInfo,
    showEtfDebug,
    isSaving,
    errorMessage,
    successMessage,
    reloadKey,
    rankTextByVol,
    rankTextByDrawdown,
    handleSubmitPlan,
  }
}

