<script setup lang="ts">
import { ref, computed } from 'vue'
import AppNav from '../components/AppNav.vue'
import AppHeader from '../components/AppHeader.vue'
import SavingsPlanForm from '../components/SavingsPlanForm.vue'
import ScenarioCards from '../components/ScenarioCards.vue'
import MyList from '../components/MyList.vue'
import { createSparplan } from '../services/sparplanApi'

// ✅ Nutze deine Datei src/data/etfInfo.ts
import { ETF_INFO, type EtfInfo } from '../data/etfInfo'

const etfs = ref([
  { id: 1, name: 'S&P 500', isin: 'IE00B5BMR087', ter: 0.0007 },
  { id: 2, name: 'MSCI World', isin: 'IE00B4L5Y983', ter: 0.0020 },
  { id: 3, name: 'FTSE All-World', isin: 'IE00B3RBWM25', ter: 0.0022 },
])

const loadingEtfs = ref(false)
const errorEtfs = ref<string | null>(null)

// === Auswahl / Szenario State ===
const selectedEtf = ref('') // Name ohne "(TER: ...)"
const monthlyRate = ref(200)
const years = ref(15)

// ✅ TS-sicher: kein split()[0]
function normalizeEtfName(input: unknown): string {
  const name = typeof input === 'string' ? input : ''
  const marker = ' (TER'
  const idx = name.indexOf(marker)
  const base = idx === -1 ? name : name.slice(0, idx)
  return base.trim()
}

// === Vergleichs-Infos zum ausgewählten ETF ===
const selectedEtfInfo = computed<EtfInfo | null>(() => {
  const key = normalizeEtfName(selectedEtf.value)
  return ETF_INFO.find(e => e.name === key) ?? null
})

function rankTextByVol(id: number) {
  const sorted = [...ETF_INFO].sort((a, b) => a.volatility1y - b.volatility1y) // klein = stabiler
  const pos = sorted.findIndex(x => x.id === id)
  if (pos === 0) return 'am stabilsten (niedrigste Volatilität) im Vergleich'
  if (pos === sorted.length - 1) return 'am volatilsten (höchste Volatilität) im Vergleich'
  return 'mittlere Volatilität im Vergleich'
}

function rankTextByDrawdown(id: number) {
  // weniger negativ ist besser, z.B. -10 > -15
  const sorted = [...ETF_INFO].sort((a, b) => b.maxDrawdown1y - a.maxDrawdown1y)
  const pos = sorted.findIndex(x => x.id === id)
  if (pos === 0) return 'hatte den geringsten Rückgang (Drawdown) im Vergleich'
  if (pos === sorted.length - 1) return 'hatte den stärksten Rückgang (Drawdown) im Vergleich'
  return 'liegt beim Drawdown im Mittelfeld'
}

// === UI Messages ===
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// damit MyList nach dem Speichern automatisch neu lädt
const reloadKey = ref(0)

async function handleSubmitPlan(payload: { etf: string; rate: number; years: number }) {
  const chosenName = normalizeEtfName(payload.etf)

  selectedEtf.value = chosenName
  monthlyRate.value = payload.rate
  years.value = payload.years

  errorMessage.value = null
  successMessage.value = null
  isSaving.value = true

  try {
    // ✅ TS-sicher: find kann undefined sein → if-Block
    let etfNameFormatted = payload.etf
    const selectedEtfObj = etfs.value.find(e => e.name === chosenName)
    if (selectedEtfObj) {
      etfNameFormatted = `${selectedEtfObj.name} (TER: ${(selectedEtfObj.ter * 100).toFixed(2)} %)`
    }

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

      <!-- ✅ erscheint sobald handleSubmitPlan gelaufen ist -->
      <div v-if="selectedEtfInfo" class="etf-info">
        <h3>{{ selectedEtfInfo.name }} – Kurzprofil</h3>

        <p><strong>Abdeckung:</strong> {{ selectedEtfInfo.coverage }}</p>
        <p><strong>Regionen:</strong> {{ selectedEtfInfo.regions }}</p>
        <p><strong>Diversifikation:</strong> {{ selectedEtfInfo.diversification }}</p>

        <div class="metrics">
          <div><strong>Volatilität (1J):</strong> {{ selectedEtfInfo.volatility1y.toFixed(1) }}%</div>
          <div><strong>Max. Drawdown (1J):</strong> {{ selectedEtfInfo.maxDrawdown1y.toFixed(1) }}%</div>
          <div><strong>Einordnung:</strong> {{ rankTextByVol(selectedEtfInfo.id) }}</div>
          <div><strong>Stabilität:</strong> {{ rankTextByDrawdown(selectedEtfInfo.id) }}</div>
        </div>

        <ul>
          <li v-for="n in selectedEtfInfo.notes" :key="n">{{ n }}</li>
        </ul>
      </div>
    </main>

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

/* ✅ ETF-Profil */
.etf-info {
  grid-column: 1 / -1;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(229, 231, 235, 0.12);
  background: rgba(17, 24, 39, 0.35);
}

.metrics {
  margin: 0.75rem 0;
  display: grid;
  gap: 0.35rem;
  color: #cbd5e1;
}

@media (max-width: 800px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
