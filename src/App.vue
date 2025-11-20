<script setup lang="ts">
import { ref, onMounted } from 'vue'

import AppHeader from './components/AppHeader.vue'
import SavingsPlanForm from './components/SavingsPlanForm.vue'
import ScenarioCards from './components/ScenarioCards.vue'
import MyList from './components/MyList.vue'

// Typ für den Sparplan
type Plan = {
  etf: string
  rate: number
  years: number
}

// Typ für einen ETF aus dem Backend
type Etf = {
  id: number
  name: string
  isin: string
  ter: number
}

// aktueller Sparplan
const currentPlan = ref<Plan | null>(null)

// Zustand für ETFs aus dem Backend
const loadingEtfs = ref(false)
const errorEtfs = ref<string | null>(null)
const etfs = ref<Etf[]>([])

// Basis-URL des Backends
const BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080'

// Event-Handler für Formular
const handlePlanSubmit = (plan: Plan) => {
  console.log('Im Parent empfangen:', plan)
  currentPlan.value = plan
}

// ETFs beim Laden der App vom Backend holen
onMounted(async () => {
  loadingEtfs.value = true
  errorEtfs.value = null
  try {
    const res = await fetch(`${BASE_URL}/etfs`)
    if (!res.ok) {
      throw new Error(`HTTP-Fehler: ${res.status}`)
    }
    const data = (await res.json()) as Etf[]
    etfs.value = data
    console.log('ETFs vom Backend:', data)
  } catch (e: unknown) {
    if (e instanceof Error) {
      errorEtfs.value = e.message
    } else {
      errorEtfs.value = 'Unbekannter Fehler beim Laden der ETFs'
    }
  } finally {
    loadingEtfs.value = false
  }
})
</script>

<template>
  <div class="app">
    <AppHeader
      title="ETF-Sparplaner"
      subtitle="Simuliere, wie sich dein monatlicher ETF-Sparplan über die Zeit entwickeln könnte."
    />

    <main class="main">

<SavingsPlanForm
  @submit-plan="handlePlanSubmit"
  :etfs="etfs"
  :loading-etfs="loadingEtfs"
  :error-etfs="errorEtfs"
/>

      <ScenarioCards
        v-if="currentPlan"
        :rate="currentPlan.rate"
        :years="currentPlan.years"
        :etf-name="currentPlan.etf"
      />
    </main>

    <section class="roadmap">
      <MyList />
    </section>
  </div>
</template>

<style scoped>
/* dein CSS unverändert */
.app { /* ... */ }
.main { /* ... */ }
.roadmap { /* ... */ }
@media (max-width: 800px) {
  .main { /* ... */ }

  .nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .nav a {
    text-decoration: none;
    color: var(--color-text);
    font-weight: 500;
  }

  .nav a.router-link-active {
    text-decoration: underline;
  }
}
</style>
