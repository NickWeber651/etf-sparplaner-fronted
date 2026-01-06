<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { searchNews, type NewsItem } from '../services/newsApi'

const props = defineProps<{
  etfName: string
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const items = ref<NewsItem[]>([])

const query = computed(() => {
  // simple Mapping: bei Bedarf später verfeinern
  const n = props.etfName.toLowerCase()
  if (n.includes('s&p')) return 'S&P 500'
  if (n.includes('msci')) return 'MSCI'
  if (n.includes('all-world')) return 'All-World'
  return props.etfName
})

watchEffect(async () => {
  const q = query.value?.trim()
  if (!q) {
    items.value = []
    return
  }

  loading.value = true
  error.value = null
  try {
    items.value = await searchNews(q, 5)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Fehler beim Laden der News'
    items.value = []
  } finally {
    loading.value = false
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
      <h4 class="news-title">Aktuelle News zu: <span class="q">{{ query }}</span></h4>
    </div>

    <div v-if="loading" class="hint">Lade News …</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <ul v-else class="news-list">
      <li v-if="items.length === 0" class="hint">Keine passenden Headlines gefunden.</li>

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
