/**
 * FX RATES LOGIC
 * Business Logic für FxRates Component
 */

import { computed, ref, watchEffect } from 'vue'
import { getLatestRates, type LatestRatesResponse } from '@/services/fxApi'

interface FxRatesProps {
  base: string
  symbols: string[]
}

export function useFxRates(props: FxRatesProps) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<LatestRatesResponse | null>(null)

  const title = computed(() => `${props.base} → ${props.symbols.join(', ')}`)

  watchEffect(async (onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => controller.abort())

    loading.value = true
    error.value = null

    try {
      const res = await getLatestRates(props.base, props.symbols)
      data.value = res
    } catch (e) {
      if ((e as any)?.name === 'AbortError') return
      error.value = e instanceof Error ? e.message : 'Fehler beim Laden der Wechselkurse'
      data.value = null
    } finally {
      loading.value = false
    }
  })

  function fmtRate(x?: number) {
    return typeof x === 'number' ? x.toFixed(4) : '—'
  }

  return {
    loading,
    error,
    data,
    title,
    fmtRate,
  }
}

