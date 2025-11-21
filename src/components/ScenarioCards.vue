<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props von außen:
 * - rate: monatliche Sparrate
 * - years: Laufzeit in Jahren
 * - etfName: Name des ETFs
 */
const props = defineProps<{
  rate: number
  years: number
  etfName: string
}>()

// Anzahl Monate
const months = computed(() => props.years * 12)

/**
 * Hilfsfunktion für den Sparplan-Endwert:
 * Endwert = r * ((1 + i)^n - 1) / i
 * r = monatliche Sparrate
 * i = monatlicher Zinssatz
 * n = Anzahl Monate
 */
function calcEndValue(monthly: number, yearlyReturn: number, months: number): number {
  const i = yearlyReturn / 12
  if (i === 0) {
    return Math.round(monthly * months)
  }
  const endValue = monthly * ((Math.pow(1 + i, months) - 1) / i)
  return Math.round(endValue)
}

// Drei Szenarien
const bestCase = computed(() => calcEndValue(props.rate, 0.08, months.value))
const baseCase = computed(() => calcEndValue(props.rate, 0.06, months.value))
const worstCase = computed(() => calcEndValue(props.rate, 0.03, months.value))

// Für das Template bequemer Zugriff auf den ETF-Namen
const etfName = computed(() => props.etfName)
const rate = computed(() => props.rate)
const years = computed(() => props.years)
</script>

<template>
  <!--
    <section> = Thematischer Bereich
    class="right" = Wird in CSS verwendet für Styling
  -->
  <section class="right">
    <h2>Szenarien für {{ etfName }}</h2>
    <p class="investment">
      Basierend auf einer Sparrate von {{ rate }} € pro Monat und {{ years }} Jahren Laufzeit.
    </p>
    <!--
      === KARTEN-CONTAINER ===
      <div> mit class="cards" = Container für alle drei Karten
      CSS Grid macht daraus ein schönes Layout (siehe CSS unten)
    -->
    <div class="cards">

      <!--
        === KARTE 1: BEST-CASE ===
        <article> = Semantisches HTML5-Element für eigenständigen Inhalt
        (wie ein in sich geschlossener Artikel)

        Zwei CSS-Klassen:
        - "card" = Basis-Styling für alle Karten
        - "best" = Spezielle Farbe für Best-Case (grüner Rand)
      -->
      <article class="card best">
        <h3>Best-Case</h3>
        <!-- Gesamteinzahlung: 200€ × 15 Jahre × 12 Monate = 36.000€ -->
        <p class="investment">
          Gesamteinzahlung:
          {{ (rate * years * 12).toLocaleString('de-DE') }}&nbsp;€
        </p>
        <p>Ø Rendite: 8&nbsp;% p.a.</p>
  <p><strong>Endwert: ca. {{ bestCase.toLocaleString('de-DE') }}&nbsp;€</strong></p>
        </article>

      <!--
        === KARTE 2: BASIS-SZENARIO ===
        Mittlere/realistische Annahme
      -->
      <article class="card base">
        <h3>Basis-Szenario</h3>
      <p class="investment">
        Gesamteinzahlung:
        {{ (rate * years * 12).toLocaleString('de-DE') }}&nbsp;€
      </p>
        <p>Ø Rendite: 6&nbsp;% p.a.</p>
  <p><strong>Endwert: ca. {{ baseCase.toLocaleString('de-DE') }}&nbsp;€</strong></p>
      </article>

      <!--
        === KARTE 3: WORST-CASE ===
        Konservative/vorsichtige Annahme
      -->
      <article class="card worst">
        <h3>Worst-Case</h3>
      <p class="investment">
        Gesamteinzahlung:
        {{ (rate * years * 12).toLocaleString('de-DE') }}&nbsp;€
      </p>
        <p>Ø Rendite: 3&nbsp;% p.a.</p>
        <p><strong>Endwert: ca. {{ worstCase.toLocaleString('de-DE') }}&nbsp;€</strong></p>
      </article>
    </div>

    <!--
      === DISCLAIMER (Haftungsausschluss) ===
      Wichtig: Keine Anlageberatung!
    -->
    <p class="disclaimer">
      Alle Werte sind nur Beispielzahlen für das UI-Design und keine echte Berechnung oder
      Anlageempfehlung.
    </p>
  </section>
</template>

<style scoped>
/**
 * === CSS FÜR SZENARIO-KARTEN ===
 */

/**
 * Alle Absätze in der rechten Spalte bekommen Abstand
 */
.right p {
  margin-bottom: 0.75rem;
}

/**
 * === GRID-LAYOUT FÜR KARTEN ===
 * Verteilt die 3 Karten untereinander mit gleichmäßigem Abstand
 */
.cards {
  display: grid;        /* CSS Grid aktivieren (wie GridLayout in Java Swing) */
  gap: 0.75rem;         /* Abstand zwischen den Karten */
  margin-top: 0.75rem;  /* Abstand nach oben zur Überschrift */

  /*
   * KEIN grid-template-columns angegeben = standardmäßig 1 Spalte
   * = Alle Karten stapeln sich vertikal
   */
}

/**
 * === BASIS-STYLING FÜR ALLE KARTEN ===
 * Jede Karte hat class="card" + eine zweite Klasse (best/base/worst)
 * Diese Regeln gelten für ALLE Karten
 */
.card {
  padding: 0.75rem;                      /* Innenabstand in der Karte */
  border-radius: 0.75rem;                /* Abgerundete Ecken (12px) */
  border: 1px solid var(--color-border); /* Dünner Rahmen */
  background: var(--color-background-soft); /* Hintergrund aus CSS-Variablen (Dark Theme Support) */
  color: var(--color-text);              /* Textfarbe aus CSS-Variablen (Dark Theme Support) */

  /*
   * box-shadow = Schatten (macht Karte "schwebend")
   * Parameter: horizontal vertikal blur spread farbe
   * - 0 = kein horizontaler Offset
   * - 2px = 2 Pixel nach unten
   * - 4px = 4 Pixel Unschärfe (blur)
   * - rgba(0,0,0,0.05) = Schwarz mit 5% Deckkraft (sehr subtil!)
   */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/**
 * Überschriften in Karten bekommen Abstand nach unten
 */
.card h3 {
  margin-bottom: 0.4rem;
}

/**
 * Gesamteinzahlung: kleiner und etwas blasser
 */
.investment {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0.5rem;
}

/**
 * === FARBIGE LINKE RÄNDER ===
 * Unterscheiden die drei Szenarien visuell
 * Diese Klassen werden ZUSÄTZLICH zu "card" angewendet
 */

/* Best-Case = Grün (positiv, optimistisch) */
.best {
  border-left: 5px solid #2e7d32;  /* 5 Pixel dicker LINKER Rand in Grün */
                                    /* #2e7d32 = Dunkelgrün (Material Design Palette) */
}

/* Basis-Szenario = Blau (neutral, vertrauenswürdig) */
.base {
  border-left: 5px solid #1565c0;  /* Blau (Material Design) */
}

/* Worst-Case = Orange (Warnung, Vorsicht) */
.worst {
  border-left: 5px solid #ef6c00;  /* Orange (Material Design) */
}

/**
 * === DISCLAIMER (Haftungsausschluss) ===
 * Kleinerer, blasserer Text am Ende
 */
.disclaimer {
  margin-top: 0.75rem;  /* Abstand nach oben */
  font-size: 0.8rem;    /* 80% der normalen Schriftgröße */
  opacity: 0.8;         /* 80% sichtbar = leicht transparent */
}
</style>

