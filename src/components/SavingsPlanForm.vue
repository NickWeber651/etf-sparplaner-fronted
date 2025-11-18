<script setup lang="ts">
import { ref, computed } from 'vue'

// Formulardaten (reaktive Variablen)
const selectedEtf = ref('S&P 500')
const monthlyRate = ref<number>(200)
const years = ref<number>(15)

// Separate Validierung für jedes Feld (für visuelles Feedback)
const isRateValid = computed(() => monthlyRate.value >= 25 && monthlyRate.value <= 10000)
const isYearsValid = computed(() => years.value >= 1 && years.value <= 50)

// Gesamtvalidierung (beide Felder müssen gültig sein)
const isValid = computed(() => isRateValid.value && isYearsValid.value)

// Submit-Handler mit Validierung
const handleSubmit = () => {
  if (!isValid.value) {
    alert('Bitte Eingaben prüfen:\n- Sparrate: 25-10.000 €\n- Laufzeit: 1-50 Jahre')
    return
  }

  console.log('Formular abgeschickt:', {
    etf: selectedEtf.value,
    rate: monthlyRate.value,
    years: years.value
  })
}
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
          <option>S&P 500</option>
          <option>MSCI World</option>
          <option>NASDAQ 100</option>
        </select>
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
          required
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
          required
        />
        <span v-if="!isYearsValid" class="error">Laufzeit muss zwischen 1 und 50 Jahren liegen</span>
      </div>

      <!-- Submit-Button: disabled wenn Eingaben ungültig -->
      <button type="submit" :disabled="!isValid">Berechnen</button>
    </form>
  </section>
</template>

<style scoped>
.left p {
  margin-bottom: 0.75rem;
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
