<template>
  <div class="space-y-1">
    <FieldLabel v-if="!hideLabel" :field="field" :required="required" />
    <div class="relative">
      <select
        v-model="localValue"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-3 rounded-lg border transition-all outline-none text-body-md bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-error' : 'border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container',
          localValue ? 'text-on-surface' : 'text-secondary/50',
          field.bold ? 'font-bold' : '',
        ]"
        @blur="emit('blur')"
      >
        <option value="" disabled>Select an option</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" style="font-size:18px">expand_more</span>
    </div>
    <p v-if="error" class="text-label-sm text-error">{{ error }}</p>
    <p v-else-if="field.description" class="text-label-sm text-secondary">{{ field.description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FieldLabel from './FieldLabel.vue'
const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { default: null },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null },
  required: { type: Boolean, default: false },
  hideLabel: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'blur'])
const options = computed(() =>
  (props.field.options ?? '').split('\n').map((o) => o.trim()).filter(Boolean)
)
const localValue = computed({
  get: () => props.modelValue ?? '',
  set: (v) => emit('update:modelValue', v || null),
})
</script>