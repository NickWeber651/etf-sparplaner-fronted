<script setup lang="ts">
/**
 * === HOME-VIEW ===
 * Die Hauptseite der App mit ETF-Sparplan-Rechner
 *
 * Zeigt:
 * - Navigation mit Links zu Login/Register
 * - Header mit Logo und Titel
 * - Formular für Sparplan-Eingaben (links)
 * - Szenario-Karten (rechts)
 * - Roadmap mit Features (unten)
 */

// Import von Komponenten (wie: import MyClass from package in Java)
import AppNav from '../components/AppNav.vue'
import AppHeader from '../components/AppHeader.vue'
import SavingsPlanForm from '../components/SavingsPlanForm.vue'
import ScenarioCards from '../components/ScenarioCards.vue'
import MyList from '../components/MyList.vue'
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
      <!-- Linke Spalte: Sparplan-Formular -->
      <SavingsPlanForm />

      <!-- Rechte Spalte: Szenario-Karten -->
      <ScenarioCards />
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
