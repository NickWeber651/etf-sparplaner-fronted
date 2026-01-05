<script setup lang="ts">
/**
 * === HOME-VIEW ===
 * Hauptseite: Navigation + Rechner + Szenarien + gespeicherte Sparpläne
 *
 * WICHTIG:
 * - HomeView ist wieder die "ganze" Seite (AppNav/AppHeader/Form/ScenarioCards)
 * - Die Sparpläne-Liste inkl. Bearbeiten/Löschen steckt komplett in <MyList />
 */

import { ref } from 'vue'
import AppNav from '../components/AppNav.vue'
import AppHeader from '../components/AppHeader.vue'
import SavingsPlanForm from '../components/SavingsPlanForm.vue'
import ScenarioCards from '../components/ScenarioCards.vue'
import MyList from '../components/MyList.vue'
import { createSparplan } from '../services/sparplanApi'

// --- ETF Mock-Daten (später Backend) ---
const etfs = ref([
  { id: 1, name: 'S&P 500', isin: 'IE00B5BMR087', ter: 0.0007 },
  { id: 2, name: 'MSCI World', isin: 'IE00B4L5Y983', ter: 0.0020 },
  { id: 3, name: 'FTSE All-World', isin: 'IE00B3RBWM25', ter: 0.0022 },
])
const loadingEtfs = ref(false)
const errorEtfs = ref<string | null>(null)

// --- Szenario State ---
const selectedEtf = ref('')
const monthlyRate = ref(200)
const years = ref(15)

// --- UI Messages ---
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// --- Trigger für MyList Reload ---
const reloadKey = ref(0)

async function handleSubmitPlan(payload: { etf: string; rate: number; years: number }) {
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

    // MyList neu laden lassen
    reloadKey.value += 1

    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (error) {
    console.error('❌ Fehler beim Speichern:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Fehler beim Speichern des Sparplans'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="home">
    <AppNav />

    <AppHeader
      title="ETF-Sparplaner"
      subtitle="Simuliere, wie sich dein monatlicher ETF-Sparplan über die Zeit entwickeln könnte."
    />

    <main class="main">
      <div v-if="successMessage || errorMessage" class="messages">
        <div v-if="successMessage" class="message success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>
      </div>

      <SavingsPlanForm
        :etfs="etfs"
        :loadingEtfs="loadingEtfs"
        :errorEtfs="errorEtfs"
        :isSaving="isSaving"
        @submit-plan="handleSubmitPlan"
      />

      <ScenarioCards
        :rate="monthlyRate"
        :years="years"
        :etfName="selectedEtf || 'Wähle einen ETF'"
      />
    </main>

    <!-- Gespeicherte Sparpläne: genau EINMAL, als Komponente -->
    <section class="saved-plans">
      <MyList :reloadKey="reloadKey" />
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  min-height: 100vh;
}

.main {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}

.messages {
  grid-column: 1 / -1;
  margin-bottom: 1rem;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.message.success {
  background: rgba(65, 184, 131, 0.15);
  border: 1px solid #41b883;
  color: #41b883;
}

.message.error {
  background: rgba(231, 76, 60, 0.15);
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.saved-plans {
  margin-top: 2.5rem;
}

@media (max-width: 800px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
