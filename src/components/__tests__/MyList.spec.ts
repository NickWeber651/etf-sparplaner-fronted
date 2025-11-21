import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyList from '../MyList.vue'

// Test-Suite für MyList-Komponente
describe('MyList', () => {
  it('rendert die Komponente', () => {
    const wrapper = mount(MyList)
    expect(wrapper.exists()).toBe(true)
  })
})

