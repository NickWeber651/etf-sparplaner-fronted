<script setup lang="ts">
/**
 * LOGIN VIEW - PRESENTATION-LOGIC PATTERN
 * VIEW: Template + Styles
 * LOGIC: LoginView.logic.ts
 */

import { useLoginView } from '@/composables/views/useLoginView'

const {
  email,
  password,
  isLoading,
  errorMessage,
  handleLogin,
} = useLoginView()

</script>

<template>
  <!--
    === AUTH-PAGE LAYOUT ===
    Vollbild-Layout mit zentrierter Karte
  -->
  <div class="auth-page">
    <div class="auth-card">

      <!-- === KARTEN-HEADER === -->
      <div class="card-header">
        <h2>Anmelden</h2>
        <p class="subtitle">
          Melde dich an, um deine gespeicherten Sparpläne zu sehen und neue Simulationen zu erstellen.
        </p>
      </div>

      <!--
        === FORMULAR ===
        @submit.prevent = Event-Handler für Submit (verhindert Seitenreload)
        Wie: form.addActionListener(...) in Java Swing
      -->
      <form @submit.prevent="handleLogin">

        <!-- === FEHLERMELDUNG === -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- === E-MAIL-FELD === -->
        <div class="form-group">
          <label for="login-email">E-Mail-Adresse</label>
          <!--
            v-model = Two-Way Data Binding (wie Property Binding in JavaFX)
            Änderungen im Input aktualisieren automatisch email.value
            Änderungen an email.value aktualisieren automatisch das Input-Feld
          -->
          <input
            id="login-email"
            v-model="email"
            type="email"
            placeholder="name@beispiel.de"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- === PASSWORT-FELD === -->
        <div class="form-group">
          <label for="login-password">Passwort</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- === SUBMIT-BUTTON === -->
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Wird angemeldet...' : 'Anmelden' }}
        </button>

        <!-- === PASSWORT VERGESSEN LINK === -->
        <p class="forgot-link">
          <RouterLink to="/forgot-password" class="link-plain">Passwort vergessen?</RouterLink>
        </p>

        <!--
          === REGISTRIERUNGS-LINK ===
          RouterLink = Vue Router Komponente (wie <a> aber ohne Seitenreload)
          to="/register" = Navigiert zu RegisterView (Client-Side Routing)
        -->
        <p class="inline-text">
          Noch kein Konto?
          <RouterLink to="/register">Jetzt registrieren</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/**
 * === CSS FÜR LOGIN-VIEW ===
 * scoped = Styles gelten nur für diese Komponente (Kapselung!)
 *
 * WICHTIG: Nutzt bestehende CSS-Variablen aus main.css
 * - var(--color-background) = Dunkler Hintergrund
 * - var(--color-text) = Helle Textfarbe
 * = Automatisches Dark Theme!
 */

/**
 * === VOLLBILD-CONTAINER ===
 * Flexbox zentriert die Karte vertikal und horizontal
 */
.auth-page {
  min-height: 100vh;                    /* 100% Viewport Height = volle Bildschirmhöhe */
  display: flex;                         /* Flexbox aktivieren */
  align-items: center;                   /* Vertikal zentrieren */
  justify-content: center;               /* Horizontal zentrieren */
  padding: 2rem 1rem;                    /* Abstand zum Rand (Responsive Design) */
  background: var(--color-background);   /* Dunkler Hintergrund aus main.css */
}

/**
 * === AUTH-KARTE ===
 * Die weiße/helle Karte in der Mitte
 */
.auth-card {
  max-width: 460px;                           /* Maximale Breite (nicht zu breit) */
  width: 100%;                                /* 100% bis max-width erreicht ist */
  background: var(--color-background-soft);   /* Hellerer Hintergrund für Karte */
  border-radius: 1.125rem;                    /* 18px abgerundete Ecken - modern! */
  padding: 2rem 2.25rem 2rem;                 /* Innenabstand: oben 2rem, Seiten 2.25rem, unten 2rem */
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.15); /* Schatten = "schwebender" Effekt */
}

/**
 * === KARTEN-HEADER ===
 * Überschrift und Untertitel
 */
.card-header h2 {
  margin: 0 0 0.5rem;                /* Abstand nach unten */
  font-size: 1.875rem;               /* 30px Schriftgröße */
  color: var(--color-heading);       /* Textfarbe aus main.css */
}

.card-header .subtitle {
  margin: 0 0 1.5rem;         /* Abstand nach unten (Platz zum Formular) */
  font-size: 0.97rem;         /* Etwas kleiner als normaler Text */
  color: var(--color-text);   /* Textfarbe aus main.css */
  opacity: 0.85;              /* 85% sichtbar = etwas blasser */
  line-height: 1.5;           /* Zeilenhöhe für bessere Lesbarkeit */
}

/**
 * === FORMULAR-GRUPPE ===
 * Container für Label + Input
 */
.form-group {
  margin-bottom: 1rem;  /* Abstand zwischen den Formularfeldern */
}

/**
 * === LABELS ===
 * Beschriftungen über den Input-Feldern
 */
