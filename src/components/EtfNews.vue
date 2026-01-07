<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { searchNews, type NewsItem } from '../services/newsApi'

const props = defineProps<{
  etfName: string
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const items = ref<NewsItem[]>([])

// Request-ID gegen Race Conditions
const reqId = ref(0)

/**
 * "News-taugliche" Query
 */
const primaryQuery = computed(() => {
  const raw = (props.etfName ?? '').trim()
  const n = raw.toLowerCase()

  // Wenn "ETF" oder leer reinkommt -> sinnvoller Default
  if (!raw || raw === 'ETF') return 'MSCI World ETF'

  if (n.includes('s&p')) return 'S&P 500 ETF'
  if (n.includes('msci world')) return 'MSCI World ETF'
  if (n.includes('msci')) return 'MSCI ETF'
  if (n.includes('ftse all-world') || n.includes('all-world')) return 'FTSE All-World ETF'

  return `${raw} ETF`
})

const shownQuery = ref('') // nur Anzeige im UI

watchEffect(async () => {
  const myReq = ++reqId.value

  const q1 = primaryQuery.value.trim()
  if (!q1) {
    items.value = []
    shownQuery.value = ''
    return
  }

  loading.value = true
  error.value = null
  shownQuery.value = q1

  try {
    let result = await searchNews(q1, 5)

    // Fallback: wenn 0 Treffer → breite ETF-News
    if (!result || result.length === 0) {
      const q2 = 'ETF investing'
      shownQuery.value = q2
      result = await searchNews(q2, 5)
    }

    // Nur wenn noch aktuell
    if (reqId.value === myReq) {
      items.value = result ?? []
    }
  } catch (e) {
    if (reqId.value === myReq) {
      error.value = e instanceof Error ? e.message : 'Fehler beim Laden der News'
      items.value = []
    }
  } finally {
    if (reqId.value === myReq) {
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
        Keine News gefunden – probiere später erneut.
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
