<template>
  <div class="space-y-1">
    <label class="flex items-center gap-3 cursor-pointer">
      <input
        v-model="localValue"
        type="checkbox"
        :disabled="disabled"
        class="w-4 h-4 rounded border-outline-variant text-primary accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
        @blur="emit('blur')"
      />
      <FieldLabel :field="field" :required="required" tag="span" wrapper-class="text-label-md text-on-surface" />
    </label>
    <p v-if="error" class="text-label-sm text-error">{{ error }}</p>
    <p v-else-if="field.description" class="text-label-sm text-secondary">{{ field.description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FieldLabel from './FieldLabel.vue'
const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { default: 0 },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null },
  required: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'blur'])
const localValue = computed({
  get: () => props.modelValue === 1 || props.modelValue === true,
  set: (v) => emit('update:modelValue', v ? 1 : 0),
})
</script>