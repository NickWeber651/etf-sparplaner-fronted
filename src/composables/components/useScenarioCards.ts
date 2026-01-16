/**
 * SCENARIO CARDS LOGIC
 * Business Logic für ScenarioCards Component
 */

import { computed } from 'vue'

interface ScenarioCardsProps {
  rate: number
  years: number
  etfName: string
}

export function useScenarioCards(props: ScenarioCardsProps) {
  // Berechnung
  const months = computed(() => props.years * 12)

  function calcEndValue(monthly: number, yearlyReturn: number, months: number): number {
    const i = yearlyReturn / 12
    if (i === 0) {
      return Math.round(monthly * months)
    }
    const endValue = monthly * ((Math.pow(1 + i, months) - 1) / i)
    return Math.round(endValue)
  }

  const bestCase = computed(() => calcEndValue(props.rate, 0.08, months.value))
  const baseCase = computed(() => calcEndValue(props.rate, 0.06, months.value))
  const worstCase = computed(() => calcEndValue(props.rate, 0.03, months.value))

  const etfName = computed(() => props.etfName)
  const rate = computed(() => props.rate)
  const years = computed(() => props.years)

  return {
    bestCase,
    baseCase,
    worstCase,
    etfName,
    rate,
    years,
  }
}

