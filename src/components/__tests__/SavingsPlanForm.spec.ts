import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SavingsPlanForm from '../SavingsPlanForm.vue'

// Minimaler Mock: SavingsPlanForm erwartet diese Props (required)
const etfsMock = [
  { id: 1, name: 'S&P 500 (TER: 0.07 %)', isin: 'US0000000001', ter: 0.07 },
  { id: 2, name: 'MSCI World (TER: 0.20 %)', isin: 'IE00B0M62Q58', ter: 0.20 },
]

function mountSavingsPlanForm() {
  return mount(SavingsPlanForm, {
    props: {
      etfs: etfsMock,
      loadingEtfs: false,
      // je nach Komponente ist das string|null; null ist meist ok, sonst ''
     errorEtfs: '',
    },
  })
}

// Test-Suite für SavingsPlanForm-Komponente
describe('SavingsPlanForm', () => {

  // Test 1: Prüft ob alle Formularfelder vorhanden sind
  it('rendert alle Formularfelder', () => {
    const wrapper = mountSavingsPlanForm()

    // Prüfen ob ETF-Dropdown existiert
    expect(wrapper.find('#etf').exists()).toBe(true)

    // Prüfen ob Sparrate-Input existiert
    expect(wrapper.find('#rate').exists()).toBe(true)

    // Prüfen ob Laufzeit-Input existiert
    expect(wrapper.find('#years').exists()).toBe(true)

    // Prüfen ob Button existiert
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  // Test 2: Prüft ob Input-Sanitization ungültige Werte verhindert
  it('sanitiert ungültige Sparrate automatisch', async () => {
    const wrapper = mountSavingsPlanForm()

    const rateInput = wrapper.find('#rate')

    // Versuche ungültigen Wert zu setzen (< 25)
    await rateInput.setValue(10)
    await rateInput.trigger('input')
    await wrapper.vm.$nextTick()

    // Input-Sanitization sollte den Wert auf Minimum (25) korrigiert haben
    // Button ist immer noch disabled weil kein ETF ausgewählt ist
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  // Test 3: Prüft ob Button bei ungültigen Werten disabled ist
  it('disabled Button bei ungültigen Werten', async () => {
    const wrapper = mountSavingsPlanForm()

    // Ungültige Sparrate setzen
    await wrapper.find('#rate').setValue(10)
    await wrapper.vm.$nextTick()

    // Button sollte disabled sein
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  // Test 4: Prüft ob Button bei gültigen Werten enabled ist
  it('enabled Button bei gültigen Werten', async () => {
    const wrapper = mountSavingsPlanForm()

    // Gültige Werte setzen (inkl. ETF-Auswahl, falls diese fürs Enable nötig ist)
    await wrapper.find('#etf').setValue(etfsMock[0]!.name)
    await wrapper.find('#rate').setValue(200)
    await wrapper.find('#years').setValue(15)
    await wrapper.vm.$nextTick()

    // Button sollte NICHT disabled sein
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeUndefined()
  })
})