.form-group label {
  display: block;              /* Eigene Zeile (nicht inline) */
  font-size: 0.875rem;         /* 14px Schriftgröße */
  margin-bottom: 0.375rem;     /* Kleiner Abstand zum Input */
  color: var(--color-text);    /* Textfarbe aus main.css */
  font-weight: 500;            /* Etwas fetter (400=normal, 700=bold) */
}

/**
 * === INPUT-FELDER ===
 * E-Mail und Passwort-Felder
 */
.form-group input {
  width: 100%;                           /* Volle Breite des Containers */
  padding: 0.625rem 0.875rem;            /* Innenabstand: vertikal 10px, horizontal 14px */
  border-radius: 0.625rem;               /* 10px abgerundete Ecken */
  border: 1px solid var(--color-border); /* Rahmen aus main.css */
  font-size: 0.95rem;                    /* Schriftgröße */
  background: var(--color-background);   /* Hintergrund aus main.css */
  color: var(--color-text);              /* Textfarbe aus main.css */
  transition: border-color 0.2s ease;    /* Sanfte Animation bei Hover/Focus */
}

/**
 * :focus = CSS-Pseudoklasse (wenn Feld aktiv/fokussiert ist)
 */
.form-group input:focus {
  outline: none;                              /* Standard-Browser-Outline entfernen */
  border-color: var(--color-border-hover);    /* Hellerer Rahmen bei Fokus */
}

/**
 * === BUTTONS ===
 * Basis-Styling für alle Buttons
 */
.btn {
  display: inline-block;      /* Wie Block, aber behält inline-Eigenschaften */
  width: 100%;                /* Volle Breite */
  padding: 0.625rem 1.125rem; /* Innenabstand */
  border-radius: 999px;       /* Komplett abgerundet = Pill-Form */
  border: none;               /* Kein Rahmen */
  font-size: 0.95rem;         /* Schriftgröße */
  font-weight: 600;           /* Fett (600 = semi-bold) */
  cursor: pointer;            /* Mauszeiger = Hand-Symbol */
  text-align: center;         /* Text zentrieren */
  transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease;
  /* ^ Sanfte Animationen für Hover-Effekt */
  margin-top: 0.5rem;         /* Abstand nach oben */
}

/**
 * === PRIMARY BUTTON ===
 * Grüner Haupt-Button (Anmelden)
 */
.btn-primary {
  background: var(--vt-c-green);                    /* Grün aus base.css */
  color: var(--vt-c-black);                         /* Schwarzer Text auf grünem Hintergrund */
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25); /* Grüner Schatten */
}

/**
 * :hover = CSS-Pseudoklasse (wenn Maus über Element schwebt)
 */
.btn-primary:hover {
  filter: brightness(1.05);                          /* 5% heller */
  transform: translateY(-1px);                       /* 1px nach oben (Lift-Effekt) */
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.35); /* Größerer Schatten */
}

/**
 * === PASSWORT-VERGESSEN LINK ===
 */
.forgot-link {
  margin-top: 0.75rem;  /* Abstand nach oben */
  font-size: 0.875rem;  /* 14px Schriftgröße */
  text-align: center;   /* Zentriert */
}

/**
 * === FEHLERMELDUNG ===
 * Rote Box für Fehler bei Login/Registrierung
 */
.error-message {
  background-color: rgba(239, 68, 68, 0.1);  /* Rot mit 10% Deckkraft */
  border: 1px solid rgba(239, 68, 68, 0.3);  /* Roter Rahmen */
  color: #ef4444;                             /* Roter Text */
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

/**
 * === PLAIN LINKS ===
 * Einfache Text-Links ohne Button-Styling
 */
.link-plain {
  color: hsla(160, 100%, 37%, 1);  /* Grün (HSL-Farbformat) */
  text-decoration: none;            /* Kein Unterstrich */
  font-weight: 500;                 /* Etwas fetter */
}

.link-plain:hover {
  text-decoration: underline;  /* Unterstrich beim Hover */
}

/**
 * === INLINE-TEXT ===
 * "Noch kein Konto? Jetzt registrieren"
 */
.inline-text {
  margin-top: 1rem;          /* Abstand nach oben */
  font-size: 0.875rem;       /* 14px */
  color: var(--color-text);  /* Textfarbe aus main.css */
  opacity: 0.85;             /* 85% sichtbar */
  text-align: center;        /* Zentriert */
}

/**
 * RouterLink wird zu <a> gerendert - daher a-Selektor
 */
.inline-text a {
  color: hsla(160, 100%, 37%, 1);  /* Grün */
  text-decoration: none;            /* Kein Unterstrich */
  font-weight: 500;                 /* Etwas fetter */
}

.inline-text a:hover {
  text-decoration: underline;  /* Unterstrich beim Hover */
}

/**
 * === RESPONSIVE DESIGN ===
 * Auf kleinen Bildschirmen (Smartphones) weniger Padding
 */
@media (max-width: 500px) {
  .auth-card {
    padding: 1.5rem 1.25rem;  /* Weniger Innenabstand */
  }
}
</style>

