/**
 * === API-SERVICE für Sparplan-Backend ===
 *
 * ZWECK:
 * Diese Datei stellt Funktionen bereit, um mit dem Backend zu kommunizieren.
 * Ähnlich wie ein DAO (Data Access Object) in Java, aber für REST-APIs.
 *
 * KONZEPT (WI 3):
 * - Separation of Concerns: API-Logik getrennt von UI-Komponenten
 * - Single Responsibility: Nur für Backend-Kommunikation zuständig
 * - Environment Variables: Unterschiedliche URLs für Dev/Prod
 */

import { getToken } from './authApi'

/**
 * === BASE URL ===
 * Die Basis-URL des Backends wird aus den Environment-Variablen gelesen.
 *
 * VITE stellt Environment-Variablen über import.meta.env bereit.
 * Variablen müssen mit VITE_ beginnen, um im Frontend verfügbar zu sein.
 *
 * Fallback auf localhost:8080 für lokale Entwicklung ohne .env-Datei.
 */
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8080'

/**
 * === AUTH-HEADER HELPER ===
 * Erstellt die Headers mit Authorization Bearer Token
 */
function getAuthHeaders(): Record<string, string> {
  const token = getToken()

  // Plain object so we can safely add properties in TypeScript
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

import type { SparplanRequest, SparplanResponse } from '@/types'

/**
 * === API-FUNKTIONEN ===
 * Async/Await Pattern für asynchrone HTTP-Requests
 * (Wie Future/CompletableFuture in Java)
 */

/**
 * POST /api/sparplaene - Neuen Sparplan im Backend speichern
 *
 * @param formData - Objekt mit etfName, monatlicheRate, laufzeitJahre
 * @returns Promise mit dem gespeicherten Sparplan (inkl. ID)
 * @throws Error bei HTTP-Fehler (400, 500, etc.)
 *
 * WICHTIG:
 * - Content-Type: application/json - Backend erwartet JSON
 * - Property-Namen MÜSSEN exakt mit Backend übereinstimmen
 */
export async function createSparplan(formData: SparplanRequest): Promise<SparplanResponse> {
  try {
    // fetch() = JavaScript-Standard für HTTP-Requests (wie HttpClient in Java)
    const response = await fetch(`${BASE_URL}/api/sparplaene`, {
      method: 'POST',
      headers: getAuthHeaders(),
      // JSON.stringify() konvertiert JavaScript-Objekt zu JSON-String
      body: JSON.stringify(formData),
    })

    // HTTP-Status prüfen (2xx = Erfolg)
    if (!response.ok) {
      // Bei 401 Unauthorized: Token ungültig oder abgelaufen
      if (response.status === 401) {
        throw new Error('Bitte melde dich erneut an.')
      }
      // Fehler-Details vom Backend auslesen
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    // JSON-Response parsen und zurückgeben
    const data: SparplanResponse = await response.json()
    return data

  } catch (error) {
    // Fehlerbehandlung: Netzwerkfehler, Timeout, etc.
    console.error('❌ Fehler beim Erstellen des Sparplans:', error)
    throw error // Fehler weiterwerfen, damit UI reagieren kann
  }
}

/**
 * GET /api/sparplaene - Alle gespeicherten Sparpläne abrufen
 *
 * @returns Promise mit Array aller Sparpläne
 * @throws Error bei HTTP-Fehler
 */
export async function getSparplaene(): Promise<SparplanResponse[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/sparplaene`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // Bei 401 Unauthorized: Token ungültig oder abgelaufen
      if (response.status === 401) {
        throw new Error('Bitte melde dich erneut an.')
      }
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: SparplanResponse[] = await response.json()
    return data

  } catch (error) {
    console.error('❌ Fehler beim Laden der Sparpläne:', error)
    throw error
  }
}

/**
 * DELETE /api/sparplaene/{id} - Einen gespeicherten Sparplan löschen
 *
 * @param id - ID des Sparplans
 * @returns Promise<void>
 * @throws Error bei HTTP-Fehler (401/403/404/500)
 */
export async function deleteSparplan(id: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/sparplaene/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Bitte melde dich erneut an.')
      }
      if (response.status === 403) {
        throw new Error('Du darfst diesen Sparplan nicht löschen.')
      }
      if (response.status === 404) {
        throw new Error('Sparplan nicht gefunden (evtl. schon gelöscht).')
      }

      // Backend kann optional JSON-Fehler liefern – robust auslesen
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    // Bei 204 No Content gibt es keinen Body – einfach fertig.
    return
  } catch (error) {
    console.error('❌ Fehler beim Löschen des Sparplans:', error)
    throw error
  }
}

/**
 * PUT /api/sparplaene/{id} - Einen gespeicherten Sparplan aktualisieren
 *
 * @param id - ID des Sparplans
 * @param formData - neue Daten (etfName, monatlicheRate, laufzeitJahre)
 * @returns Promise<SparplanResponse> - der aktualisierte Sparplan
 * @throws Error bei HTTP-Fehler (401/403/404/500)
 */
export async function updateSparplan(id: number, formData: SparplanRequest): Promise<SparplanResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/sparplaene/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Bitte melde dich erneut an.')
      }
      if (response.status === 403) {
        throw new Error('Du darfst diesen Sparplan nicht bearbeiten.')
      }
      if (response.status === 404) {
        throw new Error('Sparplan nicht gefunden (evtl. gelöscht).')
      }

      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: SparplanResponse = await response.json()
    return data
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren des Sparplans:', error)
    throw error
  }
}

/**
 * === ZUSAMMENFASSUNG (für WI 3) ===
 *
 * 1. ENVIRONMENT VARIABLES
 *    - Konfiguration von außen steuerbar (Dev vs. Prod)
 *    - Keine hardcodierte URLs im Code
 *
 * 2. TYPESCRIPT INTERFACES
 *    - Type Safety: Compiler prüft Datenstrukturen
 *    - Bessere IDE-Unterstützung (Autocomplete)
 *
 * 3. ASYNC/AWAIT
 *    - Moderne Alternative zu Callbacks/Promises
 *    - Lesbarer Code für asynchrone Operationen
 *
 * 4. ERROR HANDLING
 *    - try/catch für Fehlerbehandlung
 *    - Aussagekräftige Fehlermeldungen
 *
 * 5. SEPARATION OF CONCERNS
 *    - API-Logik getrennt von UI-Komponenten
 *    - Wiederverwendbar und testbar
 */
