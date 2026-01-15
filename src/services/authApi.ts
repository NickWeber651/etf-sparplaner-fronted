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

const TOKEN_KEY = 'auth_token'
const USER_EMAIL_KEY = 'user_email'

/* === NEUE KONSTANTEN: MAX-LÄNGEN FÜR INPUTS === */
export const MAX_EMAIL_LENGTH = 254
export const MAX_PASSWORD_LENGTH = 128

/* === NEUE HILFSFUNKTIONEN: VALIDIERUNG VOR API-Aufruf === */
function validateEmailLength(email: string, context = 'E-Mail') {
  const len = String(email || '').trim().length
  if (len === 0) {
    throw new Error(`${context} darf nicht leer sein`)
  }
  if (len > MAX_EMAIL_LENGTH) {
    throw new Error(`${context} ist zu lang (max. ${MAX_EMAIL_LENGTH} Zeichen)`)
  }
}

function validatePasswordLength(password: string, context = 'Passwort') {
  const len = String(password || '').length
  if (len === 0) {
    throw new Error(`${context} darf nicht leer sein`)
  }
  if (len > MAX_PASSWORD_LENGTH) {
    throw new Error(`${context} ist zu lang (max. ${MAX_PASSWORD_LENGTH} Zeichen)`)
  }
}

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

function normalizeEmail(email: string): string {
  return String(email || '').trim().toLowerCase()
}

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
  // store canonical (trimmed + lowercase) email to avoid mismatches
  localStorage.setItem(USER_EMAIL_KEY, normalizeEmail(email))
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
    // clientseitige Validierung: verhindert sehr lange/empty Eingaben
    validateEmailLength(email)
    validatePasswordLength(password)
    const canonicalEmail = normalizeEmail(email)
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: canonicalEmail, password } as AuthRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errMsg = errorData?.error || errorData?.message
      if (response.status === 401) {
        throw new Error(errMsg || 'Ungültige E-Mail oder Passwort')
      }
      throw new Error(errMsg || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: AuthResponse = await response.json()

    // Token und canonical Email im localStorage speichern
    saveToken(data.token)
    saveUserEmail(canonicalEmail)

    console.log('✅ Login erfolgreich:', canonicalEmail)
    // return normalized email to caller
    return { ...data, email: canonicalEmail }

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
    // clientseitige Validierung vor Registrierung
    validateEmailLength(email)
    validatePasswordLength(password)
    const canonicalEmail = normalizeEmail(email)
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: canonicalEmail, password } as AuthRequest),
    })

    if (!response.ok) {
      // robustes Parsen: JSON, sonst Text (Backend kann unterschiedliche Formate liefern)
      const txt = await response.text().catch(() => '')
      let parsed: any = null
      try {
        parsed = txt ? JSON.parse(txt) : null
      } catch {
        parsed = null
      }
      const errMsg = parsed?.error || parsed?.message || txt || null

      // Nur 409 = Conflict wird eindeutig als "bereits registriert" interpretiert.
      // 400 kann Validierungsfehler (z.B. schwaches Passwort) sein — gib die Backend-Meldung weiter.
      if (response.status === 409) {
        throw new Error(errMsg || 'Diese E-Mail-Adresse ist bereits registriert')
      }

      throw new Error(errMsg || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: AuthResponse = await response.json()

    // Token und canonical Email im localStorage speichern (Auto-Login nach Registrierung)
    saveToken(data.token)
    saveUserEmail(canonicalEmail)

    console.log('✅ Registrierung erfolgreich:', canonicalEmail)
    return { ...data, email: canonicalEmail }

  } catch (error) {
    console.error('❌ Registrierung fehlgeschlagen:', error)
    throw error
  }
}

/**
 * POST /api/auth/reset-password - Passwort zurücksetzen (OHNE E-Mail-Versand)
 *
 * @param email - E-Mail-Adresse des Benutzers
 * @param newPassword - Neues Passwort
 * @returns Promise<void>
 * @throws Error wenn E-Mail nicht gefunden oder Netzwerkfehler
 */
export async function resetPassword(email: string, newPassword: string): Promise<void> {
  try {
    // Validierung: E-Mail und neues Passwort
    validateEmailLength(email, 'E-Mail')
    validatePasswordLength(newPassword, 'Neues Passwort')
    const canonicalEmail = normalizeEmail(email)
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: canonicalEmail, newPassword }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errMsg = errorData?.error || errorData?.message
      if (response.status === 404) {
        throw new Error(errMsg || 'E-Mail-Adresse nicht gefunden')
      }
      throw new Error(errMsg || `HTTP ${response.status}: ${response.statusText}`)
    }

    console.log('✅ Passwort erfolgreich zurückgesetzt für:', canonicalEmail)

  } catch (error) {
    console.error('❌ Passwort-Reset fehlgeschlagen:', error)
    throw error
  }
}
