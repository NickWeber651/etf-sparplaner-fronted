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
 * === TYPESCRIPT INTERFACES ===
 * Definieren die Struktur der Daten (wie Java-Klassen/DTOs)
 */

/**
 * Datenstruktur für einen neuen Sparplan (Request-Body für POST)
 * Entspricht dem Java-DTO im Backend
 */
export interface SparplanRequest {
  etfName: string        // z.B. "S&P 500 (TER: 0.07 %)"
  monatlicheRate: number // z.B. 200
  laufzeitJahre: number  // z.B. 15
}

/**
 * Datenstruktur für einen gespeicherten Sparplan (Response vom Backend)
 * Enthält zusätzlich ID und Erstellungsdatum
 */
export interface SparplanResponse {
  id: number             // Auto-generierte ID vom Backend
  etfName: string
  monatlicheRate: number
  laufzeitJahre: number
  erstelltAm: string     // ISO-Date-String, z.B. "2025-12-06"
}

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
      headers: {
        'Content-Type': 'application/json',
      },
      // JSON.stringify() konvertiert JavaScript-Objekt zu JSON-String
      body: JSON.stringify(formData),
    })

    // HTTP-Status prüfen (2xx = Erfolg)
    if (!response.ok) {
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
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
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

