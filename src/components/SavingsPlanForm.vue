<script setup lang="ts">
/**
 * === FORMULAR-KOMPONENTE ===
 * Diese Komponente ist aktuell noch ein Prototyp (deswegen alles "disabled").
 * Später werden hier echte Daten eingegeben und ans Backend geschickt.
 *
 * Keine Props, da das Formular seine Daten selbst verwaltet (wie private Felder in Java)
 */
</script>

<template>
  <!--
    <section> = Thematischer Abschnitt
    class="left" = CSS-Klasse für Styling (siehe unten)
  -->
  <section class="left">

    <!-- <h2> = Überschrift Ebene 2 (h1 ist größer, h6 am kleinsten) -->
    <h2>Dein Sparplan</h2>

    <!--
      <p> = Paragraph (Textabsatz)
      &nbsp; = geschütztes Leerzeichen (verhindert Umbruch zwischen "P" und "500")
      &amp; = kaufmännisches Und (&) - muss in HTML escaped werden
      <strong> = Fetter Text (semantisch wichtig, nicht nur optisch)
    -->
    <p>
      Wähle einen ETF (z.&nbsp;B. den <strong>S&amp;P&nbsp;500</strong>), gib deine monatliche Sparrate
      und die geplante Laufzeit ein. Später wird dir die App zeigen, wie sich dein Vermögen unter
      verschiedenen Annahmen entwickeln kann.
    </p>

    <!--
      === FORMULAR ===
      <form> = Container für Eingabefelder (wie ein JPanel mit Input-Feldern in Java Swing)
      @submit.prevent = Vue Event-Handler (@ ist Kurzform für v-on:)
        - submit = Event wenn Formular abgeschickt wird (z.B. Enter-Taste)
        - .prevent = verhindert Standard-Verhalten (Seitenreload)
        Wie: event.preventDefault() in JavaScript oder consume() in Java
    -->
    <form class="form" @submit.prevent>

      <!--
        === FORMULAR-ZEILE 1: ETF-Auswahl ===
        <div> gruppiert Label + Select + Hinweis zusammen
      -->
      <div class="form-row">
        <!--
          <label> = Beschriftung für Input-Feld
          for="etf" = Verknüpft Label mit dem Element id="etf" (Klick auf Label = Fokus auf Select)
        -->
        <label for="etf">ETF auswählen</label>

        <!--
          <select> = Dropdown-Menü (wie JComboBox in Java Swing)
          id="etf" = Eindeutige ID (für Label und CSS)
          disabled = Deaktiviert (grau, nicht klickbar) - noch kein Backend
        -->
        <select id="etf" disabled>
          <!-- <option> = Einzelner Eintrag im Dropdown -->
          <option>S&amp;P 500 (Platzhalter)</option>
          <option>MSCI World (Platzhalter)</option>
        </select>

        <!-- <small> = Kleingedruckter Text (semantisch für Nebenbemerkungen) -->
        <small>Später kommt hier eine echte Auswahl aus dem Backend.</small>
      </div>

      <!--
        === FORMULAR-ZEILE 2: Sparrate ===
      -->
      <div class="form-row">
        <label for="rate">Monatliche Sparrate (EUR)</label>

        <!--
          <input> = Eingabefeld (wie JTextField in Java Swing)
          type="number" = Nur Zahlen erlaubt (Browser zeigt Pfeiltasten an)
          placeholder = Beispieltext (wird angezeigt wenn Feld leer ist)
          disabled = Noch deaktiviert
        -->
        <input id="rate" type="number" placeholder="z.B. 200" disabled />
      </div>

      <!--
        === FORMULAR-ZEILE 3: Laufzeit ===
      -->
      <div class="form-row">
        <label for="years">Laufzeit (Jahre)</label>
        <input id="years" type="number" placeholder="z.B. 15" disabled />
      </div>

      <!--
        === SUBMIT-BUTTON ===
        <button> = Schaltfläche (wie JButton in Java Swing)
        type="submit" = Löst submit-Event des Formulars aus (wie ActionListener in Java)
        disabled = Deaktiviert (noch keine Berechnung möglich)
      -->
      <button type="submit" disabled class="btn-disabled">
        Berechnen (kommt später)
      </button>

      <!-- Hinweis für Benutzer -->
      <p class="hint">
        Hinweis: Dies ist ein Prototyp. Die echte Berechnung (Zinseszins, Szenarien) wird später im
        Backend umgesetzt.
      </p>
    </form>
  </section>
