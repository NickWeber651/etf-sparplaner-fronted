<template>
  <section class="about">
    <h1>Über den ETF-Sparplaner</h1>

    <p>
      Diese Webanwendung ist ein Studienprojekt im Modul <strong>Web-Technologien</strong>.
      Ziel ist es, einen einfachen ETF-Sparplan-Simulator mit <strong>Vue&nbsp;3</strong>
      im Frontend und <strong>Spring Boot</strong> im Backend zu entwickeln.
    </p>

    <h2>Was die Anwendung macht</h2>
    <ul>
      <li>
        Du wählst einen ETF aus einer Liste, die das Backend über die REST-Schnittstelle
        <code>/etfs</code> bereitstellt.
      </li>
      <li>
        Du gibst deine monatliche Sparrate und die geplante Laufzeit in Jahren ein.
      </li>
      <li>
        Die Anwendung berechnet drei Szenarien (Best-, Basis- und Worst-Case) auf Basis
        unterschiedlicher Renditeannahmen und zeigt die Endwerte an.
      </li>
    </ul>

    <h2>Technischer Aufbau</h2>
    <ul>
      <li><strong>Frontend:</strong> Vue&nbsp;3, TypeScript, Komponenten (Formular, Szenario-Karten, Header, Roadmap)</li>
      <li><strong>Backend:</strong> Spring Boot, REST-Controller <code>EtfController</code> mit Endpunkt <code>/etfs</code></li>
      <li><strong>Kommunikation:</strong> Fetch-API im Frontend (GET <code>{{ backendUrl }}/etfs</code>)</li>
    </ul>

    <p class="note">
      Hinweis: Dieses Tool dient ausschließlich zu Demonstrations- und Lernzwecken und stellt
      <strong>keine Anlageberatung</strong> dar.
    </p>
  </section>
</template>

<script setup lang="ts">
const backendUrl = 'http://localhost:8080'
</script>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

h1 {
  margin-bottom: 1rem;
}

h2 {
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 0.75rem;
}

ul {
  padding-left: 1.2rem;
}

li {
  margin-bottom: 0.35rem;
}

code {
  background: #1f2933;
  color: #e5e7eb;
  padding: 0.1rem 0.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.note {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.85;
}
</style>
