/**
 * === SPARPLAN STORE (PINIA) ===
 * Zentrales State-Management für Sparpläne
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SparplanResponse } from '@/types'
import { useSparplan } from '@/composables'

export const useSparplanStore = defineStore('sparplan', () => {
  // Composable nutzen für Business-Logik
  const {
    sparplaene,
    loading,
    error,
    saving,
    loadSparplaene,
    addSparplan,
    editSparplan,
    removeSparplan,
  } = useSparplan()

  // Zusätzlicher lokaler State
  const reloadKey = ref(0)

  /**
   * Triggert manuelles Neuladen
   */
  async function reload() {
    await loadSparplaene()
    reloadKey.value++
  }

  return {
    // State
    sparplaene,
    loading,
    error,
    saving,
    reloadKey,
    // Actions
    loadSparplaene,
    addSparplan,
    editSparplan,
    removeSparplan,
    reload,
  }
})

