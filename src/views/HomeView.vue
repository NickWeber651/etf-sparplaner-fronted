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
import { createSparplan, getSparplaene, type SparplanResponse } from '../services/sparplanApi'

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
 * === BACKEND-STATE ===
 * Für Speichern und Laden von Sparplänen
 */
const isSaving = ref(false)              // Wird Sparplan gerade gespeichert?
const isLoadingPlans = ref(false)        // Werden Sparpläne gerade geladen?
const errorMessage = ref<string | null>(null)     // Fehlermeldung
const successMessage = ref<string | null>(null)   // Erfolgsmeldung
const sparplaene = ref<SparplanResponse[]>([])    // Liste aller gespeicherten Sparpläne

/**
 * === EVENT-HANDLER ===
 * Wird aufgerufen wenn SavingsPlanForm submitted wird
 */
async function handleSubmitPlan(payload: { etf: string; rate: number; years: number }) {
  // State für Szenarien-Berechnung (bestehende Logik)
  selectedEtf.value = payload.etf
  monthlyRate.value = payload.rate
  years.value = payload.years

  console.log('✅ Sparplan berechnet:', payload)

  // === NEU: Backend-Integration ===
  // Fehlermeldungen zurücksetzen
  errorMessage.value = null
  successMessage.value = null
  isSaving.value = true

  try {
    // ETF-Name mit TER formatieren (wie im Dropdown angezeigt)
    const selectedEtfObj = etfs.value.find(e => e.name === payload.etf)
    const etfNameFormatted = selectedEtfObj
      ? `${selectedEtfObj.name} (TER: ${(selectedEtfObj.ter * 100).toFixed(2)} %)`
      : payload.etf

    // Sparplan im Backend speichern
    const savedPlan = await createSparplan({
      etfName: etfNameFormatted,
      monatlicheRate: payload.rate,
      laufzeitJahre: payload.years,
    })

    console.log('💾 Sparplan im Backend gespeichert:', savedPlan)

    // Erfolgsmeldung anzeigen
    successMessage.value = '✅ Sparplan erfolgreich gespeichert!'

    // Sparpläne-Liste neu laden
    await loadSparplaene()

    // Erfolgsmeldung nach 3 Sekunden ausblenden
    setTimeout(() => {
      successMessage.value = null
    }, 3000)

  } catch (error) {
    // Fehlerbehandlung
    console.error('❌ Fehler beim Speichern:', error)
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Fehler beim Speichern des Sparplans'
  } finally {
    isSaving.value = false
  }
}

/**
 * === SPARPLÄNE VOM BACKEND LADEN ===
 */
async function loadSparplaene() {
  isLoadingPlans.value = true
  errorMessage.value = null

  try {
    const plans = await getSparplaene()
    sparplaene.value = plans
    console.log('📋 Sparpläne geladen:', plans.length, 'Einträge')
  } catch (error) {
    console.error('❌ Fehler beim Laden der Sparpläne:', error)
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Fehler beim Laden der Sparpläne'
  } finally {
    isLoadingPlans.value = false
  }
}

/**
 * === DATUM FORMATIEREN ===
 * Konvertiert ISO-String in deutsches Format
 * z.B. "2025-12-06" → "06.12.2025"
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * === LIFECYCLE ===
 * Beim Mounten: Sparpläne vom Backend laden
 */
onMounted(async () => {
  console.log('🚀 HomeView geladen - ETFs bereit')
  await loadSparplaene()
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
        === FEEDBACK-MESSAGES ===
        Erfolgs- und Fehlermeldungen über dem Formular
      -->
      <div v-if="successMessage || errorMessage" class="messages">
        <div v-if="successMessage" class="message success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>
      </div>

      <!--
        === LINKE SPALTE: FORMULAR ===
        Props: ETF-Daten + Speicherzustand übergeben
        Event: @submit-plan hört auf das submit-Event
      -->
      <SavingsPlanForm
        :etfs="etfs"
        :loadingEtfs="loadingEtfs"
        :errorEtfs="errorEtfs"
        :isSaving="isSaving"
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
      === GESPEICHERTE SPARPLÄNE ===
      Liste aller im Backend gespeicherten Sparpläne
    -->

   <section class="saved-plans">
     <MyList />
   </section>

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
 * === FEEDBACK-MESSAGES ===
 * Erfolgs- und Fehlermeldungen
 */
.messages {
  grid-column: 1 / -1;  /* Über beide Spalten */
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

/**
 * === ROADMAP-SEKTION ===
 * Abstand nach oben zum Haupt-Bereich
 */
.roadmap {
  margin-top: 2.5rem;
}

/**
 * === GESPEICHERTE SPARPLÄNE ===
 * Liste der Backend-Sparpläne
 */
.saved-plans {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.saved-plans h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

/* Ladezustand */
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
  opacity: 0.7;
}

/* Leerzustand (keine Sparpläne) */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-background-soft);
  border-radius: 0.75rem;
  border: 1px dashed var(--color-border);
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.empty-state .hint {
  font-size: 0.95rem;
  opacity: 0.7;
}

/* Grid für Sparpläne-Karten */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Einzelne Sparplan-Karte */
.plan-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #41b883;
}

/* Karten-Header (ETF-Name + ID) */
.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.plan-header h3 {
  font-size: 1rem;
  margin: 0;
  color: var(--color-heading);
  flex: 1;
  line-height: 1.3;
}

.plan-id {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.5;
  font-weight: 500;
  margin-left: 0.5rem;
}

/* Details-Liste */
.plan-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.detail-item .label {
  color: var(--color-text);
  opacity: 0.75;
}

.detail-item .value {
  font-weight: 600;
  color: var(--color-heading);
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
