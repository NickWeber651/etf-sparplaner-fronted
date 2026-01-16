<script setup lang="ts">
/**
 * HOME VIEW - PRESENTATION-LOGIC PATTERN
 * VIEW: Template + Styles
 * LOGIC: HomeView.logic.ts
 */

import AppNav from '../components/AppNav.vue'
import AppHeader from '../components/AppHeader.vue'
import SavingsPlanForm from '../components/SavingsPlanForm.vue'
import ScenarioCards from '../components/ScenarioCards.vue'
import MyList from '../components/MyList.vue'
import FxRates from '../components/FxRates.vue'
import { useHomeView } from '@/composables/views/useHomeView'

const {
  etfs,
  loadingEtfs,
  errorEtfs,
  selectedEtf,
  selectedEtfRaw,
  monthlyRate,
  years,
  selectedEtfInfo,
  showEtfDebug,
  isSaving,
  errorMessage,
  successMessage,
  reloadKey,
  rankTextByVol,
  rankTextByDrawdown,
  handleSubmitPlan,
} = useHomeView()

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

      <ScenarioCards :rate="monthlyRate" :years="years" :etfName="selectedEtf || 'Wähle einen ETF'" />

      <!-- ✅ API immer sichtbar (Frontend-only) -->
      <FxRates />

      <!-- Debug -->
      <p v-if="selectedEtfRaw || selectedEtf" class="etf-debug">
        ETF (raw): <code>{{ selectedEtfRaw }}</code>
        · normalisiert: <code>{{ selectedEtf }}</code>
        · Match: <code>{{ selectedEtfInfo ? selectedEtfInfo.name : 'kein Match' }}</code>
      </p>

      <!-- ETF-Kurzprofil -->
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
          <div><strong>Risiko:</strong> {{ selectedEtfInfo.riskLabel }}</div>
        </div>

        <ul>
          <li v-for="n in selectedEtfInfo.notes" :key="n">{{ n }}</li>
        </ul>
      </div>

      <div v-else-if="showEtfDebug" class="etf-info etf-info--warn">
        <h3>ETF-Profil nicht gefunden</h3>
        <p>Siehe Debug-Zeile oben (raw/normalisiert). Dann passt der Wert nicht zu ETF_INFO.</p>
      </div>
    </main>

    <section class="saved-plans">
      <MyList :key="reloadKey" />
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

.etf-debug {
  grid-column: 1 / -1;
  margin-top: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(234, 179, 8, 0.35);
  background: rgba(234, 179, 8, 0.08);
  color: #fde68a;
}

.etf-debug code {
  background: rgba(17, 24, 39, 0.35);
  border: 1px solid rgba(229, 231, 235, 0.12);
  padding: 0.1rem 0.35rem;
  border-radius: 6px;
  color: #e5e7eb;
}

.etf-info {
  grid-column: 1 / -1;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(229, 231, 235, 0.12);
  background: rgba(17, 24, 39, 0.35);
  color: #e5e7eb;
}

.etf-info h3,
.etf-info p,
.etf-info ul,
.etf-info li {
  color: #e5e7eb;
}

.etf-info ul {
  margin: 0.6rem 0 0;
  padding-left: 1.2rem;
}

.etf-info--warn {
  border-color: rgba(234, 179, 8, 0.35);
  background: rgba(234, 179, 8, 0.06);
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
