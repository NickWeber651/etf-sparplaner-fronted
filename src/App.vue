<script setup lang="ts">
import MyList from './components/MyList.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="80" height="80" />
      <div>
        <h1>ETF-Sparplaner</h1>
        <p class="subtitle">
          Simuliere, wie sich dein monatlicher ETF-Sparplan über die Zeit entwickeln könnte.
        </p>
      </div>
    </header>

    <main class="main">
      <!-- LINKER BLOCK: Beschreibung + Formular-Platzhalter -->
      <section class="left">
        <h2>Dein Sparplan</h2>
        <p>
          Wähle einen ETF (z.&nbsp;B. den <strong>S&amp;P&nbsp;500</strong>), gib deine monatliche Sparrate
          und die geplante Laufzeit ein. Später wird dir die App zeigen, wie sich dein Vermögen unter
          verschiedenen Annahmen entwickeln kann.
        </p>

        <form class="form" @submit.prevent>
          <div class="form-row">
            <label for="etf">ETF auswählen</label>
            <select id="etf" disabled>
              <option>S&amp;P 500 (Platzhalter)</option>
              <option>MSCI World (Platzhalter)</option>
            </select>
            <small>Später kommt hier eine echte Auswahl aus dem Backend.</small>
          </div>

          <div class="form-row">
            <label for="rate">Monatliche Sparrate (EUR)</label>
            <input id="rate" type="number" placeholder="z.B. 200" disabled />
          </div>

          <div class="form-row">
            <label for="years">Laufzeit (Jahre)</label>
            <input id="years" type="number" placeholder="z.B. 15" disabled />
          </div>

          <button type="submit" disabled class="btn-disabled">
            Berechnen (kommt später)
          </button>

          <p class="hint">
            Hinweis: Dies ist ein Prototyp. Die echte Berechnung (Zinseszins, Szenarien) wird später im
            Backend umgesetzt.
          </p>
        </form>
      </section>

      <!-- RECHTER BLOCK: Szenarien als statische Beispiele -->
      <section class="right">
        <h2>Szenarien (Beispielwerte)</h2>
        <div class="cards">
          <article class="card best">
            <h3>Best-Case</h3>
            <p>Ø Rendite: 8&nbsp;% p.a.</p>
            <p>Nach 15 Jahren: ca. 68.000&nbsp;€</p>
          </article>

          <article class="card base">
            <h3>Basis-Szenario</h3>
            <p>Ø Rendite: 6&nbsp;% p.a.</p>
            <p>Nach 15 Jahren: ca. 55.000&nbsp;€</p>
          </article>

          <article class="card worst">
            <h3>Worst-Case</h3>
            <p>Ø Rendite: 3&nbsp;% p.a.</p>
            <p>Nach 15 Jahren: ca. 42.000&nbsp;€</p>
          </article>
        </div>

        <p class="disclaimer">
          Alle Werte sind nur Beispielzahlen für das UI-Design und keine echte Berechnung oder
          Anlageempfehlung.
        </p>
      </section>
    </main>

    <!-- Deine Unterkomponente mit v-for -->
    <section class="roadmap">
      <MyList />
    </section>
  </div>
</template>

<style scoped>
.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  flex-shrink: 0;
}

.subtitle {
  margin-top: 0.25rem;
  color: var(--color-text);
  opacity: 0.85;
}

.main {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}

.left p,
.right p {
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

small {
  font-size: 0.75rem;
  opacity: 0.8;
}

.btn-disabled {
  margin-top: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  border: none;
  background: #ccc;
  color: #555;
  cursor: not-allowed;
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.cards {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

/* 🔴 HIER: Karten immer weiß, mit leichtem Schatten */
.card {
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: #ffffff;       /* weißer Hintergrund */
  color: #222;               /* dunkler Text */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-bottom: 0.4rem;
}

/* Optional: bunte Ränder links für die drei Szenarien */
.best {
  border-left: 5px solid #2e7d32;
}
.base {
  border-left: 5px solid #1565c0;
}
.worst {
  border-left: 5px solid #ef6c00;
}

.disclaimer {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.roadmap {
  margin-top: 2.5rem;
}

/* Mobile-Layout */
@media (max-width: 800px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
