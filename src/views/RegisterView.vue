<script setup lang="ts">
/**
 * === REGISTRIERUNGS-VIEW ===
 * Erstellt neue Benutzer-Accounts
 *
 * KOMPLEXER als Login, weil:
 * - Passwort-Bestätigung nötig (müssen übereinstimmen)
 * - Checkbox für Nutzungsbedingungen (muss aktiviert sein)
 * - Mehr Validierungen
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authApi'

/**
 * === REACTIVE STATE ===
 * Jedes Input-Feld braucht eine ref()-Variable
 * (wie private Felder in einer Java-Klasse)
 */
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')            // Passwort-Wiederholung
const termsAccepted = ref(false)           // Checkbox-Status (boolean)
const isLoading = ref(false)               // Ladezustand
const errorMessage = ref<string | null>(null)      // Fehlermeldung
const successMessage = ref<string | null>(null)    // Erfolgsmeldung

// Router für Navigation nach Registrierung
const router = useRouter()

/**
 * === REGISTRIERUNGS-HANDLER ===
 * Validiert alle Eingaben bevor sie ans Backend geschickt werden
 *
 * Validierungen (wie in einer Service-Schicht in Java):
 * 1. Alle Felder ausgefüllt? (HTML "required" Attribut prüft das auch)
 * 2. Passwörter identisch?
 * 3. Nutzungsbedingungen akzeptiert?
 * 4. E-Mail-Format korrekt? (Browser prüft das bei type="email")
 */
async function handleRegister() {
  // Meldungen zurücksetzen
  errorMessage.value = null
  successMessage.value = null

  // Validierung 1: Passwörter vergleichen
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Die Passwörter stimmen nicht überein!'
    return  // Frühes Return (wie Guard Clause in Clean Code)
  }

  // Validierung 2: Nutzungsbedingungen akzeptiert?
  if (!termsAccepted.value) {
    errorMessage.value = 'Bitte akzeptiere die Nutzungsbedingungen.'
    return
  }

  // Debug-Ausgabe (wie Logger in Java)
  console.log('Registrierung:', {
    email: email.value,
    password: '***',  // Nie echtes Passwort loggen!
    termsAccepted: termsAccepted.value
  })

  // Ladezustand aktivieren
  isLoading.value = true

  try {
    // API-Call zum Backend
    await register(email.value, password.value)

    // Erfolg: Meldung anzeigen und zur Startseite navigieren
    console.log('✅ Registrierung erfolgreich, navigiere zu Home...')
    successMessage.value = 'Registrierung erfolgreich! Du wirst weitergeleitet...'

    // Kurz warten, dann zur Startseite navigieren (Auto-Login)
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error) {
    // Fehlerbehandlung
    console.error('❌ Registrierung fehlgeschlagen:', error)
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Registrierung fehlgeschlagen. Bitte versuche es erneut.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!--
    === AUTH-PAGE LAYOUT ===
    Identisch zu LoginView (wiederverwendbare CSS-Klassen!)
  -->
  <div class="auth-page">
    <div class="auth-card">

      <!-- === KARTEN-HEADER === -->
      <div class="card-header">
        <h2>Konto erstellen</h2>
        <p class="subtitle">
          Lege ein kostenloses Konto an, um deine ETF-Sparpläne zu speichern und später wieder aufzurufen.
        </p>
      </div>

      <!--
        === REGISTRIERUNGS-FORMULAR ===
        Mehr Felder als Login (E-Mail, Passwort, Passwort-Wiederholung, Checkbox)
      -->
      <form @submit.prevent="handleRegister">

        <!-- === FEHLERMELDUNG === -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- === ERFOLGSMELDUNG === -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- === E-MAIL-FELD === -->
        <div class="form-group">
          <label for="reg-email">E-Mail-Adresse</label>
          <!--
            type="email" = Browser validiert E-Mail-Format automatisch
            required = Feld muss ausgefüllt sein (HTML5-Validierung)
          -->
          <input
            id="reg-email"
            v-model="email"
            type="email"
            placeholder="name@beispiel.de"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- === PASSWORT-FELD === -->
        <div class="form-group">
          <label for="reg-password">Passwort</label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- === PASSWORT-WIEDERHOLUNGS-FELD === -->
        <div class="form-group">
          <label for="reg-password2">Passwort wiederholen</label>
          <!--
            Zweites Passwort-Feld zur Bestätigung
            Wird in handleRegister() mit password verglichen
          -->
          <input
            id="reg-password2"
            v-model="passwordConfirm"
            type="password"
            placeholder="••••••••"
            required
            :disabled="isLoading"
          />
        </div>

        <!--
          === CHECKBOX-ZEILE ===
          Für Nutzungsbedingungen / Datenschutz
        -->
        <div class="checkbox-row">
          <!--
            v-model bei Checkbox = bindet an Boolean-Variable
            checked = true, unchecked = false
          -->
          <input
            id="reg-terms"
            v-model="termsAccepted"
            type="checkbox"
            :disabled="isLoading"
          />
          <label for="reg-terms">
            Ich akzeptiere die Datenschutzbestimmungen und Nutzungsbedingungen.
          </label>
        </div>

        <!-- === SUBMIT-BUTTON === -->
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Wird erstellt...' : 'Konto erstellen' }}
        </button>

        <!--
          === LOGIN-LINK ===
          Für User die schon ein Konto haben
          RouterLink = Navigation ohne Seitenreload (SPA = Single Page Application)
        -->
        <p class="inline-text">
          Du hast schon ein Konto?
          <RouterLink to="/login">Jetzt anmelden</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/**
 * === CSS FÜR REGISTER-VIEW ===
 * Fast identisch zu LoginView - nur checkbox-row ist neu
 *
 * BEST PRACTICE: CSS wiederverwenden!
 * In echten Projekten würde man diese Styles in eine gemeinsame
 * AuthLayout-Komponente auslagern (DRY = Don't Repeat Yourself)
 */

/**
 * === VOLLBILD-CONTAINER ===
 */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--color-background);
}

