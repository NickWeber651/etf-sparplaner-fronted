/**
 * SAVINGS PLAN FORM LOGIC
 * Business Logic für SavingsPlanForm Component
 */

import { ref, computed } from 'vue'
import {
  validateSparrate,
  validateYears,
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
    // Validierung - kein ETF ausgewählt
    if (!selectedEtf.value) {
      alert('Bitte einen ETF auswählen.')
      return
    }

    // Validierung - prüfe Sparrate und Laufzeit
    try {
      validateSparrate(monthlyRate.value, true)
      validateYears(years.value, true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ungültige Eingabe'
      alert(`Validierungsfehler:\n${message}`)
      return
    }

    // Finale Prüfung
    if (!isValid.value) {
      alert('Bitte Eingaben prüfen:\n- Sparrate: 25-10.000 €\n- Laufzeit: 1-50 Jahre')
      return
    }

    // Alles ok - Submit
    emit('submit-plan', {
      etf: selectedEtf.value,
      rate: monthlyRate.value,
      years: years.value,
    })

    console.log('Formular abgeschickt:', {
      etf: selectedEtf.value,
      rate: monthlyRate.value,
      years: years.value,
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

