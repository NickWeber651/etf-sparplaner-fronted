/**
 * === VALIDATION UTILITIES ===
 * Wiederverwendbare Validierungsfunktionen
 */

/** Validierungs-Konstanten */
export const VALIDATION_LIMITS = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MAX_LENGTH: 128,
  ETF_NAME_MAX_LENGTH: 30,
  AMOUNT_MAX_DIGITS: 12,
  DURATION_MAX_YEARS: 50,
  SPARRATE_MIN: 25,
  SPARRATE_MAX: 10000,
  YEARS_MIN: 1,
  YEARS_MAX: 50,
  // Absolute Limits um Overflow zu verhindern
  ABSOLUTE_MAX_NUMBER: Number.MAX_SAFE_INTEGER, // 9007199254740991
  REASONABLE_MAX_AMOUNT: 1000000, // 1 Million EUR
  REASONABLE_MAX_YEARS: 100, // 100 Jahre
} as const

/**
 * Validiert E-Mail-Länge
 * @param email - E-Mail-Adresse
 * @param context - Kontext für Fehlermeldung (default: "E-Mail")
 * @throws Error wenn Validierung fehlschlägt
 */
export function validateEmailLength(email: string, context = 'E-Mail'): void {
  const trimmed = String(email || '').trim()

  if (trimmed.length === 0) {
    throw new Error(`${context} darf nicht leer sein`)
  }

  if (trimmed.length > VALIDATION_LIMITS.EMAIL_MAX_LENGTH) {
    throw new Error(`${context} ist zu lang (max. ${VALIDATION_LIMITS.EMAIL_MAX_LENGTH} Zeichen)`)
  }
}

/**
 * Validiert Passwort-Länge
 * @param password - Passwort
 * @param context - Kontext für Fehlermeldung
 * @throws Error wenn Validierung fehlschlägt
 */
export function validatePasswordLength(password: string, context = 'Passwort'): void {
  const len = String(password || '').length

  if (len === 0) {
    throw new Error(`${context} darf nicht leer sein`)
  }

  if (len > VALIDATION_LIMITS.PASSWORD_MAX_LENGTH) {
    throw new Error(`${context} ist zu lang (max. ${VALIDATION_LIMITS.PASSWORD_MAX_LENGTH} Zeichen)`)
  }
}

/**
 * Validiert ETF-Name
 * @param name - ETF-Name
 * @param context - Kontext für Fehlermeldung
 * @throws Error wenn Validierung fehlschlägt
 */
export function validateEtfName(name: string, context = 'ETF-Name'): void {
  const trimmed = String(name || '').trim()

  if (trimmed.length === 0) {
    throw new Error(`${context} darf nicht leer sein`)
  }

  if (trimmed.length > VALIDATION_LIMITS.ETF_NAME_MAX_LENGTH) {
    throw new Error(`${context} ist zu lang (max. ${VALIDATION_LIMITS.ETF_NAME_MAX_LENGTH} Zeichen)`)
  }
}

/**
 * Validiert Betrag (Sparrate)
 * @param amount - Betrag als String oder Number
 * @param context - Kontext für Fehlermeldung
 * @throws Error wenn Validierung fehlschlägt
 */
export function validateAmount(amount: string | number, context = 'Betrag'): void {
  const str = String(amount ?? '').trim()

  if (str.length === 0) {
    throw new Error(`${context} darf nicht leer sein`)
  }

  if (str.length > VALIDATION_LIMITS.AMOUNT_MAX_DIGITS) {
    throw new Error(`${context} ist zu lang (max. ${VALIDATION_LIMITS.AMOUNT_MAX_DIGITS} Zeichen)`)
  }

  // Prüfe auf negative Zahl (beginnt mit Minus)
  if (str.startsWith('-')) {
    throw new Error(`${context} muss eine gültige positive Zahl sein`)
  }

  // Erlaube Zahlen mit optionalem Dezimaltrenner
  if (!/^\d+([.,]\d{1,2})?$/.test(str)) {
    throw new Error(`${context} muss eine gültige Zahl sein (max. 2 Dezimalstellen)`)
  }

  const normalized = str.replace(',', '.')
  const num = Number(normalized)

  if (!isFinite(num) || num < 0) {
    throw new Error(`${context} muss eine gültige positive Zahl sein`)
  }
}

/**
 * Validiert Laufzeit in Jahren
 * @param years - Laufzeit
 * @param context - Kontext für Fehlermeldung
 * @throws Error wenn Validierung fehlschlägt
 */
export function validateDuration(years: number | string, context = 'Laufzeit'): void {
  const num = Number(years)

  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(`${context} muss eine positive Zahl sein`)
  }

  if (num > VALIDATION_LIMITS.DURATION_MAX_YEARS) {
    throw new Error(`${context} ist zu groß (max. ${VALIDATION_LIMITS.DURATION_MAX_YEARS} Jahre)`)
  }
}

/**
 * Prüft ob Sparrate im gültigen Bereich liegt
 * @param rate - Monatliche Sparrate
 * @returns true wenn gültig
 */
export function isValidSparrate(rate: number): boolean {
  return rate >= VALIDATION_LIMITS.SPARRATE_MIN && rate <= VALIDATION_LIMITS.SPARRATE_MAX
}

/**
 * Prüft ob Laufzeit im gültigen Bereich liegt
 * @param years - Laufzeit in Jahren
 * @returns true wenn gültig
 */
