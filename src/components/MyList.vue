<script setup lang="ts">
/**
 * === IMPORTS ===
 * ref       → macht eine Variable reaktiv (Vue bemerkt Änderungen)
 * onMounted → Funktion, die einmal ausgeführt wird, wenn die Komponente "auf die Seite kommt"
 */
import { ref, onMounted } from 'vue'

/**
 * === DATEN FÜR M2 (v-for über features) ==========================
 * Array von Strings, das wir später im Template mit v-for durchlaufen.
 * Das ist deine Unterkomponente mit Schleife → erfüllt M2.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const features: string[] = [
  'Du wählst einen ETF, z. B. den S&P 500.',
  'Du gibst an, wie viel du jeden Monat investieren möchtest.',
  'Du legst fest, wie lange du sparen willst (in Jahren/Monaten).',
  'Wir berechnen ein Best-Case-, ein Basis- und ein Worst-Case-Szenario.',
  'Du siehst Entwicklung der Einzahlung, Rendite und Gesamtsumme im Zeitverlauf.'
]

/**
 * === ZUSTAND FÜR M3 (REST / API-Anbindung) =======================
 * Das sind reaktive Variablen für den API-Aufruf.
 */
const loading = ref(false)               // true, solange der Request noch läuft
const error   = ref<string | null>(null) // Fehlermeldung (oder null)
const etfs    = ref<unknown[]>([])       // Antwortdaten vom Backend

/**
 * === BASIS-URL DES BACKENDS =====================================
 * Lokal:  http://localhost:8080
 * Online: Wert aus VITE_BACKEND_BASE_URL (Render-Env-Variable)
 */
const BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080'

/**
 * === LEBENSZYKLUS: onMounted =====================================
 * Wird ausgeführt, wenn die Komponente das erste Mal angezeigt wird.
 * Hier testen wir: Kann das Frontend /etfs vom Backend aufrufen?
 */
onMounted(async () => {
  // 1. Status setzen: Request startet
  loading.value = true
  error.value = null

  try {
    // 2. HTTP-GET-Request an /etfs schicken
    const res = await fetch(`${BASE_URL}/etfs`)

    // 3. Falls Statuscode nicht 200–299 → Fehler werfen
    if (!res.ok) {
      throw new Error(`HTTP-Fehler: ${res.status}`)
    }

    // 4. Antwort als JSON einlesen
    const data = (await res.json()) as unknown[]

    // 5. Daten in der reaktiven Variable speichern → Template zeigt sie an
    etfs.value = data
  } catch (e: unknown) {
    // Fehler-Text merken, damit er im Template angezeigt werden kann
    if (e instanceof Error) {
      error.value = e.message || 'Unbekannter Fehler beim API-Aufruf'
    } else {
      error.value = 'Unbekannter Fehler beim API-Aufruf'
    }
  } finally {
    // 6. In jedem Fall (Erfolg oder Fehler): loading wieder auf false
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h2>ETF-Sparplaner (Prototyp)</h2>

    <p>
      Mit diesem Tool kannst du simulieren, wie sich ein ETF-Sparplan über die Zeit entwickeln könnte.
      Du wählst einen ETF (z.&nbsp;B. den <strong>S&amp;P&nbsp;500</strong>), legst deine monatliche Sparrate
      und die Laufzeit fest. Auf dieser Basis entstehen verschiedene Szenarien:
    </p>

    <!-- Statische Erklärung der Szenarien -->
    <ul>
      <li><strong>Best-Case:</strong> optimistische, aber realistische Renditeannahme.</li>
      <li><strong>Basis-Szenario:</strong> wahrscheinlicher Durchschnittsverlauf.</li>
      <li><strong>Worst-Case:</strong> vorsichtige Annahme mit schwächerer Marktentwicklung.</li>
    </ul>

    <p style="margin-top: 1rem;">
      In einer späteren Version berechnen wir aus deiner Sparrate und den angenommenen Renditen
      die Entwicklung der Gesamtsumme (Zinseszins-Effekt) für jeden Monat.
    </p>

    <h3>Was du mit diesem Tool machen können wirst</h3>

    <!-- v-for (M2) -->
    <ul>
      <li v-for="f in features" :key="f">
        {{ f }}
      </li>
    </ul>

    <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
      Hinweis: Dieses Tool ist ein Studienprojekt und keine Anlageberatung.
      Investitionen in ETFs unterliegen Marktschwankungen und Risiken.
    </p>

    <hr style="margin: 2rem 0;" />

    <!-- Bereich für M3: REST / API-Anbindung -->
    <h3>M3: Test der REST-API (/etfs)</h3>

    <!-- Fall 1: Request läuft noch -->
    <p v-if="loading">
      Verbinde mit dem Backend ({{ BASE_URL }}/etfs) ...
    </p>

    <!-- Fall 2: Es ist ein Fehler aufgetreten -->
    <p v-else-if="error">
      Fehler beim API-Aufruf: {{ error }}
    </p>

    <!-- Fall 3: Request fertig und kein Fehler -->
    <div v-else>
      <p>
        Backend erfolgreich erreicht ✅ – Antwort von
        <code>/etfs</code>:
      </p>

      <!-- Falls die Liste leer ist -->
      <p v-if="etfs.length === 0">
        Das Backend hat eine leere Liste zurückgegeben.
      </p>

      <!-- Falls Daten vorhanden sind: rohes JSON anzeigen -->
      <pre v-else>
{{ etfs }}
      </pre>
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 0.75rem;
}

h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

ul {
  padding-left: 1.2rem;
}

li {
  margin: 0.25rem 0;
}

/* Darstellung des JSON-Blocks */
pre {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  background: #1f2933;  /* dunkler Hintergrund */
  color: #e5e7eb;       /* helle Schrift */
  font-size: 0.9rem;
  overflow-x: auto;     /* horizontales Scrollen, falls die Zeile zu lang ist */
}
</style>
