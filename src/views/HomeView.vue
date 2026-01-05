<script setup lang="ts">
import { ref, computed } from 'vue'
import AppNav from '../components/AppNav.vue'
import AppHeader from '../components/AppHeader.vue'
import SavingsPlanForm from '../components/SavingsPlanForm.vue'
import ScenarioCards from '../components/ScenarioCards.vue'
import MyList from '../components/MyList.vue'
import { createSparplan } from '../services/sparplanApi'

const etfs = ref([
  { id: 1, name: 'S&P 500', isin: 'IE00B5BMR087', ter: 0.0007 },
  { id: 2, name: 'MSCI World', isin: 'IE00B4L5Y983', ter: 0.0020 },
  { id: 3, name: 'FTSE All-World', isin: 'IE00B3RBWM25', ter: 0.0022 },
])
const loadingEtfs = ref(false)
const errorEtfs = ref<string | null>(null)

// --- ETF Zusatzinfos (Mock / Platzhalter) ---
// Hinweis: Das ist bewusst im Frontend als Mock abgelegt.
// Wenn ihr später echte Kennzahlen wollt (Volatilität/Drawdown), kann das ins Backend wandern.
const ETF_INFO = [
  {
    id: 1,
    name: 'S&P 500',
    coverage: 'USA (Large Caps)',
    regions: 'USA',
    diversification: 'mittel',
    volatility1y: 17.0,
    maxDrawdown1y: -14.0,
    notes: [
      'Stark USA-lastig, hoher Tech-Anteil möglich',
      'Klumpenrisiko USA (je nach Strategie ok)',
      'Währungsrisiko USD (je nach ETF/Share Class)',
    ],
  },
  {
    id: 2,
    name: 'MSCI World',
    coverage: 'Industrieländer weltweit',
    regions: 'Welt (Developed Markets)',
    diversification: 'hoch',
    volatility1y: 15.5,
    maxDrawdown1y: -12.5,
    notes: [
      'Breit gestreut über viele Länder/Branchen',
      'Trotz „World“ meist hoher USA-Anteil',
      'Guter Core-Baustein für langfristig',
    ],
  },
  {
    id: 3,
    name: 'FTSE All-World',
    coverage: 'Welt inkl. Schwellenländer',
    regions: 'Welt (Developed + Emerging)',
    diversification: 'sehr hoch',
    volatility1y: 16.2,
    maxDrawdown1y: -13.2,
    notes: [
      'Noch breiter als MSCI World (inkl. Emerging Markets)',
      'EM können Schwankungen erhöhen',
      'Sehr guter „All-in-One“-Weltbaustein',
    ],
  },
] as const

const selectedEtf = ref('')
const monthlyRate = ref(200)
const years = ref(15)

// --- Vergleichs-Infos zum ausgewählten ETF ---
const selectedEtfInfo = computed(() => ETF_INFO.find(e => e.name === selectedEtf.value))

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

const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// damit MyList nach dem Speichern automatisch neu lädt
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

.etf-info {
  grid-column: 1 / -1;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(229, 231, 235, 0.12);
  background: rgba(17, 24, 39, 0.35);
}

.etf-info h3 {
  margin: 0 0 0.75rem;
}

.metrics {
  margin: 0.75rem 0;
  display: grid;
  gap: 0.35rem;
  color: #cbd5e1;
}

.etf-info ul {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

@media (max-width: 800px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
