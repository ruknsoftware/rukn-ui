<template>
  <div class="space-y-1">
    <FieldLabel :field="field" :required="required" />
    <input
      v-model="localValue"
      type="datetime-local"
      :readonly="readonly"
      :disabled="disabled"
      :class="[
        'relative w-full ps-4 pe-10 py-3 rounded-lg border transition-all outline-none text-body-md bg-white disabled:opacity-50 disabled:cursor-not-allowed read-only:bg-surface-container-low',
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
  set: (v) => emit('update:modelValue', v || null),
})
</script>

<style scoped>
/* Browsers force their own internal direction on the native calendar icon,
   so a logical inset-inline-end here resolves against THAT forced direction
   rather than the page's — it stays visually on the right even under
   dir="rtl". :dir() reflects the real HTML directionality (from the dir
   attribute chain), which that internal override can't affect, so use it
   to pick the correct physical side explicitly. */
input[type='datetime-local']:dir(ltr)::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0.75rem;
}
input[type='datetime-local']:dir(rtl)::-webkit-calendar-picker-indicator {
  position: absolute;
  left: 0.75rem;
}

/* The date/time segment cluster also ignores dir="rtl" and stays
   left-anchored by default — force its text-align explicitly the same way. */
input[type='datetime-local']:dir(ltr) {
  text-align: left;
}
input[type='datetime-local']:dir(rtl) {
  text-align: right;
}
</style>