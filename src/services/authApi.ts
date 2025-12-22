/**
 * === AUTH-API-SERVICE ===
 *
 * ZWECK:
 * Service für Authentifizierung (Login, Registrierung, Logout)
 * Kommuniziert mit dem Spring Boot Backend unter /api/auth/*
 *
 * TOKEN-HANDLING:
 * - JWT wird nach Login/Register in localStorage gespeichert
 * - Token wird bei jedem API-Request als Authorization Header mitgesendet
 */

/**
 * === BASE URL ===
 * Gleiche Basis-URL wie sparplanApi.ts
 */
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080'

/**
 * === LOCALSTORAGE KEY ===
 * Konstante für den Key, unter dem der Token gespeichert wird
 */
const TOKEN_KEY = 'auth_token'
const USER_EMAIL_KEY = 'user_email'

/**
 * === TYPESCRIPT INTERFACES ===
 */

/** Request-Body für Login und Registrierung */
export interface AuthRequest {
  email: string
  password: string
}

/** Response vom Backend nach erfolgreichem Login/Register */
export interface AuthResponse {
  token: string
  email: string
}

/**
 * === TOKEN-FUNKTIONEN ===
 * Hilfsfunktionen für Token-Management
 */

/**
 * Token im localStorage speichern
 */
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Token aus localStorage lesen
 * @returns Token oder null wenn nicht vorhanden
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * User-Email im localStorage speichern
 */
export function saveUserEmail(email: string): void {
  localStorage.setItem(USER_EMAIL_KEY, email)
}

/**
 * User-Email aus localStorage lesen
 */
export function getUserEmail(): string | null {
  return localStorage.getItem(USER_EMAIL_KEY)
}

/**
 * Prüfen ob User eingeloggt ist (Token vorhanden)
 */
export function isAuthenticated(): boolean {
  const token = getToken()
  return token !== null && token.length > 0
}

/**
 * Logout: Token und User-Email aus localStorage entfernen
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
}

/**
 * === API-FUNKTIONEN ===
 */

/**
 * POST /api/auth/login - Benutzer anmelden
 *
 * @param email - E-Mail-Adresse
 * @param password - Passwort
 * @returns Promise mit AuthResponse (token + email)
 * @throws Error bei ungültigen Credentials oder Netzwerkfehler
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as AuthRequest),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Ungültige E-Mail oder Passwort')
      }
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: AuthResponse = await response.json()

    // Token und Email im localStorage speichern
    saveToken(data.token)
    saveUserEmail(data.email)

    console.log('✅ Login erfolgreich:', data.email)
    return data

  } catch (error) {
    console.error('❌ Login fehlgeschlagen:', error)
    throw error
  }
}

/**
 * POST /api/auth/register - Neuen Benutzer registrieren
 *
 * @param email - E-Mail-Adresse
 * @param password - Passwort
 * @returns Promise mit AuthResponse (token + email)
 * @throws Error bei bereits vergebener Email oder Netzwerkfehler
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as AuthRequest),
    })

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Diese E-Mail-Adresse ist bereits registriert')
      }
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: AuthResponse = await response.json()

    // Token und Email im localStorage speichern (Auto-Login nach Registrierung)
    saveToken(data.token)
    saveUserEmail(data.email)

    console.log('✅ Registrierung erfolgreich:', data.email)
    return data

  } catch (error) {
    console.error('❌ Registrierung fehlgeschlagen:', error)
    throw error
  }
}