</template>

<style scoped>
/**
 * === CSS FÜR FORMULAR-KOMPONENTE ===
 * scoped = Styles gelten nur hier (Kapselung!)
 */

/**
 * Alle <p> innerhalb von class="left" bekommen Abstand nach unten
 */
.left p {
  margin-bottom: 0.75rem;  /* Abstand zwischen Absätzen */
}

/**
 * === FORMULAR-CONTAINER ===
 * Gibt dem Formular einen farbigen Hintergrund und abgerundete Ecken
 */
.form {
  margin-top: 1rem;                         /* Abstand nach oben */
  padding: 1rem;                            /* Innenabstand (Luft zwischen Rand und Inhalt) */
  border-radius: 0.75rem;                   /* Abgerundete Ecken (12px) - modern! */
  background: var(--color-background-soft); /* CSS-Variable = heller Grauton */
  border: 1px solid var(--color-border);    /* 1 Pixel dünner Rahmen */
}

/**
 * === FORMULAR-ZEILE LAYOUT ===
 * Jede Zeile (Label + Input) wird als vertikale Flexbox angeordnet
 */
.form-row {
  display: flex;              /* Flexbox aktivieren */
  flex-direction: column;     /* Kinder stapeln sich VERTIKAL (Label oben, Input unten) */
                              /* Standard wäre "row" = horizontal */
  margin-bottom: 0.75rem;     /* Abstand zwischen den Formularzeilen */
}

/**
 * === LABEL STYLING ===
 * Labels (Beschriftungen) werden fett dargestellt
 */
label {
  font-weight: 500;        /* Schriftstärke (400=normal, 700=fett, 500=mittel) */
  margin-bottom: 0.25rem;  /* Kleiner Abstand zum Input-Feld darunter */
}

/**
 * === INPUT- UND SELECT-FELDER ===
 * Beide Selektoren durch Komma getrennt = gleiche Regeln für beide
 */
input,
select {
  padding: 0.4rem 0.5rem;                /* Innenabstand: oben/unten 0.4rem, links/rechts 0.5rem */
  border-radius: 0.4rem;                 /* Leicht abgerundete Ecken */
  border: 1px solid var(--color-border); /* Rahmen um das Feld */
  font: inherit;                         /* Schriftart vom Elternelement übernehmen */
}

/**
 * === KLEINGEDRUCKTER HINWEISTEXT ===
 */
small {
  font-size: 0.75rem;  /* 75% der normalen Schriftgröße */
  opacity: 0.8;        /* Leicht transparent (80% sichtbar) */
}

/**
 * === DEAKTIVIERTER BUTTON ===
 * Zeigt an, dass Funktion noch nicht verfügbar ist
 */
.btn-disabled {
  margin-top: 0.5rem;       /* Abstand nach oben */
  padding: 0.5rem 0.9rem;   /* Innenabstand (macht Button größer/klickbarer) */
  border-radius: 0.5rem;    /* Abgerundete Ecken */
  border: none;             /* Kein Rahmen */
  background: #ccc;         /* Grau = deaktiviert (Hexadezimal-Farbe) */
  color: #555;              /* Dunkler Text auf grauem Hintergrund */
  cursor: not-allowed;      /* Mauszeiger zeigt "verboten"-Symbol */
}

/**
 * === HINWEIS-TEXT AM ENDE ===
 */
.hint {
  margin-top: 0.5rem;   /* Abstand nach oben */
  font-size: 0.8rem;    /* Etwas kleinere Schrift */
  opacity: 0.8;         /* Leicht transparent */
}
</style>

