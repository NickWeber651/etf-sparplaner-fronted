// Sparplan Composable

import { ref } from 'vue'
import type { SparplanRequest, SparplanResponse } from '@/types'
import {
  getSparplaene,
  createSparplan,
  updateSparplan,
  deleteSparplan,
} from '@/services/sparplanApi'

export function useSparplan() {
  const sparplaene = ref<SparplanResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = ref(false)

  async function loadSparplaene() {
    loading.value = true
    error.value = null

    try {
      sparplaene.value = await getSparplaene()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Laden der Sparplaene'
      console.error('Fehler beim Laden:', e)
    } finally {
      loading.value = false
    }
  }

  async function addSparplan(data: SparplanRequest): Promise<SparplanResponse | null> {
    saving.value = true
    error.value = null

    try {
      const newSparplan = await createSparplan(data)
      sparplaene.value.push(newSparplan)
      return newSparplan
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Erstellen des Sparplans'
      console.error('Fehler beim Erstellen:', e)
      return null
    } finally {
      saving.value = false
    }
  }

  async function editSparplan(id: number, data: SparplanRequest): Promise<boolean> {
    saving.value = true
    error.value = null

    try {
      const updated = await updateSparplan(id, data)
      const index = sparplaene.value.findIndex(p => p.id === id)

      if (index !== -1) {
        sparplaene.value[index] = updated
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Aktualisieren des Sparplans'
      console.error('Fehler beim Aktualisieren:', e)
      return false
    } finally {
      saving.value = false
    }
  }

  async function removeSparplan(id: number): Promise<boolean> {
    saving.value = true
    error.value = null

    try {
      await deleteSparplan(id)
      sparplaene.value = sparplaene.value.filter(p => p.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Loeschen des Sparplans'
      console.error('Fehler beim Loeschen:', e)
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    sparplaene,
    loading,
    error,
    saving,
    loadSparplaene,
    addSparplan,
    editSparplan,
    removeSparplan,
  }
}

