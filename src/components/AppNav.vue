<script setup lang="ts">
/**
 * APP NAV VIEW - PRESENTATION-LOGIC PATTERN
 * VIEW: Template + Styles
 * LOGIC: @/composables/components/useAppNav.ts
 */

import { useAppNav } from '@/composables/components/useAppNav'

const {
  loggedIn,
  userEmail,
  handleLogout,
} = useAppNav()

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

    <!-- === EINGELOGGT: User-Email + Logout === -->
    <template v-if="loggedIn">
      <span class="user-email">{{ userEmail }}</span>
      <button @click="handleLogout" class="nav-link nav-link-logout">Abmelden</button>
    </template>

    <!-- === NICHT EINGELOGGT: Login + Register === -->
    <template v-else>
      <RouterLink to="/login" class="nav-link nav-link-primary">Anmelden</RouterLink>
      <RouterLink to="/register" class="nav-link nav-link-secondary">Registrieren</RouterLink>
    </template>
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

/**
 * === USER EMAIL ===
 * Zeigt die Email des eingeloggten Users
 */
.user-email {
  padding: 0.5rem 1rem;
  color: var(--color-text);
  font-size: 0.875rem;
  opacity: 0.8;
}

/**
 * === LOGOUT BUTTON ===
 * Roter Button zum Abmelden
 */
.nav-link-logout {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.nav-link-logout:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}
</style>

