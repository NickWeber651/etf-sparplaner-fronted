<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { searchNews, type NewsItem } from '../services/newsApi'

const props = defineProps<{
  etfName: string
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const items = ref<NewsItem[]>([])

const primaryQuery = computed(() => {
  const raw = (props.etfName ?? '').trim()
  const n = raw.toLowerCase()

  // bessere, "news-taugliche" Suchbegriffe
  if (!raw) return 'ETF'

  if (n.includes('s&p')) return 'S&P 500 ETF'
  if (n.includes('msci world')) return 'MSCI World ETF'
  if (n.includes('msci')) return 'MSCI ETF'
  if (n.includes('ftse all-world') || n.includes('all-world')) return 'FTSE All-World ETF'

  // default: ETF hinten dran macht fast immer besser
  return `${raw} ETF`
})

const shownQuery = ref('') // nur Anzeige im UI

watchEffect(async () => {
  const q1 = primaryQuery.value.trim()
  if (!q1) {
    items.value = []
    return
  }

  // Request "Token", damit alte Requests nicht neuere überschreiben
  const token = Symbol('req')
  ;(watchEffect as any)._lastToken = token

  loading.value = true
  error.value = null
  shownQuery.value = q1

  try {
    let result = await searchNews(q1, 5)

    // Fallback: wenn 0 Treffer → allgemeine ETF-News statt "nichts gefunden"
    if (!result || result.length === 0) {
      const q2 = 'ETF'
      shownQuery.value = q2
      result = await searchNews(q2, 5)
    }

    // nur setzen, wenn das noch der aktuellste Request ist
    if ((watchEffect as any)._lastToken === token) {
      items.value = result ?? []
    }
  } catch (e) {
    if ((watchEffect as any)._lastToken === token) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Laden der News'
      items.value = []
    }
  } finally {
    if ((watchEffect as any)._lastToken === token) {
      loading.value = false
    }
  }
})

function fmtDate(unixSeconds: number) {
  if (!unixSeconds) return ''
  const d = new Date(unixSeconds * 1000)
  return d.toLocaleDateString('de-DE')
}
</script>

<template>
  <div class="news">
    <div class="news-head">
      <h4 class="news-title">
        Aktuelle News zu: <span class="q">{{ shownQuery || primaryQuery }}</span>
      </h4>
    </div>

    <div v-if="loading" class="hint">Lade News …</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ul v-else class="news-list">
      <li v-if="items.length === 0" class="hint">
        Keine Headlines gefunden (auch nicht im Fallback).
      </li>

      <li v-for="n in items" :key="n.id" class="news-item">
        <a v-if="n.url" class="link" :href="n.url" target="_blank" rel="noreferrer">
          {{ n.title }}
        </a>
        <span v-else class="no-link">{{ n.title }}</span>

        <div class="meta">
          <span>{{ fmtDate(n.time) }}</span>
          <span class="dot">•</span>
          <span>by {{ n.by }}</span>
          <span v-if="n.score != null" class="dot">•</span>
          <span v-if="n.score != null">{{ n.score }} points</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.news{
  margin-top: 1rem;
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(229,231,235,.12);
  background: rgba(17,24,39,.30);
  color: #e5e7eb;
}
.news-title{ margin:0; font-size: 1rem; }
.q{ color:#a7f3d0; }
.hint{ color:#9ca3af; margin-top: .5rem; }
.error{ color:#fca5a5; margin-top: .5rem; }
.news-list{ list-style:none; padding:0; margin:.75rem 0 0; display:grid; gap:.65rem; }
.news-item{ padding:.55rem .6rem; border-radius: 10px; background: rgba(229,231,235,.06); border: 1px solid rgba(229,231,235,.10); }
.link{ color:#93c5fd; text-decoration:none; }
.link:hover{ text-decoration:underline; }
.no-link{ color:#e5e7eb; }
.meta{ margin-top:.25rem; font-size:.85rem; color:#cbd5e1; display:flex; flex-wrap:wrap; gap:.35rem; }
.dot{ opacity:.6; }
</style>
