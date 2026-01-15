<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    min?: number
    max?: number
    step?: number
    maxDigits?: number
    ariaLabel?: string
  }>(),
  {
    min: 0,
    max: 999999,
    step: 1,
    maxDigits: 6,
    ariaLabel: 'Zahl',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const internal = ref(String(props.modelValue ?? ''))

watch(
  () => props.modelValue,
  (v) => {
    // parent -> internal sync
    internal.value = v == null ? '' : String(v)
  }
)

function clamp(n: number) {
  return Math.min(props.max!, Math.max(props.min!, n))
}

function sanitizeDigits(raw: string) {
  // nur Ziffern erlauben
  let v = (raw ?? '').replace(/[^\d]/g, '')
  if (props.maxDigits && v.length > props.maxDigits) v = v.slice(0, props.maxDigits)
  return v
}

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
  const cleaned = sanitizeDigits(t.value)
  internal.value = cleaned

  // solange leer, nichts emitten (sonst springt auf 0)
  if (cleaned === '') return

  const n = clamp(Number(cleaned))
  emit('update:modelValue', n)
}

function onBlur() {
  // beim Verlassen final clampen & hübsch setzen
  const cleaned = sanitizeDigits(internal.value)
  if (cleaned === '') {
    internal.value = String(props.min ?? 0)
    emit('update:modelValue', props.min ?? 0)
    return
  }
  const n = clamp(Number(cleaned))
  internal.value = String(n)
  emit('update:modelValue', n)
}

const count = computed(() => sanitizeDigits(internal.value).length)
</script>

<template>
  <div class="wrap">
    <input
      class="input"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      :value="internal"
      @input="onInput"
      @blur="onBlur"
      :aria-label="ariaLabel"
    />
    <div class="char-counter">{{ count }} / {{ maxDigits }}</div>
  </div>
</template>

<style scoped>
.wrap { width: 100%; }
.input { width: 100%; box-sizing: border-box; }
.char-counter {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
  text-align: right;
}
</style>
