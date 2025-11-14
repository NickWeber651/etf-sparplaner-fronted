<script setup lang="ts">
/**
 * === HAUPT-APP-KOMPONENTE ===
 * Dies ist die Root-Komponente (wie die Main-Klasse in Java)
 *
 * WICHTIG: Verwendet jetzt den Router!
 * - RouterView = Platzhalter für die aktuelle Route
 * - Je nach URL wird eine andere View angezeigt:
 *   / → HomeView
 *   /login → LoginView
 *   /register → RegisterView
 *   /about → AboutView
 */

// Kein Import von Komponenten mehr nötig - Router macht das!
// RouterView und RouterLink sind global verfügbar (registriert in main.ts)
</script>

<template>
  <!--
    === ROUTER-VIEW ===
    <RouterView> ist ein Platzhalter (wie ein Slot in Java)
    Vue Router ersetzt es automatisch mit der passenden View-Komponente

    Beispiel:
    - URL = "/" → <RouterView> wird zu <HomeView>
    - URL = "/login" → <RouterView> wird zu <LoginView>
    - URL = "/register" → <RouterView> wird zu <RegisterView>

    Das ist wie ein Switch-Statement in Java:
    switch(currentUrl) {
      case "/": return new HomeView();
      case "/login": return new LoginView();
      ...
    }
  -->
  <RouterView />
</template>

<style scoped>
/**
 * === GLOBALE STYLES ===
 * Aktuell keine Styles hier - jede View hat ihre eigenen Styles
 *
 * Globale Styles (für ALLE Seiten) stehen in src/assets/main.css
 */
</style>

