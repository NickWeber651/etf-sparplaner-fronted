<script setup lang="ts">
/**
 * === ABOUT-VIEW ===
 * Informationsseite über das Projekt
 */
import AppNav from '../components/AppNav.vue'
</script>

<template>
  <div class="about">
    <AppNav />

    <main class="card">
      <header class="head">
        <h1 class="title">Über dieses Projekt</h1>
        <p class="subtitle">
          Der <strong>ETF-Sparplaner</strong> ist ein Studienprojekt im Kurs <strong>WebTech</strong>.
          Im Fokus stehen saubere Frontend-Architektur, gute UX und echte Datenquellen.
        </p>
      </header>

      <section class="section">
        <h2 class="h2">Team</h2>
        <div class="team">
          <div class="person">
            <div class="avatar">LS</div>
            <div class="meta">
              <div class="name">Leonhard Siewert</div>
              <div class="role">Frontend · Architektur · UI</div>
            </div>
          </div>

          <div class="person">
            <div class="avatar">NW</div>
            <div class="meta">
              <div class="name">Nick Weber</div>
              <div class="role">Frontend · API-Integration · Features</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="h2">Technologie-Stack</h2>

        <div class="grid">
          <div class="tile">
            <div class="kicker">Frontend</div>
            <div class="value">Vue 3 + TypeScript</div>
            <div class="desc">Komponentenbasiert, reactive State, moderne Tooling-Pipeline.</div>
          </div>

          <div class="tile">
            <div class="kicker">Backend</div>
            <div class="value">Spring Boot</div>
            <div class="desc">REST-API für Sparpläne (Speichern, Laden, Bearbeiten, Löschen).</div>
          </div>

          <div class="tile">
            <div class="kicker">API (Frontend-only)</div>
            <div class="value">Wechselkurse</div>
            <div class="desc">Live-Marktdaten über eine öffentliche FX-API (z.B. EUR→USD/GBP/CHF).</div>
          </div>

          <div class="tile">
            <div class="kicker">Daten</div>
            <div class="value">Sparpläne + Szenarien</div>
            <div class="desc">Einzahlungen, Laufzeit und Szenario-Berechnungen direkt im UI.</div>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="h2">Features</h2>

        <ul class="features">
          <li class="ok">
            <span class="badge">✓</span>
            Sparpläne erstellen und speichern
          </li>
          <li class="ok">
            <span class="badge">✓</span>
            Gespeicherte Sparpläne anzeigen, bearbeiten und löschen
          </li>
          <li class="ok">
            <span class="badge">✓</span>
            Szenario-Berechnung (Worst / Basis / Best) inkl. Haltezeit
          </li>
          <li class="ok">
            <span class="badge">✓</span>
            API-Integration: Live-Wechselkurse (Frontend-only)
          </li>
          <li class="later">
            <span class="badge ghost">↗</span>
            Erweiterungen: weitere ETFs, Charts und zusätzliche Kennzahlen
          </li>
        </ul>

        <p class="note">
          Hinweis: Die Berechnungen dienen der <strong>Simulation</strong> und sind keine Finanzberatung.
        </p>
      </section>

      <footer class="foot">
        <div class="tiny">
          © {{ new Date().getFullYear() }} · ETF-Sparplaner · WebTech
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.about {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
  min-height: 100vh;
}

.card {
  margin-top: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(229, 231, 235, 0.12);
  background: rgba(17, 24, 39, 0.45);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  padding: 1.6rem;
  color: #e5e7eb;
}

.head {
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.10);
}

.title {
  margin: 0;
  font-size: 1.8rem;
  letter-spacing: 0.2px;
}

.subtitle {
  margin: 0.7rem 0 0;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 70ch;
}

.section {
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.08);
}

.section:last-of-type {
  border-bottom: none;
}

.h2 {
  margin: 0 0 0.8rem;
  font-size: 1.15rem;
  color: #e5e7eb;
}

.team {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.person {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem 0.9rem;
  border-radius: 14px;
  border: 1px solid rgba(229, 231, 235, 0.10);
  background: rgba(229, 231, 235, 0.06);
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #06130e;
  background: rgba(65, 184, 131, 0.95);
}

.meta .name {
  font-weight: 800;
}

.meta .role {
  margin-top: 0.15rem;
  color: #94a3b8;
  font-size: 0.92rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.tile {
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(229, 231, 235, 0.10);
  background: rgba(229, 231, 235, 0.06);
}

.kicker {
  font-size: 0.82rem;
  color: #94a3b8;
}

.value {
  margin-top: 0.25rem;
  font-weight: 800;
  font-size: 1.05rem;
}

.desc {
  margin-top: 0.35rem;
  color: #cbd5e1;
  font-size: 0.92rem;
  line-height: 1.5;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.55rem;
}

.features li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 14px;
  border: 1px solid rgba(229, 231, 235, 0.10);
  background: rgba(229, 231, 235, 0.06);
  color: #e5e7eb;
}

.badge {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 900;
  flex: 0 0 auto;
}

.ok .badge {
  background: rgba(65, 184, 131, 0.95);
  color: #06130e;
}

.ghost {
  background: rgba(229, 231, 235, 0.12);
  color: #cbd5e1;
}

.note {
  margin-top: 0.9rem;
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.5;
}

.foot {
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.tiny {
  color: #94a3b8;
  font-size: 0.85rem;
}

@media (max-width: 720px) {
  .card {
    padding: 1.2rem;
  }
  .team {
    grid-template-columns: 1fr;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
