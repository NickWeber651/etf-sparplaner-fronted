<script setup lang="ts">
/**
 * === ABOUT-VIEW ===
 * Informationsseite über das Projekt
 */

import AppNav from '../components/AppNav.vue'
</script>

<template>
  <div class="about">
    <!--
      === NAVIGATION ===
      Links zu anderen Seiten
    -->
    <AppNav />

    <div class="content">
      <h1>Über dieses Projekt</h1>

      <p>
        Der <strong>ETF-Sparplaner</strong> ist ein Studienprojekt für den
        Kurs WebTech. Ziel ist es, verschiedene Technologien zu kombinieren:
      </p>

      <ul>
        <li><strong>Frontend:</strong> Vue 3 mit TypeScript</li>
        <li><strong>Backend:</strong> Spring Boot (kommt später)</li>
        <li><strong>Datenbank:</strong> PostgreSQL oder MongoDB (kommt später)</li>
        <li><strong>API:</strong> REST-Schnittstelle für Datenabfrage</li>
      </ul>

      <h2>Features (geplant)</h2>
      <ul>
        <li>✅ Benutzer-Authentifizierung (Login/Register)</li>
        <li>✅ Responsive Design mit Dark Theme</li>
        <li>⏳ ETF-Datenbank mit historischen Kursen</li>
        <li>⏳ Sparplan-Simulator mit Zinseszins-Berechnung</li>
        <li>⏳ Chart-Visualisierung mit Chart.js</li>
        <li>⏳ Speichern von Sparplänen im Benutzerkonto</li>
      </ul>

      <p class="disclaimer">
        <strong>Hinweis:</strong> Dieses Tool dient nur zu Bildungszwecken
        und ist keine Anlageberatung.
      </p>
    </div>
  </div>
</template>

<style scoped>
/**
 * === ABOUT-PAGE STYLES ===
 */

.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}

.content {
  background: var(--color-background-soft);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 1rem;
}

h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

h2 {
  color: var(--color-heading);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text);
}

ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: var(--color-text);
}

li {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.disclaimer {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--color-background-mute);
  border-left: 4px solid var(--vt-c-green);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .content {
    padding: 1.5rem;
  }
}
</style>
