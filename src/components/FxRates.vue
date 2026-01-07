<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { getLatestRates, type LatestRatesResponse } from '../services/fxApi'

const props = withDefaults(
  defineProps<{
    base?: string
    symbols?: string[]
  }>(),
  {
    base: 'EUR',
    symbols: () => ['USD', 'GBP', 'CHF'],
  }
)

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
    // fetch wrapper nutzt kein signal – daher nur "soft" cleanup via Abort für zukünftige Erweiterung
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
</script>

<template>
  <section class="fx">
    <header class="fx-head">
      <h4 class="fx-title">Marktdaten (API): <span class="q">{{ title }}</span></h4>
      <span v-if="data?.date" class="fx-date">Stand: {{ data.date }}</span>
    </header>

    <div v-if="loading" class="hint">Lade Wechselkurse …</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="data" class="grid">
      <div v-for="sym in symbols" :key="sym" class="card">
        <div class="sym">{{ sym }}</div>
        <div class="rate">{{ fmtRate(data.rates[sym]) }}</div>
        <div class="sub">1 {{ data.base }} = {{ fmtRate(data.rates[sym]) }} {{ sym }}</div>
      </div>
    </div>

    <div v-else class="hint">Keine Daten.</div>
  </section>
</template>

<style scoped>
.fx{
  margin-top: 1rem;
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(229,231,235,.12);
  background: rgba(17,24,39,.30);
  color: #e5e7eb;
}
.fx-head{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
  gap:.75rem;
  flex-wrap:wrap;
}
.fx-title{ margin:0; font-size: 1rem; }
.q{ color:#a7f3d0; }
.fx-date{ color:#94a3b8; font-size:.9rem; }
.hint{ color:#9ca3af; margin-top: .5rem; }
.error{ color:#fca5a5; margin-top: .5rem; }

.grid{
  margin-top: .75rem;
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .65rem;
}
.card{
  padding:.7rem .75rem;
  border-radius: 10px;
  background: rgba(229,231,235,.06);
  border: 1px solid rgba(229,231,235,.10);
}
.sym{ font-weight:700; color:#e5e7eb; }
.rate{ font-size: 1.2rem; font-weight:800; color:#93c5fd; margin-top:.2rem; }
.sub{ margin-top:.2rem; font-size:.85rem; color:#cbd5e1; }

@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
}
</style>
