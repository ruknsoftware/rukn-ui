<template>
  <div class="space-y-1">
    <FieldLabel :field="field" :required="required" />
    <textarea
      v-model="localValue"
      :placeholder="field.placeholder ?? ''"
      :readonly="readonly"
      :disabled="disabled"
      rows="6"
      :class="[
        'w-full px-4 py-3 rounded-lg border transition-all outline-none text-body-md bg-white placeholder:text-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none read-only:bg-surface-container-low',
        error ? 'border-error' : 'border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container',
        field.bold ? 'font-bold' : '',
      ]"
      @blur="emit('blur')"
    />
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
})
const emit = defineEmits(['update:modelValue', 'blur'])
const localValue = computed({
  get: () => props.modelValue ?? '',
  set: (v) => emit('update:modelValue', v),
})
</script>