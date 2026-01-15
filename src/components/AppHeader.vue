<script setup lang="ts">
/**
 * === PROPS (Eigenschaften von außen) ===
 * Props sind wie Parameter einer Methode in Java.
 * Die Eltern-Komponente (App.vue) übergibt Werte an diese Komponente.
 *
 * Beispiel Java-Analogie:
 * public class AppHeader {
 *   private String title;
 *   private String subtitle;
 *
 *   public AppHeader(String title, String subtitle) {
 *     this.title = title;
 *     this.subtitle = subtitle;
 *   }
 * }
 */
defineProps<{
  title: string      // String-Typ (wie in Java, aber klein geschrieben)
  subtitle: string   // Wird von App.vue übergeben
}>()
</script>

<template>
  <!--
    === HEADER-STRUKTUR ===
    <header> = Semantisches HTML5-Element für Kopfbereich
  -->
  <header class="header">

    <!--
      <img> = Bild-Element (self-closing, braucht kein </img>)
      alt = Alternativtext für Screenreader (Barrierefreiheit)
      src = Bildquelle; @ bedeutet: Starte im src-Ordner
      width/height = Größe in Pixeln
    -->
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="80" height="80" />

    <!-- <div> = Generischer Container (wie ein Panel in Java Swing) -->
    <div>
      <!--
        {{ title }} = Mustache-Syntax (doppelte geschweifte Klammern)
        Zeigt den WERT der Variable title an (wie System.out.println(title) in Java)
        Vue ersetzt {{ title }} automatisch mit dem echten Wert
      -->
      <h1>{{ title }}</h1>

      <!--
        <p> = Paragraph (Absatz)
        {{ subtitle }} wird ebenfalls dynamisch ersetzt
      -->
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>

<style scoped>
/**
 * === FLEXBOX LAYOUT ===
 * Flexbox = Flexibles Layout-System (einfacher als Grid, gut für Reihen/Spalten)
 * Ähnlich wie FlowLayout in Java, aber viel kontrollierbarer
 */
.header {
  display: flex;           /* Aktiviert Flexbox - Kinder werden nebeneinander gelegt */
  gap: 1rem;               /* Abstand zwischen Logo und Text */
  align-items: center;     /* Vertikale Zentrierung (Logo und Text auf gleicher Höhe) */
  margin-bottom: 2rem;     /* Abstand nach unten zum nächsten Element */
}

/**
 * flex-shrink = Verhalten beim Platzmangel
 * 0 = Logo darf NICHT schrumpfen (behält immer 80x80px)
 */
.logo {
  flex-shrink: 0;
}

/**
 * Styling für den Untertitel
 */
.subtitle {
  margin-top: 0.25rem;           /* Kleiner Abstand über dem Untertitel */
  color: var(--color-text);      /* CSS-Variable (wie eine Konstante in Java) */
                                 /* Wird in main.css definiert - ermöglicht Theme-Wechsel */
  opacity: 0.85;                 /* Transparenz: 0.85 = 85% sichtbar (etwas blasser) */
}
</style>

