<script setup lang="ts">
/**
 * === NAVIGATION-KOMPONENTE ===
 * Zeigt Links zu verschiedenen Seiten der App
 *
 * Verwendet RouterLink statt <a> für:
 * - Keine Seitenreloads (SPA = Single Page Application)
 * - Schnellere Navigation
 * - Automatische "active" CSS-Klasse für aktuelle Route
 */
</script>

<template>
  <!--
    === NAVIGATION-BAR ===
    Horizontale Navigation mit Links
  -->
  <nav class="nav">
    <!--
      RouterLink = Vue Router Komponente
      - to="/" = Ziel-Route (wie href bei <a>)
      - Wird zu <a> gerendert, aber ohne Seitenreload
      - Bekommt automatisch class="router-link-active" wenn aktiv
    -->
    <RouterLink to="/" class="nav-link">Home</RouterLink>
    <RouterLink to="/about" class="nav-link">Über uns</RouterLink>
    <RouterLink to="/login" class="nav-link nav-link-primary">Anmelden</RouterLink>
    <RouterLink to="/register" class="nav-link nav-link-secondary">Registrieren</RouterLink>
  </nav>
</template>

<style scoped>
/**
 * === NAVIGATION STYLES ===
 */

/**
 * === NAV-CONTAINER ===
 * Flexbox für horizontale Anordnung
 */
.nav {
  display: flex;              /* Flexbox = Elemente nebeneinander */
  gap: 1rem;                  /* 1rem Abstand zwischen Links */
  align-items: center;        /* Vertikal zentrieren */
  margin-bottom: 2rem;        /* Abstand nach unten */
  padding: 1rem 0;            /* Vertikaler Innenabstand */
  flex-wrap: wrap;            /* Umbruch auf kleinen Bildschirmen */
}

/**
 * === NAV-LINKS ===
 * Basis-Styling für alle Links
 */
.nav-link {
  padding: 0.5rem 1rem;                /* Innenabstand */
  border-radius: 0.5rem;               /* Abgerundete Ecken */
  text-decoration: none;               /* Kein Unterstrich */
  color: var(--color-text);            /* Textfarbe aus main.css */
  font-weight: 500;                    /* Etwas fetter */
  transition: background-color 0.2s ease, color 0.2s ease;
  /* ^ Sanfte Animationen */
}

/**
 * Hover-Effekt
 */
.nav-link:hover {
  background-color: var(--color-background-soft);  /* Heller Hintergrund */
}

/**
 * Aktiver Link (automatisch von Vue Router gesetzt)
 */
.nav-link.router-link-active {
  background-color: var(--color-background-mute);
  color: var(--color-heading);
}

/**
 * === PRIMARY LINK (Anmelden) ===
 * Grüner Button-Style
 */
.nav-link-primary {
  background: var(--vt-c-green);
  color: var(--vt-c-black);
  font-weight: 600;
}

.nav-link-primary:hover {
  filter: brightness(1.1);
  background: var(--vt-c-green);
}

/**
 * === SECONDARY LINK (Registrieren) ===
 * Umrandeter Button-Style
 */
.nav-link-secondary {
  border: 1px solid var(--color-border);
  font-weight: 600;
}

.nav-link-secondary:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-soft);
}
</style>

