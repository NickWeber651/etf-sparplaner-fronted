<script setup lang="ts">
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
    <ul>
      <li v-for="f in features" :key="f">
        {{ f }}
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
