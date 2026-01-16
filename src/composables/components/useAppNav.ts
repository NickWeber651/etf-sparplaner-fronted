/**
 * APP NAV LOGIC
 * Business Logic für AppNav Component
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, getUserEmail, logout } from '@/services/authApi'

export function useAppNav() {
  const router = useRouter()

  const loggedIn = computed(() => isAuthenticated())
  const userEmail = computed(() => getUserEmail())

  function handleLogout() {
    logout()
    console.log('👋 Logout erfolgreich')
    router.push('/login')
  }

  return {
    loggedIn,
    userEmail,
    handleLogout,
  }
}

