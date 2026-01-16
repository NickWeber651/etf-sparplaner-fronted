/**
 * SAVINGS PLAN FORM LOGIC
 * Business Logic für SavingsPlanForm Component
 */

import { ref, computed } from 'vue'
import {
  sanitizeNumberInput,
  validateSparrate,
  validateYears,
  VALIDATION_LIMITS,
} from '@/utils/validation.utils'

interface EtfBasic {
  id: number
  name: string
  isin: string
  ter: number
}

interface SavingsPlanFormProps {
  etfs: EtfBasic[]
  loadingEtfs: boolean
  errorEtfs: string | null
  isSaving?: boolean
}

export function useSavingsPlanForm(
  props: SavingsPlanFormProps,
  emit: (e: 'submit-plan', payload: { etf: string; rate: number; years: number }) => void
) {
  // Form State
  const selectedEtf = ref('')
  const monthlyRate = ref<number>(200)
  const years = ref<number>(15)

  // Computed
  const selectedEtfDetails = computed(() => {
    return props.etfs.find(e => e.name === selectedEtf.value) ?? null
  })

  const isRateValid = computed(() => {
    return validateSparrate(monthlyRate.value, false)
  })

  const isYearsValid = computed(() => {
    return validateYears(years.value, false)
  })

  const isValid = computed(() => {
    return isRateValid.value && isYearsValid.value && selectedEtf.value !== ''
  })

  // Functions
  function handleSubmit() {
    // Sanitize Inputs erst mal
    const sanitizedRate = sanitizeNumberInput(
      monthlyRate.value,
      VALIDATION_LIMITS.SPARRATE_MIN,
      VALIDATION_LIMITS.SPARRATE_MAX,
      200
    )

    const sanitizedYears = sanitizeNumberInput(
      years.value,
      VALIDATION_LIMITS.YEARS_MIN,
      VALIDATION_LIMITS.YEARS_MAX,
      15
    )

    // Update die Werte falls sie bereinigt wurden
    if (monthlyRate.value !== sanitizedRate) {
      monthlyRate.value = sanitizedRate
    }
    if (years.value !== sanitizedYears) {
      years.value = sanitizedYears
    }

    // Validierung
    if (!selectedEtf.value) {
      alert('Bitte einen ETF auswählen.')
      return
    }

    try {
      validateSparrate(sanitizedRate, true)
      validateYears(sanitizedYears, true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ungültige Eingabe'
      alert(`Validierungsfehler:\n${message}`)
      return
    }

    if (!isValid.value) {
      alert('Bitte Eingaben prüfen:\n- Sparrate: 25-10.000 €\n- Laufzeit: 1-50 Jahre')
      return
    }

    emit('submit-plan', {
      etf: selectedEtf.value,
      rate: sanitizedRate,
      years: sanitizedYears,
    })

    console.log('Formular abgeschickt:', {
      etf: selectedEtf.value,
      rate: sanitizedRate,
      years: sanitizedYears,
    })
  }

  return {
    selectedEtf,
    monthlyRate,
    years,
    selectedEtfDetails,
    isRateValid,
    isYearsValid,
    isValid,
    handleSubmit,
  }
}

