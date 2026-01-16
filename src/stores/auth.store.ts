/**
 * === AUTH STORE (PINIA) ===
 * Zentrales State-Management für Authentifizierung
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { getToken, getUserEmail, logout as apiLogout } from '@/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const email = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed<User | null>(() => {
    if (!token.value || !email.value) return null

    return {
      email: email.value,
      token: token.value,
    }
  })

  // Actions

  /**
   * Lädt Auth-State aus localStorage
   */
  function loadAuth() {
    token.value = getToken()
    email.value = getUserEmail()
  }

  /**
   * Setzt Auth-State nach erfolgreichem Login/Register
   */
  function setAuth(newToken: string, newEmail: string) {
    token.value = newToken
    email.value = newEmail
  }

  /**
   * Löscht Auth-State (Logout)
   */
  function clearAuth() {
    apiLogout()
    token.value = null
    email.value = null
  }

  // Initial laden
  loadAuth()

  return {
    // State
    token,
    email,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    loadAuth,
    setAuth,
    clearAuth,
  }
})

