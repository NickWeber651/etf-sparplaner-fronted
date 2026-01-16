/**
 * SAVINGS PLAN FORM LOGIC
 * Business Logic für SavingsPlanForm Component
 */

import { ref, computed } from 'vue'

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

  const isRateValid = computed(() => monthlyRate.value >= 25 && monthlyRate.value <= 10000)
  const isYearsValid = computed(() => years.value >= 1 && years.value <= 50)
  const isValid = computed(() => isRateValid.value && isYearsValid.value)

  // Functions
  function handleSubmit() {
    if (!isValid.value) {
      alert('Bitte Eingaben prüfen:\n- Sparrate: 25-10.000 €\n- Laufzeit: 1-50 Jahre')
      return
    }

    if (!selectedEtf.value) {
      alert('Bitte einen ETF auswählen.')
      return
    }

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

