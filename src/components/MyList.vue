<script setup lang="ts">
/**
 * === DATEN-DEFINITION ===
 * In Vue definieren wir Daten mit const (wie final in Java)
 *
 * const = Konstante (Referenz kann nicht geändert werden)
 * features = Array von Strings (wie ArrayList<String> in Java)
 *
 * Diese Daten werden im Template mit v-for durchlaufen (wie for-each-Schleife in Java)
 */
const features = [
  'Du wählst einen ETF, z. B. den S&P 500.',
  'Du gibst an, wie viel du jeden Monat investieren möchtest.',
  'Du legst fest, wie lange du sparen willst (in Jahren/Monaten).',
  'Wir berechnen ein Best-Case-, ein Basis- und ein Worst-Case-Szenario.',
  'Du siehst Entwicklung der Einzahlung, Rendite und Gesamtsumme im Zeitverlauf.'
]
</script>

<template>
  <section>
    <h2>ETF-Sparplaner (Prototyp)</h2>

    <p>
      Mit diesem Tool kannst du simulieren, wie sich ein ETF-Sparplan über die Zeit entwickeln könnte.
      Du wählst einen ETF (z.&nbsp;B. den <strong>S&amp;P&nbsp;500</strong>), legst deine monatliche Sparrate
      und die Laufzeit fest. Auf dieser Basis entstehen verschiedene Szenarien:
    </p>

    <!--
      === STATISCHE LISTE ===
      <ul> = Unordered List (unsortierte Liste mit Aufzählungszeichen)
      <li> = List Item (einzelner Listenpunkt)
    -->
    <ul>
      <li><strong>Best-Case:</strong> optimistische, aber realistische Renditeannahme.</li>
      <li><strong>Basis-Szenario:</strong> wahrscheinlicher Durchschnittsverlauf.</li>
      <li><strong>Worst-Case:</strong> vorsichtige Annahme mit schwächerer Marktentwicklung.</li>
    </ul>

    <!--
      === INLINE-STYLES ===
      style="..." = Direkte CSS-Angaben (wie in Java: component.setMargin(...))
      Besser ist normalerweise CSS-Klassen, aber für Einzelfälle OK
    -->
    <p style="margin-top: 1rem;">
      In einer späteren Version berechnen wir aus deiner Sparrate und den angenommenen Renditen
      die Entwicklung der Gesamtsumme (Zinseszins-Effekt) für jeden Monat.
    </p>

    <h3>Was du mit diesem Tool machen können wirst</h3>

    <!--
      === DYNAMISCHE LISTE MIT V-FOR ===
      WICHTIG für Modul 2!

      v-for = Vue-Direktive für Schleifen (wie for-each in Java)
      "f in features" = für jedes Element f im Array features

      Java-Äquivalent:
      for (String f : features) {
        System.out.println(f);
      }

      :key = Eindeutiger Schlüssel (WICHTIG in Vue!)
      Vue braucht das, um Elemente effizient zu aktualisieren
      Hier: Der String selbst ist der Key (funktioniert, da alle unterschiedlich sind)
    -->
    <ul>
      <li v-for="f in features" :key="f">
        {{ f }}  <!-- Gibt den aktuellen String aus -->
      </li>
    </ul>

    <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
      Hinweis: Dieses Tool ist ein Studienprojekt und keine Anlageberatung.
      Investitionen in ETFs unterliegen Marktschwankungen und Risiken.
    </p>
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
</style>
