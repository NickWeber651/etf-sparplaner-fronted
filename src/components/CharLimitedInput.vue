<!-- File: src/components/CharLimitedInput.vue -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  maxlength?: number
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const MAX = props.maxlength ?? 50
const internal = ref(props.modelValue ?? '')

// keep internal in sync with parent
watch(() => props.modelValue, (v) => {
  internal.value = v ?? ''
})

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
  let v = t.value ?? ''
  if (v.length > MAX) v = v.slice(0, MAX)
  internal.value = v
  emit('update:modelValue', v)
}

const count = computed(() => internal.value.length)
</script>

<template>
  <div class="saved-plan">
    <input
      :value="internal"
      @input="onInput"
      :maxlength="MAX"
      type="text"
     class="input"
      :aria-label="props?.ariaLabel ?? 'Sparplanname'"
    />
    <div class="char-counter">{{ count }} / {{ MAX }}</div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  box-sizing: border-box;
}
.char-counter {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
  text-align: right;
}
</style>