export function isValidLaufzeit(years: number): boolean {
  return years >= VALIDATION_LIMITS.YEARS_MIN && years <= VALIDATION_LIMITS.YEARS_MAX
}

/**
 * Sanitiert und validiert eine Zahl-Eingabe vom User
 * Verhindert negative Zahlen, NaN, Infinity und extrem große Werte
 * @param value - User-Input (kann number, string oder undefined sein)
 * @param min - Minimalwert
 * @param max - Maximalwert
 * @param defaultValue - Fallback-Wert wenn Input ungültig ist
 * @returns Bereinigte Zahl im gültigen Bereich
 */
export function sanitizeNumberInput(
  value: number | string | null | undefined,
  min: number,
  max: number,
  defaultValue: number
): number {
  // Explizit null und undefined behandeln
  if (value === null || value === undefined) {
    return defaultValue
  }

  // Konvertiere zu Number
  const num = Number(value)

  // Prüfe auf ungültige Werte
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return defaultValue
  }

  // Prüfe auf extrem große Werte (Overflow-Schutz)
  if (Math.abs(num) > VALIDATION_LIMITS.ABSOLUTE_MAX_NUMBER) {
    return defaultValue
  }

  // Clampe Wert in den gültigen Bereich
  return Math.max(min, Math.min(max, num))
}

/**
 * Validiert eine Sparrate mit strikten Checks
 * @param rate - Sparrate
 * @param throwError - Ob ein Fehler geworfen werden soll (default: true)
 * @returns true wenn gültig, false sonst
 * @throws Error wenn ungültig und throwError=true
 */
export function validateSparrate(rate: number | string | null | undefined, throwError = true): boolean {
  const num = Number(rate)

  // Check 1: Muss eine gültige Zahl sein
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    if (throwError) throw new Error('Sparrate muss eine gültige Zahl sein')
    return false
  }

  // Check 2: Keine negativen Werte
  if (num < 0) {
    if (throwError) throw new Error('Sparrate darf nicht negativ sein')
    return false
  }

  // Check 3: Nicht zu groß (Overflow-Schutz)
  if (num > VALIDATION_LIMITS.REASONABLE_MAX_AMOUNT) {
    if (throwError) throw new Error(`Sparrate ist unrealistisch hoch (max. ${VALIDATION_LIMITS.REASONABLE_MAX_AMOUNT.toLocaleString('de-DE')} €)`)
    return false
  }

  // Check 4: Im erlaubten Bereich
  if (num < VALIDATION_LIMITS.SPARRATE_MIN) {
    if (throwError) throw new Error(`Sparrate muss mindestens ${VALIDATION_LIMITS.SPARRATE_MIN} € betragen`)
    return false
  }

  if (num > VALIDATION_LIMITS.SPARRATE_MAX) {
    if (throwError) throw new Error(`Sparrate darf maximal ${VALIDATION_LIMITS.SPARRATE_MAX.toLocaleString('de-DE')} € betragen`)
    return false
  }

  return true
}

/**
 * Validiert eine Laufzeit mit strikten Checks
 * @param years - Laufzeit in Jahren
 * @param throwError - Ob ein Fehler geworfen werden soll (default: true)
 * @returns true wenn gültig, false sonst
 * @throws Error wenn ungültig und throwError=true
 */
export function validateYears(years: number | string | null | undefined, throwError = true): boolean {
  const num = Number(years)

  // Check 1: Muss eine gültige Zahl sein
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    if (throwError) throw new Error('Laufzeit muss eine gültige Zahl sein')
    return false
  }

  // Check 2: Keine negativen Werte
  if (num < 0) {
    if (throwError) throw new Error('Laufzeit darf nicht negativ sein')
    return false
  }

  // Check 3: Nicht zu groß (Overflow-Schutz)
  if (num > VALIDATION_LIMITS.REASONABLE_MAX_YEARS) {
    if (throwError) throw new Error(`Laufzeit ist unrealistisch hoch (max. ${VALIDATION_LIMITS.REASONABLE_MAX_YEARS} Jahre)`)
    return false
  }

  // Check 4: Im erlaubten Bereich
  if (num < VALIDATION_LIMITS.YEARS_MIN) {
    if (throwError) throw new Error(`Laufzeit muss mindestens ${VALIDATION_LIMITS.YEARS_MIN} Jahr betragen`)
    return false
  }

  if (num > VALIDATION_LIMITS.YEARS_MAX) {
    if (throwError) throw new Error(`Laufzeit darf maximal ${VALIDATION_LIMITS.YEARS_MAX} Jahre betragen`)
    return false
  }

  return true
}

/**
 * Validiert einen Sparplan-Request komplett
 * @param data - Sparplan-Daten
 * @throws Error wenn Validierung fehlschlägt
 */
export function validateSparplanRequest(data: {
  etfName?: string
  monatlicheRate?: number | string
  laufzeitJahre?: number | string
}): void {
  // ETF-Name validieren
  if (!data.etfName || String(data.etfName).trim().length === 0) {
    throw new Error('Bitte wählen Sie einen ETF aus')
  }

  validateEtfName(data.etfName, 'ETF-Name')

  // Sparrate validieren
  validateSparrate(data.monatlicheRate, true)

  // Laufzeit validieren
  validateYears(data.laufzeitJahre, true)
}

