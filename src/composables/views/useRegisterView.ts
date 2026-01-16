/**
 * REGISTER VIEW LOGIC
 * Business Logic fuer RegisterView
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authApi'

export function useRegisterView() {
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const passwordConfirm = ref('')
  const termsAccepted = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  async function handleRegister() {
    errorMessage.value = null
    successMessage.value = null

    if (password.value !== passwordConfirm.value) {
      errorMessage.value = 'Die Passwörter stimmen nicht überein!'
      return
    }

    if (!termsAccepted.value) {
      errorMessage.value = 'Bitte akzeptiere die Nutzungsbedingungen.'
      return
    }

    console.log('Registrierung:', {
      email: email.value,
      password: '***',
      termsAccepted: termsAccepted.value
    })

    isLoading.value = true

    try {
      await register(email.value, password.value)
      console.log('✅ Registrierung erfolgreich, navigiere zu Home...')
      successMessage.value = 'Registrierung erfolgreich! Du wirst weitergeleitet...'

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      console.error('❌ Registrierung fehlgeschlagen:', error)
      errorMessage.value = error instanceof Error
        ? error.message
        : 'Registrierung fehlgeschlagen. Bitte versuche es erneut.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    passwordConfirm,
    termsAccepted,
    isLoading,
    errorMessage,
    successMessage,
    handleRegister,
  }
}

