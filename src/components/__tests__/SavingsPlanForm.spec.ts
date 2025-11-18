import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SavingsPlanForm from '../SavingsPlanForm.vue'

// Test-Suite für SavingsPlanForm-Komponente
describe('SavingsPlanForm', () => {

  // Test 1: Prüft ob alle Formularfelder vorhanden sind
  it('rendert alle Formularfelder', () => {
    const wrapper = mount(SavingsPlanForm)

    // Prüfen ob ETF-Dropdown existiert
    expect(wrapper.find('#etf').exists()).toBe(true)

    // Prüfen ob Sparrate-Input existiert
    expect(wrapper.find('#rate').exists()).toBe(true)

    // Prüfen ob Laufzeit-Input existiert
    expect(wrapper.find('#years').exists()).toBe(true)

    // Prüfen ob Button existiert
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  // Test 2: Prüft ob Validierung bei zu niedriger Sparrate funktioniert
  it('zeigt Fehlermeldung bei zu niedriger Sparrate', async () => {
    const wrapper = mount(SavingsPlanForm)

    // Sparrate auf ungültigen Wert setzen (< 25)
    await wrapper.find('#rate').setValue(10)

    // Fehlermeldung sollte erscheinen
    expect(wrapper.text()).toContain('Sparrate muss zwischen 25 und 10.000 € liegen')
  })

  // Test 3: Prüft ob Button bei ungültigen Werten disabled ist
  it('disabled Button bei ungültigen Werten', async () => {
    const wrapper = mount(SavingsPlanForm)

    // Ungültige Sparrate setzen
    await wrapper.find('#rate').setValue(10)

    // Button sollte disabled sein
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  // Test 4: Prüft ob Button bei gültigen Werten enabled ist
  it('enabled Button bei gültigen Werten', async () => {
    const wrapper = mount(SavingsPlanForm)

    // Gültige Werte setzen
    await wrapper.find('#rate').setValue(200)
    await wrapper.find('#years').setValue(15)

    // Button sollte NICHT disabled sein
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeUndefined()
  })
})

