<template>
  <div class="space-y-1">
    <FieldLabel v-if="!hideLabel" :field="field" :required="required" />
    <label
      :class="[
        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        error ? 'border-error' : 'border-outline-variant hover:border-primary-container',
      ]"
    >
      <span class="material-symbols-outlined text-secondary" style="font-size:20px">attach_file</span>
      <span class="text-body-md text-secondary">
        {{ uploading ? 'Uploading…' : localValue ? 'Change file' : 'Choose file' }}
      </span>
      <input
        type="file"
        class="sr-only"
        :disabled="disabled || uploading"
        @change="onFileChange"
        @blur="emit('blur')"
      />
    </label>
    <a v-if="localValue" :href="localValue" target="_blank" class="block text-label-sm text-primary underline truncate">
      {{ localValue.split('/').pop() }}
    </a>
    <p v-if="error" class="text-label-sm text-error">{{ error }}</p>
    <p v-else-if="field.description && !localValue" class="text-label-sm text-secondary">{{ field.description }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const uploading = ref(false)
const localValue = computed(() => props.modelValue)

async function onFileChange(event) {
  const file = event.target?.files?.[0]
  if (!file) return emit('update:modelValue', null)
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('is_private', '0')
    const res = await fetch('/api/method/upload_file', {
      method: 'POST',
      headers: { 'X-Frappe-CSRF-Token': window.csrf_token || '' },
      body: fd,
    })
    const data = await res.json()
    emit('update:modelValue', data?.message?.file_url ?? null)
  } finally {
    uploading.value = false
  }
}
</script>
