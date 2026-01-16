<script setup lang="ts">
/**
 * SAVINGS PLAN FORM VIEW - PRESENTATION-LOGIC PATTERN
 *
 * VIEW: Template + Styles
 * LOGIC: SavingsPlanForm.logic.ts
 */

import { useSavingsPlanForm } from '@/composables/components/useSavingsPlanForm'

const props = defineProps<{
  etfs: { id: number; name: string; isin: string; ter: number }[]
  loadingEtfs: boolean
  errorEtfs: string | null
  isSaving?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit-plan', payload: { etf: string; rate: number; years: number }): void
}>()

const {
  selectedEtf,
  monthlyRate,
  years,
  selectedEtfDetails,
  isRateValid,
  isYearsValid,
  isValid,
  handleSubmit,
} = useSavingsPlanForm(props, emit)

</script>


<template>
  <section class="left">
    <h2>Dein Sparplan</h2>
    <p>
      Wähle einen ETF (z.&nbsp;B. den <strong>S&amp;P&nbsp;500</strong>), gib deine monatliche Sparrate
      und die geplante Laufzeit ein.
    </p>

    <!-- Formular mit Event-Handler (@submit.prevent verhindert Seitenreload) -->
    <form class="form" @submit.prevent="handleSubmit">

      <!-- ETF-Auswahl: v-model bindet selectedEtf an das Dropdown -->
     <div class="form-row">
       <label for="etf">ETF auswählen</label>

       <select id="etf" v-model="selectedEtf">
         <option disabled value="">Bitte ETF wählen</option>
         <option
           v-for="e in etfs"
           :key="e.id"
           :value="e.name"
         >
           {{ e.name }} (TER: {{ (e.ter * 100).toFixed(2) }} %)
         </option>
       </select>

       <!-- Optional: Infos zu Laden / Fehler -->
       <span v-if="loadingEtfs" class="error" style="color: #555;">
         ETFs werden geladen …
       </span>
       <span v-if="errorEtfs" class="error">
         Fehler beim Laden der ETFs: {{ errorEtfs }}
       </span>

       <!-- 👉 NEU: Details zum ausgewählten ETF -->
       <div v-if="selectedEtfDetails" class="etf-details">
         <small>
           <strong>ISIN:</strong> {{ selectedEtfDetails.isin }} |
           <strong>TER:</strong> {{ (selectedEtfDetails.ter * 100).toFixed(2) }} % p.a.
         </small>
       </div>
     </div>

      <!-- Sparrate: v-model.number konvertiert automatisch zu Zahl -->
      <div class="form-row">
        <label for="rate">Monatliche Sparrate (EUR)</label>
        <input
          id="rate"
          type="number"
          v-model.number="monthlyRate"
          :class="{ invalid: !isRateValid }"
          min="25"
          max="10000"
          step="1"
          required
          @input="monthlyRate = Math.max(25, Math.min(10000, Math.abs(monthlyRate || 0)))"
        />
        <!-- Fehlermeldung erscheint nur bei ungültiger Eingabe -->
        <span v-if="!isRateValid" class="error">Sparrate muss zwischen 25 und 10.000 € liegen</span>
      </div>

      <!-- Laufzeit in Jahren -->
      <div class="form-row">
        <label for="years">Laufzeit (Jahre)</label>
        <input
          id="years"
          type="number"
          v-model.number="years"
          :class="{ invalid: !isYearsValid }"
          min="1"
          max="50"
          step="1"
          required
          @input="years = Math.max(1, Math.min(50, Math.abs(years || 0)))"
        />
        <span v-if="!isYearsValid" class="error">Laufzeit muss zwischen 1 und 50 Jahren liegen</span>
      </div>

      <!-- Submit-Button: disabled wenn Eingaben ungültig oder beim Speichern -->
      <button type="submit" :disabled="!isValid || isSaving">
        {{ isSaving ? 'Speichern...' : 'Berechnen & Speichern' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.left p {
  margin-bottom: 0.75rem;
}


.etf-details {
  margin-top: 0.35rem;
  color: var(--color-text);
  opacity: 0.75;
}

.form {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

input,
select {
  padding: 0.4rem 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid var(--color-border);
  font: inherit;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s; /* Sanfter Übergang bei Farbwechsel */
}

/* Focus-Effekt: Grüner Rahmen beim Klicken in Felder */
input:focus,
select:focus {
  outline: none;
  border-color: #41b883;
}

/* Ungültiges Input-Feld: roter Rand */
input.invalid {
  border-color: #e74c3c;
}

/* Fehlermeldung: klein und rot */
.error {
  font-size: 0.85rem;
  color: #e74c3c;
  margin-top: 0.25rem;
}

button {
  margin-top: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  border: none;
  background: #41b883;
  color: white;
  cursor: pointer;
  transition: all 0.2s; /* Smooth Animation für alle Effekte */
}

/* Hover-Effekt: Button hebt sich nur wenn nicht disabled */
button:not(:disabled):hover {
  transform: translateY(-2px); /* Hebt sich um 2px */
  box-shadow: 0 4px 8px rgba(65, 184, 131, 0.3); /* Grüner Schatten */
}

/* Disabled-State: Button wird grau wenn Eingaben ungültig */
button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
