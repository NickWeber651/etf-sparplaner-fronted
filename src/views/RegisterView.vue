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

/**
 * === REACTIVE STATE ===
 * Jedes Input-Feld braucht eine ref()-Variable
 * (wie private Felder in einer Java-Klasse)
 */
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')            // Passwort-Wiederholung
const termsAccepted = ref(false)           // Checkbox-Status (boolean)
// Router wird später für Navigation nach Registrierung gebraucht
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
function handleRegister() {
  // Validierung 1: Passwörter vergleichen
  if (password.value !== passwordConfirm.value) {
    alert('Die Passwörter stimmen nicht überein!')
    return  // Frühes Return (wie Guard Clause in Clean Code)
  }

  // Validierung 2: Nutzungsbedingungen akzeptiert?
  if (!termsAccepted.value) {
    alert('Bitte akzeptiere die Nutzungsbedingungen.')
    return
  }

  // Debug-Ausgabe (wie Logger in Java)
  console.log('Registrierung:', {
    email: email.value,
    password: '***',  // Nie echtes Passwort loggen!
    termsAccepted: termsAccepted.value
  })

  // TODO: Später API-Call implementieren
  // const response = await fetch('/api/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email: email.value, password: password.value })
  // })
  // if (response.ok) {
  //   alert('Registrierung erfolgreich!')
  //   router.push('/login')
  // }

  alert('Registrierungs-Funktion kommt später (Backend-Integration)')
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
          />
          <label for="reg-terms">
            Ich akzeptiere die Datenschutzbestimmungen und Nutzungsbedingungen.
          </label>
        </div>

        <!-- === SUBMIT-BUTTON === -->
        <button type="submit" class="btn btn-primary">Konto erstellen</button>

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

