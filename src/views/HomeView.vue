<script setup lang="ts">
/**
 * === HOME-VIEW ===
 * Die Hauptseite der App mit ETF-Sparplan-Rechner
 *
 * WICHTIG: Diese View verwaltet den STATE (Zustand) und gibt ihn an Kinder-Komponenten weiter
 * - ETF-Daten (werden später vom Backend geladen)
 * - Formular-Eingaben (Sparrate, Laufzeit)
 * - Berechnung der Szenarien
 */

import { ref, onMounted } from 'vue'
import AppNav from '../components/AppNav.vue'
import AppHeader from '../components/AppHeader.vue'
import SavingsPlanForm from '../components/SavingsPlanForm.vue'
import ScenarioCards from '../components/ScenarioCards.vue'
import MyList from '../components/MyList.vue'

/**
 * === ETF-DATEN ===
 * Mock-Daten für ETFs (später vom Backend)
 */
const etfs = ref([
  { id: 1, name: 'S&P 500', isin: 'IE00B5BMR087', ter: 0.0007 },
  { id: 2, name: 'MSCI World', isin: 'IE00B4L5Y983', ter: 0.0020 },
  { id: 3, name: 'FTSE All-World', isin: 'IE00B3RBWM25', ter: 0.0022 },
])
const loadingEtfs = ref(false)
const errorEtfs = ref<string | null>(null)

/**
 * === FORMULAR-DATEN ===
 * Werden vom SavingsPlanForm-Event gefüllt
 */
const selectedEtf = ref('')
const monthlyRate = ref(200)
const years = ref(15)

/**
 * === EVENT-HANDLER ===
 * Wird aufgerufen wenn SavingsPlanForm submitted wird
 */
function handleSubmitPlan(payload: { etf: string; rate: number; years: number }) {
  selectedEtf.value = payload.etf
  monthlyRate.value = payload.rate
  years.value = payload.years

  console.log('✅ Sparplan berechnet:', payload)
}

/**
 * === LIFECYCLE ===
 * Später: ETFs vom Backend laden
 */
onMounted(() => {
  console.log('🚀 HomeView geladen - ETFs bereit')
})
</script>

<template>
  <!--
    === HOME-PAGE LAYOUT ===
    Container mit maximaler Breite und zentriert
  -->
  <div class="home">

    <!--
      === NAVIGATION ===
      Links zu anderen Seiten (Home, About, Login, Register)
    -->
    <AppNav />

    <!--
      === APP-HEADER ===
      Komponente mit Props (wie Methoden-Parameter in Java)
    -->
    <AppHeader
      title="ETF-Sparplaner"
      subtitle="Simuliere, wie sich dein monatlicher ETF-Sparplan über die Zeit entwickeln könnte."
    />

    <!--
      === HAUPT-BEREICH ===
      Grid-Layout: 2 Spalten (Formular links, Szenarien rechts)
    -->
    <main class="main">
      <!--
        === LINKE SPALTE: FORMULAR ===
        Props: ETF-Daten übergeben
        Event: @submit-plan hört auf das submit-Event
      -->
      <SavingsPlanForm
        :etfs="etfs"
        :loadingEtfs="loadingEtfs"
        :errorEtfs="errorEtfs"
        @submit-plan="handleSubmitPlan"
      />

      <!--
        === RECHTE SPALTE: SZENARIEN ===
        Props: Formular-Daten übergeben
      -->
      <ScenarioCards
        :rate="monthlyRate"
        :years="years"
        :etfName="selectedEtf || 'Wähle einen ETF'"
      />
    </main>

    <!--
      === ROADMAP-SEKTION ===
      Feature-Liste und Projekt-Info
    -->
    <section class="roadmap">
      <MyList />
    </section>
  </div>
</template>

<style scoped>
/**
 * === CSS FÜR HOME-VIEW ===
 * Layout-Styles für die Hauptseite
 */

/**
 * === HAUPT-CONTAINER ===
 * Zentriert und begrenzt die maximale Breite
 */
.home {
  max-width: 1100px;        /* Maximale Breite: 1100px */
  margin: 0 auto;           /* Horizontal zentrieren */
  padding: 2rem 1.5rem 3rem; /* Innenabstand: oben 2rem, Seiten 1.5rem, unten 3rem */
  min-height: 100vh;
}

/**
 * === GRID-LAYOUT FÜR FORMULAR + SZENARIEN ===
 * 2 Spalten nebeneinander
 */
.main {
  display: grid;                    /* CSS Grid aktivieren */
  grid-template-columns: 1.2fr 1fr; /* Links breiter als rechts (1.2:1 Verhältnis) */
  gap: 2rem;                        /* 2rem Abstand zwischen den Spalten */
  align-items: flex-start;          /* Elemente oben ausrichten */
}

/**
 * === ROADMAP-SEKTION ===
 * Abstand nach oben zum Haupt-Bereich
 */
.roadmap {
  margin-top: 2.5rem;
}

/**
 * === RESPONSIVE DESIGN ===
 * Auf kleinen Bildschirmen (≤800px) nur 1 Spalte
 */
@media (max-width: 800px) {
  .main {
    grid-template-columns: 1fr;  /* Nur 1 Spalte = Elemente stapeln sich */
  }
}
</style>
