<script setup lang="ts">
import { ref } from 'vue'

// Formulardaten (reaktive Variablen)
const selectedEtf = ref('S&P 500')
const monthlyRate = ref<number>(200)
const years = ref<number>(15)

// Submit-Handler: Gibt Formulardaten in Console aus
const handleSubmit = () => {
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
          min="25"
          max="10000"
        />
      </div>

      <!-- Laufzeit in Jahren -->
      <div class="form-row">
        <label for="years">Laufzeit (Jahre)</label>
        <input
          id="years"
          type="number"
          v-model.number="years"
          min="1"
          max="50"
        />
      </div>

      <!-- Submit-Button (kein disabled mehr) -->
      <button type="submit">Berechnen</button>
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
}

button {
  margin-top: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  border: none;
  background: #41b883;
  color: white;
  cursor: pointer;
}
</style>
