<script setup lang="ts">
/**
 * === SCRIPT-BEREICH ===
 * Ähnlich wie import-Statements in Java: Wir laden andere Komponenten.
 * "setup" bedeutet: Dieser Code läuft beim Start der Komponente (wie ein Konstruktor).
 * TypeScript (ts) ist wie Java typsicher - Fehler werden früh erkannt!
 */

// Import von Komponenten (wie: import MyClass from package in Java)
// Jede .vue-Datei ist eine wiederverwendbare Komponente
import AppHeader from './components/AppHeader.vue'           // Header mit Logo und Titel
import SavingsPlanForm from './components/SavingsPlanForm.vue' // Formular links
import ScenarioCards from './components/ScenarioCards.vue'     // Szenario-Karten rechts
import MyList from './components/MyList.vue'                   // Roadmap unten
</script>

<template>
  <!--
    === TEMPLATE-BEREICH ===
    Hier steht das HTML - die Struktur der Seite.
    Ähnlich wie die Benutzeroberfläche in JavaFX oder Swing.
  -->

  <!-- Haupt-Container der gesamten App -->
  <div class="app">

    <!--
      AppHeader ist eine Komponente (wie ein Objekt einer Klasse in Java).
      Props sind wie Parameter beim Methodenaufruf:
      new AppHeader("ETF-Sparplaner", "Simuliere...") in Java gedacht
    -->
    <AppHeader
      title="ETF-Sparplaner"
      subtitle="Simuliere, wie sich dein monatlicher ETF-Sparplan über die Zeit entwickeln könnte."
    />

    <!--
      <main> ist ein semantisches HTML5-Element für den Hauptinhalt.
      class="main" verknüpft es mit CSS-Styles (siehe unten).
    -->
    <main class="main">

      <!-- Linke Spalte: Formular-Komponente (ohne Props, da alles intern) -->
      <SavingsPlanForm />

      <!-- Rechte Spalte: Szenario-Komponente (zeigt 3 Karten) -->
      <ScenarioCards />
    </main>

    <!--
      <section> gruppiert thematisch zusammengehörende Inhalte.
      Hier: Die Roadmap mit MyList-Komponente (enthält ein v-for wie eine for-Schleife)
    -->
    <section class="roadmap">
      <MyList />
    </section>
  </div>
</template>

<style scoped>
/**
 * === STYLE-BEREICH ===
 * CSS = Cascading Style Sheets = Wie die Seite AUSSIEHT (Design, Layout, Farben)
 * "scoped" bedeutet: Diese Styles gelten NUR für diese Komponente (Kapselung wie in Java!)
 */

/**
 * .app = CSS-Selektor für class="app"
 * In CSS beginnen Klassen mit einem Punkt (.)
 * Alle Eigenschaften zwischen {} gelten für dieses Element
 */
.app {
  max-width: 1100px;        /* Maximale Breite: 1100 Pixel (sonst zu breit auf großen Monitoren) */
  margin: 0 auto;           /* auto = zentriert den Container horizontal */
  padding: 2rem 1.5rem 3rem; /* Innenabstand: oben 2rem, links/rechts 1.5rem, unten 3rem */
                            /* rem = relative Einheit (1rem ≈ 16px standardmäßig) */
}

/**
 * CSS Grid = Modernes Layout-System (wie ein unsichtbares Gitter)
 * Ähnlich wie GridLayout in Java Swing, aber viel mächtiger
 */
.main {
  display: grid;                        /* Aktiviert Grid-Layout */
  grid-template-columns: 1.2fr 1fr;     /* 2 Spalten: Links ist 1.2x so breit wie rechts */
                                        /* fr = "fraction" (Bruchteil) - teilt den Platz auf */
  gap: 2rem;                            /* Abstand zwischen den Grid-Elementen */
  align-items: flex-start;              /* Elemente oben ausrichten (nicht mittig strecken) */
}

/**
 * Abstand für die Roadmap-Sektion
 */
.roadmap {
  margin-top: 2.5rem;  /* Außenabstand nach oben (Abstand zum Element darüber) */
}

/**
 * === RESPONSIVE DESIGN ===
 * @media = Bedingte Styles (wie if-Statement in Java)
 * Wenn Bildschirmbreite <= 800px (z.B. Smartphone), dann andere Regeln
 */
@media (max-width: 800px) {
  .main {
    grid-template-columns: 1fr;  /* Nur 1 Spalte statt 2 - Elemente stapeln sich untereinander */
  }
}
</style>