/**
 * === AUTH-KARTE ===
 */
.auth-card {
  max-width: 460px;
  width: 100%;
  background: var(--color-background-soft);
  border-radius: 1.125rem;
  padding: 2rem 2.25rem 2rem;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.15);
}

/**
 * === KARTEN-HEADER ===
 */
.card-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.875rem;
  color: var(--color-heading);
}

.card-header .subtitle {
  margin: 0 0 1.5rem;
  font-size: 0.97rem;
  color: var(--color-text);
  opacity: 0.85;
  line-height: 1.5;
}

/**
 * === FORMULAR-GRUPPE ===
 */
.form-group {
  margin-bottom: 1rem;
}

/**
 * === LABELS ===
 */
.form-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
  color: var(--color-text);
  font-weight: 500;
}

/**
 * === INPUT-FELDER ===
 */
.form-group input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 0.625rem;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-border-hover);
}

/**
 * === CHECKBOX-ZEILE ===
 * NEU: Spezifisch für Registrierung
 * Flexbox legt Checkbox und Label nebeneinander
 */
.checkbox-row {
  display: flex;                /* Flexbox = Elemente nebeneinander */
  align-items: flex-start;      /* Oben ausrichten (nicht mittig) */
  gap: 0.5rem;                  /* Abstand zwischen Checkbox und Label */
  font-size: 0.875rem;          /* 14px Schriftgröße */
  color: var(--color-text);     /* Textfarbe aus main.css */
  opacity: 0.9;                 /* 90% sichtbar */
  margin: 0.75rem 0 1.25rem;    /* Abstände: oben 0.75rem, unten 1.25rem */
}

/**
 * Checkbox selbst
 */
.checkbox-row input {
  margin-top: 0.125rem;  /* Kleine Verschiebung nach unten für optische Ausrichtung */
  cursor: pointer;        /* Hand-Symbol beim Hover */
}

/**
 * Label neben der Checkbox
 */
.checkbox-row label {
  cursor: pointer;     /* Gesamte Zeile ist klickbar */
  font-weight: 400;    /* Normal (nicht fett) */
}

/**
 * === BUTTONS ===
 */
.btn {
  display: inline-block;
  width: 100%;
  padding: 0.625rem 1.125rem;
  border-radius: 999px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease;
}

/**
 * === PRIMARY BUTTON ===
 */
.btn-primary {
  background: var(--vt-c-green);
  color: var(--vt-c-black);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25);
}

.btn-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.35);
}

/**
 * === FEHLERMELDUNG ===
 */
.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

/**
 * === ERFOLGSMELDUNG ===
 */
.success-message {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

/**
 * === INLINE-TEXT ===
 */
.inline-text {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.85;
  text-align: center;
}

.inline-text a {
  color: hsla(160, 100%, 37%, 1);
  text-decoration: none;
  font-weight: 500;
}

.inline-text a:hover {
  text-decoration: underline;
}

/**
 * === RESPONSIVE DESIGN ===
 */
@media (max-width: 500px) {
  .auth-card {
    padding: 1.5rem 1.25rem;
  }
}
</style>

