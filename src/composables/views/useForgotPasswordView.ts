import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { resetPassword } from '@/services/authApi'

export function useForgotPasswordView() {
  const router = useRouter()

  const email = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  async function handleResetPassword() {
    errorMessage.value = null
    successMessage.value = null

    if (!email.value || !newPassword.value || !confirmPassword.value) {
      errorMessage.value = 'Bitte fulle alle Felder aus!'
      return
    }

    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'Die Passworter stimmen nicht uberein!'
      return
    }

    if (newPassword.value.length < 6) {
      errorMessage.value = 'Das Passwort muss mindestens 6 Zeichen lang sein!'
      return
    }

    console.log('Passwort-Reset fuer:', email.value)

    isLoading.value = true

    try {
      await resetPassword(email.value, newPassword.value)
      successMessage.value = 'Passwort erfolgreich zuruckgesetzt! Du wirst zum Login weitergeleitet...'

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Passwort-Reset fehlgeschlagen:', error)
      errorMessage.value = error instanceof Error
        ? error.message
        : 'Passwort-Reset fehlgeschlagen. Bitte versuche es erneut.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    newPassword,
    confirmPassword,
    isLoading,
    errorMessage,
    successMessage,
    handleResetPassword,
  }
}

