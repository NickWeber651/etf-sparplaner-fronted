<script setup lang="ts">
/**
 * FORGOT PASSWORD VIEW - PRESENTATION-LOGIC PATTERN
 * VIEW: Template + Styles
 * LOGIC: ForgotPasswordView.logic.ts
 */

import { useForgotPasswordView } from '@/composables/views/useForgotPasswordView'

const {
  email,
  newPassword,
  confirmPassword,
  isLoading,
  errorMessage,
  successMessage,
  handleResetPassword,
} = useForgotPasswordView()

</script>

<template>
  <div class="auth-page">
    <div class="auth-card">

      <!-- === KARTEN-HEADER === -->
      <div class="card-header">
        <h2>Passwort zurücksetzen</h2>
        <p class="subtitle">
          Gib deine E-Mail-Adresse und ein neues Passwort ein.
        </p>
      </div>

      <!-- === FORMULAR === -->
      <form @submit.prevent="handleResetPassword">

        <!-- === ERFOLGSMELDUNG === -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- === FEHLERMELDUNG === -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- === E-MAIL-FELD === -->
        <div class="form-group">
          <label for="reset-email">E-Mail-Adresse</label>
          <input
            id="reset-email"
            v-model="email"
            type="email"
            placeholder="name@beispiel.de"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- === NEUES PASSWORT === -->
        <div class="form-group">
          <label for="new-password">Neues Passwort</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            placeholder="Mindestens 6 Zeichen"
            required
            minlength="6"
            :disabled="isLoading"
          />
        </div>

        <!-- === PASSWORT BESTÄTIGEN === -->
        <div class="form-group">
          <label for="confirm-password">Passwort bestätigen</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            placeholder="Passwort wiederholen"
            required
            minlength="6"
            :disabled="isLoading"
          />
        </div>

        <!-- === SUBMIT-BUTTON === -->
        <button type="submit" class="btn btn-primary" :disabled="isLoading || !!successMessage">
          {{ isLoading ? 'Wird zurückgesetzt...' : 'Passwort zurücksetzen' }}
        </button>

        <!-- === ZURÜCK ZUM LOGIN === -->
        <p class="inline-text">
          Doch nicht?
          <RouterLink to="/login">Zurück zum Login</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/**
 * === CSS FÜR FORGOT PASSWORD VIEW ===
 * Nutzt gleiche Styles wie LoginView und RegisterView
 */

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--color-background);
}

.auth-card {
  max-width: 460px;
  width: 100%;
  background: var(--color-background-soft);
  border-radius: 1.125rem;
  padding: 2rem 2.25rem 2rem;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.15);
}

.card-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-heading);
  text-align: center;
}

.subtitle {
  margin: 0 0 1.5rem;
  color: var(--color-text);
  opacity: 0.8;
  text-align: center;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-heading);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-border-hover);
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.9375rem;
  font-weight: 500;
}

.success-message {
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 0.5rem;
  color: #34d399;
  font-size: 0.9375rem;
  font-weight: 500;
}

.btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 211, 153, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.inline-text {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.inline-text a {
  color: #34d399;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.inline-text a:hover {
  color: #10b981;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 500px) {
  .auth-card {
    padding: 1.5rem 1.25rem;
  }

  .card-header h2 {
    font-size: 1.625rem;
  }
}
</style>

