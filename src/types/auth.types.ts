/**
 * === AUTH TYPE DEFINITIONS ===
 * TypeScript-Definitionen für Authentifizierung
 */

/** Request-Body für Login/Register */
export interface AuthRequest {
  email: string
  password: string
}

/** Response vom Backend nach Login/Register */
export interface AuthResponse {
  token: string
  email: string
  message?: string
}

/** User-Informationen */
export interface User {
  email: string
  token: string
}

