import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/authApi'

export function useLoginView() {
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  async function handleLogin() {
    errorMessage.value = null

    if (!email.value || !password.value) {
      errorMessage.value = 'Bitte fulle alle Felder aus!'
      return
    }

    console.log('Login-Versuch:', {
      email: email.value,
      password: '***'
    })

    isLoading.value = true

    try {
      await login(email.value, password.value)
      console.log('Login erfolgreich, navigiere zu Home...')
      router.push('/')
    } catch (error) {
      console.error('Login fehlgeschlagen:', error)
      errorMessage.value = error instanceof Error
        ? error.message
        : 'Login fehlgeschlagen. Bitte versuche es erneut.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    isLoading,
    errorMessage,
    handleLogin,
  }
}

